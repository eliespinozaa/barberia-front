import { StyleSheet, Platform } from "react-native";

const createStyles = (width, theme) => {
  const isSmall = width < 375;
  const isMedium = width >= 375 && width < 768;
  const isLarge = width >= 768;
  const isWeb = Platform.OS === "web";

  const BG = theme.colors.background;
  const NAVBAR = theme.colors.navBackground;
  const CARD = theme.mode === "dark" ? "#FFFFFF" : theme.colors.cardBackground;
  const GOLD = theme.colors.secondary;
  const WHITE = theme.colors.text;
  const MUTED = theme.colors.textMuted;
  const BORDER = theme.colors.border;

  const CARD_TEXT = theme.mode === "dark" ? "#1A1A1A" : "#1A1A1A";
  const CARD_TEXT_MUTED = theme.mode === "dark" ? "#666666" : "#666666";

  const PAD = isSmall ? 14 : isLarge ? 32 : 20;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
    },

    // ── Navbar ──────────────────────────────────────────────
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: NAVBAR,
      paddingHorizontal: PAD,
      paddingVertical: isSmall ? 10 : 14,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      zIndex: 100,
    },
    navLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    navLogoWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#1A1A1A",
      borderWidth: 1,
      borderColor: "rgba(201,168,76,0.3)",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },

    navLogoImg: {
      width: "100%",
      height: "100%",
      borderRadius: 20,
    },
    navBarberia: {
      color: "#FFFFFF",
      fontSize: isSmall ? 14 : 16,
      fontWeight: "700",
    },
    navLinks: {
      flexDirection: "row",
      gap: 28,
    },
    navLink: {
      color: "rgba(255,255,255,0.6)",
      fontSize: 14,
      fontWeight: "500",
    },
    navLinkActive: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },
    navRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    navIcon: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },

    dropdown: {
      position: "absolute",
      top: isSmall ? 58 : 66,
      right: PAD,
      backgroundColor: theme.colors.cardBackground, // ← era '#2A2A2A'
      borderRadius: 12,
      paddingVertical: 8,
      minWidth: 180,
      zIndex: 999,
      borderWidth: 1,
      borderColor: BORDER,
      ...(isWeb && { boxShadow: "0px 8px 24px rgba(0,0,0,0.5)" }),
    },
    dropdownBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 998,
    },
    dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
    },
    dropdownText: {
      color: WHITE,
      fontSize: 14,
    },

    // ── Saludo ───────────────────────────────────────────────
    greeting: {
      paddingHorizontal: PAD,
      paddingVertical: isSmall ? 14 : 20,
    },
    greetingText: {
      color: WHITE,
      fontSize: isSmall ? 15 : isLarge ? 20 : 17,
      fontWeight: "700",
    },

    // ── Hero row ─────────────────────────────────────────────
    heroRow: {
      flexDirection: isLarge ? "row" : "column",
      paddingHorizontal: PAD,
      gap: 14,
      marginBottom: 24,
    },
    heroVideo: {
      flex: isLarge ? 1 : undefined,
      height: isSmall ? 180 : isLarge ? 240 : 200,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: GOLD,
    },
    videoPlaceholder: {
      flex: 1,
      backgroundColor: "#000",
    },
    heroMap: {
      flex: isLarge ? 1 : undefined,
      height: isSmall ? 180 : isLarge ? 240 : 200,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: BORDER,
    },
    mapPlaceholder: {
      flex: 1,
      backgroundColor: "#E8E8E8",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding: 12,
    },
    mapControls: {
      position: "absolute",
      right: 12,
      bottom: 12,
      gap: 4,
    },
    mapControlBtn: {
      backgroundColor: WHITE,
      width: 28,
      height: 28,
      textAlign: "center",
      lineHeight: 28,
      borderRadius: 4,
      fontSize: 16,
      color: "#333",
      marginBottom: 4,
      ...(isWeb && { userSelect: "none" }),
    },

    // ── Promociones ──────────────────────────────────────────
    promoSection: {
      paddingHorizontal: PAD,
      marginBottom: isSmall ? 80 : 32,
    },
    promoTitle: {
      color: WHITE,
      fontSize: isSmall ? 16 : 18,
      fontWeight: "700",
      marginBottom: 14,
    },
    promoGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    promoCard: {
      backgroundColor: CARD,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: BORDER,
      width: isSmall
        ? "100%"
        : isLarge
          ? (width - PAD * 2 - 24) / 3
          : (width - PAD * 2 - 12) / 2,
    },
    promoCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    promoCardTitulo: {
      color: CARD_TEXT,
      fontSize: isSmall ? 13 : 14,
      fontWeight: "700",
      flex: 1,
      marginRight: 8,
    },

    promoCardDesc: {
      color: CARD_TEXT_MUTED, // ← dinámico
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 8,
    },
    promoCardBadge: {
      color: GOLD,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 6,
    },
    promoCardValidez: {
      color: CARD_TEXT_MUTED, // ← dinámico
      fontSize: 11,
      marginTop: 4,
    },

    bottomNav: {
      flexDirection: "row",
      backgroundColor: NAVBAR,
      borderTopWidth: 1,
      borderTopColor: BORDER,
      paddingVertical: isSmall ? 8 : 10,
    },
    bottomNavItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
    },
    bottomNavText: {
      color: MUTED,
      fontSize: 10,
      fontWeight: "500",
    },

    proximaCitaCard: {
      backgroundColor: "#1A2230",
      borderRadius: 18,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      gap: 4,
    },
    proximaCitaHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    proximaCitaLabel: {
      color: "#C9A84C",
      fontSize: 13,
      fontWeight: "700",
    },
    proximaCitaFecha: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    proximaCitaEstado: {
      color: "rgba(255,255,255,0.5)",
      fontSize: 12,
    },

    addressCard: {
      flex: 1,
      backgroundColor: "#1A2230",
      borderRadius: 16,
      padding: 16,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    addressText: {
      color: "#FFFFFF",
      fontSize: 12,
      textAlign: "center",
    },
    addressBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#C9A84C",
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 14,
      marginTop: 4,
    },
    addressBtnText: {
      color: "#0B1014",
      fontSize: 11,
      fontWeight: "700",
    },

    promoIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(201,168,76,0.15)",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },

    promoIconImg: {
      width: "100%",
      height: "100%",
    },
  });
};

export default createStyles;
