import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/owner/AdminServiciosStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import Tooltip from '../../components/Tooltip';
import { servicioAPI } from '../../config/api';

const AdminServiciosScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  // El id de la barbería viene por params (lo manda OwnerHomeScreen).
  const barberiaId = route?.params?.barberiaId;

  const iconColor = isDark ? '#FFFFFF' : '#1A1A1A';

  const [busqueda, setBusqueda] = useState('');
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [servicioDetalle, setServicioDetalle] = useState(null);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const [resultado, setResultado] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const cerrarResultado = () => {
    setResultado((prev) => ({ ...prev, visible: false }));
  };

  const cargarServicios = useCallback(async () => {
    if (!barberiaId) return;
    setCargando(true);
    try {
      const res = await servicioAPI.listarPorBarberia(barberiaId);
      if (!res.success) {
        console.log(res.error);
        setServicios([]);
        return;
      }
      const dataTransformada = res.data.map((s) => ({
        id: s.id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        precio: s.precio,
        imagen: s.imagen,
        activo: s.estado === 1,
      }));
      setServicios(dataTransformada);
    } catch (e) {
      console.log(e);
      setServicios([]);
    } finally {
      setCargando(false);
    }
  }, [barberiaId]);

  useFocusEffect(
    useCallback(() => {
      cargarServicios();
    }, [cargarServicios])
  );

  const serviciosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return servicios;
    const q = busqueda.trim().toLowerCase();
    return servicios.filter((s) => s.nombre.toLowerCase().includes(q));
  }, [servicios, busqueda]);

  const formatearPrecio = (precio) => {
    const num = Number(precio);
    if (Number.isNaN(num)) return '$0';
    return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
  };

  const handleAgregar = () => {
    navigation.navigate('EditarServicioScreen', { barberiaId });
  };

  const handleEditar = (servicio) => {
    navigation.navigate('EditarServicioScreen', { servicio, barberiaId });
  };

  const handleEliminar = (servicio) => {
    setServicioAEliminar(servicio);
  };

  const cerrarModalEliminar = () => {
    setServicioAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!servicioAEliminar) return;

    setEliminando(true);
    const res = await servicioAPI.eliminar(servicioAEliminar.id);
    setEliminando(false);

    if (!res.success) {
      setServicioAEliminar(null);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo eliminar',
        message: res.error || 'Ocurrió un error al eliminar el servicio.',
      });
      return;
    }

    setServicios((prev) => prev.filter((s) => s.id !== servicioAEliminar.id));
    setServicioAEliminar(null);
    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'El servicio se eliminó correctamente.',
    });
  };

  // ── Carrusel horizontal (flechas solo en web) ──
  const isWeb = Platform.OS === 'web';
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const SCROLL_STEP = 180;

  const scrollMax = Math.max(contentWidth - carouselWidth, 0);

  const handleScrollLeft = () => {
    const nuevo = Math.max(scrollX - SCROLL_STEP, 0);
    scrollRef.current?.scrollTo({ x: nuevo, animated: true });
  };

  const handleScrollRight = () => {
    const nuevo = Math.min(scrollX + SCROLL_STEP, scrollMax);
    scrollRef.current?.scrollTo({ x: nuevo, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Servicios</Text>
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
            <Ionicons name="search" size={18} color="#1A1A1A" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={busqueda}
              onChangeText={setBusqueda}
            />
          </View>

          {/* ── Encabezado de sección ── */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>CORTES ✂️</Text>
            <Tooltip label="Agregar">
              <TouchableOpacity style={styles.fab} onPress={handleAgregar}>
                <Ionicons name="add" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </Tooltip>
          </View>

          {/* ── Carrusel de servicios ── */}
          {serviciosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cut-outline" size={36} color={iconColor} />
              <Text style={styles.emptyText}>No hay servicios para mostrar.</Text>
            </View>
          ) : (
            <View style={styles.carouselWrapper}>
              {isWeb && scrollX > 0 && (
                <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowLeft]} onPress={handleScrollLeft}>
                  <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              )}

              <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
                onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
                onContentSizeChange={(w) => setContentWidth(w)}
                onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
                scrollEventThrottle={16}
              >
                {serviciosFiltrados.map((servicio) => (
                  <View key={servicio.id} style={styles.serviceCard}>
                    <View style={styles.serviceInfoBtn}>
                      <Tooltip label="Detalle" position="bottom">
                        <TouchableOpacity onPress={() => setServicioDetalle(servicio)}>
                          <Ionicons name="information-circle-outline" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                      </Tooltip>
                    </View>

                    <View style={styles.serviceCardImage}>
                      {servicio.imagen ? (
                        <Image source={{ uri: servicio.imagen }} style={styles.serviceCardImageImg} />
                      ) : (
                        <Ionicons name="cut-outline" size={26} color="#9CA3AF" />
                      )}
                    </View>
                    <Text style={styles.serviceCardName} numberOfLines={1}>{servicio.nombre}</Text>
                    <Text style={styles.serviceCardPrice}>{formatearPrecio(servicio.precio)}</Text>

                    <View style={styles.serviceCardActions}>
                      <Tooltip label="Editar">
                        <TouchableOpacity onPress={() => handleEditar(servicio)}>
                          <Feather name="edit-2" size={18} color="#1A1A1A" />
                        </TouchableOpacity>
                      </Tooltip>
                      <Tooltip label="Eliminar">
                        <TouchableOpacity onPress={() => handleEliminar(servicio)}>
                          <Feather name="trash-2" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </Tooltip>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {isWeb && scrollX < scrollMax && (
                <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowRight]} onPress={handleScrollRight}>
                  <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              )}
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── Modal: detalle del servicio ── */}
      <Modal
        transparent
        visible={!!servicioDetalle}
        animationType="fade"
        onRequestClose={() => setServicioDetalle(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{servicioDetalle?.nombre}</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setServicioDetalle(null)}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              {servicioDetalle?.descripcion || 'Sin descripción disponible.'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* ── Modal: confirmar eliminar servicio ── */}
      <Modal
        transparent
        visible={!!servicioAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar servicio</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminar}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar este servicio? Esta acción no se puede deshacer.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={cerrarModalEliminar}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnConfirm} onPress={confirmarEliminar}>
                <Text style={styles.modalBtnConfirmText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingOverlay visible={cargando} message="Cargando servicios..." />
      <LoadingOverlay visible={eliminando} message="Eliminando servicio..." />

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

export default AdminServiciosScreen;