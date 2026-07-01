import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, Easing, Platform,
  KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authAPI, tokenManager } from '../../config/api';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/common/LoginStyles';

const LoginScreen = ({ navigation }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const spinAnim  = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { theme } = useTheme();
const styles = createStyles(theme);

  /* ── Verificar sesión activa + animación de entrada ── */
  useEffect(() => {
    const check = async () => {
      const token    = await tokenManager.getToken();
      const userData = await tokenManager.getUser();
      if (token && userData) {
        navigation.replace('LoadingScreen', { user: userData });
      }
    };
    check();

    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 80, useNativeDriver: true }),
    ]).start();
  };

  /* ── Login ── */
  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Completa todos los campos');
      shake();
      return;
    }

    setLoading(true);
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
    ).start();

    const res = await authAPI.login(email, password);

    spinAnim.stopAnimation();
    spinAnim.setValue(0);
    setLoading(false);

    if (res.success) {
      const apiUser = {
  id:              res.data.id,
  email:           res.data.correo,
  name:            res.data.nombreCompleto,
  rol:             res.data.rol,
  nombreCompleto:  res.data.nombreCompleto,
  clienteAsociado: res.data.clienteAsociado,
};
      navigation.replace('LoadingScreen', { user: apiUser });
    } else {
      setError(res.error || 'Error de autenticación');
      shake();
    }
  };

  /* ── Render ── */
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Botón Atrás */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Home')}>
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.centerWrapper}>

            {/* ── Header (fuera de la tarjeta, igual que Register) ── */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Hola, Bienvenido a</Text>

              <View style={styles.logoWrap}>
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="cut" size={28} color="#C9A84C" />
                  <Text style={styles.logoText}>BARBER</Text>
                  <Text style={styles.logoSubText}>SYSTEM</Text>
                </View>
              </View>

              <Text style={styles.title}>Inicia Sesión</Text>
            </View>

            {/* ── Tarjeta ── */}
            <Animated.View style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { translateX: shakeAnim },
                ],
              },
            ]}>

              {/* Error */}
              {!!error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color="#E74C3C" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Campo correo */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Correo</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="tu@correo.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Campo contraseña */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPass}
                    value={password}
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                    <Ionicons
                      name={showPass ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botón */}
              <TouchableOpacity
                style={[styles.btn, loading && styles.btnLoading]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading && (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="refresh" size={18} color="#FFF" />
                  </Animated.View>
                )}
                <Text style={styles.btnText}>
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </Text>
              </TouchableOpacity>

              {/* Olvidé contraseña */}
              <TouchableOpacity style={styles.forgot}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

            </Animated.View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;