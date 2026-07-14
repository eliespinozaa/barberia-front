import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 700;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = theme.colors.navBackground;
  const BG            = theme.colors.background;
  const WHITE         = theme.colors.text;
  const MUTED         = theme.colors.textMuted;
  const BORDER        = theme.colors.border;
  const CONTENT_MAX_W = isSmall ? '100%' : 1100;

  const CARD_BG        = isDark ? '#FFFFFF' : '#FFFFFF';
  const CARD_TEXT      = isDark ? '#000000' : '#1A1A1A';
  const CARD_TEXT_MUTED = isDark ? '#000000' : '#6B7280';
  const HEADER_ROW_BG  = isDark ? '#B9B9B9' : '#B9B9B9';
  const ROW_BORDER     = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const ICON_BTN_BG    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

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

    /* ── Barra de título + back + agregar ── */
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
    addBtn: {
      position:        'absolute',
      right:           isSmall ? 16 : 28,
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.35)',
      justifyContent:  'center',
      alignItems:      'center',
    },

    /* ── Body ── */
    bodyInner: {
      padding:       isSmall ? 16 : 28,
      paddingTop:    isSmall ? 4 : 8,
      paddingBottom: 60,
      alignItems:    'center',
    },
    contentWrap: {
      width:    '100%',
      maxWidth: CONTENT_MAX_W,
    },

    /* ── Header de tabla, separado (solo web/escritorio) ── */
    headerRow: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   HEADER_ROW_BG,
      borderRadius:      999,
      paddingVertical:   20,
      paddingHorizontal: 20,
      marginBottom:      14,
    },
    headerCell: {
      color:      CARD_TEXT,
      fontSize:   18,
      fontWeight: '800',
    },

    /* ── Tarjeta de tabla */
    tableCard: {
      backgroundColor: CARD_BG,
      borderRadius:    20,
      padding:         isSmall ? 14 : 20,
      ...(isWeb
        ? { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.5)' : '0px 4px 14px rgba(0,0,0,0.18)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.15,
            shadowRadius: 10,
            elevation: 4,
          }),
    },

    /* ── Columnas (compartidas header/datos, escritorio) ── */
    colBarbero:  { flex: 1.3 },
    colServicio: { flex: 1.3 },
    colFecha:    { flex: 1 },
    colHora:     { flex: 0.7 },
    colEstatus:  { flex: 1.1, alignItems: 'flex-start' },
    colAcciones: { flex: 1, alignItems: 'flex-end' },

    /* ── Fila de datos (escritorio) ── */
    dataRow: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: ROW_BORDER,
    },
    dataCell: {
      color:      CARD_TEXT,
      fontSize:   14,
      fontWeight: '600',
    },

    /* ── Badge de estado ── */
    badge: {
      alignSelf:         'flex-start',
      borderRadius:      999,
      paddingVertical:   6,
      paddingHorizontal: 16,
    },
    badgeTexto: {
      fontSize:   13,
      fontWeight: '800',
    },

    /* ── Acciones (íconos) ── */
    accionesRow: {
      flexDirection: 'row',
      gap:           10,
    },
    iconBtn: {
      width:           32,
      height:          32,
      borderRadius:    16,
      backgroundColor: ICON_BTN_BG,
      justifyContent:  'center',
      alignItems:      'center',
    },
    resenaBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      gap:               6,
      backgroundColor:   isDark ? 'rgba(184,134,11,0.18)' : '#F7E3B5',
      borderRadius:      999,
      paddingVertical:   7,
      paddingHorizontal: 14,
      alignSelf:         isSmall ? 'flex-start' : 'flex-end',
    },
    resenaBtnTexto: {
      color:      CARD_TEXT,
      fontSize:   12,
      fontWeight: '800',
    },

   /* ── Cards móviles ── */
    mobileCard: {
      backgroundColor:   isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius:      16,
      padding:           16,
      marginBottom:      12,
      borderWidth:       1,
      borderColor:       ROW_BORDER,
      ...(isWeb
        ? { boxShadow: isDark ? '0px 3px 10px rgba(0,0,0,0.45)' : '0px 3px 10px rgba(0,0,0,0.15)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: isDark ? 0.35 : 0.12,
            shadowRadius: 8,
            elevation: 3,
          }),
    },
    mobileCardHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   8,
    },
    mobileCardBarbero: {
      color:      CARD_TEXT,
      fontSize:   15,
      fontWeight: '800',
      flexShrink: 1,
      marginRight: 10,
    },
    mobileCardServicio: {
      color:        CARD_TEXT_MUTED,
      fontSize:     13,
      fontWeight:   '600',
      marginBottom: 10,
    },
    mobileCardFila: {
      flexDirection:  'row',
      justifyContent: 'space-between',
      marginBottom:   12,
    },
    mobileCardDato: {
      color:      CARD_TEXT,
      fontSize:   13,
      fontWeight: '700',
    },
    mobileCardAcciones: {
      flexDirection:  'row',
      justifyContent: 'flex-end',
    },

    /* ── Estado vacío ── */
    emptyState: {
      alignItems:      'center',
      paddingVertical: 60,
    },
    emptyText: {
      color:      MUTED,
      fontSize:   14,
      fontWeight: '600',
      marginTop:  10,
      textAlign:  'center',
    },

    /* ── Paginación ── */
    paginacionWrap: {
      marginTop:       18,
      paddingTop:      16,
      borderTopWidth:  1,
      borderTopColor:  ROW_BORDER,
      alignItems:      'center',
    },
    paginacionTexto: {
      color:        CARD_TEXT_MUTED,
      fontSize:     12,
      fontWeight:   '700',
      marginBottom: 12,
      textAlign:    'center',
    },
    paginacionBotones: {
      flexDirection: 'row',
      alignItems:    'center',
      flexWrap:      'wrap',
      justifyContent: 'center',
      gap:           6,
    },
    paginaNavBtn: {
      width:           26,
      height:          26,
      justifyContent:  'center',
      alignItems:      'center',
    },
    paginaDots: {
      color:      CARD_TEXT_MUTED,
      fontSize:   14,
      fontWeight: '700',
      marginHorizontal: 2,
    },
    paginaNum: {
      width:           26,
      height:          26,
      borderRadius:    13,
      justifyContent:  'center',
      alignItems:      'center',
    },
    paginaNumActiva: {
      backgroundColor: CARD_TEXT,
    },
    paginaNumTexto: {
      color:      CARD_TEXT,
      fontSize:   13,
      fontWeight: '700',
    },
    paginaNumTextoActiva: {
      color: CARD_BG,
    },

   

    /* ── Overlay de confirmación (cancelar cita) ── */
    confirmOverlay: {
      position:        'absolute',
      top:             0,
      left:            0,
      right:           0,
      bottom:          0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent:  'center',
      alignItems:      'center',
      paddingHorizontal: 24,
    },
  confirmCard: {
      backgroundColor: '#D9D9D9',
      borderRadius:    20,
      paddingVertical:   30,
      paddingHorizontal: 26,
      width:           isSmall ? '90%' : 340,
      alignItems:      'center',
    },
    confirmTitulo: {
      color:        '#1A1A1A',
      fontSize:     17,
      fontWeight:   '800',
      marginBottom: 32,
      textAlign:    'center',
      lineHeight:   23,
    },
    confirmBotones: {
      flexDirection:  'row',
      justifyContent: 'center',
      gap:            28,
      marginTop:      6,
    },
    confirmBtnNo: {
      borderRadius:      20,
      paddingVertical:   10,
      paddingHorizontal: 22,
      backgroundColor:   '#2A2A2A',
      alignItems:        'center',
    },
    confirmBtnNoTexto: {
      color:      '#FFFFFF',
      fontSize:   13,
      fontWeight: '700',
    },
    confirmBtnSi: {
      borderRadius:      20,
      paddingVertical:   10,
      paddingHorizontal: 22,
      backgroundColor:   '#2A2A2A',
      alignItems:        'center',
    },
    confirmBtnSiTexto: {
      color:      '#FFFFFF',
      fontSize:   13,
      fontWeight: '700',
    },
  });
};

export default createStyles;