import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 900;
  const CARD_BG       = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const ROW_BG        = isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const BORDER        = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const DROPDOWN_BG           = isDark ? '#1B212F' : '#FFFFFF';
const DROPDOWN_ITEM_ACTIVE  = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
const DROPDOWN_TEXT         = isDark ? '#FFFFFF' : '#1A1A1A';

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

    /* ── Stats ── */
    statsCard: {
      flexDirection:   isSmall ? 'column' : 'row',
      backgroundColor: CARD_BG,
      borderRadius:    18,
      padding:         isSmall ? 16 : 22,
      marginBottom:    20,
      gap:             isSmall ? 16 : 0,
      ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }),
    },
    statItem: {
      flex:       isSmall ? undefined : 1,
      alignItems: 'center',
    },
    statDivider: {
      width:           isSmall ? '100%' : 1,
      height:          isSmall ? 1 : '100%',
      backgroundColor: BORDER,
    },
    statLabel: {
      color:         WHITE,
      fontSize:      12,
      fontWeight:    '800',
      letterSpacing: 0.4,
      marginBottom:  6,
    },
    statValue: {
      color:      WHITE,
      fontSize:   20,
      fontWeight: '800',
    },

    /* ── Filtro ── */
    filtroRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           10,
      marginBottom:  18,
    },
    filtroLabel: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '700',
    },
    filtroDropdown: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   '#FFFFFF',
      borderRadius:      10,
      paddingHorizontal: 14,
      paddingVertical:   8,
      gap:               6,
    },
    filtroDropdownText: {
      color:      '#1A1A1A',
      fontSize:   13,
      fontWeight: '600',
    },

    /* ── Tabla ── */
    tableHeader: {
      flexDirection:     'row',
      backgroundColor:   CARD_BG,
      borderRadius:      14,
      paddingVertical:   14,
      paddingHorizontal: 18,
      marginBottom:      4,
    },
    tableHeaderText: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '800',
    },
    tableBody: {
      backgroundColor: CARD_BG,
      borderRadius:    14,
      overflow:        'hidden',
    },
    tableRow: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   16,
      paddingHorizontal: 18,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
      backgroundColor:   ROW_BG,
    },
    tableRowLast: {
      borderBottomWidth: 0,
    },
    cellText: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '600',
    },

    colBarberia: {
      flex: isSmall ? 1.2 : 1.4,
    },
    colEstado: {
      flex: 1,
    },
    colVencimiento: {
      flex: 1,
    },
    colAcciones: {
      flex:           0.6,
      alignItems:     'flex-end',
    },

    /* ── Badges de estado ── */
    badge: {
      alignSelf:         'flex-start',
      borderRadius:      14,
      paddingHorizontal: 14,
      paddingVertical:   5,
    },
    badgeText: {
      color:      '#1A1A1A',
      fontSize:   12,
      fontWeight: '800',
    },
    badgeActivo: {
      backgroundColor: '#86EFAC',
    },
    badgePorVencer: {
      backgroundColor: '#FCD34D',
    },
    badgeVencida: {
      backgroundColor: '#FCA5A5',
    },

    /* ── Estado vacío ── */
    emptyState: {
      alignItems:      'center',
      paddingVertical: 36,
    },
    emptyText: {
      color:      MUTED,
      fontSize:   13,
      fontWeight: '600',
      marginTop:  10,
    },

    /* ── Paginación ── */
    paginationWrap: {
      alignItems:   'center',
      marginTop:    22,
    },
    paginationInfo: {
      color:        MUTED,
      fontSize:     12,
      fontWeight:   '600',
      marginBottom: 12,
    },
    paginationRow: {
      flexDirection: 'row',
      alignItems:    'center',
      flexWrap:      'wrap',
      justifyContent: 'center',
      gap:           8,
    },
    pageArrow: {
      width:           28,
      height:          28,
      borderRadius:    14,
      backgroundColor: CARD_BG,
      justifyContent:  'center',
      alignItems:      'center',
    },
    pageNumber: {
      width:           28,
      height:          28,
      borderRadius:    14,
      justifyContent:  'center',
      alignItems:      'center',
    },
    pageNumberActive: {
      backgroundColor: '#FFFFFF',
    },
    pageNumberText: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '700',
    },
    pageNumberTextActive: {
      color: '#1A1A1A',
    },


/* ── Dropdown filtro ── */
    dropOverlay: {
  flex:            1,
  backgroundColor: 'transparent',
},


    dropdownOverlay: {
  flex:            1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent:  'center',
  alignItems:      'center',
},dropdownMenu: {
  position:        'absolute',
  top:             44,
  left:            0,
  backgroundColor: '#1B212F',
  borderRadius:    14,
  padding:         8,
  minWidth:        160,
  zIndex:          99,
  ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.4)' }),
},
dropdownItem: {
  paddingHorizontal: 16,
  paddingVertical:   11,
  borderRadius:      10,
},
dropdownItemActive: {
  backgroundColor: 'rgba(255,255,255,0.1)',
},
dropdownItemText: {
  color:      '#FFFFFF',
  fontSize:   14,
  fontWeight: '500',
},
dropdownItemTextActive: {
  color:      '#FFFFFF',
  fontWeight: '700',
},

dropMenu: {
  backgroundColor: DROPDOWN_BG,
  borderRadius:    14,
  padding:         8,
  minWidth:        160,
  ...(isWeb && { boxShadow: isDark ? '0px 8px 24px rgba(0,0,0,0.4)' : '0px 8px 24px rgba(0,0,0,0.15)' }),
},
    dropItem: {
      paddingHorizontal: 16,
      paddingVertical:   11,
      borderRadius:      10,
    },
    dropItemActive: {
      backgroundColor: DROPDOWN_ITEM_ACTIVE,
    },
    dropItemText: {
      color:      DROPDOWN_TEXT,
      fontSize:   14,
      fontWeight: '500',
    },
    dropItemTextActive: {
      color:      DROPDOWN_TEXT,
      fontWeight: '700',
    },
  });
};

export default createStyles;