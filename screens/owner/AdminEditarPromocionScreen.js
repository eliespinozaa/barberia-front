import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/owner/AdminEditarPromocionStyles';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { promocionAPI } from '../../config/api';

const AdminEditarPromocionScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const promocionParam = route?.params?.promocion;
  const barberiaId     = route?.params?.barberiaId;
  const esCreacion     = !promocionParam;

  // ── Estados del formulario ──
  const [titulo,      setTitulo]      = useState(promocionParam?.titulo      || '');
  const [descripcion, setDescripcion] = useState(promocionParam?.descripcion || '');
  const [descuento,   setDescuento]   = useState(
    promocionParam?.descuento != null ? String(promocionParam.descuento) : ''
  );
  const [fechaInicio, setFechaInicio] = useState(promocionParam?.fechaInicio || '');
  const [fechaFin,    setFechaFin]    = useState(promocionParam?.fechaFin    || '');
  const [imagen,      setImagen]      = useState(promocionParam?.imagen      || null);
  const [activo,      setActivo]      = useState(
    promocionParam ? promocionParam.estado === 1 : true
  );

  const [loading,   setLoading]   = useState(false);
  const [modalInactivar, setModalInactivar] = useState(false);

  const [resultado, setResultado] = useState({
    visible: false,
    type:    'success',
    title:   '',
    message: '',
  });

  const cerrarResultado = () => {
    const fueExito = resultado.type === 'success';
    setResultado((prev) => ({ ...prev, visible: false }));
    if (fueExito) navigation.goBack();
  };

  // ── Imagen ──
  const handleCambiarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para elegir una imagen.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (resultado.canceled || !resultado.assets?.length) return;

    const asset = resultado.assets[0];
    setImagen(
      asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri
    );
  };

  // ── Validación ──
  const validar = () => {
    if (!titulo.trim()) {
      setResultado({ visible: true, type: 'error', title: 'Falta información', message: 'El título es obligatorio.' });
      return false;
    }
    if (descuento.trim() !== '') {
      const num = Number(descuento);
      if (Number.isNaN(num) || num <= 0 || num > 100) {
        setResultado({ visible: true, type: 'error', title: 'Descuento inválido', message: 'El descuento debe estar entre 0.01 y 100.' });
        return false;
      }
    }
    if (!fechaInicio.trim() || !fechaFin.trim()) {
      setResultado({ visible: true, type: 'error', title: 'Falta información', message: 'Las fechas de inicio y fin son obligatorias.' });
      return false;
    }
    if (fechaFin < fechaInicio) {
      setResultado({ visible: true, type: 'error', title: 'Fechas inválidas', message: 'La fecha de fin no puede ser anterior a la de inicio.' });
      return false;
    }
    return true;
  };

  // ── Guardar ──
  const handleGuardar = async () => {
    if (!validar()) return;
    setLoading(true);

    const payload = {
      idBarberia:  barberiaId,
      titulo:      titulo.trim(),
      descripcion: descripcion.trim() || null,
      descuento:   descuento.trim() !== '' ? Number(descuento) : null,
      fechaInicio,
      fechaFin,
      imagen:      imagen || null,
      estado:      activo ? 1 : 0,
    };
    

    const res = esCreacion
      ? await promocionAPI.crear(payload)
      : await promocionAPI.editar(promocionParam.id, payload);

    setLoading(false);

    if (!res.success) {
      setResultado({ visible: true, type: 'error', title: 'No se pudo guardar', message: res.error || 'Ocurrió un error.' });
      return;
    }

    setResultado({
      visible: true,
      type:    'success',
      title:   '¡Listo!',
      message: esCreacion ? 'La promoción se creó correctamente.' : 'La promoción se actualizó correctamente.',
    });
  };

  // ── Inactivar (eliminar lógico) ──
  const confirmarInactivar = async () => {
    setModalInactivar(false);
    setLoading(true);
    const res = await promocionAPI.eliminar(promocionParam.id);
    setLoading(false);

    if (!res.success) {
      setResultado({ visible: true, type: 'error', title: 'No se pudo inactivar', message: res.error || 'Ocurrió un error.' });
      return;
    }

    setResultado({ visible: true, type: 'success', title: '¡Listo!', message: 'La promoción se inactivó correctamente.' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>{esCreacion ? 'Nuevo' : 'Editar'}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>

          {/* ── Imagen ── */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap} onPress={handleCambiarImagen}>
              {imagen ? (
                <Image source={{ uri: imagen }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCambiarImagen}>
              <Text style={styles.avatarLabel}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          {/* ── Card formulario ── */}
          <View style={styles.card}>
            <View style={styles.formGrid}>

              {/* Titulo */}
              <View style={styles.column}>
                <Text style={styles.label}>Titulo</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. 2x1 en cortes"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={titulo}
                    onChangeText={setTitulo}
                  />
                </View>
              </View>

              {/* Descripcion */}
              <View style={styles.column}>
                <Text style={styles.label}>Descripcion</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Descripción de la promo"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={descripcion}
                    onChangeText={setDescripcion}
                  />
                </View>
              </View>

              {/* Descuento */}
              <View style={styles.column}>
                <Text style={styles.label}>Descuento</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="% (ej. 15)"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={descuento}
                    onChangeText={setDescuento}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Estatus */}
              <View style={styles.column}>
                <Text style={styles.label}>Estatus:</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>
                    {activo ? 'Activo' : 'Inactivo'}
                  </Text>
                  <Switch
                    value={activo}
                    onValueChange={setActivo}
                    trackColor={{ false: '#3A3A3A', true: '#22C55E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Fecha inicio */}
              <View style={styles.column}>
                <Text style={styles.label}>Fecha inicio</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={fechaInicio}
                    onChangeText={setFechaInicio}
                  />
                </View>
              </View>

              {/* Fecha fin */}
              <View style={styles.column}>
                <Text style={styles.label}>Fecha fin</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={fechaFin}
                    onChangeText={setFechaFin}
                  />
                </View>
              </View>

            </View>

            {/* Botón guardar */}
            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleGuardar}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading
                  ? (esCreacion ? 'Creando...' : 'Actualizando...')
                  : (esCreacion ? 'Crear' : 'Actualizar')}
              </Text>
            </TouchableOpacity>

          
          </View>

        </View>
      </ScrollView>

      {/* ── Modal: confirmar inactivar ── */}
      <Modal
        transparent
        visible={modalInactivar}
        animationType="fade"
        onRequestClose={() => setModalInactivar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalInactivar(false)}
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.modalMessage}>
              Estas seguro que deseas inactivar{'\n'}la promocion definitivamente?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalInactivar(false)}
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

      <LoadingOverlay visible={loading} message={esCreacion ? 'Creando promoción...' : 'Guardando promoción...'} />

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

export default AdminEditarPromocionScreen;