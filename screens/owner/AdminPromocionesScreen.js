import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/owner/AdminPromocionesStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import Tooltip from '../../components/Tooltip';
import { promocionAPI } from '../../config/api';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A';
  const [, mes, dia] = fechaISO.split('-');
  return `${dia} ${MESES[parseInt(mes, 10) - 1]}`;
};

// Una promoción se considera activa si su estado está encendido y la
// fecha de fin todavía no pasó; en caso contrario se muestra Finalizada.
const esPromocionActiva = (promo) => {
  if (promo.estado !== 1) return false;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(`${promo.fechaFin}T00:00:00`);
  return fin >= hoy;
};

const AdminPromocionesScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const barberiaId = route?.params?.barberiaId;
  const iconColor = isDark ? '#FFFFFF' : '#1A1A1A';

  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [promoAEliminar, setPromoAEliminar] = useState(null);
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

  const cargarPromociones = useCallback(async () => {
    if (!barberiaId) return;
    setCargando(true);
    try {
      const res = await promocionAPI.listarPorBarberia(barberiaId);
      if (!res.success) {
        console.log(res.error);
        setPromociones([]);
        return;
      }

      const dataTransformada = res.data.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        descripcion: p.descripcion,
        descuento: p.descuento,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin,
        imagen: p.imagen,
        estado: p.estado,
      }));

      setPromociones(dataTransformada);
    } catch (e) {
      console.log(e);
      setPromociones([]);
    } finally {
      setCargando(false);
    }
  }, [barberiaId]);

  useFocusEffect(
    useCallback(() => {
      cargarPromociones();
    }, [cargarPromociones])
  );

  const stats = useMemo(() => {
    const total = promociones.length;
    const activas = promociones.filter((p) => esPromocionActiva(p)).length;
    const finalizadas = total - activas;
    return { total, activas, finalizadas };
  }, [promociones]);

  const handleAgregar = () => {
    navigation.navigate('AdminEditarPromocionScreen', { barberiaId });
  };

  const handleEditar = (promo) => {
    navigation.navigate('AdminEditarPromocionScreen', { promocion: promo, barberiaId });
  };

  const handleEliminar = (promo) => {
    setPromoAEliminar(promo);
  };

  const handleToggleEstado = async (promo) => {
  const nuevoEstado = esPromocionActiva(promo) ? 0 : 1;
  const res = await promocionAPI.editar(promo.id, {
    idBarberia:  barberiaId,
    titulo:      promo.titulo,
    descripcion: promo.descripcion,
    descuento:   promo.descuento,
    fechaInicio: promo.fechaInicio,
    fechaFin:    promo.fechaFin,
    imagen:      promo.imagen,
    estado:      nuevoEstado,
  });

  if (!res.success) {
    setResultado({
      visible: true,
      type:    'error',
      title:   'Error',
      message: res.error || 'No se pudo cambiar el estado.',
    });
    return;
  }

  setPromociones((prev) =>
    prev.map((p) =>
      p.id === promo.id ? { ...p, estado: nuevoEstado } : p
    )
  );
};

  const cerrarModalEliminar = () => {
    setPromoAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!promoAEliminar) return;

    setEliminando(true);
    const res = await promocionAPI.eliminar(promoAEliminar.id);
    setEliminando(false);

    if (!res.success) {
      setPromoAEliminar(null);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo eliminar',
        message: res.error || 'Ocurrió un error al eliminar la promoción.',
      });
      return;
    }

    setPromociones((prev) => prev.filter((p) => p.id !== promoAEliminar.id));
    setPromoAEliminar(null);
    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'La promoción se eliminó correctamente.',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Promociones</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>

          {/* ── Barra de estadísticas ── */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Promociones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.activas}</Text>
              <Text style={styles.statLabel}>Activas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.finalizadas}</Text>
              <Text style={styles.statLabel}>Finalizadas</Text>
            </View>
          </View>

          {/* ── Encabezado del listado ── */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Todo</Text>
            <Tooltip label="Agregar">
              <TouchableOpacity style={styles.fab} onPress={handleAgregar}>
                <Ionicons name="add" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </Tooltip>
          </View>

          {/* ── Grid de promociones ── */}
          {promociones.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetags-outline" size={36} color={iconColor} />
              <Text style={styles.emptyText}>No hay promociones para mostrar.</Text>
            </View>
          ) : (
            <View style={styles.cardsGrid}>
              {promociones.map((promo) => {
                const activa = esPromocionActiva(promo);
                return (
                  <View key={promo.id} style={styles.promoCard}>
                    <View style={styles.promoAvatar}>
                      {promo.imagen ? (
                        <Image source={{ uri: promo.imagen }} style={styles.promoAvatarImage} />
                      ) : (
                        <Ionicons name="pricetag-outline" size={26} color="#9CA3AF" />
                      )}
                    </View>

                    <Text style={styles.promoTitulo} numberOfLines={1}>{promo.titulo}</Text>

                    <Text style={styles.promoDetalle}>
                      {promo.descuento != null ? `${promo.descuento}% de descuento` : promo.descripcion || 'Sin descripción'}
                    </Text>

                    <Text style={styles.promoVigenciaLabel}>Vigencia</Text>
                    <Text style={styles.promoVigenciaFechas}>
                      {formatearFecha(promo.fechaInicio)} - {formatearFecha(promo.fechaFin)}
                    </Text>

                    <View style={styles.promoEstadoRow}>
                      <View style={[styles.statusDot, activa ? styles.statusDotActive : styles.statusDotInactive]} />
                      <Text style={styles.promoEstadoText}>
                        {activa ? 'Activa' : 'Finalizada'}
                      </Text>
                    </View>

                   <View style={styles.promoActions}>
  <Tooltip label={esPromocionActiva(promo) ? 'Pausar' : 'Activar'}>
    <TouchableOpacity onPress={() => handleToggleEstado(promo)}>
      <Ionicons
        name={esPromocionActiva(promo) ? 'pause-circle-outline' : 'play-circle-outline'}
        size={20}
        color={esPromocionActiva(promo) ? '#F59E0B' : '#22C55E'}
      />
    </TouchableOpacity>
  </Tooltip>
  <Tooltip label="Editar">
    <TouchableOpacity onPress={() => handleEditar(promo)}>
      <Feather name="edit-2" size={18} color={iconColor} />
    </TouchableOpacity>
  </Tooltip>
  <Tooltip label="Eliminar">
    <TouchableOpacity onPress={() => handleEliminar(promo)}>
      <Feather name="trash-2" size={18} color="#EF4444" />
    </TouchableOpacity>
  </Tooltip>
</View>
                  </View>
                );
              })}
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── Modal: confirmar eliminar promoción ── */}
      <Modal
        transparent
        visible={!!promoAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar promoción</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminar}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar esta promoción? Esta acción no se puede deshacer.
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

      <LoadingOverlay visible={cargando} message="Cargando promociones..." />
      <LoadingOverlay visible={eliminando} message="Eliminando promoción..." />

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

export default AdminPromocionesScreen;