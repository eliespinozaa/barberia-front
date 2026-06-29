import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR       = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 780;

  const CARD_BG       = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const LIST_ITEM_BG  = isDark ? '#1A2230' : '#FFFFFF';
  const TAB_BG        = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const TAB_BG_ACTIVE = isDark ? 'rgba(255,255,255,0.16)' : '#1A1A1A';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const MUTED_LIGHT   = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const ACTIVE_GREEN  = '#22C55E';
  const DANGER_RED    = '#EF4444';
  const FAB_ICON      = isDark ? '#0B1014' : '#1A1A1A';

  return StyleSheet.create({
   container: {
  flex: 1,
  backgroundColor: theme.colors.background,   
},

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
  padding:        isSmall ? 16 : 28,
  paddingBottom:  40,
  alignItems:     'center',    
},
contentWrap: {
  width:    '100%',
  maxWidth: CONTENT_MAX_W,      
},

infoCard: {
  flexDirection:   isSmall ? 'column' : 'row',
  backgroundColor: CARD_BG,
  borderRadius:    18,
  padding:         isSmall ? 16 : 22,
  gap:             isSmall ? 18 : 24,
  marginBottom:    22,
  justifyContent:  'space-around',
  ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }),
},
infoColumn: {
  flex:       isSmall ? undefined : 1,
  alignItems: isSmall ? 'center' : 'flex-start',   
},
infoColumnTitle: {
  color:        WHITE,
  fontSize:     14,
  fontWeight:   '800',
  marginBottom: 10,
  letterSpacing: 0.3,
},
infoLine: {
  color:        WHITE,
  fontSize:     13,
  fontWeight:   '500',
  marginBottom: 6,
},


infoLineMuted: {
  color:    MUTED,
  fontSize: 13,
},
  estadoRow: {
  flexDirection: 'row',
  alignItems:    'center',
  flexWrap:      'wrap',
  gap:           4,
},
    statusDot: {
      width:        8,
      height:       8,
      borderRadius: 4,
      marginRight:  2,
    },
    statusDotActive: {
      backgroundColor: ACTIVE_GREEN,
    },
    statusDotInactive: {
      backgroundColor: DANGER_RED,
    },

   tabsRow: {
  flexDirection:  'row',
  flexWrap:       'wrap',
  justifyContent: 'center',   
  gap:            10,
  marginBottom:   24,
},
    tabPill: {
  backgroundColor:   TAB_BG,
  borderRadius:      20,
  paddingHorizontal: 18,
  paddingVertical:   9,
},
tabPillActive: {
  backgroundColor: TAB_BG_ACTIVE,
},
tabPillText: {
  color:      MUTED,
  fontSize:   14,
  fontWeight: '700',
},
tabPillTextActive: {
  color: isDark ? '#FFFFFF' : '#FFFFFF',   
  },

    /* ── Encabezado del listado ── */
    listHeader: {
  flexDirection:  'row',
  alignItems:     'center',
  justifyContent: 'flex-end',
  marginBottom:   14,
},

    listHeaderTitle: {
  color:      WHITE,
  fontSize:   18,
  fontWeight: '700',
},
fab: {
  width:           38,
  height:          38,
  borderRadius:    19,
  backgroundColor: isDark ? '#FFFFFF' : '#1A1A1A',
  justifyContent:  'center',
  alignItems:      'center',
  ...(isWeb
    ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.3)' }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
      }),
},

    /* ── Listado ── */
    listContainer: {
      gap: 12,
    },

listItem: {
  flexDirection:   'row',
  alignItems:      'center',
  backgroundColor: LIST_ITEM_BG,
  borderRadius:    16,
  padding:         14,
  gap:             14,
  ...(isWeb && { boxShadow: isDark ? '0px 2px 10px rgba(0,0,0,0.25)' : '0px 2px 10px rgba(0,0,0,0.08)' }),
},
listItemName: {
  color:        WHITE,
  fontSize:     15,
  fontWeight:   '700',
  marginBottom: 2,
},
listItemStatus: {
  color:    MUTED,
  fontSize: 12,
  fontWeight: '500',
},
listItemActionBtn: {
  padding: 2,
},

  
    listItemAvatar: {
      width:           44,
      height:          44,
      borderRadius:    22,
      backgroundColor: '#D9D9D9',
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
    },
    listItemAvatarImage: {
      width:  44,
      height: 44,
    },
    listItemInfo: {
      flex: 1,
    },
  
    
    listItemActions: {
      flexDirection: 'row',
      gap:           16,
    },
   

    emptyState: {
      alignItems:   'center',
      paddingVertical: 40,
    },
  emptyText: {
      color:     MUTED_LIGHT,
      fontSize:  13,
      fontWeight: '600',
      marginTop: 10,
      textAlign: 'center',
    },

    /* ── Modal: confirmar eliminar barbero ── */
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



    cardsRow: {
  gap:             14,
  paddingRight:    8,
  paddingVertical: 4,
},
serviceCard: {
  backgroundColor:   '#FFFFFF',
  borderRadius:      20,
  paddingVertical:   18,
  paddingHorizontal: 16,
  alignItems:        'center',
  width:             150,
  position:          'relative',
  ...(isWeb && { boxShadow: '0px 4px 14px rgba(0,0,0,0.18)' }),
},
serviceCardImage: {
  width:           64,
  height:          64,
  borderRadius:    16,
  backgroundColor: '#D9D9D9',
  justifyContent:  'center',
  alignItems:      'center',
  overflow:        'hidden',
  marginBottom:    12,
},
serviceCardImageImg: {
  width:  64,
  height: 64,
},
serviceCardName: {
  color:        '#1A1A1A',
  fontSize:     15,
  fontWeight:   '700',
  marginBottom: 4,
  textAlign:    'center',
},
serviceCardPrice: {
  color:        '#1A1A1A',
  fontSize:     14,
  fontWeight:   '700',
  marginBottom: 14,
},
serviceCardActions: {
  flexDirection: 'row',
  gap:           20,
},

serviceInfoBtn: {
  position: 'absolute',
  top:      8,
  right:    8,
  padding:  2,
  zIndex:   2,
},

carouselWrapper: {
  position: 'relative',
},
carouselArrow: {
  position:        'absolute',
  top:              '50%',
  marginTop:        -18,
  width:            36,
  height:           36,
  borderRadius:     18,
  backgroundColor:  '#FFFFFF',
  justifyContent:   'center',
  alignItems:       'center',
  zIndex:           5,
  ...(isWeb
    ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.25)', cursor: 'pointer' }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 4,
      }),
},
carouselArrowLeft: {
  left: -6,
},
carouselArrowRight: {
  right: -6,
},

    /* ── Sub-tabs dentro de Membresía ── */
  subTabsRow: {
  flexDirection:   'row',
  justifyContent:  'center',
  gap:             10,
  marginBottom:    16,
},
subTabsDivider: {
  height:           1,
  backgroundColor:  isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  marginBottom:     20,
  marginTop: -20,
},

membresiaSectionCard: {
  backgroundColor: CARD_BG,
  borderRadius:    18,
  padding:         isSmall ? 16 : 22,
  ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }),
},
    subTabPill: {
      backgroundColor:   TAB_BG,
      borderRadius:      20,
      paddingHorizontal: 16,
      paddingVertical:   8,
    },
    subTabPillActive: {
      backgroundColor: TAB_BG_ACTIVE,
    },
    subTabPillText: {
      color:      MUTED,
      fontSize:   13,
      fontWeight: '700',
    },
    subTabPillTextActive: {
      color: '#FFFFFF',
    },

    /* ── Card de membresía ── */
    membresiaCard: {
      alignItems: 'center',
      paddingVertical: 8,
    },
    membresiaCardTitle: {
      color:        WHITE,
      fontSize:     18,
      fontWeight:   '800',
      marginBottom: 18,
      letterSpacing: 0.3,
    },
    membresiaEstadoRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           8,
      marginBottom:  24,
    },
    membresiaEstadoText: {
      color:      WHITE,
      fontSize:   16,
      fontWeight: '700',
    },
    membresiaFechaBlock: {
      alignItems:   'center',
      marginBottom: 18,
    },
    membresiaFechaLabel: {
      color:        WHITE,
      fontSize:     15,
      fontWeight:   '700',
      marginBottom: 4,
    },
    membresiaFechaValor: {
      color:    MUTED,
      fontSize: 14,
      fontWeight: '500',
    },
    membresiaPrecio: {
      color:        WHITE,
      fontSize:     17,
      fontWeight:   '800',
      marginVertical: 14,
    },

    membresiaActions: {
  flexDirection: 'row',
  gap:           14,
  marginTop:     10,
  justifyContent: 'center',
  flexWrap:      'wrap',
},
membresiaBtnSuspender: {
  backgroundColor:   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  borderRadius:      20,
  paddingVertical:   10,
  paddingHorizontal: 18,
  alignItems:        'center',
},
membresiaBtnReactivar: {
  backgroundColor:   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  borderRadius:      20,
  paddingVertical:   10,
  paddingHorizontal: 18,
  alignItems:        'center',
},
membresiaBtnText: {
  color:      WHITE,
  fontSize:   13,
  fontWeight: '700',
},
/* ── Historial de pagos ── */
    pagosListContainer: {
      gap: 0,
    },
    pagosGrupoTitulo: {
      color:        WHITE,
      fontSize:     15,
      fontWeight:   '700',
      marginBottom: 10,
      marginTop:    4,
    },
    pagosGrupoLista: {
      gap:          12,
      marginBottom: 22,
    },
    pagoItem: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'space-between',
      backgroundColor: LIST_ITEM_BG,
      borderRadius:    16,
      paddingVertical:   14,
      paddingHorizontal: 18,
      ...(isWeb && { boxShadow: isDark ? '0px 2px 10px rgba(0,0,0,0.25)' : '0px 2px 10px rgba(0,0,0,0.08)' }),
    },
    pagoItemFecha: {
      flex:       1,
      color:      WHITE,
      fontSize:   15,
      fontWeight: '700',
    },
    pagoItemCentro: {
      flex:       1,
      alignItems: 'center',
    },
    pagoItemMonto: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '700',
    },
    pagoItemEstado: {
      flex:       1,
      fontSize:   13,
      fontWeight: '500',
      textAlign:  'right',
    },
    pagoItemEstadoPagado: {
      color: MUTED,
    },
    pagoItemEstadoPendiente: {
      color: MUTED,
    },
    pagoItemEstadoVencido: {
      color: DANGER_RED,
    },
    pagoBtnRegistrar: {
      backgroundColor:   isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
      borderRadius:      16,
      paddingVertical:   8,
      paddingHorizontal: 16,
    },
    pagoBtnRegistrarText: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '700',
    },
  });
};

export default createStyles;