import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/EditarServicioStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { servicioAPI } from '../../config/api';

const EditarServicioScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);

  const { servicio, barberiaId } = route?.params || {};
  const esEdicion = !!servicio;

  const [nombre, setNombre] = useState(servicio?.nombre || '');
  const [descripcion, setDescripcion] = useState(servicio?.descripcion || '');
  const [precio, setPrecio] = useState(servicio?.precio ? String(servicio.precio) : '');
  const [activo, setActivo] = useState(servicio ? servicio.activo : true);
  const [imagen, setImagen] = useState(servicio?.imagen || null);

  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const cerrarResultado = () => {
    setResultado((prev) => ({ ...prev, visible: false }));
    if (resultado.type === 'success') {
      navigation.goBack();
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Permiso requerido',
        message: 'Necesitamos acceso a tus fotos para seleccionar una imagen.',
      });
      return;
    }

    const resultadoPicker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (resultadoPicker.canceled) return;

    const asset = resultadoPicker.assets[0];
    const base64Img = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri;

    setImagen(base64Img);
  };

  const validar = () => {
    if (!nombre.trim()) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Falta información',
        message: 'El nombre del servicio es obligatorio.',
      });
      return false;
    }
    if (!precio.trim() || Number.isNaN(Number(precio)) || Number(precio) < 0) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Precio inválido',
        message: 'Ingresa un precio válido para el servicio.',
      });
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validar()) return;

    setGuardando(true);

    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      imagen,
      estado: activo ? 1 : 0,
      idBarberia: barberiaId,
    };

    const res = esEdicion
      ? await servicioAPI.actualizar(servicio.id, payload)
      : await servicioAPI.crear(payload);

    setGuardando(false);

    if (!res.success) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo guardar',
        message: res.error || 'Ocurrió un error al guardar el servicio.',
      });
      return;
    }

    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: esEdicion
        ? 'El servicio se actualizó correctamente.'
        : 'El servicio se creó correctamente.',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>
            {esEdicion ? 'Editar servicio' : 'Nuevo servicio'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>
          {/* ── Imagen ── */}
          <TouchableOpacity style={styles.imagePicker} onPress={seleccionarImagen}>
            {imagen ? (
              <Image source={{ uri: imagen }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Agregar imagen</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ── Nombre ── */}
          <Text style={styles.label}>Nombre del servicio</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Corte clásico"
            placeholderTextColor={styles.placeholderColor}
          />

          {/* ── Descripción ── */}
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Breve descripción del servicio"
            placeholderTextColor={styles.placeholderColor}
            multiline
            numberOfLines={3}
          />

          {/* ── Precio ── */}
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            placeholder="0.00"
            placeholderTextColor={styles.placeholderColor}
            keyboardType="decimal-pad"
          />

          {/* ── Estado activo/inactivo ── */}
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

          {/* ── Botón guardar ── */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
            <Text style={styles.saveBtnText}>
              {esEdicion ? 'Guardar cambios' : 'Crear servicio'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoadingOverlay visible={guardando} message="Guardando servicio..." />

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

export default EditarServicioScreen;