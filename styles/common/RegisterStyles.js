import { StyleSheet, Platform } from "react-native";

const createStyles = (width, theme) => {
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  const isWeb = Platform.OS === "web";

  const CARD_MAX_W = isLargeScreen ? 700 : 500;
  const H_PAD = isSmallScreen ? 14 : isMediumScreen ? 16 : 24;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: isSmallScreen ? 32 : 48,
    },

    back: {
      position: "absolute",
      top: isSmallScreen ? 12 : 16,
      left: isSmallScreen ? 12 : 16,
      zIndex: 100,
    },
    backCircle: {
      width: isSmallScreen ? 34 : 40,
      height: isSmallScreen ? 34 : 40,
      borderRadius: isSmallScreen ? 17 : 20,
      backgroundColor: "#0B1120",
      borderWidth: 4,
      borderColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },

    centerWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: H_PAD,
      paddingTop: isSmallScreen ? 68 : isLargeScreen ? 80 : 72,
      paddingBottom: isSmallScreen ? 20 : 28,
    },

    header: {
      alignItems: "center",
      marginBottom: isSmallScreen ? 12 : 15,
    },
    greeting: {
      color: theme.colors.text,
      fontSize: isSmallScreen ? 13 : isMediumScreen ? 14 : 16,
      fontWeight: "700",
      marginBottom: isSmallScreen ? 10 : 14,
      letterSpacing: 0.2,
      textAlign: "center",
    },
    logoWrap: {
      alignItems: "center",
      marginBottom: isSmallScreen ? 10 : 14,
    },
    logoPlaceholder: {
      alignItems: "center",
      justifyContent: "center",
      width: isSmallScreen ? 70 : isMediumScreen ? 80 : 90,
      height: isSmallScreen ? 70 : isMediumScreen ? 80 : 90,
      borderRadius: isSmallScreen ? 35 : isMediumScreen ? 40 : 45,
      backgroundColor: "#1A1A1A",
      borderWidth: 1.5,
      borderColor: "#C9A84C",
      overflow: "hidden",
    },
    logoText: {
      color: "#C9A84C",
      fontSize: isSmallScreen ? 9 : 11,
      fontWeight: "900",
      letterSpacing: 2.5,
      marginTop: 3,
    },
    logoSubText: {
      color: "rgba(255,255,255,0.4)",
      fontSize: isSmallScreen ? 7 : 9,
      fontWeight: "700",
      letterSpacing: 2,
    },
    title: {
      color: theme.colors.text,
      fontSize: isSmallScreen ? 22 : isMediumScreen ? 26 : 28,
      fontWeight: "700",
      textAlign: "center",
    },

    card: {
      width: "100%",
      maxWidth: CARD_MAX_W,
      backgroundColor: "#F5F5F5",
      borderRadius: isSmallScreen ? 8 : 10,
      paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 20 : 28,
      paddingTop: isSmallScreen ? 18 : 24,
      paddingBottom: isSmallScreen ? 16 : 22,
      ...(isWeb && { boxShadow: "0px 4px 20px rgba(0,0,0,0.25)" }),
    },

    formGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    column: {
      width: isLargeScreen ? "48%" : "100%",
      marginBottom: isSmallScreen ? 12 : 16,
    },

    label: {
      color: "#333",
      fontSize: isSmallScreen ? 12 : 13,
      fontWeight: "700",
      marginBottom: isSmallScreen ? 4 : 6,
      letterSpacing: 0.1,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      borderColor: "#D8D8D8",
      borderRadius: 6,
      borderWidth: 1,
      paddingHorizontal: isSmallScreen ? 10 : 12,
      height: isSmallScreen ? 42 : 46,
      overflow: "hidden",
    },
    input: {
      flex: 1,
      minWidth: 0,
      color: "#000",
      fontSize: isSmallScreen ? 13 : 14,
      ...(isWeb && { outlineWidth: 0 }),
    },
    eyeBtn: {
      flexShrink: 0,
      padding: 4,
      marginLeft: 6,
    },
    switchContainer: {
      height: isSmallScreen ? 42 : 46,
      justifyContent: "center",
    },

    btn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "#2C2C2C",
      borderRadius: 6,
      height: isSmallScreen ? 44 : 48,
      marginTop: isSmallScreen ? 6 : 10,
      marginBottom: isSmallScreen ? 12 : 16,
      alignSelf: "center",
      width: isSmallScreen ? "100%" : 220,
    },
    btnText: {
      color: "#FFF",
      fontSize: isSmallScreen ? 14 : 15,
      fontWeight: "700",
      letterSpacing: 0.2,
    },
    strengthWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
    },
    strengthBarTrack: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#E0E0E0",
      overflow: "hidden",
    },
    strengthBarFill: {
      height: "100%",
      borderRadius: 3,
    },
    strengthLabel: {
      fontSize: 12,
      fontWeight: "700",
      minWidth: 55,
      textAlign: "right",
    },
    requirementsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      gap: 6,
    },
    requirementItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      width: "48%",
    },
    requirementText: {
      fontSize: 11,
      color: "#999",
      fontWeight: "600",
    },
    requirementTextMet: {
      color: "#22C55E",
    },
    matchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 6,
    },
    matchText: {
      fontSize: 12,
      fontWeight: "600",
    },

    logoImage: {
      width: "100%",
      height: "100%",
      borderRadius: isSmallScreen ? 35 : isMediumScreen ? 40 : 45,
    },

    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: isSmallScreen ? 42 : 46,
    },
    statusLabel: {
      color: "#333",
      fontSize: 13,
      fontWeight: "600",
    },
  });
};

export default createStyles;
