import { StyleSheet } from "react-native";

const createStyles = (theme) => {
  const isDark = theme.mode === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0B1120" : "#F5F5F5",
      justifyContent: "center",
      alignItems: "center",
    },

    content: {
      alignItems: "center",
      paddingHorizontal: 40,
      width: "100%",
      maxWidth: 360,
    },

    iconWrap: {
      width: 112,
      height: 112,
      borderRadius: 56,
      backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
      ...(isDark
        ? {}
        : {
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
          }),
    },

    /* ── Anillo giratorio (spinner tipo "arco dorado") ── */
    spinnerRing: {
      position: "absolute",
      width: 112,
      height: 112,
      borderRadius: 56,
      borderWidth: 3,
      borderColor: "transparent",
      borderTopColor: "#C9A84C",
      borderRightColor: "rgba(201,168,76,0.25)",
    },

    logoImage: {
      width: "62%",
      height: "62%",
    },

    title: {
      fontSize: 24,
      fontWeight: "900",
      color: isDark ? "#FFF" : "#1A1A1A",
      textAlign: "center",
      lineHeight: 32,
      marginBottom: 10,
    },

    titleAccent: {
      color: "#C9A84C",
    },

    subtitle: {
      fontSize: 14,
      color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)",
      marginBottom: 28,
      textAlign: "center",
    },

    /* ── Puntitos rebotando ── */
    dotsRow: {
      flexDirection: "row",
      gap: 8,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#C9A84C",
    },
  });
};

export default createStyles;