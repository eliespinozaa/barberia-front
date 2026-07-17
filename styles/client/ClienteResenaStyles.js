import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 700;
  const isWeb = Platform.OS === 'web';
  const isDark = theme.mode === 'dark';

  const BG = theme.colors.background;
  const WHITE = theme.colors.text;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
    },

    titleBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical: isSmall ? 14 : 20,
      position: 'relative',
    },
    backBtn: {
      position: 'absolute',
      left: isSmall ? 16 : 28,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titlePill: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      paddingHorizontal: 26,
      paddingVertical: 10,
    },
    titlePillText: {
      color: '#1A1A1A',
      fontSize: isSmall ? 15 : 17,
      fontWeight: '800',
    },

    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },

    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      paddingVertical: 24,
      paddingHorizontal: 26,
      width: '100%',
      maxWidth: 460,
      ...(isWeb && { boxShadow: '0px 8px 30px rgba(0,0,0,0.35)' }),
    },
    closeBtn: {
      position: 'absolute',
      top: 18,
      right: 18,
      zIndex: 2,
    },

    label: {
      color: '#1A1A1A',
      fontSize: 16,
      fontWeight: '800',
    },

    calificacionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 22,
    },

    starsRow: {
      flexDirection: 'row',
      gap: 6,
    },
    starBtn: {
      padding: 2,
    },

    comentarioInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#1A1A1A',
      color: '#1A1A1A',
      fontSize: 14,
      paddingVertical: 8,
      minHeight: 70,
      textAlignVertical: 'top',
      marginBottom: 24,
      ...(isWeb && { outlineWidth: 0 }),
    },

    btnEnviar: {
      alignSelf: 'center',
      backgroundColor: '#6B7280',
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 40,
    },
    btnEnviarTexto: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
    },
    btnEnviarDisabled: {
      opacity: 0.5,
    },

    yaResenoWrap: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    yaResenoTexto: {
      color: '#1A1A1A',
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
};

export default createStyles;