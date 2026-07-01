import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 560;
  const CARD_BG       = isDark ? 'rgba(255,255,255,0.04)' : '#F5F5F5';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const BORDER        = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    /* ── Header ── */
    header: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'center',
      backgroundColor:   NAVBAR,
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 14 : 18,
      position:          'relative',
    },
    backBtn: {
      position:        'absolute',
      left:            isSmall ? 16 : 28,
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: 'rgba(255,255,255,0.12)',
      justifyContent:  'center',
      alignItems:      'center',
    },
    headerPill: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingHorizontal: 28,
      paddingVertical:   10,
    },
    headerTitle: {
      color:      '#1A1A1A',
      fontSize:   isSmall ? 16 : 18,
      fontWeight: '700',
    },

    /* ── Body ── */
    body: { flex: 1 },
    bodyInner: {
      padding:       isSmall ? 16 : 28,
      paddingBottom: 40,
      alignItems:    'center',
    },
    contentWrap: {
      width:    '100%',
      maxWidth: CONTENT_MAX_W,
    },

    sectionTitle: {
      color:        WHITE,
      fontSize:     17,
      fontWeight:   '800',
      marginBottom: 14,
    },

    /* ── Card ── */
    card: {
      backgroundColor: CARD_BG,
      borderRadius:    20,
      paddingVertical: isSmall ? 6 : 8,
      ...(isWeb && {
        boxShadow: isDark
          ? '0px 4px 20px rgba(0,0,0,0.3)'
          : '0px 4px 20px rgba(0,0,0,0.1)',
      }),
    },

    /* ── Filas de días ── */
    fila: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: isSmall ? 20 : 28,
      paddingVertical:   isSmall ? 14 : 16,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    filaLast: {
      borderBottomWidth: 0,
    },
    filaDia: {
      color:      WHITE,
      fontSize:   isSmall ? 14 : 15,
      fontWeight: '700',
    },
    filaHora: {
      color:      WHITE,
      fontSize:   isSmall ? 14 : 15,
      fontWeight: '500',
    },
    filaHoraCerrado: {
      color: MUTED,
    },

    /* ── Botón editar ── */
    editBtn: {
      alignSelf:         'center',
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingHorizontal: 32,
      paddingVertical:   12,
      margin:            20,
      ...(isWeb && { boxShadow: '0px 4px 12px rgba(0,0,0,0.2)' }),
    },
    editBtnText: {
      color:      '#1A1A1A',
      fontSize:   15,
      fontWeight: '700',
    },
  });
};

export default createStyles;