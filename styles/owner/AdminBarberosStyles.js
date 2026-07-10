import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 780;

  const LIST_ITEM_BG  = isDark ? '#1A2230' : '#FFFFFF';
  const SEARCH_BG     = isDark ? '#FFFFFF' : '#FFFFFF';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const MUTED_LIGHT   = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const ACTIVE_GREEN  = '#22C55E';
  const DANGER_RED    = '#EF4444';

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
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   SEARCH_BG,
      borderRadius:      26,
      paddingHorizontal: 18,
      paddingVertical:   Platform.OS === 'ios' ? 12 : 8,
      marginBottom:      22,
      ...(isWeb && { boxShadow: '0px 2px 10px rgba(0,0,0,0.12)' }),
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex:     1,
      fontSize: 14,
      fontWeight: '600',
      color:    '#1A1A1A',
      textAlign: 'center',
      ...(isWeb && { outlineStyle: 'none' }),
    },

    /* ── Encabezado del listado ── */
    listHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   14,
    },
    listHeaderTitle: {
      color:      WHITE,
      fontSize:   18,
      fontWeight: '800',
    },
    fab: {
      width:           38,
      height:          38,
      borderRadius:    19,
      backgroundColor: '#FFFFFF',
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
    listItemName: {
      color:        WHITE,
      fontSize:     15,
      fontWeight:   '700',
      marginBottom: 2,
    },
    listItemStatusRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           6,
    },
    listItemStatus: {
      color:      MUTED,
      fontSize:   12,
      fontWeight: '500',
    },
    statusDot: {
      width:        7,
      height:       7,
      borderRadius: 3.5,
    },
    statusDotActive: {
      backgroundColor: ACTIVE_GREEN,
    },
    statusDotInactive: {
      backgroundColor: DANGER_RED,
    },
    listItemActions: {
      flexDirection: 'row',
      gap:           16,
    },
    listItemActionBtn: {
      padding: 2,
    },

    /* ── Estado vacío ── */
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

    /* ── Modal: confirmar eliminar ── */
    modalOverlay: {
      flex:              1,
      backgroundColor:   'rgba(0,0,0,0.6)',
      justifyContent:    'center',
      alignItems:        'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      backgroundColor:   isDark ? '#1A2230' : '#FFFFFF',
      borderRadius:      20,
      paddingTop:        20,
      paddingBottom:     20,
      paddingHorizontal: 22,
      width:             '100%',
      maxWidth:          340,
      ...(isWeb && { boxShadow: isDark ? '0px 12px 32px rgba(0,0,0,0.5)' : '0px 12px 32px rgba(0,0,0,0.2)' }),
    },
    modalHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'center',
      marginBottom:   14,
      position:       'relative',
    },
    modalTitle: {
      color:      isDark ? '#FFFFFF' : '#1A1A1A',
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
      color:        isDark ? '#FFFFFF' : 'rgba(0,0,0,0.75)',
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
      flex:            1,
      backgroundColor: 'transparent',
      borderWidth:     1,
      borderColor:     isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
      borderRadius:    20,
      paddingVertical: 11,
      alignItems:      'center',
    },
    modalBtnCancelText: {
      color:      isDark ? '#FFFFFF' : '#1A1A1A',
      fontSize:   13,
      fontWeight: '600',
    },
    modalBtnConfirm: {
      flex:            1,
      backgroundColor: isDark ? '#FFFFFF' : '#1A1A1A',
      borderRadius:    20,
      paddingVertical: 11,
      alignItems:      'center',
    },
    modalBtnConfirmText: {
      color:      isDark ? '#1A1A1A' : '#FFFFFF',
      fontSize:   13,
      fontWeight: '700',
    },
  });
};

export default createStyles;