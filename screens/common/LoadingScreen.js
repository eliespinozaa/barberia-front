import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import createStyles from "../../styles/common/LoadingStyles";
import { useTheme } from "../../context/ThemeContext";

const ROLE_CONFIG = {
  BARBERO: {
    label: "Cargando panel de barbero",
    dest: "BarberHomeScreen",
  },
  DUENO: {
    label: "Cargando panel de negocio",
    dest: "OwnerHomeScreen",
  },
  SUPER_ADMIN: {
    label: "Cargando panel de admin",
    dest: "SuperAdminHomeScreen",
  },
  CLIENTE: {
    label: "Preparando tu experiencia",
    dest: null,
  },
};

const LoadingScreen = ({ navigation, route }) => {
  const { user } = route?.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (!user) {
      navigation.replace("Home");
      return;
    }

    // ── Entrada del logo ──
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // ── Subtítulo entra un poco después ──
    Animated.timing(subtitleFade, {
      toValue: 1,
      duration: 500,
      delay: 350,
      useNativeDriver: true,
    }).start();

    // ── Respiración del logo (breathing) ──
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ── Anillo girando alrededor del logo ──
    Animated.loop(
      Animated.timing(ringSpin, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // ── Puntitos rebotando en secuencia ──
    const bounceDot = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 350,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 350,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );

    bounceDot(dot1, 0).start();
    bounceDot(dot2, 150).start();
    bounceDot(dot3, 300).start();

    const timer = setTimeout(() => {
      const rol = user.rol || user.role;

      if (rol === "CLIENTE") {
        const dest = user.clienteAsociado
          ? "ClientHomeScreen"
          : "CatalogosScreen";

        navigation.replace(dest, { user });
        return;
      }

      const cfg = ROLE_CONFIG[rol];
      if (!cfg) {
        navigation.replace("Login");
        return;
      }

      navigation.replace(cfg.dest, { user });
    }, 1700);

    return () => clearTimeout(timer);
  }, [user]);

  const ringRotation = ringSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const breathScale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const dotStyle = (anim) => ({
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  });

  const rol = user?.rol || user?.role || "";
  const cfg = ROLE_CONFIG[rol] || {
    label: "Configurando tu espacio",
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.iconWrap}>
          {/* ── Anillo giratorio decorativo ── */}
          <Animated.View
            style={[
              styles.spinnerRing,
              { transform: [{ rotate: ringRotation }] },
            ]}
          />

          {/* ── Logo con respiración suave ── */}
          <Animated.Image
            source={require("../../assets/Logo.png")}
            style={[
              styles.logoImage,
              { transform: [{ scale: breathScale }] },
            ]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Bienvenido/a{"\n"}
          <Text style={styles.titleAccent}>
            {user?.name || user?.nombreCompleto || ""}
          </Text>
        </Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
          {cfg.label}
        </Animated.Text>

        {/* ── Puntitos rebotando ── */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, dotStyle(dot1)]} />
          <Animated.View style={[styles.dot, dotStyle(dot2)]} />
          <Animated.View style={[styles.dot, dotStyle(dot3)]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoadingScreen;