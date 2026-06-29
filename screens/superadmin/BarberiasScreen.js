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
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import createStyles, { getPlaceholderColor, getIconColor } from '../../styles/superadmin/BarberiasStyles';
import { barberiaAPI, usuariosAPI, suscripcionAPI } from '../../config/api';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import Tooltip from '../../components/Tooltip';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


const ESTADO_OPCIONES = ['Todas', 'Activas', 'Suspendidas'];
const SUSCRIPCION_OPCIONES = ['Todas', 'Pagadas', 'Por vencer', 'Vencidas'];
const FECHA_OPCIONES = ['Recientes', 'Más antiguas', 'A-Z'];

const FilterDropdown = ({ label, value, options, onSelect, styles, isOpen, onToggle }) => {
  return (
    <View style={[styles.filterGroup, isOpen && styles.filterGroupOpen]}>
      <Text style={styles.filterLabel}>{label}:</Text>
      <View style={{ position: 'relative' }}>
        <TouchableOpacity style={styles.filterPill} onPress={onToggle}>
          <Text style={styles.filterPillText}>{value}</Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#1A1A1A" />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownMenu}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownMenuItem}
                onPress={() => {
                  onSelect(opt);
                  onToggle();
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
  const iconColor = getIconColor(theme);
const [listaBarberias, setListaBarberias] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todas');
  const [suscripcionFiltro, setSuscripcionFiltro] = useState('Todas');
  const [fechaFiltro, setFechaFiltro] = useState('Recientes');
  const [barberiaAEliminar, setBarberiaAEliminar] = useState(null);
const [filtroAbierto, setFiltroAbierto] = useState(null);
const [cargando, setCargando] = useState(true);
const [eliminando, setEliminando] = useState(false);
const [actualizandoEstado, setActualizandoEstado] = useState(null);
const [resultado, setResultado] = useState({
  visible: false,
  type: 'success',
  title: '',
  message: '',
});

const cerrarResultado = () => {
  setResultado((prev) => ({ ...prev, visible: false }));
};

useEffect(() => {
  const cargarDatos = async () => {
    setCargando(true);

    const [barberiasRes, usuariosRes] = await Promise.all([
      barberiaAPI.listar2(),
      usuariosAPI.listar2(),
    ]);

    if (!barberiasRes.success) {
      setCargando(false);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudieron cargar las barberías',
        message: barberiasRes.error || 'Ocurrió un error al obtener la lista de barberías.',
      });
      return;
    }

    if (!usuariosRes.success) {
      setCargando(false);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudieron cargar los usuarios',
        message: usuariosRes.error || 'Ocurrió un error al obtener la lista de usuarios.',
      });
      return;
    }

    const usuarios = usuariosRes.data;

    const suscripcionesRes = await Promise.all(
      barberiasRes.data.map((b) => suscripcionAPI.obtenerActiva(b.id))
    );

    const dataTransformada = barberiasRes.data.map((b, index) => {
      const dueno = usuarios.find((u) => u.id === b.idUsuario);
      const suscripcionRes = suscripcionesRes[index];
      const suscripcion = suscripcionRes.success ? suscripcionRes.data : null;

      return {
        id: b.id,
        nombre: b.nombre,
        telefono: b.telefono,
        direccion: b.direccion,
        foto: b.imagen,
        activa: b.estado === 1,
        idUsuario: b.idUsuario,
        dueno: dueno ? `${dueno.nombre} ${dueno.apellido}` : 'Sin asignar',
        suscripcion: suscripcion ? suscripcion.estado : 'N/A',
      };
    });

    setListaBarberias(dataTransformada);
    setCargando(false);
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

  if (suscripcionFiltro === 'Pagadas') {
    lista = lista.filter((b) => b.suscripcion === 'Pagada');
  } else if (suscripcionFiltro === 'Por vencer') {
    lista = lista.filter((b) => b.suscripcion === 'Por vencer');
  } else if (suscripcionFiltro === 'Vencidas') {
    lista = lista.filter((b) => b.suscripcion === 'Vencida');
  }

  if (fechaFiltro === 'A-Z') {
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (fechaFiltro === 'Recientes') {
    lista.reverse();
  } else if (fechaFiltro === 'Más antiguas') {
  }

  return lista;
}, [listaBarberias, searchQuery, estadoFiltro, suscripcionFiltro, fechaFiltro]);

  const handleAgregar = () => {
    navigation.navigate('BarberiasNuevaScreen');
  };

 const handleVer = (barberia) => {
  navigation.navigate('DetalleBarberiaScreen', { barberiaId: barberia.id });
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

const handleToggleEstado = async (barberia) => {
  const nuevaActiva = !barberia.activa;
  setActualizandoEstado(barberia.id);

  setListaBarberias((prev) =>
    prev.map((b) => (b.id === barberia.id ? { ...b, activa: nuevaActiva } : b))
  );

  const res = await barberiaAPI.cambiarEstado(barberia.id, nuevaActiva);

  if (!res.success) {
    setListaBarberias((prev) =>
      prev.map((b) => (b.id === barberia.id ? { ...b, activa: !nuevaActiva } : b))
    );
    setResultado({
      visible: true,
      type: 'error',
      title: 'No se pudo actualizar',
      message: res.error || 'Ocurrió un error al cambiar el estado de la barbería.',
    });
  }

  setActualizandoEstado(null);
};

const confirmarEliminar = async () => {
  if (!barberiaAEliminar) return;

  setEliminando(true);

  const res = await barberiaAPI.eliminar(barberiaAEliminar.id);

  setEliminando(false);

  if (!res.success) {
    setBarberiaAEliminar(null);
    setResultado({
      visible: true,
      type: 'error',
      title: 'No se pudo eliminar',
      message: res.error || 'Ocurrió un error al eliminar la barbería.',
    });
    return;
  }

  setListaBarberias((prev) =>
    prev.filter((b) => b.id !== barberiaAEliminar.id)
  );
  setBarberiaAEliminar(null);
  setResultado({
    visible: true,
    type: 'success',
    title: '¡Listo!',
    message: 'La barbería se eliminó correctamente.',
  });
};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
  style={styles.backBtn}
  onPress={() => navigation.replace('SuperAdminHomeScreen')}
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

        <View style={styles.filtersRow}>
<View style={[styles.filtersRow, filtroAbierto && styles.filtersRowOpen]}>
  <FilterDropdown
    label="Estado"
    value={estadoFiltro}
    options={ESTADO_OPCIONES}
    onSelect={setEstadoFiltro}
    styles={styles}
    isOpen={filtroAbierto === 'estado'}
    onToggle={() => setFiltroAbierto(filtroAbierto === 'estado' ? null : 'estado')}
  />
  <FilterDropdown
    label="Suscripcion"
    value={suscripcionFiltro}
    options={SUSCRIPCION_OPCIONES}
    onSelect={setSuscripcionFiltro}
    styles={styles}
    isOpen={filtroAbierto === 'suscripcion'}
    onToggle={() => setFiltroAbierto(filtroAbierto === 'suscripcion' ? null : 'suscripcion')}
  />
  <FilterDropdown
    label="Fecha"
    value={fechaFiltro}
    options={FECHA_OPCIONES}
    onSelect={setFechaFiltro}
    styles={styles}
    isOpen={filtroAbierto === 'fecha'}
    onToggle={() => setFiltroAbierto(filtroAbierto === 'fecha' ? null : 'fecha')}
  />
</View>
        </View>

        <View style={styles.addButtonRow}>
  <Tooltip label="Agregar">
    <TouchableOpacity style={styles.fab} onPress={handleAgregar}>
      <MaterialCommunityIcons name="plus-thick" size={24} color="#0B1014" />
    </TouchableOpacity>
  </Tooltip>
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
  <Tooltip label="Ver">
    <TouchableOpacity onPress={() => handleVer(barberia)}>
      <Feather name="eye" size={20} color={iconColor} />
    </TouchableOpacity>
  </Tooltip>
  <Tooltip label="Editar">
    <TouchableOpacity onPress={() => handleEditar(barberia)}>
      <Feather name="edit-2" size={20} color={iconColor} />
    </TouchableOpacity>
  </Tooltip>
  <Tooltip label={barberia.activa ? 'Desactivar' : 'Activar'}>
    <TouchableOpacity
      onPress={() => handleToggleEstado(barberia)}
      disabled={actualizandoEstado === barberia.id}
    >
      <Feather name={barberia.activa ? 'pause' : 'play'} size={20} color={iconColor} />
    </TouchableOpacity>
  </Tooltip>
  <Tooltip label="Eliminar">
    <TouchableOpacity onPress={() => handleEliminar(barberia)}>
      <Feather name="trash-2" size={20} color="#EF4444" />
    </TouchableOpacity>
  </Tooltip>
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

      {/* ── Modal: confirmar eliminar barbería ── */}
      <Modal
        transparent
        visible={!!barberiaAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar barbería</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminar}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar esta barbería? Esta acción no se puede deshacer.
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
                onPress={confirmarEliminar}
              >
                <Text style={styles.modalBtnConfirmText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>

      <LoadingOverlay visible={cargando} message="Cargando barberías..." />
      <LoadingOverlay visible={eliminando} message="Eliminando barbería..." />
      <LoadingOverlay visible={!!actualizandoEstado} message="Actualizando estado..."/>

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={cerrarResultado}
      />
    </SafeAreaView>
  );
};

export default BarberiasScreen;