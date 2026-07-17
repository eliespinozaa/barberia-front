import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

// ─── Sub-componente NavLink ───────────────────────────────────────────────────
const NavLink = ({ label, active, onPress, styles }) => (
  <TouchableOpacity onPress={onPress} style={styles.navLink}>
    <Text style={[styles.navLinkText, active && styles.navLinkActive]}>
      {label}
    </Text>
    {active && <View style={styles.navLinkUnderline} />}
  </TouchableOpacity>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const SharedNavbar = ({ navigation, currentScreen }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { width } = useWindowDimensions(); // 🔑 se actualiza en resize
  const [menuOpen, setMenuOpen] = useState(false);

  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;
  const isWeb = Platform.OS === "web";
  const isDesktop = isWeb && isLargeScreen;

  // Colores del tema activo
  const NAV_BG = theme.colors.navBackground;
  const GOLD = theme.colors.secondary;
  const WHITE = theme.colors.text;
  const BORDER = theme.colors.border;
  const SURFACE = theme.colors.surface;
  const TEXT_SECONDARY = theme.colors.textSecondary;
  const NAV_TEXT = theme.colors.navText;
  const CARD_BG = theme.colors.cardBackground;

  const styles = buildStyles({
    isSmallScreen,
    isLargeScreen,
    isDesktop,
    isWeb,
    NAV_BG,
    GOLD,
    WHITE,
    BORDER,
    SURFACE,
    TEXT_SECONDARY,
    NAV_TEXT,
    CARD_BG,
  });

  const links = [];

  const handleNav = (screen) => {
    setMenuOpen(false);
    if (screen === currentScreen) return;
    try {
      navigation.navigate(screen);
    } catch (_) {}
  };

  return (
    <View>
      <View style={styles.navbar}>
        {/* ── Logo / Brand ─────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.brand}
          onPress={() => handleNav("Home")}
        >
          <View style={styles.logoPlaceholder}>
            <Image
              source={require("../assets/Logo.png")}
              style={styles.navLogoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandName} numberOfLines={1} ellipsizeMode="tail">
            BARBER SYSTEM
          </Text>
        </TouchableOpacity>

        {/* ── Links desktop ────────────────────────────────────────────── */}
        {isDesktop && (
          <View style={styles.navLinks}>
            {links.map((l) => (
              <NavLink
                key={l.screen}
                label={l.label}
                active={currentScreen === l.screen}
                onPress={() => handleNav(l.screen)}
                styles={styles}
              />
            ))}
          </View>
        )}

        {/* ── Acciones ─────────────────────────────────────────────────── */}
        <View style={styles.navActions}>
          {/* Toggle tema oscuro/claro: SOLO visible en desktop */}
          {isDesktop && (
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <Ionicons
                name={isDarkMode ? "sunny-outline" : "moon-outline"}
                size={20}
                color={GOLD}
              />
            </TouchableOpacity>
          )}

          {isDesktop ? (
            <>
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => handleNav("Login")}
              >
                <Text style={styles.btnOutlineText}>Iniciar sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSolid}
                onPress={() => handleNav("Register")}
              >
                <Text style={styles.btnSolidText}>Registrarse</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.iconButton, menuOpen && styles.iconButtonActive]}
              onPress={() => setMenuOpen(!menuOpen)}
            >
              <Ionicons
                name={menuOpen ? "close" : "menu"}
                size={24}
                color={menuOpen ? "#1A1A1A" : GOLD}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Menú móvil / tablet: empuja el contenido, con más estilo ──── */}
      {menuOpen && !isDesktop && (
        <View style={styles.mobileMenu}>
          {/* Links de navegación, si los hay */}
          {links.map((l) => {
            const active = currentScreen === l.screen;
            return (
              <TouchableOpacity
                key={l.screen}
                style={[styles.mobileRow, active && styles.mobileRowActive]}
                onPress={() => handleNav(l.screen)}
              >
                <View
                  style={[
                    styles.mobileRowIcon,
                    active && styles.mobileRowIconActive,
                  ]}
                >
                  <Ionicons
                    name={l.icon || "chevron-forward-outline"}
                    size={17}
                    color={active ? "#1A1A1A" : GOLD}
                  />
                </View>
                <Text
                  style={[
                    styles.mobileRowText,
                    active && styles.mobileRowTextActive,
                  ]}
                >
                  {l.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={active ? "#1A1A1A" : "rgba(255,255,255,0.25)"}
                />
              </TouchableOpacity>
            );
          })}

          {/* Toggle de tema, misma fila con ícono */}
          <TouchableOpacity style={styles.mobileRow} onPress={toggleTheme}>
            <View style={styles.mobileRowIcon}>
              <Ionicons
                name={isDarkMode ? "sunny-outline" : "moon-outline"}
                size={17}
                color={GOLD}
              />
            </View>
            <Text style={styles.mobileRowText}>
              {isDarkMode ? "Modo claro" : "Modo oscuro"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgba(255,255,255,0.25)"
            />
          </TouchableOpacity>

          {/* ── CTAs ── */}
          <View style={styles.mobileCtas}>
            <TouchableOpacity
              style={styles.mobileBtnOutline}
              onPress={() => handleNav("Login")}
            >
              <Ionicons name="log-in-outline" size={17} color={GOLD} />
              <Text style={styles.mobileBtnOutlineText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mobileBtnSolid}
              onPress={() => handleNav("Register")}
            >
              <Ionicons name="person-add-outline" size={17} color="#1A1A1A" />
              <Text style={styles.btnSolidText}>Crear cuenta gratis</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── Función de estilos (recalcula en cada render si cambian deps) ────────────
const buildStyles = ({
  isSmallScreen,
  isLargeScreen,
  isDesktop,
  isWeb,
  NAV_BG,
  GOLD,
  WHITE,
  BORDER,
  TEXT_SECONDARY,
  NAV_TEXT,
  CARD_BG,
}) =>
  StyleSheet.create({
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: NAV_BG,
      paddingHorizontal: isSmallScreen ? 14 : isLargeScreen ? 40 : 24,
      paddingVertical: isSmallScreen ? 10 : 16,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      zIndex: 100,
    },

    // ── Brand ──────────────────────────────────────────────────────────────
    brand: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
    },
    logoPlaceholder: {
      width: isSmallScreen ? 28 : 36,
      height: isSmallScreen ? 28 : 36,
      borderRadius: isSmallScreen ? 14 : 18,
      backgroundColor: "rgba(201,168,76,0.12)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: GOLD,
      marginRight: isSmallScreen ? 8 : 10,
      overflow: "hidden",
      flexShrink: 0,
    },
    navLogoImage: {
      width: "100%",
      height: "100%",
    },
    brandName: {
      color: NAV_TEXT,
      fontSize: isSmallScreen ? 13 : isLargeScreen ? 18 : 15,
      fontWeight: "800",
      letterSpacing: isSmallScreen ? 0.8 : 1.5,
      flexShrink: 1,
    },

    // ── Links desktop ──────────────────────────────────────────────────────
    navLinks: {
      flexDirection: "row",
      alignItems: "center",
    },
    navLink: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      position: "relative",
    },
    navLinkText: {
      color: TEXT_SECONDARY,
      fontSize: isLargeScreen ? 14 : 13,
      fontWeight: "500",
    },
    navLinkActive: {
      color: GOLD,
      fontWeight: "700",
    },
    navLinkUnderline: {
      position: "absolute",
      bottom: 0,
      left: 14,
      right: 14,
      height: 2,
      backgroundColor: GOLD,
      borderRadius: 1,
    },

    // ── Acciones ───────────────────────────────────────────────────────────
    navActions: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    iconButton: {
      padding: isSmallScreen ? 6 : 8,
      borderRadius: 8,
      backgroundColor: "rgba(201,168,76,0.1)",
      marginLeft: isSmallScreen ? 4 : 8,
      borderWidth: 1,
      borderColor: "rgba(201,168,76,0.2)",
    },
    iconButtonActive: {
      backgroundColor: GOLD,
      borderColor: GOLD,
    },
    btnOutline: {
      paddingHorizontal: isLargeScreen ? 16 : 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: GOLD,
      marginLeft: 10,
    },
    btnOutlineText: {
      color: GOLD,
      fontSize: isLargeScreen ? 13 : 12,
      fontWeight: "600",
    },
    btnSolid: {
      paddingHorizontal: isLargeScreen ? 16 : 12,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: GOLD,
      marginLeft: 10,
    },
    btnSolidText: {
      color: "#1A1A1A",
      fontSize: isLargeScreen ? 13 : 12,
      fontWeight: "700",
      marginLeft: 6,
    },

    // ── Menú móvil: empuja el contenido, estilo "app moderna" ──────────────
    mobileMenu: {
      width: "100%",
      backgroundColor: NAV_BG,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      paddingHorizontal: isSmallScreen ? 14 : 24,
      paddingTop: 12,
      paddingBottom: 18,
      gap: 6,
      ...(isWeb && { boxShadow: "0px 6px 16px rgba(0,0,0,0.15)" }),
    },

    // Cada fila del menú: ícono en circulito + texto + chevron
    mobileRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 11,
      paddingHorizontal: 10,
      borderRadius: 12,
      gap: 12,
    },
    mobileRowActive: {
      backgroundColor: GOLD,
    },
    mobileRowIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "rgba(201,168,76,0.12)",
      justifyContent: "center",
      alignItems: "center",
    },
    mobileRowIconActive: {
      backgroundColor: "rgba(0,0,0,0.12)",
    },
    mobileRowText: {
      flex: 1,
      color: WHITE,
      fontSize: 14,
      fontWeight: "600",
    },
    mobileRowTextActive: {
      color: "#1A1A1A",
    },

    // Bloque de botones al final: outline + solid, uno debajo del otro,
    // grandes y con buen padding para que se sientan "importantes"
    mobileCtas: {
      marginTop: 10,
      gap: 10,
    },
    mobileBtnOutline: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1.5,
      borderColor: GOLD,
      borderRadius: 12,
      paddingVertical: 13,
    },
    mobileBtnOutlineText: {
      color: GOLD,
      fontSize: 14,
      fontWeight: "700",
    },
    mobileBtnSolid: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: GOLD,
      borderRadius: 12,
      paddingVertical: 13,
    },
  });

export default SharedNavbar;