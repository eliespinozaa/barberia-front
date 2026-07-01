import React, { useState, useEffect, useMemo } from 'react';
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
import createStyles from '../../styles/superadmin/EditarUsuarioStyles';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { usuariosAPI, barberiaAPI } from '../../config/api';

const ROLES = ['SUPER_ADMIN', 'DUENO', 'CLIENTE', 'BARBERO'];
const ROL_LABEL = {
  SUPER_ADMIN: 'Super Admin',
  DUENO:       'Dueño',
  CLIENTE:     'Cliente',
  BARBERO:     'Barbero',
};

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

const EditarUsuarioScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const usuarioParam = route?.params?.usuario;
  const esCreacion = !usuarioParam;

  const usuario = usuarioParam || {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fotoPerfil: null,
    estado: 1,
    rol: 'CLIENTE',
  };

  const [nombreCompleto, setNombreCompleto] = useState(
    esCreacion ? '' : `${usuario.nombre} ${usuario.apellido}`.trim()
  );
  const [correo, setCorreo] = useState(usuario.email || '');
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [estatus, setEstatus] = useState(usuario.estado === 1);
  const [foto, setFoto] = useState(usuario.fotoPerfil);
  const [rol, setRol] = useState(usuario.rol || 'CLIENTE');
  const [dropRolVisible, setDropRolVisible] = useState(false);

  // ── Barbería (solo al crear un usuario con rol Barbero) ──
  const [barberias, setBarberias] = useState([]);
  const [idBarberia, setIdBarberia] = useState(null);
  const [dropBarberiaVisible, setDropBarberiaVisible] = useState(false);

  useEffect(() => {
    const cargarBarberias = async () => {
      const res = await barberiaAPI.listar2();
      if (res.success) setBarberias(res.data);
    };
    if (esCreacion && rol === 'BARBERO' && barberias.length === 0) {
      cargarBarberias();
    }
  }, [rol, esCreacion]);

  // ── Password ──
  // En creación siempre se pide. En edición, se revela con "Restablecer contraseña".
  const [mostrarPassword, setMostrarPassword] = useState(esCreacion);
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
    visible: false, type: 'success', title: '', message: '',
  });

  const cerrarResultado = () => {
    const fueExito = resultado.type === 'success';
    setResultado((prev) => ({ ...prev, visible: false }));
    // La lista de UsuariosScreen recarga sola via useFocusEffect al regresar.
    if (fueExito) navigation.goBack();
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
    if (!nombreCompleto.trim() || !correo.trim() || !telefono.trim()) {
      setResultado({
        visible: true, type: 'error', title: 'Faltan datos',
        message: 'Nombre, correo y teléfono son obligatorios.',
      });
      return false;
    }
    if (esCreacion && rol === 'BARBERO' && !idBarberia) {
      setResultado({
        visible: true, type: 'error', title: 'Falta la barbería',
        message: 'Selecciona a qué barbería pertenece este barbero.',
      });
      return false;
    }
    return true;
  };

  const validarPassword = () => {
    if (strengthScore < 3) {
      setResultado({
        visible: true, type: 'error', title: 'Contraseña muy débil',
        message: 'La contraseña debe cumplir al menos 3 de los 4 requisitos.',
      });
      return false;
    }
    if (nuevaPassword !== confirmarPassword) {
      setResultado({
        visible: true, type: 'error', title: 'Las contraseñas no coinciden',
        message: 'Verifica que la nueva contraseña y su confirmación sean iguales.',
      });
      return false;
    }
    return true;
  };

  const handleCrear = async () => {
    if (!validarFormularioBasico()) return;
    if (!validarPassword()) return;

    setLoading(true);
    
    const partes = nombreCompleto.trim().split(' ');
    const nombreSeparado = partes[0];
    const apellidoSeparado = partes.slice(1).join(' ') || '';

    const payload = {
      nombre: nombreSeparado,
      apellido: apellidoSeparado,
      correo,
      password: nuevaPassword,
      telefono,
      fotoPerfil: foto,
      rol,
      estado: estatus ? 1 : 0,
      ...(rol === 'BARBERO' && { idBarberia }),
    };

    const res = await usuariosAPI.crear(payload);
    setLoading(false);

    if (!res.success) {
      setResultado({
        visible: true, type: 'error', title: 'No se pudo crear',
        message: res.error || 'Ocurrió un error al crear el usuario.',
      });
      return;
    }

    setResultado({
      visible: true, type: 'success', title: '¡Listo!',
      message: 'El usuario se creó correctamente.',
    });
  };

  const handleActualizar = async () => {
    if (!validarFormularioBasico()) return;
    if (mostrarPassword) {
      if (!validarPassword()) return;
    }

    setLoading(true);
    

    const partes = nombreCompleto.trim().split(' ');
    const nombreSeparado = partes[0];
    const apellidoSeparado = partes.slice(1).join(' ') || '';

    const payload = {
      nombre: nombreSeparado,
      apellido: apellidoSeparado,
      correo,
      telefono,
      estado: estatus ? 1 : 0,
      fotoPerfil: foto,
      ...(mostrarPassword && {
        passwordActual,
        nuevaPassword,
      }),
    };

    const res = await usuariosAPI.actualizar(usuario.id, payload);
    setLoading(false);

    if (!res.success) {
      setResultado({
        visible: true, type: 'error', title: 'No se pudo actualizar',
        message: res.error || 'Ocurrió un error al actualizar el usuario.',
      });
      return;
    }

    setResultado({
      visible: true, type: 'success', title: '¡Listo!',
      message: 'El usuario se actualizó correctamente.',
    });
  };

  const handleSubmit = () => (esCreacion ? handleCrear() : handleActualizar());

  const barberiaSeleccionada = barberias.find((b) => b.id === idBarberia);

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
                    value={nombreCompleto}
                    onChangeText={setNombreCompleto}
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

              {/* ── Rol: editable solo al crear ── */}
              <View style={styles.column}>
                <Text style={styles.label}>Rol</Text>
                <TouchableOpacity
                  style={[styles.dropdownTrigger, !esCreacion && styles.dropdownTriggerDisabled]}
                  onPress={() => esCreacion && setDropRolVisible(true)}
                  disabled={!esCreacion}
                >
                  <Text style={styles.dropdownTriggerText}>{ROL_LABEL[rol] || rol}</Text>
                  {esCreacion && <Ionicons name="chevron-down" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              </View>

              {/* ── Barbería: solo si rol == BARBERO y es creación ── */}
              {esCreacion && rol === 'BARBERO' && (
                <View style={styles.column}>
                  <Text style={styles.label}>Barbería</Text>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setDropBarberiaVisible(true)}
                  >
                    <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                      {barberiaSeleccionada ? barberiaSeleccionada.nombre : 'Seleccionar...'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.column}>
                <Text style={styles.label}>Estatus:</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>{estatus ? 'Activo' : 'Inactivo'}</Text>
                  <Switch
                    value={estatus}
                    onValueChange={setEstatus}
                    trackColor={{ false: '#3A3A3A', true: '#22C55E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* ── Botón "Restablecer contraseña" (solo edición) ── */}
              {!esCreacion && !mostrarPassword && (
                <View style={styles.column}>
                  <Text style={styles.label}> </Text>
                  <TouchableOpacity style={styles.resetBtn} onPress={() => setMostrarPassword(true)}>
                    <Text style={styles.resetBtnText}>Restablecer contraseña</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Contraseña actual: solo al editar y con el panel abierto */}
              {!esCreacion && mostrarPassword && (
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

              {(esCreacion || mostrarPassword) && (
                <>
                  <View style={styles.column}>
                    <Text style={styles.label}>Nueva Contraseña</Text>
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

                  {!esCreacion && (
                    <View style={styles.column}>
                      <Text style={styles.label}> </Text>
                      <TouchableOpacity
                        style={[styles.resetBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}
                        onPress={() => {
                          setMostrarPassword(false);
                          setPasswordActual('');
                          setNuevaPassword('');
                          setConfirmarPassword('');
                        }}
                      >
                        <Text style={[styles.resetBtnText, { color: '#FFFFFF' }]}>Cancelar cambio</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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

      {/* ── Dropdown: Rol ── */}
      {dropRolVisible && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setDropRolVisible(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setDropRolVisible(false)}>
            <View style={styles.dropdownMenu}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={styles.dropdownMenuItem}
                  onPress={() => { setRol(r); setDropRolVisible(false); }}
                >
                  <Text style={styles.dropdownMenuItemText}>{ROL_LABEL[r]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* ── Dropdown: Barbería ── */}
      {dropBarberiaVisible && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setDropBarberiaVisible(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setDropBarberiaVisible(false)}>
            <View style={styles.dropdownMenu}>
              <ScrollView>
                {barberias.length === 0 ? (
                  <View style={styles.dropdownMenuItem}>
                    <Text style={styles.dropdownMenuItemText}>Cargando barberías...</Text>
                  </View>
                ) : (
                  barberias.map((b) => (
                    <TouchableOpacity
                      key={b.id}
                      style={styles.dropdownMenuItem}
                      onPress={() => { setIdBarberia(b.id); setDropBarberiaVisible(false); }}
                    >
                      <Text style={styles.dropdownMenuItemText}>{b.nombre}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <LoadingOverlay visible={loading} message={esCreacion ? 'Creando usuario...' : 'Actualizando usuario...'} />

      {resultado.visible && (
        <ResultModal
          visible
          type={resultado.type}
          title={resultado.title}
          message={resultado.message}
          onClose={cerrarResultado}
        />
      )}
    </SafeAreaView>
  );
};

export default EditarUsuarioScreen;