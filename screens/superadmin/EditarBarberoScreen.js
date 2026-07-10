import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { CommonActions } from '@react-navigation/native';
import createStyles from '../../styles/superadmin/EditarBarberoStyles';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { usuariosAPI, barberoAPI } from '../../config/api';

const RequirementItem = ({ met, label, styles }) => (
  <View style={styles.requirementItem}>
    <Ionicons
      name={met ? 'checkmark-circle' : 'ellipse-outline'}
      size={14}
      color={met ? '#22C55E' : '#999'}
    />
    <Text style={[styles.requirementText, met && styles.requirementTextMet]}>
      {label}
    </Text>
  </View>
);

const EditarBarberoScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const barberoParam = route?.params?.barbero;
  const barberiaId = route?.params?.barberiaId;
  const esCreacion = !barberoParam;

  const barbero = barberoParam || {
    nombre: '',
    correo: '',
    telefono: '',
    foto: null,
    activo: true,
  };

  const [nombre, setNombre] = useState(barbero.nombre);
  const [correo, setCorreo] = useState(barbero.correo);
  const [telefono, setTelefono] = useState(barbero.telefono);
  const [estatus, setEstatus] = useState(barbero.activo);
  const [foto, setFoto] = useState(barbero.foto);
  // Ya no usamos un state aparte "fotoBase64": la conversión a base64
  // se hace al momento de enviar (handleCrear / handleActualizar),
  // tomando siempre el valor actual de "foto" como única fuente de verdad.

  // En edición es opcional cambiar password; en creación siempre se pide
  const [cambiarPassword, setCambiarPassword] = useState(esCreacion);
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const passwordChecks = {
    length: nuevaPassword.length >= 8,
    uppercase: /[A-Z]/.test(nuevaPassword),
    number: /[0-9]/.test(nuevaPassword),
    special: /[^A-Za-z0-9]/.test(nuevaPassword),
  };

  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;

  const strengthInfo = useMemo(() => {
    if (!nuevaPassword) return { label: '', color: '#D8D8D8', width: '0%' };
    if (strengthScore <= 1) return { label: 'Débil', color: '#EF4444', width: '25%' };
    if (strengthScore === 2) return { label: 'Regular', color: '#F59E0B', width: '50%' };
    if (strengthScore === 3) return { label: 'Buena', color: '#3B82F6', width: '75%' };
    return { label: 'Fuerte', color: '#22C55E', width: '100%' };
  }, [nuevaPassword, strengthScore]);

  const passwordsMatch = confirmarPassword.length > 0 && nuevaPassword === confirmarPassword;
  const [loading, setLoading] = useState(false);

  const [resultado, setResultado] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    payloadExtra: null,
  });

 const cerrarResultado = () => {
  const fueExito = resultado.type === 'success';
  setResultado((prev) => ({ ...prev, visible: false }));

  if (!fueExito) return;

  const estado = navigation.getState();
  const indiceActual = estado.index; 
  const indicePadre = indiceActual - 1; 

  if (indicePadre >= 0) {
    const nuevasRutas = estado.routes.slice(0, indicePadre + 1);
    navigation.dispatch(
      CommonActions.reset({
        ...estado,
        routes: nuevasRutas,
        index: nuevasRutas.length - 1,
      })
    );
  } else {
    navigation.goBack();
  }
};

  
  const handleCambiarFoto = async () => {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para elegir una imagen.');
    return;
  }

  const resultadoPicker = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,   
  });

  if (resultadoPicker.canceled || !resultadoPicker.assets?.length) return;

  const asset = resultadoPicker.assets[0];
  const base64Img = asset.base64
    ? `data:image/jpeg;base64,${asset.base64}`
    : asset.uri;

  setFoto(base64Img);
};

  const validarFormularioBasico = () => {
    if (!nombre.trim() || !correo.trim() || !telefono.trim()) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Faltan datos',
        message: 'Nombre, correo y teléfono son obligatorios.',
      });
      return false;
    }
    return true;
  };

  const validarPassword = () => {
    if (strengthScore < 3) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Contraseña muy débil',
        message: 'La contraseña debe cumplir al menos 3 de los 4 requisitos.',
      });
      return false;
    }
    if (nuevaPassword !== confirmarPassword) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Las contraseñas no coinciden',
        message: 'Verifica que la nueva contraseña y su confirmación sean iguales.',
      });
      return false;
    }
    return true;
  };

  const handleCrear = async () => {
    if (!validarFormularioBasico()) return;
    if (!validarPassword()) return;
    if (!barberiaId) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'Falta la barbería',
        message: 'No se especificó a qué barbería pertenece este barbero.',
      });
      return;
    }

    setLoading(true);


    const partesNombre = nombre.trim().split(' ');
    const nombreSeparado = partesNombre[0];
    const apellidoSeparado = partesNombre.slice(1).join(' ') || '';

    const payload = {
      nombre: nombreSeparado,
      apellido: apellidoSeparado,
      correo,
      password: nuevaPassword,
      telefono,
      idBarberia: barberiaId,
      estado: estatus ? 1 : 0,
      fotoPerfil: foto,
    };

    const res = await barberoAPI.crear(payload);

    setLoading(false);

    if (!res.success) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo crear',
        message: res.error || 'Ocurrió un error al crear el barbero.',
      });
      return;
    }

    const nuevoBarbero = {
      id: res.data.id,
      idUsuario: res.data.idUsuario,
      nombre,
      correo,
      telefono,
      activo: estatus,
      foto: res.data.fotoPerfil ?? null,
    };

    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'El barbero se creó correctamente.',
      payloadExtra: nuevoBarbero,
    });
  };

  const handleActualizar = async () => {
    if (!validarFormularioBasico()) return;

    if (cambiarPassword) {
      if (!validarPassword()) return;
    }

    setLoading(true);


    const partesNombre = nombre.trim().split(' ');
    const nombreSeparado = partesNombre[0];
    const apellidoSeparado = partesNombre.slice(1).join(' ') || '';

    const payload = {
      nombre: nombreSeparado,
      apellido: apellidoSeparado,
      correo,
      telefono,
      estado: estatus ? 1 : 0,
      fotoPerfil: foto,
      ...(cambiarPassword && {
        passwordActual,
        nuevaPassword,
      }),
    };

    const res = await usuariosAPI.actualizar(barbero.idUsuario, payload);

    setLoading(false);

    if (!res.success) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo actualizar',
        message: res.error || 'Ocurrió un error al actualizar el barbero.',
      });
      return;
    }

    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'El barbero se actualizó correctamente.',
    });
  };

  const handleSubmit = () => (esCreacion ? handleCrear() : handleActualizar());

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>

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

          {/* ── Avatar ── */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap} onPress={handleCambiarFoto}>
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

          {/* ── Card del formulario ── */}
          <View style={styles.card}>
            <View style={styles.formGrid}>

              <View style={styles.column}>
                <Text style={styles.label}>Nombre completo</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Correo</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="tu@correo.com"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Telefono</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="10 dígitos"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Estatus:</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>
                    {estatus ? 'Activo' : 'Inactivo'}
                  </Text>
                  <Switch
                    value={estatus}
                    onValueChange={setEstatus}
                    trackColor={{ false: '#3A3A3A', true: '#22C55E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* En edición se puede elegir si cambiar password; en creación siempre se pide */}
              {!esCreacion && (
                <View style={styles.column}>
                  <Text style={styles.label}>Cambiar contraseña?</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>
                      {cambiarPassword ? 'Sí' : 'No'}
                    </Text>
                    <Switch
                      value={cambiarPassword}
                      onValueChange={setCambiarPassword}
                      trackColor={{ false: '#3A3A3A', true: '#22C55E' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              )}

              {/* Contraseña actual solo aplica al editar */}
              {!esCreacion && cambiarPassword && (
                <View style={styles.column}>
                  <Text style={styles.label}>Contraseña Actual</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Value"
                      placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                      secureTextEntry={!showActual}
                      value={passwordActual}
                      onChangeText={setPasswordActual}
                    />
                    <TouchableOpacity onPress={() => setShowActual(!showActual)} style={styles.eyeBtn}>
                      <Ionicons name={showActual ? 'eye-outline' : 'eye-off-outline'} size={18} color={isDark ? 'rgba(255,255,255,0.6)' : '#555'} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(esCreacion || cambiarPassword) && (
                <>
                  <View style={styles.column}>
                    <Text style={styles.label}>{esCreacion ? 'Nueva Contraseña' : 'Nueva Contraseña'}</Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.input}
                        placeholder="Value"
                        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                        secureTextEntry={!showNueva}
                        value={nuevaPassword}
                        onChangeText={setNuevaPassword}
                      />
                      <TouchableOpacity onPress={() => setShowNueva(!showNueva)} style={styles.eyeBtn}>
                        <Ionicons name={showNueva ? 'eye-outline' : 'eye-off-outline'} size={18} color={isDark ? 'rgba(255,255,255,0.6)' : '#555'} />
                      </TouchableOpacity>
                    </View>

                    {nuevaPassword.length > 0 && (
                      <>
                        <View style={styles.strengthWrap}>
                          <View style={styles.strengthBarTrack}>
                            <View
                              style={[
                                styles.strengthBarFill,
                                { width: strengthInfo.width, backgroundColor: strengthInfo.color },
                              ]}
                            />
                          </View>
                          <Text style={[styles.strengthLabel, { color: strengthInfo.color }]}>
                            {strengthInfo.label}
                          </Text>
                        </View>

                        <View style={styles.requirementsGrid}>
                          <RequirementItem styles={styles} met={passwordChecks.length} label="8+ caracteres" />
                          <RequirementItem styles={styles} met={passwordChecks.uppercase} label="Una mayúscula" />
                          <RequirementItem styles={styles} met={passwordChecks.number} label="Un número" />
                          <RequirementItem styles={styles} met={passwordChecks.special} label="Un carácter especial" />
                        </View>
                      </>
                    )}
                  </View>

                  <View style={styles.column}>
                    <Text style={styles.label}>Confirmar Contraseña</Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.input}
                        placeholder="Value"
                        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#999'}
                        secureTextEntry={!showConfirmar}
                        value={confirmarPassword}
                        onChangeText={setConfirmarPassword}
                      />
                      <TouchableOpacity onPress={() => setShowConfirmar(!showConfirmar)} style={styles.eyeBtn}>
                        <Ionicons name={showConfirmar ? 'eye-outline' : 'eye-off-outline'} size={18} color={isDark ? 'rgba(255,255,255,0.6)' : '#555'} />
                      </TouchableOpacity>
                    </View>

                    {confirmarPassword.length > 0 && (
                      <View style={styles.matchRow}>
                        <Ionicons
                          name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                          size={14}
                          color={passwordsMatch ? '#22C55E' : '#EF4444'}
                        />
                        <Text style={[styles.matchText, { color: passwordsMatch ? '#22C55E' : '#EF4444' }]}>
                          {passwordsMatch ? 'Las contraseñas coinciden' : 'No coinciden todavía'}
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}

            </View>

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
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

      <LoadingOverlay visible={loading} message={esCreacion ? 'Creando barbero...' : 'Actualizando barbero...'} />

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

export default EditarBarberoScreen;