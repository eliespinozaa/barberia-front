import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/BarberiasNuevaStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { barberiaAPI, usuariosAPI } from '../../config/api';


const BarberiasNuevaScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);

  const barberiaExistente = route?.params?.barberia || null;
  const esEdicion = !!barberiaExistente;

  const [foto, setFoto] = useState(barberiaExistente?.foto || null);
  const [nombre, setNombre] = useState(barberiaExistente?.nombre || '');
  const [propietario, setPropietario] = useState(barberiaExistente?.dueno || '');
  const [telefono, setTelefono] = useState(barberiaExistente?.telefono || '');
  const [estatus, setEstatus] = useState(
    barberiaExistente ? !!barberiaExistente.activa : true
  );
  const [direccion, setDireccion] = useState(barberiaExistente?.direccion || '');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState({ visible: false, type: 'success', message: '' });
  const [datosPendientes, setDatosPendientes] = useState(null);

  const [duenos, setDuenos] = useState([]);
const [propietarioId, setPropietarioId] = useState(barberiaExistente?.idUsuario || null);
const [propietarioNombre, setPropietarioNombre] = useState(barberiaExistente?.dueno || '');
const [modalPropietarioVisible, setModalPropietarioVisible] = useState(false);
const [cargandoDuenos, setCargandoDuenos] = useState(false);
const [dropdownPropietarioAbierto, setDropdownPropietarioAbierto] = useState(false);

useEffect(() => {
  const cargarDuenos = async () => {
    setCargandoDuenos(true);
    try {
      const res = await usuariosAPI.listar2();

      if (res.success) {
        const soloDuenos = res.data.filter((u) => u.rol === 'DUENO');
        setDuenos(soloDuenos);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los propietarios.');
      }
    } catch (error) {
      console.error('Error al cargar propietarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los propietarios.');
    } finally {
      setCargandoDuenos(false);
    }
  };

  cargarDuenos();
}, []);

const handleCambiarFoto = async () => {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para elegir una imagen.');
    return;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    base64: true,   // 👈 agregar esto
  });

  if (!resultado.canceled && resultado.assets?.length > 0) {
    const asset = resultado.assets[0];
    const base64Img = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri;
    setFoto(base64Img);
  }
};


const handleGuardar = async () => {
  if (!nombre.trim()) {
    Alert.alert('Falta información', 'El nombre de la barbería es obligatorio.');
    return;
  }

  if (!propietarioId) {
    Alert.alert('Falta información', 'Debes seleccionar un propietario.');
    return;
  }

  setCargando(true);

  try {

    const payload = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      estado: estatus ? 1 : 0,
      imagen: foto,
      idUsuario: propietarioId,
    };

    const res = esEdicion
      ? await barberiaAPI.actualizar(barberiaExistente.id, payload)
      : await barberiaAPI.crear(payload);

    if (!res.success) {
      throw new Error(res.error);
    }

    const datos = {
      id: res.data.id,
      nombre: res.data.nombre,
      telefono: res.data.telefono,
      direccion: res.data.direccion,
      foto: res.data.imagen,
      activa: res.data.estado === 1,
      dueno: propietarioNombre,
      idUsuario: propietarioId,
      suscripcion: 'N/A',
    };

    setDatosPendientes(datos);
    setCargando(false);
    setResultado({
      visible: true,
      type: 'success',
      message: esEdicion
        ? 'La barbería se actualizó correctamente.'
        : 'La barbería se creó correctamente.',
    });
  } catch (error) {
    setCargando(false);
    setResultado({
      visible: true,
      type: 'error',
      message: error.message || 'No se pudo guardar la información.',
    });
  }
};


  const handleCerrarResultado = () => {
    const fueExito = resultado.type === 'success';
    setResultado({ visible: false, type: 'success', message: '' });

    if (fueExito && datosPendientes) {
      if (esEdicion) {
        navigation.navigate('BarberiasScreen', { barberiaActualizada: datosPendientes });
      } else {
        navigation.navigate('BarberiasScreen', { nuevaBarberia: datosPendientes });
      }
    }
  };

  

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>{esEdicion ? 'Editar' : 'Nuevo'}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar ── */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity style={styles.avatarCircle} onPress={handleCambiarFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={32} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCambiarFoto}>
            <Text style={styles.avatarLabel}>Cambiar</Text>
          </TouchableOpacity>
        </View>

        {/* ── Formulario ── */}
        <View style={styles.formPanel}>
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nombre de la barbería"
                placeholderTextColor="rgba(0,0,0,0.35)"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={[styles.formField, { position: 'relative', zIndex: 10 }]}>
  <Text style={styles.fieldLabel}>Propietario</Text>
  <TouchableOpacity
    style={styles.selectInput}
    onPress={() => setDropdownPropietarioAbierto((prev) => !prev)}
  >
    <Text
      style={[
        styles.selectInputText,
        { flex: 1, color: propietarioNombre ? '#1A1A1A' : 'rgba(0,0,0,0.35)' },
      ]}
      numberOfLines={1}
    >
      {propietarioNombre || 'Selecciona un propietario'}
    </Text>
    <Ionicons
      name={dropdownPropietarioAbierto ? 'chevron-up' : 'chevron-down'}
      size={16}
      color="#1A1A1A"
    />
  </TouchableOpacity>

  {dropdownPropietarioAbierto && (
    <View
      style={{
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        maxHeight: 180,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
        zIndex: 20,
      }}
    >
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {cargandoDuenos ? (
          <Text style={{ padding: 12, color: '#6B7280', fontSize: 13 }}>Cargando...</Text>
        ) : duenos.length === 0 ? (
          <Text style={{ padding: 12, color: '#6B7280', fontSize: 13 }}>
            No hay propietarios registrados.
          </Text>
        ) : (
          duenos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F0F0F0',
              }}
              onPress={() => {
                setPropietarioId(item.id);
                setPropietarioNombre(`${item.nombre} ${item.apellido}`);
                setDropdownPropietarioAbierto(false);
              }}
            >
              <Text style={{ fontSize: 13, color: '#1A1A1A' }}>
                {item.nombre} {item.apellido}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )}
</View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Telefono</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Número de contacto"
                placeholderTextColor="rgba(0,0,0,0.35)"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Estatus:</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  {estatus ? 'Activa' : 'Suspendida'}
                </Text>
                <Switch
                  value={estatus}
                  onValueChange={setEstatus}
                  trackColor={{ false: '#3A3A3A', true: '#22C55E' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
           

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Direccion</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Value"
                placeholderTextColor="rgba(0,0,0,0.35)"
                value={direccion}
                onChangeText={setDireccion}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleGuardar}>
            <Text style={styles.submitBtnText}>{esEdicion ? 'Actualizar' : 'Crear'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoadingOverlay
        visible={cargando}
        message={esEdicion ? 'Actualizando...' : 'Creando...'}
      />

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        message={resultado.message}
        onClose={handleCerrarResultado}
      />

    </SafeAreaView>
  );
};

export default BarberiasNuevaScreen;