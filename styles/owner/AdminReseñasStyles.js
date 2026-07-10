import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 780;

  const CARD_BG       = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const LIST_ITEM_BG  = isDark ? '#1A2230' : '#FFFFFF';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const MUTED_LIGHT   = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const TRACK_BG       = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const STAR_MUTED     = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)';

  const shadowCard = isWeb
    ? { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      };

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

    sectionTitle: {
      color:         WHITE,
      fontSize:      18,
      fontWeight:    '800',
      marginBottom:  14,
    },

    /* ── Card resumen ── */
    summaryCard: {
      backgroundColor: CARD_BG,
      borderRadius:    18,
      padding:         isSmall ? 18 : 22,
      marginBottom:    28,
      ...shadowCard,
    },
    summaryHeaderRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           10,
      marginBottom:  4,
    },
    summaryRating: {
      color:      WHITE,
      fontSize:   28,
      fontWeight: '800',
    },
    summaryCount: {
      color:        MUTED,
      fontSize:     14,
      fontWeight:   '500',
      marginBottom: 18,
    },

    breakdownList: {
      gap: 10,
    },
    breakdownRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           8,
    },
    breakdownNumber: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '700',
      width:      12,
    },
    breakdownStarColor: {
      color: STAR_MUTED,
    },
    breakdownTrack: {
      flex:            1,
      height:          6,
      borderRadius:    3,
      backgroundColor: TRACK_BG,
      overflow:        'hidden',
    },
    breakdownFill: {
      height:          '100%',
      borderRadius:    3,
      backgroundColor: STAR_MUTED,
    },
    breakdownPercent: {
      color:      MUTED,
      fontSize:   13,
      fontWeight: '600',
      width:      36,
      textAlign:  'right',
    },

    /* ── Encabezado de últimas reseñas ── */
    reviewsHeaderRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   14,
    },
    verTodasBtn: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      20,
      paddingHorizontal: 16,
      paddingVertical:   8,
    },
    verTodasBtnText: {
      color:      '#1A1A1A',
      fontSize:   13,
      fontWeight: '700',
    },

    /* ── Grid de reseñas ── */
    reviewsGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           14,
    },
    reviewCard: {
      flexBasis:         isSmall ? '100%' : '48%',
      flexGrow:          1,
      backgroundColor:   LIST_ITEM_BG,
      borderRadius:      18,
      paddingVertical:   20,
      paddingHorizontal: 18,
      alignItems:        'center',
      ...shadowCard,
    },
    reviewCardName: {
      color:        WHITE,
      fontSize:     16,
      fontWeight:   '800',
      marginBottom: 8,
      textAlign:    'center',
    },
    starsRow: {
      flexDirection: 'row',
      gap:           4,
      marginBottom:  12,
    },
    reviewCardQuote: {
      color:        MUTED,
      fontSize:     13,
      fontWeight:   '500',
      textAlign:    'center',
      marginBottom: 18,
    },
    reviewCardDate: {
      color:      MUTED_LIGHT,
      fontSize:   12,
      fontWeight: '600',
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
  });
};

export default createStyles;