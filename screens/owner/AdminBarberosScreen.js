import React, { useState, useCallback, useMemo } from 'react';
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
import { Ionicons, Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/owner/AdminBarberosStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import Tooltip from '../../components/Tooltip';
import { barberoAPI, usuariosAPI } from '../../config/api';

const AdminBarberosScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  // El id de la barbería viene por params (lo manda OwnerHomeScreen).
  const barberiaId = route?.params?.barberiaId;

  const iconColor = isDark ? '#FFFFFF' : '#1A1A1A';

  const [busqueda, setBusqueda] = useState('');
  const [barberos, setBarberos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [barberoAEliminar, setBarberoAEliminar] = useState(null);
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

  const cargarBarberos = useCallback(async () => {
    if (!barberiaId) return;
    setCargando(true);
    try {
      const barberosRes = await barberoAPI.listarPorBarberia(barberiaId);
      if (!barberosRes.success) {
        console.log(barberosRes.error);
        setBarberos([]);
        return;
      }

      const usuariosRes = await Promise.all(
        barberosRes.data.map((b) => usuariosAPI.obtenerPorId(b.idUsuario))
      );

      const dataTransformada = barberosRes.data.map((b, index) => {
        const usuarioRes = usuariosRes[index];
        const usuario = usuarioRes.success ? usuarioRes.data : null;
        return {
          id: b.id,
          idUsuario: b.idUsuario,
          nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sin asignar',
          correo: usuario ? usuario.email : '',
          telefono: usuario ? usuario.telefono : '',
          activo: b.estado === 1,
          foto: usuario?.fotoPerfil || null,
        };
      });

      setBarberos(dataTransformada);
    } catch (e) {
      console.log(e);
      setBarberos([]);
    } finally {
      setCargando(false);
    }
  }, [barberiaId]);

  useFocusEffect(
    useCallback(() => {
      cargarBarberos();
    }, [cargarBarberos])
  );

  const barberosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return barberos;
    const q = busqueda.trim().toLowerCase();
    return barberos.filter((b) => b.nombre.toLowerCase().includes(q));
  }, [barberos, busqueda]);

  const handleAgregar = () => {
    navigation.navigate('EditarBarberoScreen', { barberiaId });
  };

  const handleEditar = (item) => {
    navigation.navigate('EditarBarberoScreen', {
      barbero: item,
      barberiaId,
    });
  };

  const handleEliminar = (item) => {
    setBarberoAEliminar(item);
  };

  const cerrarModalEliminar = () => {
    setBarberoAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!barberoAEliminar) return;

    setEliminando(true);
    const res = await barberoAPI.eliminar(barberoAEliminar.id);
    setEliminando(false);

    if (!res.success) {
      setBarberoAEliminar(null);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo eliminar',
        message: res.error || 'Ocurrió un error al eliminar al barbero.',
      });
      return;
    }

    setBarberos((prev) => prev.filter((b) => b.id !== barberoAEliminar.id));
    setBarberoAEliminar(null);
    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'El barbero se eliminó correctamente.',
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
          <Text style={styles.headerTitle}>Barberos</Text>
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

          {/* ── Encabezado del listado ── */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Todo</Text>
            <Tooltip label="Agregar">
              <TouchableOpacity style={styles.fab} onPress={handleAgregar}>
                <Ionicons name="add" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </Tooltip>
          </View>

          {/* ── Listado ── */}
          <View style={styles.listContainer}>
            {barberosFiltrados.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={36} color={iconColor} />
                <Text style={styles.emptyText}>No hay barberos para mostrar.</Text>
              </View>
            ) : (
              barberosFiltrados.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.listItemAvatar}>
                    {item.foto ? (
                      <Image source={{ uri: item.foto }} style={styles.listItemAvatarImage} />
                    ) : (
                      <Ionicons name="person" size={20} color="#9CA3AF" />
                    )}
                  </View>

                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemName}>{item.nombre}</Text>
                    <View style={styles.listItemStatusRow}>
                      <View
                        style={[
                          styles.statusDot,
                          item.activo ? styles.statusDotActive : styles.statusDotInactive,
                        ]}
                      />
                      <Text style={styles.listItemStatus}>
                        Estatus {item.activo ? 'Activo' : 'Inactivo'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.listItemActions}>
                    <Tooltip label="Editar">
                      <TouchableOpacity style={styles.listItemActionBtn} onPress={() => handleEditar(item)}>
                        <Feather name="edit-2" size={20} color={iconColor} />
                      </TouchableOpacity>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <TouchableOpacity style={styles.listItemActionBtn} onPress={() => handleEliminar(item)}>
                        <Feather name="trash-2" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </Tooltip>
                  </View>
                </View>
              ))
            )}
          </View>

        </View>
      </ScrollView>

      {/* ── Modal: confirmar eliminar barbero ── */}
      <Modal
        transparent
        visible={!!barberoAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar barbero</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminar}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar a este barbero? Esta acción no se puede deshacer.
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

      <LoadingOverlay visible={cargando} message="Cargando barberos..." />
      <LoadingOverlay visible={eliminando} message="Eliminando barbero..." />

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

export default AdminBarberosScreen;