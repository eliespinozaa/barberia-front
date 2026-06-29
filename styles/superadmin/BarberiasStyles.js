import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR     = '#0B1014';
  const CARD_BG    = isDark ? 'rgba(78,80,77,0.23)' : '#FFFFFF';
  const INPUT_BG   = '#FFFFFF';
  const PILL_BG    = '#FFFFFF';
  const AVATAR_BG  = '#D9D9D9';
  const ICON_BTN_BG = '#FFFFFF';
  const WHITE      = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED      = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const ACTIVE_GREEN = '#22C55E';
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

    /* ── Body / scroll ── */
    body: {
      flex: 1,
    },
    bodyInner: {
      padding:       isSmall ? 16 : 28,
      paddingBottom: 40,
    },

    /* ── Buscador ── */
    searchBar: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   INPUT_BG,
      borderRadius:      28,
      paddingHorizontal: 18,
      paddingVertical:   Platform.OS === 'ios' ? 14 : 10,
      marginBottom:      18,
      gap:               10,
      ...(isWeb && { boxShadow: '0px 2px 10px rgba(0,0,0,0.08)' }),
    },
    searchIcon: {
      marginRight: 2,
    },
    searchInput: {
      flex:     1,
      color:    '#1A1A1A',
      fontSize: 15,
      fontWeight: '600',
      paddingVertical: 0,
      ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },

   filtersRow: {
  flexDirection: isSmall ? 'column' : 'row',  
  flexWrap:      isSmall ? 'nowrap' : 'wrap',
  width:         '100%',                        
  gap:           isSmall ? 10 : 16,
  marginBottom:  22,
  alignItems:    isSmall ? 'stretch' : 'center', 
  zIndex:        1,
},
filtersRowOpen: {
  zIndex:    999,          
  elevation: 20,            
},
    filterGroup: {
  flexDirection: 'row',
  alignItems:    'center',
  gap:           8,
},
    filterLabel: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '600',
    },
  filterPill: {
  flexDirection:     'row',
  alignItems:        'center',
  justifyContent:    isSmall ? 'space-between' : 'flex-start',  
  backgroundColor:   '#FFFFFF',
  borderRadius:      18,
  paddingHorizontal: 14,
  paddingVertical:   7,
  gap:               6,
  flex:              isSmall ? 1 : undefined, 
},
    filterPillText: {
      color:      '#1A1A1A',
      fontSize:   13,
      fontWeight: '600',
    },

    /* ── Lista de barberías ── */
    listGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           16,
    },
    card: {
      backgroundColor:   CARD_BG,
      borderRadius:      22,
      padding:           20,
      alignItems:        'center',
      flexGrow:          1,
      minWidth:          isSmall ? '100%' : 220,
      maxWidth:          isSmall ? '100%' : 300,
      ...(isWeb && { boxShadow: '0px 4px 14px rgba(0,0,0,0.18)' }),
    },
    cardAvatar: {
      width:           64,
      height:          64,
      borderRadius:    32,
      backgroundColor: AVATAR_BG,
      marginBottom:    12,
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
    },
    cardAvatarImage: {
      width:  64,
      height: 64,
    },
    cardName: {
      color:        WHITE,
      fontSize:     16,
      fontWeight:   '700',
      marginBottom: 10,
      textAlign:    'center',
    },
    cardInfoRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           6,
      marginBottom:  4,
    },
    cardInfoText: {
      color:    WHITE,
      fontSize: 13,
      fontWeight: '500',
    },
    statusDot: {
      width:        8,
      height:       8,
      borderRadius: 4,
      backgroundColor: ACTIVE_GREEN,
    },
    statusDotInactive: {
      backgroundColor: DANGER_RED,
    },

   /* ── Acciones de la card ── */
    cardActions: {
      flexDirection: 'row',
      gap:           22,
      marginTop:     16,
    },
    cardActionBtn: {
      width:           36,
      height:          36,
      justifyContent:  'center',
      alignItems:      'center',
    },

    /* ── Fila del botón agregar ── */
    addButtonRow: {
      alignItems:   'flex-end',
      marginBottom: 20,
    },

    /* ── Botón agregar barbería ── */
    fab: {
      width:           54,
      height:          54,
      borderRadius:    27,
      backgroundColor: '#FFFFFF',
      justifyContent:  'center',
      alignItems:      'center',
      ...(isWeb
        ? { boxShadow: '0px 6px 18px rgba(0,0,0,0.35)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }),
    },

    /* ── Estado vacío ── */
    emptyState: {
      alignItems:   'center',
      paddingTop:   60,
    },
    emptyText: {
      color:      MUTED,
      fontSize:   14,
      fontWeight: '600',
      marginTop:  10,
    },

    /* ── Dropdowns de filtro (reutiliza patrón del dropdown del Home) ── */
    dropdownMenu: {
      position:        'absolute',
       top:             '100%', 
      backgroundColor: '#0B1014',
      borderRadius:    12,
      paddingVertical: 6,
      minWidth:        140,
      zIndex:          999,
      borderWidth:     1,
      borderColor:     'rgba(255,255,255,0.08)',
      ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.5)' }),
    },
    dropdownMenuItem: {
      paddingVertical:   10,
      paddingHorizontal: 16,
    },
    dropdownMenuItemText: {
      color:    '#FFFFFF',
      fontSize: 13,
      fontWeight: '500',
    },

    /* ── Modal: confirmar inactivar ── */
    modalOverlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent:  'center',
      alignItems:      'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      backgroundColor:   '#1A2230',
      borderRadius:      20,
      paddingTop:        20,
      paddingBottom:     20,
      paddingHorizontal: 22,
      width:             '100%',
      maxWidth:          340,
      ...(isWeb && { boxShadow: '0px 12px 32px rgba(0,0,0,0.5)' }),
    },
    modalHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'center',
      marginBottom:   14,
      position:       'relative',
    },
    modalTitle: {
      color:      '#FFFFFF',
      fontSize:   15,
      fontWeight: '700',
    },
    modalCloseBtn: {
      position: 'absolute',
      right:    0,
      top:      -2,
      padding:  4,
    },
    modalMessage: {
      color:        '#FFFFFF',
      fontSize:     14,
      fontWeight:   '500',
      textAlign:    'center',
      lineHeight:   20,
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: 'row',
      gap:           12,
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
    dropdownMenuInline: {
  backgroundColor: '#0B1014',
  borderRadius:    12,
  paddingVertical: 6,
  marginBottom:    18,
  borderWidth:     1,
  borderColor:     'rgba(255,255,255,0.08)',
  ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.5)' }),
},
filterGroup: {
  flexDirection: 'row',
  alignItems:    'center',
  gap:           8,
  width:         isSmall ? '100%' : 'auto',    
  justifyContent: isSmall ? 'space-between' : 'flex-start',
},
filterGroupOpen: {
  zIndex:    999,           // entre los 3 pills entre sí
  elevation: 20,
},
  });
};

export const getPlaceholderColor = (theme) => {
  const isDark = theme.mode === 'dark';
  return isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
};

export const getIconColor = (theme) => {
  const isDark = theme.mode === 'dark';
  return isDark ? '#FFFFFF' : '#1A1A1A';
};

export default createStyles;