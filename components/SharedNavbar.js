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

  const styles = buildStyles({
    isSmallScreen,
    isLargeScreen,
    isDesktop,
    NAV_BG,
    GOLD,
    WHITE,
    BORDER,
    SURFACE,
    TEXT_SECONDARY,
    NAV_TEXT,
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
    <View style={styles.navbar}>
      {/* ── Logo / Brand ─────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.brand} onPress={() => handleNav("Home")}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require("../assets/Logo.png")}
            style={styles.navLogoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandName}>BARBER SYSTEM</Text>
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
        {/* Toggle tema oscuro/claro */}
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDarkMode ? "sunny-outline" : "moon-outline"}
            size={20}
            color={GOLD}
          />
        </TouchableOpacity>

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
            style={styles.iconButton}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons
              name={menuOpen ? "close" : "menu"}
              size={26}
              color={GOLD}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Menú móvil / tablet ──────────────────────────────────────── */}
      {menuOpen && !isDesktop && (
        <View style={styles.mobileMenu}>
          {links.map((l) => (
            <TouchableOpacity
              key={l.screen}
              style={styles.mobileMenuItem}
              onPress={() => handleNav(l.screen)}
            >
              <Text
                style={[
                  styles.mobileMenuText,
                  currentScreen === l.screen && styles.navLinkActive,
                ]}
              >
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.mobileMenuDivider} />

          <TouchableOpacity
            style={styles.mobileMenuItem}
            onPress={() => handleNav("Login")}
          >
            <Text style={styles.mobileMenuTextGold}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mobileMenuItem, styles.mobileMenuSolid]}
            onPress={() => handleNav("Register")}
          >
            <Text style={styles.btnSolidText}>Registrarse</Text>
          </TouchableOpacity>
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
  NAV_BG,
  GOLD,
  WHITE,
  BORDER,
  TEXT_SECONDARY,
  NAV_TEXT,
}) =>
  StyleSheet.create({
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: NAV_BG,
      paddingHorizontal: isSmallScreen ? 16 : isLargeScreen ? 40 : 24,
      paddingVertical: isSmallScreen ? 12 : 16,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      zIndex: 100,
      flexWrap: "wrap",
    },

    // ── Brand ──────────────────────────────────────────────────────────────
    brand: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoPlaceholder: {
      width: isSmallScreen ? 32 : 36,
      height: isSmallScreen ? 32 : 36,
      borderRadius: isSmallScreen ? 16 : 18,
      backgroundColor: "rgba(201,168,76,0.12)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: GOLD,
      marginRight: 10,
      overflow: "hidden",
    },
    navLogoImage: {
      width: "100%",
      height: "100%",
    },
    brandName: {
      color: NAV_TEXT,
      fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 15,
      fontWeight: "800",
      letterSpacing: 1.5,
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
    },
    iconButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: "rgba(201,168,76,0.1)",
      marginLeft: 8,
      borderWidth: 1,
      borderColor: "rgba(201,168,76,0.2)",
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
    },

    // ── Menú móvil ─────────────────────────────────────────────────────────
    mobileMenu: {
      width: "100%",
      backgroundColor: NAV_BG,
      borderTopWidth: 1,
      borderTopColor: BORDER,
      paddingVertical: 8,
      marginTop: 8,
    },
    mobileMenuItem: {
      paddingHorizontal: isSmallScreen ? 16 : 20,
      paddingVertical: isSmallScreen ? 12 : 14,
    },
    mobileMenuText: {
      color: WHITE,
      fontSize: isSmallScreen ? 14 : 15,
      fontWeight: "500",
    },
    mobileMenuTextGold: {
      color: GOLD,
      fontSize: isSmallScreen ? 14 : 15,
      fontWeight: "600",
    },
    mobileMenuDivider: {
      height: 1,
      backgroundColor: BORDER,
      marginHorizontal: isSmallScreen ? 16 : 20,
      marginVertical: 8,
    },
    mobileMenuSolid: {
      marginHorizontal: isSmallScreen ? 16 : 20,
      marginTop: 4,
      marginBottom: 8,
      backgroundColor: GOLD,
      borderRadius: 8,
      alignItems: "center",
    },
  });

export default SharedNavbar;
