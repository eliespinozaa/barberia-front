import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

const isSmallScreen = SCREEN_W < 375;
const isMediumScreen = SCREEN_W >= 375 && SCREEN_W < 768;
const isLargeScreen = SCREEN_W >= 768;
const isWeb = Platform.OS === "web";

const CARD_MAX_W = 440;
const H_PAD = isSmallScreen ? 14 : isMediumScreen ? 16 : 24;

const createStyles = (theme) =>
  StyleSheet.create({
    /* ── Raíz ── */
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: isSmallScreen ? 32 : 48,
    },

    /* ── Botón atrás ── */
    back: {
      position: "absolute",
      top: isSmallScreen ? 12 : 16,
      left: isSmallScreen ? 12 : 16,
      zIndex: 10,
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

    /* ── Envoltorio centrado ── */
    centerWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: H_PAD,
      paddingTop: isSmallScreen ? 68 : isLargeScreen ? 80 : 72,
      paddingBottom: isSmallScreen ? 20 : 28,
    },

    /* ── Header ── */
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

    /* ── Tarjeta ── */
    card: {
      width: "100%",
      maxWidth: CARD_MAX_W,
      backgroundColor: "#F5F5F5",
      borderRadius: isSmallScreen ? 8 : 10,
      paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 22 : 28,
      paddingTop: isSmallScreen ? 18 : 24,
      paddingBottom: isSmallScreen ? 16 : 22,
      ...(isWeb && {
        boxShadow: "0px 4px 20px rgba(0,0,0,0.25)",
      }),
    },

    /* ── Error ── */
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#fff0f0",
      borderWidth: 1,
      borderColor: "rgba(231,76,60,0.25)",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 14,
    },
    errorText: {
      color: "#E74C3C",
      fontSize: isSmallScreen ? 12 : 13,
      flex: 1,
    },

    /* ── Campos ── */
    fieldGroup: {
      marginBottom: isSmallScreen ? 12 : 15,
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

    /* ── Botón principal ── */
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
    },
    btnLoading: {
      opacity: 0.6,
    },
    btnText: {
      color: "#FFF",
      fontSize: isSmallScreen ? 14 : 15,
      fontWeight: "700",
      letterSpacing: 0.2,
    },

    /* ── Olvidé contraseña ── */
    forgot: {
      alignItems: "center",
      paddingVertical: 2,
    },
    forgotText: {
      color: theme.colors.textMuted,
      fontSize: isSmallScreen ? 12 : 13,
      textDecorationLine: "underline",
    },

    /* ── Cuentas de prueba ── */
    hint: {
      width: "100%",
      maxWidth: CARD_MAX_W,
      backgroundColor: "#161616",
      borderRadius: isSmallScreen ? 8 : 12,
      padding: isSmallScreen ? 12 : 16,
      borderWidth: 1,
      borderColor: "#252525",
      marginTop: isSmallScreen ? 10 : 14,
    },
    hintTitle: {
      color: "#C9A84C",
      fontSize: isSmallScreen ? 10 : 11,
      fontWeight: "700",
      marginBottom: isSmallScreen ? 6 : 8,
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    hintRow: {
      color: "rgba(255,255,255,0.40)",
      fontSize: isSmallScreen ? 11 : 12,
      marginBottom: isSmallScreen ? 3 : 4,
      lineHeight: isSmallScreen ? 16 : 18,
    },
    hintEmail: {
      color: "rgba(255,255,255,0.65)",
    },
    hintPass: {
      color: "#C9A84C",
      fontSize: isSmallScreen ? 11 : 12,
      marginTop: isSmallScreen ? 5 : 7,
      fontWeight: "600",
    },

    logoImage: {
      width: "100%",
      height: "100%",
      borderRadius: isSmallScreen ? 35 : isMediumScreen ? 40 : 45, 
    },
  });

export default createStyles;
