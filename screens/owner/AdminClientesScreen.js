import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import LoadingOverlay from '../../components/LoadingOverlay';
import createStyles from '../../styles/owner/AdminClientesStyles';
import { clienteAPI, citaAPI } from '../../config/api';

const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'frecuentes', label: 'Frecuentes' },
  { key: 'nuevos', label: 'Nuevos' },
];

const MESES_LARGO = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const formatearMesRegistro = (fechaISO) => {
  if (!fechaISO) return 'N/A';
  const fecha = new Date(fechaISO);
  return MESES_LARGO[fecha.getMonth()];
};


const esClienteNuevo = (fechaISO) => {
  if (!fechaISO) return false;
  const fecha = new Date(fechaISO);
  const dias = (Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24);
  return dias <= 30;
};

const ClienteCard = ({ cliente, styles, iconColor, mutedColor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.cardInfo}>
      <View style={styles.cardRow}>
        <Ionicons name="person" size={16} color={iconColor} style={styles.cardIcon} />
        <Text style={styles.cardNombre}>{cliente.nombre}</Text>
      </View>

      <View style={styles.cardRow}>
        <Ionicons name="people" size={14} color={mutedColor} style={styles.cardIcon} />
        <Text style={styles.cardTexto}>
          {cliente.citas != null ? `${cliente.citas} citas` : 'Sin citas registradas'}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Ionicons name="paper-plane-outline" size={14} color={mutedColor} style={styles.cardIcon} />
        <Text style={styles.cardTexto}>
          Ultima visita: {cliente.ultimaVisita || 'N/A'}
        </Text>
      </View>

      {cliente.frecuente && (
        <View style={styles.cardRow}>
          <Ionicons name="moon" size={14} color={iconColor} style={styles.cardIcon} />
          <Text style={styles.cardBadge}>Cliente frecuente</Text>
        </View>
      )}
    </View>

    <Ionicons name="arrow-forward" size={20} color={iconColor} />
  </TouchableOpacity>
);

const AdminClientesScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  // El id de la barbería viene por params (ej. al entrar desde DetalleBarberiaScreen).
  const barberiaId = route?.params?.barberiaId;

  const iconColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const mutedColor = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';

  const [busqueda, setBusqueda] = useState('');
  const [tabActivo, setTabActivo] = useState('todos');
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);


  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const [cargandoHistorial, setCargandoHistorial] = useState(false);

const abrirDetalle = async (cliente) => {
  setClienteSeleccionado(cliente);
  setModalVisible(true);
  setCargandoHistorial(true);

  const res = await citaAPI.historial(cliente.idCliente, barberiaId);

  if (res.success) {
    const historialFormateado = res.data.map((c) => ({
      id: c.id,
      texto: `${c.servicioNombre} — ${c.fecha}${c.barberoNombre ? ' con ' + c.barberoNombre : ''}`,
      estado: c.estado,
    }));

    setClienteSeleccionado((prev) => ({
      ...prev,
      historial: historialFormateado,
      citas: res.data.filter((c) => c.estado === 'COMPLETADA').length,
      ultimaVisita: res.data.find((c) => c.estado === 'COMPLETADA')?.fecha || prev.ultimaVisita,
    }));
  } else {
    console.log('Error al traer historial:', res.error);
  }

  setCargandoHistorial(false);
};

const cerrarDetalle = () => {
  setModalVisible(false);
};


  const cargarClientes = useCallback(async () => {
    if (!barberiaId) return;
    setCargando(true);
    try {
      const res = await clienteAPI.listarPorBarberia(barberiaId);
      if (!res.success) {
        console.log(res.error);
        setClientes([]);
        return;
      }

    
      const dataTransformada = res.data.map((c) => ({
        id: c.idRegistro,
        idCliente: c.idCliente,
        nombre: `${c.nombre} ${c.apellido}`.trim(),
        email: c.email,
        telefono: c.telefono,
        foto: c.fotoPerfil || null,
        fechaRegistro: c.fechaRegistro,
        registradoDesde: formatearMesRegistro(c.fechaRegistro),
        nuevo: esClienteNuevo(c.fechaRegistro),
        citas: c.citas ?? 0,
ultimaVisita: c.ultimaVisita || null,
frecuente: (c.citas ?? 0) >= 5,  
        historial: [],
      }));

      setClientes(dataTransformada);
    } catch (e) {
      console.log(e);
      setClientes([]);
    } finally {
      setCargando(false);
    }
  }, [barberiaId]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  useFocusEffect(
    useCallback(() => {
      cargarClientes();
    }, [cargarClientes])
  );

  const clientesFiltrados = useMemo(() => {
    let lista = clientes;

    if (tabActivo === 'frecuentes') {
      lista = lista.filter((c) => c.frecuente);
    } else if (tabActivo === 'nuevos') {
      lista = lista.filter((c) => c.nuevo);
    }

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter((c) => c.nombre.toLowerCase().includes(q));
    }

    return lista;
  }, [clientes, tabActivo, busqueda]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Clientes</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>

          {/* ── Buscador ── */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={mutedColor} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              placeholderTextColor={mutedColor}
              value={busqueda}
              onChangeText={setBusqueda}
            />
          </View>

          {/* ── Tabs ── */}
          <View style={styles.tabsRow}>
            {TABS.map((tab) => {
              const activo = tabActivo === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabPill, activo && styles.tabPillActive]}
                  onPress={() => setTabActivo(tab.key)}
                >
                  <Text style={[styles.tabPillText, activo && styles.tabPillTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Lista ── */}
          <Text style={styles.sectionLabel}>{tabActivo.toUpperCase()}</Text>

          <View style={styles.listContainer}>
            {clientesFiltrados.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={36} color={mutedColor} />
                <Text style={styles.emptyText}>No hay clientes para mostrar.</Text>
              </View>
            ) : (
              clientesFiltrados.map((cliente) => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  styles={styles}
                  iconColor={iconColor}
                  mutedColor={mutedColor}
                  onPress={() => abrirDetalle(cliente)}
                />
              ))
            )}
          </View>

        </View>
      </ScrollView>

      {/* ── Modal: detalle de cliente ── */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={cerrarDetalle}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarDetalle}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{clienteSeleccionado?.nombre}</Text>

            <Text style={styles.modalInfoLine}>
              Registrado desde {clienteSeleccionado?.registradoDesde}
            </Text>

            {clienteSeleccionado?.citas != null && (
              <Text style={styles.modalInfoLine}>
                {clienteSeleccionado.citas} citas
              </Text>
            )}

            {clienteSeleccionado?.ultimaVisita && (
              <Text style={styles.modalInfoLine}>
                Ultima visita: {clienteSeleccionado.ultimaVisita}
              </Text>
            )}

            {clienteSeleccionado?.frecuente && (
              <Text style={styles.modalSubtitle}>Cliente frecuente</Text>
            )}

{!cargandoHistorial && clienteSeleccionado?.historial?.length > 0 && (
  <>
    <Text style={[styles.modalSubtitle, styles.modalHistorialTitle]}>
      Historial:
    </Text>
    <View style={styles.modalHistorialList}>
      {clienteSeleccionado.historial.map((item) => (
        <View key={item.id} style={styles.modalHistorialItem}>
          <View style={styles.modalHistorialDot} />
          <Text style={styles.modalHistorialText}>{item.texto}</Text>
        </View>
      ))}
    </View>
  </>
)}

{!cargandoHistorial && clienteSeleccionado?.historial?.length === 0 && (
  <Text style={styles.modalInfoLine}>Sin visitas registradas aún.</Text>
)}
          </View>
        </View>
      </Modal>

      <LoadingOverlay visible={cargando} message="Cargando clientes..." />
      <LoadingOverlay visible={cargandoHistorial} message="Cargando historial..." />
    </SafeAreaView>
  );
};

export default AdminClientesScreen;