import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR    = '#0B1014';
  const PANEL_BG  = isDark ? 'rgba(78,80,77,0.23)' : '#FFFFFF';
  const INPUT_BG  = '#FFFFFF';
  const AVATAR_BG = '#D9D9D9';
  const WHITE     = isDark ? '#FFFFFF' : '#1A1A1A';

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
      justifyContent:  'center',
      alignItems:      'center',
    },
    headerPill: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingHorizontal: 32,
      paddingVertical:   10,
    },
    headerTitle: {
      color:      '#1A1A1A',
      fontSize:   isSmall ? 16 : 18,
      fontWeight: '700',
    },

    /* ── Body / scroll ── */
    body: {
      flex: 1,
    },
    bodyInner: {
      padding:       isSmall ? 16 : 28,
      paddingBottom: 40,
      alignItems:    'center',
    },

    /* ── Avatar selector ── */
    avatarWrapper: {
      alignItems:   'center',
      marginBottom: 28,
    },
    avatarCircle: {
      width:           80,
      height:          80,
      borderRadius:    40,
      backgroundColor: AVATAR_BG,
      justifyContent:  'center',
      alignItems:      'center',
      marginBottom:    8,
      overflow:        'hidden',
    },
    avatarImage: {
      width:  80,
      height: 80,
    },
    avatarLabel: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '600',
    },

    /* ── Panel del formulario ── */
    formPanel: {
      backgroundColor:   PANEL_BG,
      borderRadius:      28,
      padding:           isSmall ? 20 : 28,
      width:             '100%',
      maxWidth:          560,
      ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.25)' }),
    },
    formRow: {
      flexDirection: isSmall ? 'column' : 'row',
      gap:           isSmall ? 0 : 24,
    },
    formField: {
      flex:         1,
      marginBottom: 18,
    },
    fieldLabel: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '600',
      marginBottom: 8,
    },
    textInput: {
      backgroundColor:   INPUT_BG,
      borderRadius:      50,
      paddingHorizontal: 16,
      paddingVertical:   Platform.OS === 'ios' ? 14 : 11,
      color:             '#1A1A1A',
      fontSize:          14,
      fontWeight:        '500',
      ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },

    /* ── Selector de propietario (placeholder, sin lista real) ── */
    selectInput: {
      backgroundColor:   INPUT_BG,
      borderRadius:      50,
      paddingHorizontal: 16,
      paddingVertical:   Platform.OS === 'ios' ? 14 : 11,
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
    },
    selectInputText: {
      color:      '#1A1A1A',
      fontSize:   14,
      fontWeight: '500',
    },

    /* ── Estatus (switch) ── */
    statusRow: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: 4,
      paddingVertical:   8,
    },
    statusLabel: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '600',
    },

    /* ── Botón Crear/Actualizar ── */
    submitBtn: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingVertical:   14,
      paddingHorizontal: 40,
      alignItems:        'center',
      alignSelf:         'center',
      marginTop:         10,
    },
    submitBtnText: {
      color:      '#1A1A1A',
      fontSize:   15,
      fontWeight: '700',
    },
  });
};

export const getPlaceholderColor = () => 'rgba(0,0,0,0.35)';

export default createStyles;