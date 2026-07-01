import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/EditarUsuarioStyles';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { usuariosAPI, tokenManager } from '../../config/api';

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

const PerfilScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const [cargando, setCargando] = useState(true);
  const [loading, setLoading] = useState(false);

  const [usuarioId, setUsuarioId] = useState(null);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto, setFoto] = useState(null);

  // ── Password ──
  const [mostrarPassword, setMostrarPassword] = useState(false);
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

  const [resultado, setResultado] = useState({
    visible: false, type: 'success', title: '', message: '',
  });

  const cerrarResultado = () => {
  const fueExito = resultado.type === 'success';
  setResultado((prev) => ({ ...prev, visible: false }));
  if (fueExito) cargarPerfil();
};

  // ── Carga del perfil ──
  const cargarPerfil = useCallback(async () => {
    setCargando(true);
    const userLocal = await tokenManager.getUser();
    if (!userLocal?.id) {
      setCargando(false);
      return;
    }
    const res = await usuariosAPI.obtenerPorId(userLocal.id);
    const u = res.success ? res.data : userLocal;

    setUsuarioId(u.id);
    setNombreCompleto(`${u.nombre || ''} ${u.apellido || ''}`.trim());
    setCorreo(u.email || u.correo || '');
    setTelefono(u.telefono || '');
    setFoto(u.fotoPerfil || null);
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [cargarPerfil])
  );

  const convertirImagenABase64 = async (uri) => {
    if (!uri) return null;
    if (uri.startsWith('data:') || uri.startsWith('http')) return uri;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.log('Error convirtiendo imagen a base64:', e);
      return null;
    }
  };

  const handleCambiarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      setResultado({
        visible: true, type: 'error', title: 'Permiso requerido',
        message: 'Necesitamos acceso a tu galería para elegir una imagen.',
      });
      return;
    }
    const resultadoPicker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (resultadoPicker.canceled || !resultadoPicker.assets?.length) return;
    setFoto(resultadoPicker.assets[0].uri);
  };

  const validarFormularioBasico = () => {
    if (!nombreCompleto.trim() || !correo.trim() || !telefono.trim()) {
      setResultado({
        visible: true, type: 'error', title: 'Faltan datos',
        message: 'Nombre, correo y teléfono son obligatorios.',
      });
      return false;
    }
    return true;
  };

  const validarPassword = () => {
    if (!passwordActual) {
      setResultado({
        visible: true, type: 'error', title: 'Falta tu contraseña actual',
        message: 'Ingresa tu contraseña actual para confirmar el cambio.',
      });
      return false;
    }
    if (strengthScore < 3) {
      setResultado({
        visible: true, type: 'error', title: 'Contraseña muy débil',
        message: 'La nueva contraseña debe cumplir al menos 3 de los 4 requisitos.',
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

  const handleActualizar = async () => {
    if (!validarFormularioBasico()) return;
    if (mostrarPassword && !validarPassword()) return;

    setLoading(true);
    const fotoFinal = await convertirImagenABase64(foto);

    const partes = nombreCompleto.trim().split(' ');
    const nombreSeparado = partes[0];
    const apellidoSeparado = partes.slice(1).join(' ') || '';

    const payload = {
      nombre: nombreSeparado,
      apellido: apellidoSeparado,
      correo,
      telefono,
      fotoPerfil: fotoFinal,
      ...(mostrarPassword && {
        passwordActual,
        nuevaPassword,
      }),
    };

    const res = await usuariosAPI.actualizar(usuarioId, payload);
    setLoading(false);

    if (!res.success) {
      setResultado({
        visible: true, type: 'error', title: 'No se pudo actualizar',
        message: res.error || 'Ocurrió un error al actualizar tu perfil.',
      });
      return;
    }

    // Refleja los cambios en el usuario guardado localmente
    const userActual = await tokenManager.getUser();
    const userActualizado = {
      ...userActual,
      nombre: nombreSeparado,
      apellido: apellidoSeparado,
      name: `${nombreSeparado} ${apellidoSeparado}`.trim(),
      email: correo,
      correo,
      telefono,
      fotoPerfil: fotoFinal,
    };
    await tokenManager.saveToken(await tokenManager.getToken(), userActualizado);

    setMostrarPassword(false);
    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');

    setResultado({
      visible: true, type: 'success', title: '¡Listo!',
      message: 'Tu perfil se actualizó correctamente.',
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
          <Text style={styles.headerTitle}>Mi Perfil</Text>
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

              {/* ── Botón "Restablecer contraseña" ── */}
              {!mostrarPassword && (
                <View style={styles.column}>
                  <Text style={styles.label}> </Text>
                  <TouchableOpacity style={styles.resetBtn} onPress={() => setMostrarPassword(true)}>
                    <Text style={styles.resetBtnText}>Cambiar contraseña</Text>
                  </TouchableOpacity>
                </View>
              )}

              {mostrarPassword && (
                <>
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

                  <View style={styles.column}>
                    <Text style={styles.label}> </Text>
                   <TouchableOpacity
  style={[
    styles.resetBtn,
    {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
    },
  ]}
  onPress={() => {
    setMostrarPassword(false);
    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');
  }}
>
  <Text style={[styles.resetBtnText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
    Cancelar cambio
  </Text>
</TouchableOpacity>
                  </View>
                </>
              )}

            </View>

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleActualizar}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? 'Actualizando...' : 'Guardar cambios'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      <LoadingOverlay visible={cargando} message="Cargando perfil..." />
      <LoadingOverlay visible={loading} message="Actualizando perfil..." />

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

export default PerfilScreen;