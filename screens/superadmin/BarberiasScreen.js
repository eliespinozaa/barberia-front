import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import createStyles, { getPlaceholderColor } from '../../styles/superadmin/BarberiasStyles';
import { barberiaAPI, usuariosAPI } from '../../config/api';



const ESTADO_OPCIONES = ['Todas', 'Activas', 'Suspendidas'];
const SUSCRIPCION_OPCIONES = ['Todas', 'Pagadas', 'Por vencer', 'Vencidas'];
const FECHA_OPCIONES = ['Recientes', 'Más antiguas', 'A-Z'];

const FilterDropdown = ({ label, value, options, onSelect, styles }) => {
  const [open, setOpen] = useState(false);


  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}:</Text>
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={styles.filterPill}
          onPress={() => setOpen(!open)}
        >
          <Text style={styles.filterPillText}>{value}</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color="#1A1A1A" />
        </TouchableOpacity>

        {open && (
          <View style={[styles.dropdownMenu, { top: 38, left: 0 }]}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownMenuItem}
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                <Text style={styles.dropdownMenuItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const BarberiasScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const placeholderColor = getPlaceholderColor(theme);
const [listaBarberias, setListaBarberias] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todas');
  const [suscripcionFiltro, setSuscripcionFiltro] = useState('Todas');
  const [fechaFiltro, setFechaFiltro] = useState('Recientes');
  const [barberiaAEliminar, setBarberiaAEliminar] = useState(null);


  useEffect(() => {
  const cargarDatos = async () => {

    const [barberiasRes, usuariosRes] = await Promise.all([
      barberiaAPI.listar2(),
      usuariosAPI.listar2(),
    ]);

    if (!barberiasRes.success) {
      console.log(barberiasRes.error);
      return;
    }

    if (!usuariosRes.success) {
      console.log(usuariosRes.error);
      return;
    }

    const usuarios = usuariosRes.data;
const dataTransformada = barberiasRes.data.map((b) => {
  const dueno = usuarios.find((u) => u.id === b.idUsuario);
  return {
    id: b.id,
    nombre: b.nombre,
    telefono: b.telefono,
    direccion: b.direccion,
    foto: b.imagen,
    activa: b.estado === 1,
    idUsuario: b.idUsuario,
    dueno: dueno ? `${dueno.nombre} ${dueno.apellido}` : 'Sin asignar',
    suscripcion: 'N/A',
  };
});

    setListaBarberias(dataTransformada);
  };

  cargarDatos();
}, []);

  useEffect(() => {
    if (route?.params?.nuevaBarberia) {
      const nueva = route.params.nuevaBarberia;
      setListaBarberias((prev) => [nueva, ...prev]);
      navigation.setParams({ nuevaBarberia: undefined });
    }
  }, [route?.params?.nuevaBarberia]);

  useEffect(() => {
    if (route?.params?.barberiaActualizada) {
      const actualizada = route.params.barberiaActualizada;
      setListaBarberias((prev) =>
        prev.map((b) => (b.id === actualizada.id ? actualizada : b))
      );
      navigation.setParams({ barberiaActualizada: undefined });
    }
  }, [route?.params?.barberiaActualizada]);

  const barberias = useMemo(() => {
    let lista = [...listaBarberias];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      lista = lista.filter((b) => b.nombre.toLowerCase().includes(q));
    }

    if (estadoFiltro === 'Activas') {
      lista = lista.filter((b) => b.activa);
    } else if (estadoFiltro === 'Suspendidas') {
      lista = lista.filter((b) => !b.activa);
    }

    return lista;
  }, [listaBarberias, searchQuery, estadoFiltro]);

  const handleAgregar = () => {
    navigation.navigate('BarberiasNuevaScreen');
  };

  const handleVer = (barberia) => {
    console.log('Ver detalle de', barberia.nombre, '(pendiente)');
  };

  const handleEditar = (barberia) => {
    navigation.navigate('BarberiasNuevaScreen', { barberia });
  };

  const handleEliminar = (barberia) => {
    setBarberiaAEliminar(barberia);
  };

  const cerrarModalEliminar = () => {
    setBarberiaAEliminar(null);
  };

  // TODO: cuando exista API, aquí se hará el DELETE/PATCH real
  const confirmarInactivar = () => {
    if (!barberiaAEliminar) return;
    setListaBarberias((prev) =>
      prev.filter((b) => b.id !== barberiaAEliminar.id)
    );
    setBarberiaAEliminar(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
  style={styles.backBtn}
  onPress={() => navigation.navigate('SuperAdminHomeScreen')}
>
  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
</TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Barberias</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Buscador ── */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color="#1A1A1A"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ── Filtros ── */}
        <View style={styles.filtersRow}>
          <FilterDropdown
            label="Estado"
            value={estadoFiltro}
            options={ESTADO_OPCIONES}
            onSelect={setEstadoFiltro}
            styles={styles}
          />
          <FilterDropdown
            label="Suscripcion"
            value={suscripcionFiltro}
            options={SUSCRIPCION_OPCIONES}
            onSelect={setSuscripcionFiltro}
            styles={styles}
          />
          <FilterDropdown
            label="Fecha"
            value={fechaFiltro}
            options={FECHA_OPCIONES}
            onSelect={setFechaFiltro}
            styles={styles}
          />
        </View>

        {/* ── Botón agregar barbería ── */}
        <View style={styles.addButtonRow}>
          <TouchableOpacity style={styles.fab} onPress={handleAgregar}>
            <Ionicons name="add" size={28} color="#0B1014" />
          </TouchableOpacity>
        </View>

        {/* ── Listado de barberías ── */}
        {barberias.length > 0 ? (
          <View style={styles.listGrid}>
            {barberias.map((barberia) => (
              <View key={barberia.id} style={styles.card}>
                <View style={styles.cardAvatar}>
                  {barberia.foto ? (
                    <Image source={{ uri: barberia.foto }} style={styles.cardAvatarImage} />
                  ) : (
                    <Ionicons name="person" size={28} color="#9CA3AF" />
                  )}
                </View>

                <Text style={styles.cardName}>{barberia.nombre}</Text>

                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoText}>Dueño: {barberia.dueno}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoText}>Tel: {barberia.telefono}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoText}>Suscripcion: {barberia.suscripcion}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                  <Text style={styles.cardInfoText}>Estado: </Text>
                  <View
                    style={[
                      styles.statusDot,
                      !barberia.activa && styles.statusDotInactive,
                    ]}
                  />
                  <Text style={styles.cardInfoText}>
                    {barberia.activa ? 'Activa' : 'Suspendida'}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.cardActionBtn}
                    onPress={() => handleVer(barberia)}
                  >
                    <Ionicons name="eye-outline" size={18} color="#1A1A1A" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cardActionBtn}
                    onPress={() => handleEditar(barberia)}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#1A1A1A" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cardActionBtn}
                    onPress={() => handleEliminar(barberia)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={40} color={placeholderColor} />
            <Text style={styles.emptyText}>No se encontraron barberías</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Modal: confirmar inactivar barbería ── */}
      <Modal
        transparent
        visible={!!barberiaAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Inactivar</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminar}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              Estas seguro que deseas inactivar a la barberia definitivamente?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={cerrarModalEliminar}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={confirmarInactivar}
              >
                <Text style={styles.modalBtnConfirmText}>Sí, inactivar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BarberiasScreen;