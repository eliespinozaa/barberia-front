import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 560;

  const CARD_BG      = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const WHITE        = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED        = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const BORDER       = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  const INPUT_BG     = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const BTN_BG       = isDark ? '#FFFFFF' : '#1A1A1A';
  const BTN_TEXT     = isDark ? '#1A1A1A' : '#FFFFFF';
  const DANGER_RED   = '#EF4444';

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

    /* ── Avatar ── */
    avatarWrap: {
      alignItems:   'center',
      marginBottom: 24,
    },
    avatarCircle: {
      width:           96,
      height:          96,
      borderRadius:    48,
      backgroundColor: '#D9D9D9',
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
    },
    avatarImage: {
      width:  96,
      height: 96,
    },
    avatarEditBadge: {
      position:        'absolute',
      bottom:          0,
      right:           '34%',
      width:           30,
      height:          30,
      borderRadius:    15,
      backgroundColor: BTN_BG,
      justifyContent:  'center',
      alignItems:      'center',
      borderWidth:     2,
      borderColor:     theme.colors.background,
    },

    /* ── Card ── */
    card: {
      backgroundColor: CARD_BG,
      borderRadius:    18,
      padding:         isSmall ? 18 : 24,
      marginBottom:    18,
      ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }),
    },
    cardTitle: {
      color:        WHITE,
      fontSize:     15,
      fontWeight:   '800',
      marginBottom: 18,
      letterSpacing: 0.3,
    },

    /* ── Campos ── */
    fieldBlock: {
      marginBottom: 16,
    },
    fieldLabel: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '700',
      marginBottom: 6,
    },
    fieldInput: {
      backgroundColor:   INPUT_BG,
      borderWidth:       1,
      borderColor:       BORDER,
      borderRadius:      12,
      paddingHorizontal: 14,
      paddingVertical:   Platform.OS === 'ios' ? 12 : 10,
      color:             WHITE,
      fontSize:          14,
      fontWeight:        '500',
      ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },
    fieldInputRow: {
      flexDirection: 'row',
      alignItems:    'center',
      backgroundColor:   INPUT_BG,
      borderWidth:       1,
      borderColor:       BORDER,
      borderRadius:      12,
      paddingHorizontal: 14,
    },
    fieldInputFlex: {
      flex:            1,
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      color:           WHITE,
      fontSize:        14,
      fontWeight:      '500',
      ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },
    fieldHint: {
      color:     MUTED,
      fontSize:  12,
      marginTop: 6,
    },

    /* ── Botón guardar ── */
    saveBtn: {
      backgroundColor:   BTN_BG,
      borderRadius:      20,
      paddingVertical:   14,
      alignItems:        'center',
      marginTop:         6,
    },
    saveBtnText: {
      color:      BTN_TEXT,
      fontSize:   14,
      fontWeight: '800',
    },

    saveBtnSecondary: {
      backgroundColor:   'transparent',
      borderWidth:       1,
      borderColor:       BORDER,
      borderRadius:      20,
      paddingVertical:   14,
      alignItems:        'center',
      marginTop:         6,
    },
    saveBtnSecondaryText: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '800',
    },

    errorText: {
      color:        DANGER_RED,
      fontSize:     12,
      fontWeight:   '600',
      marginTop:    6,
    },
  });
};

export default createStyles;