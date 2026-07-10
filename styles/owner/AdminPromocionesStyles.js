import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isMedium = width >= 768 && width < 1100;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 1000;

  const STATS_BG      = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const CARD_BG       = isDark ? '#1A2230' : '#FFFFFF';
  const AVATAR_BG     = isDark ? 'rgba(255,255,255,0.12)' : '#D9D9D9';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  const MUTED_LIGHT   = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const ACTIVE_GREEN  = '#22C55E';
  const DANGER_RED    = '#EF4444';

  const CARD_WIDTH = isSmall ? '100%' : isMedium ? '48%' : '31.5%';

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

    /* ── Barra de estadísticas ── */
    statsBar: {
      flexDirection:   isSmall ? 'column' : 'row',
      backgroundColor: STATS_BG,
      borderRadius:    20,
      paddingVertical: isSmall ? 14 : 18,
      marginBottom:    26,
      ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.08)' }),
    },
    statItem: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      paddingVertical: isSmall ? 10 : 0,
    },
    statValue: {
      color:      WHITE,
      fontSize:   26,
      fontWeight: '800',
      marginBottom: 2,
    },
    statLabel: {
      color:      MUTED,
      fontSize:   13,
      fontWeight: '600',
    },

    /* ── Encabezado del listado ── */
    listHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   16,
    },
    listHeaderTitle: {
      color:      WHITE,
      fontSize:   19,
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

    /* ── Grid de tarjetas ── */
    cardsGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           16,
    },
    promoCard: {
      width:             CARD_WIDTH,
      backgroundColor:   CARD_BG,
      borderRadius:      20,
      paddingVertical:   20,
      paddingHorizontal: 16,
      alignItems:        'center',
      ...(isWeb && { boxShadow: isDark ? '0px 2px 10px rgba(0,0,0,0.25)' : '0px 2px 10px rgba(0,0,0,0.08)' }),
    },
    promoAvatar: {
      width:           64,
      height:          64,
      borderRadius:    32,
      backgroundColor: AVATAR_BG,
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
      marginBottom:    14,
    },
    promoAvatarImage: {
      width:  64,
      height: 64,
    },
    promoTitulo: {
      color:        WHITE,
      fontSize:     17,
      fontWeight:   '800',
      textAlign:    'center',
      marginBottom: 8,
    },
    promoDetalle: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '600',
      textAlign:    'center',
      marginBottom: 10,
    },
    promoVigenciaLabel: {
      color:        MUTED,
      fontSize:     12,
      fontWeight:   '700',
      textAlign:    'center',
    },
    promoVigenciaFechas: {
      color:        MUTED,
      fontSize:     13,
      fontWeight:   '600',
      textAlign:    'center',
      marginBottom: 10,
    },
    promoEstadoRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           6,
      marginBottom:  14,
    },
    statusDot: {
      width:        9,
      height:       9,
      borderRadius: 4.5,
    },
    statusDotActive: {
      backgroundColor: ACTIVE_GREEN,
    },
    statusDotInactive: {
      backgroundColor: DANGER_RED,
    },
    promoEstadoText: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '700',
    },
    promoActions: {
      flexDirection: 'row',
      gap:           22,
    },

    /* ── Estado vacío ── */
    emptyState: {
      alignItems:      'center',
      paddingVertical: 40,
      width:           '100%',
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