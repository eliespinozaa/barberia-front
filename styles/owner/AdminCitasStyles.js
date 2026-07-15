import { StyleSheet, Platform } from "react-native";

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb = Platform.OS === "web";
  const isDark = theme.mode === "dark";

  const NAVBAR = "#0B1014";
  const CARD_BG = isDark ? "#151B22" : "#FFFFFF";
  const CARD_BG_ACTIVA = isDark ? "#1D242C" : "#F5F5F5";
  const WHITE = isDark ? "#FFFFFF" : "#1A1A1A";
  const MUTED = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const TAB_BG = isDark ? "#151B22" : "#EAEAEA";
  const TAB_ACTIVE_BG = isDark ? "#3A3F45" : "#1A1A1A";

  const GREEN_BG = "#A6E6A1";
  const GREEN_TXT = "#0B1014";
  const YELLOW_BG = "#EDE49B";
  const YELLOW_TXT = "#0B1014";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    /* ── Header ── */

    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#2A2A2A",
      justifyContent: "center",
      alignItems: "center",
    },

    /* ── Tabs ── */
    tabsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      paddingHorizontal: isSmall ? 16 : 28,
      marginBottom: 24,
      flexWrap: "wrap",
    },
    tab: {
      backgroundColor: TAB_BG,
      borderRadius: 24,
      paddingVertical: 10,
      paddingHorizontal: 22,
    },
    tabActive: {
      backgroundColor: TAB_ACTIVE_BG,
    },
    tabText: {
      color: MUTED,
      fontSize: 14,
      fontWeight: "700",
    },
    tabTextActive: {
      color: WHITE,
    },

    /* ── Body ── */
    body: {
      flex: 1,
    },
    bodyInner: {
      paddingHorizontal: isSmall ? 16 : 28,
      paddingBottom: 40,
    },

    sectionLabel: {
      color: MUTED,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      textAlign: "center",
      alignSelf: "flex-start",
      width: isSmall ? "47%" : 190,
      marginBottom: 14,
      marginTop: 8,
    },
    sectionLabelEnCurso: {
      color: MUTED,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      textAlign: "center",
      alignSelf: "flex-start",
      width: isSmall ? "100%" : 220,
      marginBottom: 14,
      marginTop: 8,
    },

    /* ── Card en curso (una sola, más ancha) ── */
    enCursoWrap: {
      marginBottom: 28,
      alignItems: isSmall ? "stretch" : "flex-start",
    },

    /* ── Grid de siguientes citas ── */
    citasGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: isSmall ? "space-between" : "flex-start",
    },

    /* ── Card individual ── */
    citaCard: {
      backgroundColor: CARD_BG,
      borderRadius: 22,
      paddingVertical: 20,
      paddingHorizontal: 18,
      alignItems: "center",
      gap: 6,
      width: isSmall ? "47%" : 190,
      ...(isWeb && {
        boxShadow: isDark ? "none" : "0px 2px 10px rgba(0,0,0,0.08)",
      }),
    },
    citaCardEnCurso: {
      backgroundColor: CARD_BG_ACTIVA,
    },

    citaCardFinalizada: {
      opacity: 0.55,
    },
    citaEstadoBadge: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: "600",
      color:
        theme.mode === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
      textAlign: "center",
    },

    citaHora: {
      color: WHITE,
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 4,
    },
    citaNombre: {
      color: WHITE,
      fontSize: 14,
      fontWeight: "600",
    },
    citaServicio: {
      color: MUTED,
      fontSize: 13,
    },
    citaPrecio: {
      color: WHITE,
      fontSize: 16,
      fontWeight: "700",
      marginTop: 4,
      marginBottom: 6,
    },

    /* ── Botones ── */
    btnFinalizar: {
      backgroundColor: GREEN_BG,
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 28,
      marginTop: 4,
    },
    btnFinalizarText: {
      color: GREEN_TXT,
      fontSize: 13,
      fontWeight: "700",
    },
    btnConfirmar: {
      backgroundColor: GREEN_BG,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 24,
      width: "100%",
      alignItems: "center",
      marginTop: 4,
    },
    btnConfirmarText: {
      color: GREEN_TXT,
      fontSize: 13,
      fontWeight: "700",
    },
    btnCancelar: {
      backgroundColor: YELLOW_BG,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 24,
      width: "100%",
      alignItems: "center",
      marginTop: 6,
    },
    btnCancelarText: {
      color: YELLOW_TXT,
      fontSize: 13,
      fontWeight: "700",
    },

    /* ── Estados ── */
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
      gap: 10,
    },
    emptyText: {
      color: MUTED,
      fontSize: 13,
    },
    errorText: {
      color: "#E85D5D",
      marginBottom: 12,
      textAlign: "center",
    },

    /* ── Calendario (portado de AgendarCita.js) ── */
    calendarBox: {
      backgroundColor: CARD_BG,
      borderRadius: 16,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: isDark ? "transparent" : "rgba(0,0,0,0.08)",
      padding: 16,
      marginBottom: 14,
      alignSelf: "center",
      width: isSmall ? "100%" : 420,
    },
    calendarHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    calendarMonthTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: WHITE,
    },
    calendarNav: {
      flexDirection: "row",
      gap: 4,
    },
    calendarNavBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    calendarNavIconColor: {
      color: WHITE,
    },
    calendarRow: {
      flexDirection: "row",
      marginBottom: 4,
    },
    calendarDayLabel: {
      flex: 1,
      textAlign: "center",
      fontSize: 11,
      fontWeight: "600",
      color: MUTED,
      paddingBottom: 6,
    },
    calendarCell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      margin: 1,
    },
    calendarCellToday: {
      backgroundColor: isDark ? "rgba(245,179,1,0.15)" : "rgba(245,179,1,0.12)",
    },
    calendarCellSelected: {
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
    },
    calendarCellText: {
      fontSize: 13,
      color: WHITE,
      fontWeight: "400",
    },
    calendarCellTodayText: {
      fontWeight: "700",
      color: "#F5B301",
    },
    calendarCellSelectedText: {
      color: "#0B1014",
      fontWeight: "700",
    },

    header: {
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical: isSmall ? 14 : 18,
      gap: isSmall ? 10 : 12,
      position: "relative",
    },
    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: isSmall ? "flex-start" : "space-between",
      gap: 12,
    },
    headerTitle: {
      flex: 1,
      color: WHITE,
      fontSize: isSmall ? 15 : 18,
      fontWeight: "700",
    },
    headerPillWrap: {
      ...(isSmall
        ? { alignItems: "center" }
        : {
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: [{ translateX: -40 }, { translateY: -20 }],
          }),
    },
    headerPill: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 22,
    },
    headerPillText: {
      color: "#0B1014",
      fontSize: 14,
      fontWeight: "700",
    },

    barberoGrupo: {
      marginBottom: 24,
    },
    barberoHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 12,
    },
    barberoHeaderText: {
      color: WHITE,
      fontSize: 14,
      fontWeight: "800",
    },
  });
};

export default createStyles;
