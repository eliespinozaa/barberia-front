import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 700;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR  = theme.colors.navBackground;
  const BG      = theme.colors.background;
  const BORDER  = theme.colors.border;
  const WHITE   = theme.colors.text;
const CARD_BG         = '#D9D9D9';
const CARD_TEXT       = '#1A1A1A';
const CARD_TEXT_MUTED = '#6B7280';

const FIELD_BG      = '#FFFFFF';
const FIELD_TEXT    = '#1A1A1A';
const FIELD_MUTED   = '#9A9A9A';
const FIELD_BORDER  = 'rgba(0,0,0,0.06)';

const OPTION_BORDER = 'rgba(0,0,0,0.06)';

  const CONTENT_MAX_W = isSmall ? '100%' : 480;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
    },

    /* ── Navbar ── */
    navbar: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      backgroundColor:   NAVBAR,
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 10 : 14,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    navLeft: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           10,
    },
    navLogoWrap: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: '#1A1A1A',
      borderWidth:     1,
      borderColor:     'rgba(201,168,76,0.3)',
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
    },
    navLogoImg: {
      width:  '100%',
      height: '100%',
    },
    navBarberia: {
      color:      '#FFFFFF',
      fontSize:   isSmall ? 15 : 17,
      fontWeight: '700',
    },
    navAvatar: {
      width:           38,
      height:          38,
      borderRadius:    19,
      backgroundColor: 'rgba(255,255,255,0.12)',
      justifyContent:  'center',
      alignItems:      'center',
    },

    /* ── Dropdown del avatar (igual al de ClientHomeScreen), con backdrop ── */
    dropdownBackdrop: {
      position: 'absolute',
      top:      0,
      left:     0,
      right:    0,
      bottom:   0,
      zIndex:   998,
    },
    dropdown: {
      position:        'absolute',
      top:             isSmall ? 58 : 66,
      right:           isSmall ? 16 : 28,
      backgroundColor: theme.colors.cardBackground,
      borderRadius:    12,
      paddingVertical: 8,
      minWidth:        180,
      zIndex:          999,
      borderWidth:     1,
      borderColor:     BORDER,
      ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.5)' }),
    },
    dropdownItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   12,
      paddingHorizontal: 16,
      gap:               12,
    },
    dropdownText: {
      color:    WHITE,
      fontSize: 14,
    },

    /* ── Barra de título + back ── */
    titleBar: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'center',
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 14 : 20,
      position:          'relative',
    },
    backBtn: {
      position:        'absolute',
      left:            isSmall ? 16 : 28,
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
      justifyContent:  'center',
      alignItems:      'center',
    },
    titlePill: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingHorizontal: 26,
      paddingVertical:   10,
    },
    titlePillText: {
      color:      '#1A1A1A',
      fontSize:   isSmall ? 15 : 17,
      fontWeight: '800',
    },

    /* ── Body ── */
    bodyInner: {
      padding:        isSmall ? 16 : 28,
      paddingTop:     isSmall ? 4 : 8,
      paddingBottom:  60,
      alignItems:     'center',
    },

    /* ── Tarjeta del formulario ── */
   formCard: {
  width:            '100%',
  maxWidth:         CONTENT_MAX_W,
  backgroundColor:  CARD_BG,
  borderRadius:     22,
  padding:          isSmall ? 18 : 26,
  ...(isWeb
    ? { boxShadow: '0px 4px 14px rgba(0,0,0,0.35)' }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
      }),
},

    label: {
      color:        CARD_TEXT_MUTED,
      fontSize:     13,
      fontWeight:   '700',
      marginBottom: 8,
      marginTop:    16,
    },

    /* ── Dropdowns (servicio / barbero / hora) ── */
    dropdownWrap: {
      position: 'relative',
      zIndex:   1,
    },
    selectRow: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      backgroundColor:   FIELD_BG,
      borderRadius:      14,
      paddingVertical:   14,
      paddingHorizontal: 16,
      borderWidth:       1,
      borderColor:       FIELD_BORDER,
    },
    selectTexto: {
      color:      FIELD_TEXT,
      fontSize:   14,
      fontWeight: '700',
      flexShrink: 1,
      marginRight: 10,
    },
    selectRight: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           10,
    },
    selectPrecio: {
      color:      '#6B7280',
      fontSize:   13,
      fontWeight: '700',
    },

    optionsBox: {
      backgroundColor: FIELD_BG,
      borderRadius:    14,
      marginTop:       8,
      overflow:        'hidden',
      borderWidth:     1,
      borderColor:     FIELD_BORDER,
    },
    optionRow: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingVertical:   12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: OPTION_BORDER,
    },
    optionTexto: {
      color:      FIELD_TEXT,
      fontSize:   14,
      fontWeight: '700',
    },
    optionPrecio: {
      color:      '#6B7280',
      fontSize:   13,
      fontWeight: '700',
    },

    /* ── Campo de texto plano (fecha) ── */
    plainBox: {
      backgroundColor: FIELD_BG,
      borderRadius:    14,
      borderWidth:     1,
      borderColor:     FIELD_BORDER,
      paddingHorizontal: 16,
    },
    plainInput: {
      color:      FIELD_TEXT,
      fontSize:   14,
      fontWeight: '700',
      paddingVertical: 14,
      ...(isWeb ? { outlineStyle: 'none' } : {}),
    },

    /* ── Botón actualizar ── */
    actualizarBtn: {
      marginTop:         26,
      backgroundColor:   '#1A1A1A',
      borderRadius:      999,
      paddingVertical:   15,
      alignItems:        'center',
      justifyContent:    'center',
    },
    actualizarBtnTexto: {
      color:      '#FFFFFF',
      fontSize:   15,
      fontWeight: '800',
    },


    optionLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
optionCheck: {
  marginRight: 8,
},
optionRowSeleccionada: {
  backgroundColor: isDark ? 'rgba(201,168,76,0.16)' : 'rgba(201,168,76,0.12)',
},
selectRowAbierto: {
  borderColor: '#C9A84C',
  borderWidth: 1.5,
},
  });
};

export default createStyles;