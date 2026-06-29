import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 560;
  const AVATAR_BG = '#D9D9D9';

  const CARD_BG      = isDark ? 'rgba(255,255,255,0.04)' : '#F5F5F5';
  const INPUT_BG     = isDark ? '#1A2230' : '#FFFFFF';
  const INPUT_BORDER = isDark ? 'rgba(255,255,255,0.1)' : '#D8D8D8';
  const WHITE        = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED        = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

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

    /* ── Avatar ── */
    avatarSection: {
      alignItems:   'center',
      marginTop:    isSmall ? 16 : 24,
      marginBottom: isSmall ? 18 : 26,
    },
    avatarWrap: {
       width:           80,
      height:          80,
      borderRadius:    40,
      backgroundColor: AVATAR_BG,
      justifyContent:  'center',
      alignItems:      'center',
      marginBottom:    8,
      overflow:        'hidden',
    },
    avatarPlaceholder: {
      width:           '100%',
      height:          '100%',
      backgroundColor: '#D9D9D9',
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

    /* ── Card del formulario ── */
    card: {
      width:             '100%',
      backgroundColor:   CARD_BG,
      borderRadius:      isSmall ? 16 : 20,
      paddingHorizontal: isSmall ? 16 : 24,
      paddingTop:        isSmall ? 18 : 24,
      paddingBottom:     isSmall ? 16 : 22,
      ...(isWeb && { boxShadow: isDark ? '0px 4px 20px rgba(0,0,0,0.3)' : '0px 4px 20px rgba(0,0,0,0.1)' }),
    },

    formGrid: {
      flexDirection:  'row',
      flexWrap:       'wrap',
      justifyContent: 'space-between',
    },
    column: {
      width:        isSmall ? '100%' : '48%',
      marginBottom: isSmall ? 14 : 18,
    },

    label: {
      color:         WHITE,
      fontSize:      13,
      fontWeight:    '700',
      marginBottom:  isSmall ? 6 : 8,
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
    eyeBtn: {
      flexShrink: 0,
      padding:    4,
      marginLeft: 6,
    },
    switchContainer: {
      height:         isSmall ? 42 : 46,
      justifyContent: 'center',
    },

    btn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             8,
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
    statusRow: {
  flexDirection: 'row',
  alignItems:    'center',
  justifyContent: 'space-between',
  height:         isSmall ? 42 : 46,
},
statusLabel: {
  color:      WHITE,
  fontSize:   13,
  fontWeight: '600',
},

strengthWrap: {
  flexDirection: 'row',
  alignItems:    'center',
  gap:           8,
  marginTop:     8,
},
strengthBarTrack: {
  flex:            1,
  height:          6,
  borderRadius:    3,
  backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#E0E0E0',
  overflow:        'hidden',
},
strengthBarFill: {
  height:       '100%',
  borderRadius: 3,
},
strengthLabel: {
  fontSize:   12,
  fontWeight: '700',
  minWidth:   55,
  textAlign:  'right',
},
requirementsGrid: {
  flexDirection: 'row',
  flexWrap:      'wrap',
  marginTop:     8,
  gap:           6,
},
requirementItem: {
  flexDirection: 'row',
  alignItems:    'center',
  gap:           4,
  width:         '48%',
},
requirementText: {
  fontSize:   11,
  color:      MUTED,
  fontWeight: '600',
},
requirementTextMet: {
  color: '#22C55E',
},
matchRow: {
  flexDirection: 'row',
  alignItems:    'center',
  gap:           6,
  marginTop:     6,
},
matchText: {
  fontSize:   12,
  fontWeight: '600',
},
  });
};

export default createStyles;