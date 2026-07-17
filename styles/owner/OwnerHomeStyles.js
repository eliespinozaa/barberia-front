import { StyleSheet, Platform } from "react-native";

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb = Platform.OS === "web";
  const isDark = theme.mode === "dark";

  const NAVBAR = isDark ? "#0B1014" : "#1A1A1A";
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

    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#0B1014",
      paddingHorizontal: isSmall ? 16 : 24,
      paddingVertical: isSmall ? 22 : 28,
    },
    navLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      minWidth: 0,
    },

    navTitle: {
      color: "#FFFFFF",
      fontSize: isSmall ? 18 : 22,
      fontWeight: "600",
      flexShrink: 1,
    },

    navRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flexShrink: 0,
    },

    navLogoWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    navLogoImage: {
      width: 32,
      height: 32,
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

    bodyRow: {
      flex: 1,
      flexDirection: "row",
    },

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
      paddingHorizontal: 20,
      zIndex: 600,
      justifyContent: "space-between",
    },
    drawerItems: {
      marginTop: 40,
      flexGrow: 0,
    },
    drawerItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 13,
      paddingHorizontal: 8,
      borderRadius: 12,
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

    statsPanel: {
      backgroundColor: PANEL,
      borderRadius: 28,
      padding: isSmall ? 16 : 24,
      gap: 24,
      marginBottom: 32,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: isSmall ? 16 : 24,
    },
    statItem: {
      flexGrow: 1,
      minWidth: isSmall ? "45%" : 140,
      justifyContent: "center",
    },
    statHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      marginBottom: 8,
    },
    statLabel: {
      color: WHITE,
      fontSize: 13,
      fontWeight: "600",
      textAlign: "center",
    },
    statValue: {
      color: WHITE,
      fontSize: 18,
      fontWeight: "400",
      textAlign: "center",
      width: "100%",
    },

    sectionTitle: {
      color: WHITE,
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 14,
    },

    accesoCard: {
      backgroundColor: ACCESO_BG,
      borderRadius: 50,
      paddingVertical: 16,
      paddingHorizontal: 22,
      marginBottom: 12,
      ...(!isDark && isWeb && { boxShadow: "0px 2px 8px rgba(0,0,0,0.07)" }),
    },
    accesoTitulo: {
      color: WHITE,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 4,
    },
    accesoDesc: {
      color: MUTED,
      fontSize: 12,
      lineHeight: 18,
    },

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
    dropdownOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 998,
    },
  });
};

export default createStyles;
