import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "../../styles/common/LoadingStyles";
import { useTheme } from "../../context/ThemeContext";

const ROLE_CONFIG = {
  BARBERO: {
    label: "Cargando panel de barbero",
    dest: "BarberHomeScreen",
    icon: "cut-outline",
  },
  DUENO: {
    label: "Cargando panel de negocio",
    dest: "OwnerHomeScreen",
    icon: "storefront-outline",
  },
  SUPER_ADMIN: {
    label: "Cargando panel de admin",
    dest: "SuperAdminHomeScreen",
    icon: "settings-outline",
  },
  CLIENTE: {
    label: "Preparando tu experiencia",
    dest: null,
    icon: "person-outline",
  },
};

const LoadingScreen = ({ navigation, route }) => {
  const { user } = route?.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  const { theme } = useTheme();

  const styles = createStyles(theme);

  useEffect(() => {
    if (!user) {
      navigation.replace("Home");
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1400,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

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
    }, 1600);

    return () => clearTimeout(timer);
  }, [user]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rol = user?.rol || user?.role || "";
  const cfg = ROLE_CONFIG[rol] || {
    label: "Configurando tu espacio",
    icon: "cut-outline",
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
          <Animated.Image
            source={require("../../assets/Logo.png")}
            style={[styles.logoSpinImage, { transform: [{ rotate: spin }] }]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Bienvenido/a{"\n"}
          <Text style={styles.titleAccent}>
            {user?.name || user?.nombreCompleto || ""}
          </Text>
        </Text>

        <Text style={styles.subtitle}>{cfg.label}...</Text>

        <View style={styles.progressBg}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
