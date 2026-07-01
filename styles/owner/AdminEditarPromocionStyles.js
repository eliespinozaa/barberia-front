import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 560;
  const AVATAR_BG     = isDark ? 'rgba(255,255,255,0.08)' : '#D9D9D9';
  const CARD_BG       = isDark ? 'rgba(255,255,255,0.04)' : '#F5F5F5';
  const INPUT_BG      = isDark ? '#1A2230' : '#FFFFFF';
  const INPUT_BORDER  = isDark ? 'rgba(255,255,255,0.1)' : '#D8D8D8';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

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
    body: {
      flex: 1,
    },
    bodyInner: {
      padding:       isSmall ? 16 : 28,
      paddingBottom: 40,
      alignItems:    'center',
    },
    contentWrap: {
      width:    '100%',
      maxWidth: CONTENT_MAX_W,
    },

    /* ── Avatar / imagen ── */
    avatarSection: {
      alignItems:   'center',
      marginTop:    isSmall ? 16 : 24,
      marginBottom: isSmall ? 18 : 26,
    },
    avatarWrap: {
      width:           80,
      height:          80,
      borderRadius:    16,
      backgroundColor: AVATAR_BG,
      justifyContent:  'center',
      alignItems:      'center',
      marginBottom:    8,
      overflow:        'hidden',
    },
    avatarImage: {
      width:  '100%',
      height: '100%',
    },
    avatarLabel: {
      color:      WHITE,
      fontSize:   12,
      fontWeight: '700',
    },

    /* ── Card ── */
    card: {
      width:             '100%',
      backgroundColor:   CARD_BG,
      borderRadius:      isSmall ? 16 : 20,
      paddingHorizontal: isSmall ? 16 : 24,
      paddingTop:        isSmall ? 18 : 24,
      paddingBottom:     isSmall ? 16 : 22,
      ...(isWeb && {
        boxShadow: isDark
          ? '0px 4px 20px rgba(0,0,0,0.3)'
          : '0px 4px 20px rgba(0,0,0,0.1)',
      }),
    },

    /* ── Grid ── */
    formGrid: {
      flexDirection:  'row',
      flexWrap:       'wrap',
      justifyContent: 'space-between',
    },
    column: {
      width:        isSmall ? '100%' : '48%',
      marginBottom: isSmall ? 14 : 18,
    },

    /* ── Campos ── */
    label: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '700',
      marginBottom: isSmall ? 6 : 8,
    },
    inputRow: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   INPUT_BG,
      borderColor:       INPUT_BORDER,
      borderRadius:      24,
      borderWidth:       1,
      paddingHorizontal: 16,
      height:            isSmall ? 42 : 46,
      overflow:          'hidden',
    },
    input: {
      flex:     1,
      minWidth: 0,
      color:    WHITE,
      fontSize: isSmall ? 13 : 14,
      ...(isWeb && { outlineWidth: 0 }),
    },

    /* ── Switch / Estatus ── */
    statusRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      height:         isSmall ? 42 : 46,
    },
    statusLabel: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '600',
    },

    /* ── Botón principal ── */
    btn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: isDark ? '#FFFFFF' : '#1A1A1A',
      borderRadius:    24,
      height:          isSmall ? 46 : 50,
      marginTop:       isSmall ? 8 : 12,
      alignSelf:       'center',
      width:           isSmall ? '100%' : 240,
    },
    btnText: {
      color:         isDark ? '#1A1A1A' : '#FFFFFF',
      fontSize:      isSmall ? 14 : 15,
      fontWeight:    '700',
      letterSpacing: 0.2,
    },

    /* ── Botón inactivar ── */
    btnInactivar: {
      alignItems:    'center',
      justifyContent:'center',
      height:         isSmall ? 42 : 46,
      marginTop:      10,
      alignSelf:      'center',
      width:          isSmall ? '100%' : 240,
    },
    btnInactivarText: {
      color:      '#EF4444',
      fontSize:   13,
      fontWeight: '700',
    },

    /* ── Modal: confirmar inactivar ── */
    modalOverlay: {
      flex:              1,
      backgroundColor:   'rgba(0,0,0,0.6)',
      justifyContent:    'center',
      alignItems:        'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      backgroundColor:   '#1A2230',
      borderRadius:      20,
      paddingTop:        32,
      paddingBottom:     20,
      paddingHorizontal: 22,
      width:             '100%',
      maxWidth:          320,
      alignItems:        'center',
      ...(isWeb && { boxShadow: '0px 12px 32px rgba(0,0,0,0.5)' }),
    },
    modalCloseBtn: {
      position: 'absolute',
      top:      14,
      right:    14,
      padding:  4,
    },
    modalMessage: {
      color:        '#FFFFFF',
      fontSize:     15,
      fontWeight:   '700',
      textAlign:    'center',
      lineHeight:   22,
      marginBottom: 24,
    },
    modalActions: {
      flexDirection: 'row',
      gap:           12,
      width:         '100%',
    },
    modalBtnCancel: {
      flex:              1,
      backgroundColor:   'transparent',
      borderWidth:       1,
      borderColor:       'rgba(255,255,255,0.3)',
      borderRadius:      20,
      paddingVertical:   11,
      alignItems:        'center',
    },
    modalBtnCancelText: {
      color:      '#FFFFFF',
      fontSize:   13,
      fontWeight: '600',
    },
    modalBtnConfirm: {
      flex:              1,
      backgroundColor:   '#FFFFFF',
      borderRadius:      20,
      paddingVertical:   11,
      alignItems:        'center',
    },
    modalBtnConfirmText: {
      color:      '#1A1A1A',
      fontSize:   13,
      fontWeight: '700',
    },
  });
};

export default createStyles;