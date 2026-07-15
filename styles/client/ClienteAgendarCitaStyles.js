import { StyleSheet, Platform } from "react-native";

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb = Platform.OS === "web";
  const isDark = theme.mode === "dark";

  const NAVBAR = theme.colors.navBackground;
  const BG = theme.colors.background;
  const GOLD = theme.colors.secondary;
  const WHITE = theme.colors.text;
  const MUTED = theme.colors.textMuted;
  const BORDER = theme.colors.border;
  const CONTENT_MAX_W = isSmall ? "100%" : 1000;

  const STEP_INACTIVE_BG = isDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(0,0,0,0.10)";
  const STEP_LINE = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const GRIS_SOBRE_BLANCO = "rgba(11,17,32,.70)";

  const CARD_BG = "#FFFFFF";
  const CARD_TEXT = "#1A1A1A";
  const CARD_IMG_BG = "#D9D9D9";
  const CARD_BTN_BG = isDark ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.06)";
  const CARD_BTN_BG_SEL = "#1A1A1A";
  const CARD_BTN_TEXT_SEL = "#FFFFFF";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
    },

    /* ── Navbar ── */
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: NAVBAR,
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical: isSmall ? 10 : 14,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
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
    },
    navBarberia: {
      color: "#FFFFFF",
      fontSize: isSmall ? 15 : 17,
      fontWeight: "700",
    },
    navAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "rgba(255,255,255,0.12)",
      justifyContent: "center",
      alignItems: "center",
    },

    /* ── Dropdown del avatar (igual al de ClientHomeScreen) ── */
    dropdown: {
      position: "absolute",
      top: isSmall ? 58 : 66,
      right: isSmall ? 16 : 28,
      backgroundColor: theme.colors.cardBackground,
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

    /* ── Barra de título + back ── */
    titleBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical: isSmall ? 14 : 20,
      position: "relative",
    },
    backBtn: {
      position: "absolute",
      left: isSmall ? 16 : 28,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
      justifyContent: "center",
      alignItems: "center",
    },
    titlePill: {
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      paddingHorizontal: 26,
      paddingVertical: 10,
    },
    titlePillText: {
      color: "#1A1A1A",
      fontSize: isSmall ? 15 : 17,
      fontWeight: "800",
    },

    /* ── Body ── */
    body: { flex: 1 },
    bodyInner: {
      padding: isSmall ? 16 : 28,
      paddingTop: isSmall ? 4 : 8,
      paddingBottom: 100,
      alignItems: "center",
    },
    contentWrap: {
      width: "100%",
      maxWidth: CONTENT_MAX_W,
    },

    /* ── Stepper ── */
    stepperRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
      marginBottom: 28,
    },
    stepItem: {
      alignItems: "center",
      width: isSmall ? 56 : 90,
    },
    stepCircle: {
      width: isSmall ? 30 : 36,
      height: isSmall ? 30 : 36,
      borderRadius: isSmall ? 15 : 18,
      backgroundColor: STEP_INACTIVE_BG,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    stepCircleActive: {
      backgroundColor: "#FFFFFF",
    },
    stepCircleDone: {
      backgroundColor: STEP_INACTIVE_BG,
    },
    stepCircleText: {
      color: WHITE,
      fontSize: isSmall ? 13 : 15,
      fontWeight: "800",
    },
    stepCircleTextActive: {
      color: "#1A1A1A",
    },
    stepCircleTextDone: {
      color: WHITE,
    },
    stepLabel: {
      color: MUTED,
      fontSize: isSmall ? 11 : 13,
      fontWeight: "700",
      textAlign: "center",
    },
    stepLabelActive: {
      color: WHITE,
    },
    stepLine: {
      height: 2,
      backgroundColor: STEP_LINE,
      flex: 1,
      marginTop: isSmall ? 15 : 18,
      marginHorizontal: -4,
    },
    stepLineDone: {
      backgroundColor: STEP_LINE,
    },

    /* ── Categorías ── */
    categoriaSection: {
      marginBottom: 26,
    },
    categoriaTitulo: {
      color: WHITE,
      fontSize: isSmall ? 14 : 16,
      fontWeight: "800",
      letterSpacing: 0.5,
      marginBottom: 14,
    },

    /* ── Carrusel de servicios ── */
    carouselWrapper: {
      position: "relative",
    },
    cardsRow: {
      gap: 14,
      paddingRight: 8,
      paddingVertical: 4,
    },
    carouselArrow: {
      position: "absolute",
      top: "50%",
      marginTop: -18,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 5,
      ...(isWeb
        ? { boxShadow: "0px 2px 8px rgba(0,0,0,0.25)", cursor: "pointer" }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 5,
            elevation: 4,
          }),
    },
    carouselArrowLeft: {
      left: -6,
    },
    carouselArrowRight: {
      right: -6,
    },

    /* ── Card de servicio ── */
    servicioCard: {
      backgroundColor: CARD_BG,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 16,
      alignItems: "center",
      width: isSmall ? 148 : 170,
      position: "relative",
      ...(isWeb && { boxShadow: "0px 4px 14px rgba(0,0,0,0.18)" }),
    },
    servicioCardSeleccionado: {
      borderWidth: 2,
      borderColor: "#1A1A1A",
    },
    servicioCheckBadge: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#1A1A1A",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    servicioImgWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: CARD_IMG_BG,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      marginBottom: 12,
    },
    servicioImg: {
      width: 56,
      height: 56,
    },
    servicioNombre: {
      color: CARD_TEXT,
      fontSize: 14,
      fontWeight: "800",
      marginBottom: 4,
      textAlign: "center",
    },
    servicioPrecio: {
      color: CARD_TEXT,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 12,
    },
    servicioBtn: {
      backgroundColor: CARD_BTN_BG,
      borderRadius: 16,
      paddingVertical: 7,
      paddingHorizontal: 16,
    },
    servicioBtnSeleccionado: {
      backgroundColor: CARD_BTN_BG_SEL,
    },
    servicioBtnText: {
      color: CARD_TEXT,
      fontSize: 12,
      fontWeight: "700",
    },
    servicioBtnTextSeleccionado: {
      color: CARD_BTN_TEXT_SEL,
    },

    /* ── Estado vacío / placeholder de otros pasos ── */
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyText: {
      color: MUTED,
      fontSize: 14,
      fontWeight: "600",
      marginTop: 10,
      textAlign: "center",
    },

    /* ── Botón flotante siguiente/atrás ── */
    fabNext: {
      position: "absolute",
      right: isSmall ? 16 : 28,
      bottom: isSmall ? 16 : 28,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isDark ? "#1A2230" : "#1A1A1A",
      justifyContent: "center",
      alignItems: "center",
      ...(isWeb
        ? { boxShadow: "0px 6px 18px rgba(0,0,0,0.4)", cursor: "pointer" }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 6,
          }),
    },
    fabBack: {
      position: "absolute",
      left: isSmall ? 16 : 28,
      bottom: isSmall ? 16 : 28,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
      justifyContent: "center",
      alignItems: "center",
    },

    /* ── Barberos ── */
    barberosRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 14,
    },
    barberoCard: {
      backgroundColor: CARD_BG,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 16,
      alignItems: "center",
      width: isSmall ? 148 : 170,
      position: "relative",
      ...(isWeb && { boxShadow: "0px 4px 14px rgba(0,0,0,0.18)" }),
    },
    barberoCardSeleccionado: {
      borderWidth: 2,
      borderColor: "#1A1A1A",
    },
    barberoCheckBadge: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#1A1A1A",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    barberoAvatarWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: CARD_IMG_BG,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      marginBottom: 12,
    },
    barberoAvatarImg: {
      width: 56,
      height: 56,
    },
    barberoNombre: {
      color: CARD_TEXT,
      fontSize: 14,
      fontWeight: "800",
      marginBottom: 12,
      textAlign: "center",
    },
    barberoBtn: {
      backgroundColor: CARD_BTN_BG,
      borderRadius: 16,
      paddingVertical: 7,
      paddingHorizontal: 16,
    },
    barberoBtnSeleccionado: {
      backgroundColor: CARD_BTN_BG_SEL,
    },
    barberoBtnText: {
      color: CARD_TEXT,
      fontSize: 12,
      fontWeight: "700",
    },
    barberoBtnTextSeleccionado: {
      color: CARD_BTN_TEXT_SEL,
    },

    /* ── Calendario ── */
    calendarioCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 0,
      padding: 18,
      alignSelf: "center",
      width: isSmall ? "100%" : 380,
      ...(isWeb && { boxShadow: "0px 4px 14px rgba(0,0,0,0.18)" }),
    },
    calendarioHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    calendarioMesTexto: {
      color: CARD_TEXT,
      fontSize: 16,
      fontWeight: "800",
    },
    calendarioNavBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    calendarioSemanaRow: {
      flexDirection: "row",
      marginBottom: 6,
    },
    calendarioSemanaCell: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 6,
    },
    calendarioSemanaTexto: {
      color: "#9CA3AF",
      fontSize: 13,
      fontWeight: "700",
    },
    calendarioSemanas: {
      // contenedor de filas de días
    },
    calendarioDiaRow: {
      flexDirection: "row",
    },
    calendarioDiaCell: {
      flex: 1,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    calendarioDiaCirculo: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: "center",
      alignItems: "center",
    },
    calendarioDiaCirculoSeleccionado: {
      backgroundColor: GRIS_SOBRE_BLANCO,
    },
    calendarioDiaTexto: {
      color: CARD_TEXT,
      fontSize: 14,
      fontWeight: "600",
    },
    calendarioDiaTextoDeshabilitado: {
      color: "#D1D5DB",
    },

    /* ── Horarios ── */
    horariosGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      width: isSmall ? "100%" : 380,
      alignSelf: "center",
    },
    horaSlot: {
      width: isSmall ? "21.5%" : 86,
      height: isSmall ? "21.5%" : 30,
      paddingVertical: 0,
      borderRadius: 0,
      backgroundColor: isDark ? "#FFFFFF" : "rgba(0,0,0,0.05)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.15)",
      alignItems: "center",
    },
    horaSlotSeleccionada: {
      backgroundColor: isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.20)",
      borderColor: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)",
    },
    horaSlotOcupada: {
      opacity: 0.3,
    },
    horaSlotTexto: {
      color: isDark ? "rgba(0, 0, 0, .90)" : "rgba(0,0,0,0.15)",
      fontSize: 20,
      fontWeight: "700",
    },
    horaSlotTextoSeleccionada: {
      color: isDark ? "rgba(0, 0, 0, .90)" : "rgba(0,0,0,0.15)",
    },

    confirmarCard: {
      backgroundColor: isDark ? "#D9D9D9" : "#D9D9D9",
      borderRadius: 20,
      padding: 22,
      alignSelf: "center",
      width: isSmall ? "100%" : 420,
      ...(isWeb && {
        boxShadow: isDark
          ? "0px 4px 14px rgba(0,0,0,0.5)"
          : "0px 4px 14px rgba(0,0,0,0.18)",
      }),
    },
    confirmarTitulo: {
      color: isDark ? "#1A1A1A" : "#1A1A1A",
      fontSize: 18,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 18,
    },
    confirmarFila: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
    },
    confirmarLabel: {
      color: isDark ? "#1A1A1A" : "#1A1A1A",
      fontSize: 15,
      fontWeight: "800",
    },
    confirmarValor: {
      color: isDark ? "#1A1A1A" : "#1A1A1A",
      fontSize: 13,
      fontWeight: "600",
    },
    confirmarValorMuted: {
      color: isDark ? "#1A1A1A" : "#6B7280",
      fontSize: 13,
      fontWeight: "600",
    },
    confirmarValorFuerte: {
      color: isDark ? "#1A1A1A" : "#1A1A1A",
      fontSize: 14,
      fontWeight: "800",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    modalCard: {
      backgroundColor: isDark ? "#1A2230" : "#DEDEDE",
      borderRadius: 20,
      padding: 26,
      width: isSmall ? "100%" : 420,
      alignItems: "center",
    },
    modalTitulo: {
      color: isDark ? "#FFFFFF" : "#1A1A1A",
      fontSize: 19,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 14,
    },
    modalTexto: {
      color: isDark ? "rgba(255,255,255,0.75)" : "#3F3F3F",
      fontSize: 13,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 19,
    },
    modalTextoFuerte: {
      color: isDark ? "#FFFFFF" : "#1A1A1A",
      fontWeight: "800",
    },
    modalDireccionWrap: {
      marginTop: 14,
    },
    modalNota: {
      color: isDark ? "rgba(255,255,255,0.75)" : "#3F3F3F",
      fontSize: 13,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 19,
      marginTop: 16,
    },
    modalNotaFuerte: {
      color: isDark ? "#FFFFFF" : "#1A1A1A",
      fontWeight: "800",
    },
    modalBtn: {
      backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#FFFFFF",
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 40,
      marginTop: 22,
    },
    modalBtnTexto: {
      color: isDark ? "#FFFFFF" : "#1A1A1A",
      fontSize: 15,
      fontWeight: "800",
    },
  });
};

export default createStyles;
