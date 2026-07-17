import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { authAPI, tokenManager } from "../../config/api";
import { useTheme } from "../../context/ThemeContext";
import createStyles from "../../styles/common/LoginStyles";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Nuevo: estado del modal de recuperación ──
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const check = async () => {
      const token = await tokenManager.getToken();
      const userData = await tokenManager.getUser();
      if (token && userData) {
        navigation.replace("LoadingScreen", { user: userData });
      }
    };
    check();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Completa todos los campos");
      shake();
      return;
    }

    setLoading(true);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const res = await authAPI.login(email, password);

    spinAnim.stopAnimation();
    spinAnim.setValue(0);
    setLoading(false);

    if (res.success) {
      const apiUser = {
        id: res.data.id,
        email: res.data.correo,
        name: res.data.nombreCompleto,
        rol: res.data.rol,
        nombreCompleto: res.data.nombreCompleto,
        clienteAsociado: res.data.clienteAsociado,
      };
      navigation.replace("LoadingScreen", { user: apiUser });
    } else {
      setError(res.error || "Error de autenticación");
      shake();
    }
  };

  const handleForgotPassword = async () => {
  if (!forgotEmail) {
    setForgotMsg("Escribe tu correo electrónico");
    return;
  }
  setForgotLoading(true);
  setForgotMsg("");

  const res = await authAPI.forgotPassword(forgotEmail);

  setForgotLoading(false);

  setForgotMsg(
    "Si el correo existe, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam)."
  );
};

  const closeForgotModal = () => {
    setForgotVisible(false);
    setForgotEmail("");
    setForgotMsg("");
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.navigate("Home")}
          >
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.centerWrapper}>
            <View style={styles.header}>
              <Text style={styles.greeting}>Hola, Bienvenido a</Text>
              <View style={styles.logoWrap}>
                <View style={styles.logoPlaceholder}>
                  <Image
                    source={require("../../assets/Logo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={styles.title}>Inicia Sesión</Text>
            </View>

            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { translateX: shakeAnim },
                  ],
                },
              ]}
            >
              {!!error && (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#E74C3C"
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Correo</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      if (error) setError("");
                    }}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPass}
                    autoComplete="password"
                    textContentType="password"
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (error) setError("");
                    }}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPass(!showPass)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPass ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

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
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </Text>
              </TouchableOpacity>

              {/* ── Ahora sí conectado ── */}
              <TouchableOpacity
                style={styles.forgot}
                onPress={() => setForgotVisible(true)}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal: recuperar contraseña ── */}
      <Modal
        visible={forgotVisible}
        transparent
        animationType="fade"
        onRequestClose={closeForgotModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recuperar contraseña</Text>
              <TouchableOpacity onPress={closeForgotModal}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Escribe tu correo y te enviaremos un enlace para crear una nueva
              contraseña.
            </Text>

            <View style={styles.fieldGroup}>
              <TextInput
                style={[styles.inputRow, styles.modalInput]}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={forgotEmail}
                onChangeText={setForgotEmail}
              />
            </View>

            {!!forgotMsg && <Text style={styles.modalMsg}>{forgotMsg}</Text>}

            <TouchableOpacity
              style={[styles.btn, forgotLoading && styles.btnLoading]}
              onPress={handleForgotPassword}
              disabled={forgotLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>
                {forgotLoading ? "Enviando..." : "Enviar enlace"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginScreen;
