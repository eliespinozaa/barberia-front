import { StyleSheet, Platform } from "react-native";

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb = Platform.OS === "web";
  const isDark = theme.mode === "dark";

  const NAVBAR = "#0B1014";
  const SIDEBAR_BG = isDark ? "#0B1014" : "#F0F0F0";
  const PANEL = isDark ? "#4E504D3B" : "#FFFFFF";
  const ACCESO_BG = isDark ? "#4E504D3B" : "#FFFFFF";
  const WHITE = isDark ? "#FFFFFF" : "#1A1A1A";
  const MUTED = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const GOLD = "#C9A84C";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    /* ── Navbar ── */
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: NAVBAR,
      paddingHorizontal: isSmall ? 16 : 24,
      paddingVertical: isSmall ? 22 : 28,
    },
    navLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    navLogoWrap: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: "#1A1A1A",
      borderWidth: 1,
      borderColor: "rgba(201,168,76,0.3)",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    navLogoImage: {
      width: "100%",
      height: "100%",
    },
    navTitle: {
      color: "#FFFFFF",
      fontSize: isSmall ? 18 : 22,
      fontWeight: "600",
    },
    navRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    navIcon: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    navAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "#2A2A2A",
      justifyContent: "center",
      alignItems: "center",
    },
    menuBtn: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },

    /* ── Body ── */
    bodyRow: {
      flex: 1,
      flexDirection: "row",
    },

    /* ── Sidebar ── */
    sidebar: {
      width: 220,
      backgroundColor: SIDEBAR_BG,
      borderRadius: 35,
      marginVertical: 20,
      marginLeft: 16,
      paddingTop: 25,
      paddingHorizontal: 16,
      justifyContent: "space-between",
    },
    sidebarItems: {
      gap: 18,
    },
    sidebarItem: {
      paddingVertical: 4,
    },
    sidebarText: {
      color: MUTED,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    sidebarTextActive: {
      color: WHITE,
    },

    /* ── Logout ── */
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      marginBottom: 20,
    },
    logoutText: {
      color: WHITE,
      fontSize: 14,
      fontWeight: "600",
    },

    /* ── Drawer ── */
    drawerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 500,
    },
    drawer: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 260,
      backgroundColor: SIDEBAR_BG,
      paddingTop: 60,
      paddingHorizontal: 20,
      zIndex: 600,
      justifyContent: "space-between",
    },
    drawerItem: {
      paddingVertical: 14,
    },
    drawerText: {
      color: MUTED,
      fontSize: 15,
      fontWeight: "600",
    },
    drawerTextActive: {
      color: WHITE,
    },
    drawerClose: {
      position: "absolute",
      top: 16,
      right: 16,
    },

    /* ── Main content ── */
    mainContent: {
      flex: 1,
    },
    mainContentInner: {
      padding: isSmall ? 16 : 28,
      paddingBottom: 40,
    },
    greeting: {
      color: WHITE,
      fontSize: isSmall ? 14 : 15,
      fontWeight: "600",
      marginBottom: 18,
    },

    /* ── Stats panel ── */
    statsPanel: {
      backgroundColor: PANEL,
      borderRadius: 50,
      padding: isSmall ? 16 : 24,
      marginBottom: 32,
      gap: 16,
    },
    statsSectionTitle: {
      color: WHITE,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: isSmall ? 16 : 24,
    },
    statItem: {
      flexGrow: 1,
      minWidth: isSmall ? "45%" : 140,
    },
    statHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    },
    statLabel: {
      color: WHITE,
      fontSize: 13,
      fontWeight: "600",
    },
    statValue: {
      color: WHITE,
      fontSize: 18,
      fontWeight: "400",
    },

    /* ── Sección título ── */
    sectionTitle: {
      color: WHITE,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 14,
    },

    /* ── Tarjeta de cita ── */
    citaCard: {
      backgroundColor: ACCESO_BG,
      borderRadius: 50,
      padding: 16,
      marginBottom: 12,
      ...(!isDark && isWeb && { boxShadow: "0px 2px 8px rgba(0,0,0,0.08)" }),
    },
    citaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    citaInfo: {
      flex: 1,
      gap: 4,
    },
    citaCliente: {
      color: WHITE,
      fontSize: 14,
      fontWeight: "700",
    },
    citaServicio: {
      color: MUTED,
      fontSize: 12,
    },
    citaMeta: {
      alignItems: "flex-end",
      gap: 6,
    },
    citaHora: {
      color: WHITE,
      fontSize: 13,
      fontWeight: "600",
    },
    citaEstadoBadge: {
      borderWidth: 1,
      borderRadius: 20,
      paddingVertical: 3,
      paddingHorizontal: 10,
    },
    citaEstadoText: {
      fontSize: 11,
      fontWeight: "600",
    },

    /* ── Dropdown ── */
    dropdown: {
      position: "absolute",
      top: isSmall ? 78 : 92,
      right: isSmall ? 16 : 24,
      backgroundColor: "#0B1014",
      borderRadius: 12,
      paddingVertical: 8,
      minWidth: 180,
      zIndex: 999,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.08)",
      ...(isWeb && { boxShadow: "0px 8px 24px rgba(0,0,0,0.5)" }),
    },
    dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
    },
    dropdownText: {
      color: "#FFFFFF",
      fontSize: 14,
    },
  });
};

export default createStyles;
