import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall  = width < 768;
  const isMedium = width >= 768 && width < 1024;
  const isWeb    = Platform.OS === 'web';
  const isDark   = theme.mode === 'dark';

  const NAVBAR       = '#0B1014';
  const COL_COUNT    = isSmall ? 2 : isMedium ? 3 : 5;
  const CONTENT_MAX_W = isSmall ? '100%' : 900;
  const CARD_BG      = isDark ? 'rgba(255,255,255,0.04)' : '#F5F5F5';
  const INPUT_BG     = isDark ? '#1A2230' : '#FFFFFF';
  const INPUT_BORDER = isDark ? 'rgba(255,255,255,0.12)' : '#D8D8D8';
  const WHITE        = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED        = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const CHECK_BG     = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

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
      padding:       isSmall ? 12 : 28,
      paddingBottom: 40,
      alignItems:    'center',
    },
    contentWrap: {
      width:    '100%',
      maxWidth: CONTENT_MAX_W,
    },

    /* ── Card ── */
    card: {
      backgroundColor:   CARD_BG,
      borderRadius:      20,
      padding:           isSmall ? 14 : 24,
      ...(isWeb && {
        boxShadow: isDark
          ? '0px 4px 20px rgba(0,0,0,0.3)'
          : '0px 4px 20px rgba(0,0,0,0.1)',
      }),
    },

    /* ── Grid de días ── */
    grid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           isSmall ? 12 : 16,
    },
    diaCol: {
      width: isSmall
        ? `${(100 / 2) - 3}%`
        : isMedium
        ? `${(100 / 3) - 2.5}%`
        : `${(100 / 5) - 2.2}%`,
    },

    diaNombre: {
      color:        WHITE,
      fontSize:     isSmall ? 15 : 16,
      fontWeight:   '800',
      marginBottom: 10,
    },

    /* ── Checkbox ── */
    checkRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           8,
      marginBottom:  12,
    },
    checkbox: {
      width:           22,
      height:          22,
      borderRadius:    6,
      backgroundColor: CHECK_BG,
      borderWidth:     3,
      borderColor:     INPUT_BORDER,
      justifyContent:  'center',
      alignItems:      'center',
    },
checkboxChecked: {
  backgroundColor: 'transparent',
  borderColor:     '#FFFFFF',
  borderWidth:     4,   
},
checkLabelAbierto: {
  color: '#FFFFFF',
},
    checkLabel: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '700',
    },

    /* ── Inputs de hora ── */
    horaLabel: {
      color:        MUTED,
      fontSize:     11,
      fontWeight:   '600',
      marginBottom: 6,
    },
    horaInput: {
      backgroundColor:   INPUT_BG,
      borderRadius:      20,
      borderWidth:       1,
      borderColor:       INPUT_BORDER,
      paddingHorizontal: 14,
      paddingVertical:   isSmall ? 9 : 11,
      marginBottom:      10,
      alignItems:        'center',
    },
    horaInputDisabled: {
      opacity: 0.35,
    },
    horaInputText: {
      color:     WHITE,
      fontSize:  isSmall ? 13 : 14,
      fontWeight:'600',
      textAlign: 'center',
      width:     '100%',
      ...(isWeb && { outlineWidth: 0 }),
    },
    horaInputTextDisabled: {
      color: MUTED,
    },

    /* ── Botón guardar ── */
    saveBtn: {
      alignSelf:         'center',
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingHorizontal: 40,
      paddingVertical:   14,
      marginTop:         20,
      ...(isWeb && { boxShadow: '0px 4px 12px rgba(0,0,0,0.2)' }),
    },
    saveBtnText: {
      color:      '#1A1A1A',
      fontSize:   15,
      fontWeight: '700',
    },
  });
};

export default createStyles;