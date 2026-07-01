import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 780;

  const CARD_BG        = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const LIST_ITEM_BG   = isDark ? '#1A2230' : '#FFFFFF';
  const TAB_BG         = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const TAB_BG_ACTIVE  = isDark ? 'rgba(255,255,255,0.16)' : '#1A1A1A';
  const WHITE          = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED          = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const MUTED_LIGHT    = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const SEARCH_BG      = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

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

    /* ── Buscador ── */
    searchBox: {
      flexDirection:   'row',
      alignItems:      'center',
      backgroundColor: SEARCH_BG,
      borderRadius:    14,
      paddingHorizontal: 14,
      height:          46,
      marginBottom:    18,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex:       1,
      color:      WHITE,
      fontSize:   isSmall ? 14 : 15,
      fontWeight: '600',
    },

    /* ── Tabs ── */
    tabsRow: {
      flexDirection:  'row',
      flexWrap:       'wrap',
      justifyContent: 'center',
      gap:            10,
      marginBottom:   22,
    },
    tabPill: {
      flexGrow:          1,
      backgroundColor:   TAB_BG,
      borderRadius:      20,
      paddingHorizontal: 18,
      paddingVertical:   10,
      alignItems:        'center',
    },
    tabPillActive: {
      backgroundColor: TAB_BG_ACTIVE,
    },
    tabPillText: {
      color:      MUTED,
      fontSize:   13,
      fontWeight: '700',
    },
    tabPillTextActive: {
      color: '#FFFFFF',
    },

    /* ── Sección ── */
    sectionLabel: {
      color:         MUTED,
      fontSize:      12,
      fontWeight:    '700',
      letterSpacing: 0.5,
      marginBottom:  12,
    },

    /* ── Lista ── */
    listContainer: {
      gap: 12,
    },
    emptyState: {
      alignItems:      'center',
      paddingVertical: 40,
    },
    emptyText: {
      color:      MUTED_LIGHT,
      fontSize:   13,
      fontWeight: '600',
      marginTop:  10,
      textAlign:  'center',
    },

    /* ── Card de cliente ── */
    card: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      backgroundColor:   LIST_ITEM_BG,
      borderRadius:      16,
      paddingVertical:   14,
      paddingHorizontal: 16,
      ...(isWeb
        ? { boxShadow: isDark ? '0px 2px 10px rgba(0,0,0,0.25)' : '0px 2px 10px rgba(0,0,0,0.08)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.25 : 0.08,
            shadowRadius: 6,
            elevation: 3,
          }),
    },
    cardInfo: {
      flex: 1,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems:    'center',
      marginBottom:  4,
    },
    cardIcon: {
      marginRight: 8,
      width:       16,
    },
    cardNombre: {
      color:      WHITE,
      fontSize:   isSmall ? 15 : 16,
      fontWeight: '700',
    },
    cardTexto: {
      color:      MUTED,
      fontSize:   isSmall ? 12 : 13,
      fontWeight: '500',
    },
    cardBadge: {
      color:      WHITE,
      fontSize:   isSmall ? 12 : 13,
      fontWeight: '700',
    },

    /* ── Modal: detalle de cliente ── */
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
      paddingTop:        26,
      paddingBottom:     26,
      paddingHorizontal: 22,
      width:             '100%',
      maxWidth:          340,
      alignItems:        'center',
      position:          'relative',
      ...(isWeb
        ? { boxShadow: '0px 12px 32px rgba(0,0,0,0.5)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 14,
            elevation: 8,
          }),
    },
    modalCloseBtn: {
      position: 'absolute',
      right:    16,
      top:      16,
      padding:  4,
      zIndex:   2,
    },
    modalTitle: {
      color:        '#FFFFFF',
      fontSize:     18,
      fontWeight:   '800',
      textAlign:    'center',
      marginBottom: 14,
    },
    modalInfoLine: {
      color:        'rgba(255,255,255,0.8)',
      fontSize:     13,
      fontWeight:   '500',
      textAlign:    'center',
      marginBottom: 6,
    },
    modalSubtitle: {
      color:      '#FFFFFF',
      fontSize:   15,
      fontWeight: '800',
      textAlign:  'center',
      marginTop:  14,
    },
    modalHistorialTitle: {
      marginBottom: 12,
    },
    modalHistorialList: {
      alignSelf: 'stretch',
      gap:       8,
    },
    modalHistorialItem: {
      flexDirection: 'row',
      alignItems:    'center',
      justifyContent: 'center',
      gap:           8,
    },
    modalHistorialDot: {
      width:           5,
      height:          5,
      borderRadius:    2.5,
      backgroundColor: 'rgba(255,255,255,0.8)',
    },
    modalHistorialText: {
      color:      'rgba(255,255,255,0.85)',
      fontSize:   14,
      fontWeight: '500',
    },
  });
};

export default createStyles;