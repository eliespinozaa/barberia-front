import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';  

  const CONTENT_MAX_W = isSmall ? '100%' : 980;
  const NAVBAR        = '#0B1014'; 

  const TABLE_BG       = isDark ? '#1B212F' : '#FFFFFF';
  const FILTER_BG       = isDark ? '#FFFFFF' : '#F1F2F5';
  const FILTER_TEXT     = '#15181F';
  const ESTADO_BG       = '#A6E3A1';
  const ESTADO_TEXT     = '#1F6F35';
  const ESTADO_BG_OFF   = 'rgba(239,68,68,0.18)';
  const ESTADO_TEXT_OFF = '#EF4444';
  const TEXT_PRIMARY    = isDark ? '#FFFFFF' : '#1A1A1A';
  const TEXT_SECONDARY  = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)';
  const TEXT_MUTED      = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const PAGE_BTN_BG     = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';
  const ROW_BORDER      = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const CARD_FOOTER_BORDER = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const DROP_ITEM_ACTIVE   = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const MODAL_OVERLAY      = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.35)';
  const MODAL_CANCEL_BORDER = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
  const MODAL_BTN_BG       = isDark ? '#FFFFFF' : '#1A1A1A';
  const MODAL_BTN_TEXT     = isDark ? '#1A1A1A' : '#FFFFFF';
  const ADD_BTN_BG         = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  // Anchos de columna (solo web)
  const COL_NOMBRE   = 160;
  const COL_CORREO   = 190;
  const COL_ROL      = 100;
  const COL_TELEFONO = 140;
  const COL_ESTADO   = 130;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    /* ── Header ── */
    header: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   NAVBAR,
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 14 : 18,
    },
    headerSide: {
      width: 40,
    },
    headerSideRight: {
      width:      40,
      alignItems: 'flex-end',
    },
    headerCenter: {
      flex:       1,
      alignItems: 'center',
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
    backBtn: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: 'rgba(255,255,255,0.12)',
      justifyContent:  'center',
      alignItems:      'center',
    },

    /* ── Botón agregar (entre header y contenido) ── */
    addButtonRow: {
      alignItems:        'flex-end',
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 10 : 14,
    },
    addBtn: {
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: ADD_BTN_BG,
      justifyContent:  'center',
      alignItems:      'center',
      ...(isWeb
        ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.3)' }
        : {
            shadowColor:   '#000',
            shadowOffset:  { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius:  6,
            elevation:     5,
          }),
    },

    /* ── Body ── */
    body: { flex: 1 },
    bodyInner: {
      padding:       isSmall ? 12 : 28,
      paddingTop:    isSmall ? 4 : 8,
      paddingBottom: 40,
      alignItems:    'center',
    },
    contentWrap: {
      width:    '100%',
      maxWidth: CONTENT_MAX_W,
    },

    /* ══════════════════════════════
       VISTA WEB — tabla horizontal
    ══════════════════════════════ */
    tableHeaderBar: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   TABLE_BG,
      borderRadius:      50,
      paddingHorizontal: 28,
      paddingVertical:   18,
      marginBottom:      16,
    },
    thCell: {
      color:      TEXT_PRIMARY,
      fontSize:   16,
      fontWeight: '800',
    },
    tableCard: {
      width:             '100%',
      backgroundColor:   TABLE_BG,
      borderRadius:      20,
      paddingHorizontal: 28,
      paddingTop:        18,
      paddingBottom:     14,
      ...(isWeb && { boxShadow: '0px 4px 20px rgba(0,0,0,0.35)' }),
    },
    tableFilters: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           10,
      marginBottom:  18,
    },
    filterCell: {
      justifyContent: 'center',
    },
    filterInput: {
      backgroundColor:   FILTER_BG,
      borderRadius:      10,
      color:             FILTER_TEXT,
      fontSize:          14,
      fontWeight:        '600',
      paddingHorizontal: 12,
      height:            38,
      ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },
    filterDropdown: {
      backgroundColor:   FILTER_BG,
      borderRadius:      10,
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: 12,
      height:            38,
      gap:               6,
    },
    filterDropdownText: {
      color:      FILTER_TEXT,
      fontSize:   14,
      fontWeight: '700',
      flex:       1,
    },
    tableRow: {
      flexDirection:  'row',
      alignItems:     'center',
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: ROW_BORDER,
    },
    tdCellName: {
      color:      TEXT_PRIMARY,
      fontSize:   15,
      fontWeight: '700',
    },
    tdCell: {
      color:      TEXT_SECONDARY,
      fontSize:   14,
      fontWeight: '500',
    },
    tdCellMuted: {
      color:      TEXT_MUTED,
      fontSize:   14,
      fontWeight: '500',
    },
    colNombre:   { width: COL_NOMBRE,   marginRight: 10 },
    colCorreo:   { width: COL_CORREO,   marginRight: 10 },
    colRol:      { width: COL_ROL,      marginRight: 10 },
    colTelefono: { width: COL_TELEFONO, marginRight: 10 },
    colEstado:   { width: COL_ESTADO,   marginRight: 10 },
    colAcciones: { flex: 1 },

    /* ══════════════════════════════
       VISTA MÓVIL — búsqueda + cards
    ══════════════════════════════ */

    // Buscador móvil
    mobileSearch: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   '#FFFFFF',
      borderRadius:      20,
      paddingHorizontal: 14,
      paddingVertical:   Platform.OS === 'ios' ? 12 : 8,
      marginBottom:      12,
      gap:               8,
      ...(isWeb && { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }),
    },
    mobileSearchInput: {
      flex:            1,
      color:           '#1A1A1A',
      fontSize:        14,
      fontWeight:      '600',
      paddingVertical: 0,
      ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },

    // Filtros móvil en fila scrollable
    mobileFiltersRow: {
      flexDirection: 'row',
      gap:           8,
      marginBottom:  14,
    },
    mobileFilterPill: {
      flexDirection:     'row',
      alignItems:        'center',
      backgroundColor:   TABLE_BG,
      borderRadius:      20,
      paddingHorizontal: 14,
      paddingVertical:   8,
      gap:               6,
    },
    mobileFilterPillText: {
      color:      TEXT_PRIMARY,
      fontSize:   13,
      fontWeight: '600',
    },

    // Cards móvil
    mobileCard: {
      backgroundColor: TABLE_BG,
      borderRadius:    16,
      padding:         16,
      marginBottom:    12,
      ...(isWeb && { boxShadow: '0px 2px 10px rgba(0,0,0,0.25)' }),
    },
    mobileCardHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   10,
    },
    mobileCardName: {
      color:      TEXT_PRIMARY,
      fontSize:   16,
      fontWeight: '800',
      flex:       1,
      marginRight: 8,
    },
    mobileCardBody: {
      gap: 4,
      marginBottom: 12,
    },
    mobileCardLine: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           6,
    },
    mobileCardLabel: {
      color:      TEXT_MUTED,
      fontSize:   12,
      fontWeight: '600',
      width:      60,
    },
    mobileCardValue: {
      color:      TEXT_SECONDARY,
      fontSize:   13,
      fontWeight: '500',
      flex:       1,
    },
    mobileCardFooter: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'flex-end',
      gap:            18,
      paddingTop:     10,
      borderTopWidth: 1,
      borderTopColor: CARD_FOOTER_BORDER,
    },

    /* ── Estado pill (compartido web/móvil) ── */
    estadoPill: {
      borderRadius:      999,
      paddingHorizontal: 14,
      paddingVertical:   6,
      alignSelf:         'flex-start',
    },
    estadoActivo: {
      backgroundColor: ESTADO_BG,
    },
    estadoInactivo: {
      backgroundColor: ESTADO_BG_OFF,
    },
    estadoPillText: {
      fontSize:   13,
      fontWeight: '800',
      color:      ESTADO_TEXT,
    },
    estadoPillTextOff: {
      color: ESTADO_TEXT_OFF,
    },

    /* ── Acciones (compartido) ── */
    accionesRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           18,
    },
    accionBtn: {
      padding: 2,
    },

    /* ── Empty state ── */
    emptyState: {
      alignItems:      'center',
      paddingVertical: 40,
    },
    emptyText: {
      color:      TEXT_MUTED,
      fontSize:   13,
      fontWeight: '600',
      marginTop:  10,
    },

    /* ── Paginación (compartida) ── */
    paginacion: {
      alignItems:      'center',
      paddingTop:      18,
      paddingBottom:   10,
      gap:             14,
    },
    paginacionInfo: {
      color:      TEXT_PRIMARY,
      fontSize:   isSmall ? 12 : 14,
      fontWeight: '700',
    },
    paginacionBtns: {
      flexDirection:  'row',
      alignItems:     'center',
      gap:            isSmall ? 4 : 8,
      flexWrap:       'wrap',
      justifyContent: 'center',
    },
    pageBtn: {
      width:           isSmall ? 32 : 36,
      height:          isSmall ? 32 : 36,
      borderRadius:    isSmall ? 16 : 18,
      backgroundColor: PAGE_BTN_BG,
      justifyContent:  'center',
      alignItems:      'center',
    },
    pageBtnActive: {
      backgroundColor: '#FFFFFF',
    },
    pageBtnDisabled: {
      opacity: 0.3,
    },
    pageBtnText: {
      color:      TEXT_PRIMARY,
      fontSize:   isSmall ? 12 : 14,
      fontWeight: '700',
    },
    pageBtnTextActive: {
      color: '#15181F',
    },

    /* ── Dropdowns ── */
    dropOverlay: {
      flex:            1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent:  'center',
      alignItems:      'center',
    },
    dropMenu: {
      backgroundColor: TABLE_BG,
      borderRadius:    14,
      padding:         8,
      minWidth:        160,
      ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.4)' }),
    },
    dropItem: {
      paddingHorizontal: 16,
      paddingVertical:   11,
      borderRadius:      10,
    },
    dropItemActive: {
      backgroundColor: DROP_ITEM_ACTIVE,
    },
    dropItemText: {
      color:      TEXT_PRIMARY,
      fontSize:   14,
      fontWeight: '500',
    },
    dropItemTextActive: {
      fontWeight: '700',
    },

    /* ── Modal ── */
    modalOverlay: {
      flex:              1,
      backgroundColor:   MODAL_OVERLAY,
      justifyContent:    'center',
      alignItems:        'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      backgroundColor:   TABLE_BG,
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
      color:      TEXT_PRIMARY,
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
      color:       TEXT_PRIMARY,
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
      borderColor:     MODAL_CANCEL_BORDER,
      borderRadius:    20,
      paddingVertical: 11,
      alignItems:      'center',
    },
    modalBtnCancelText: {
      color:     TEXT_PRIMARY,
      fontSize:   13,
      fontWeight: '600',
    },
    modalBtnConfirm: {
      flex:            1,
      backgroundColor: MODAL_BTN_BG,
      borderRadius:    20,
      paddingVertical: 11,
      alignItems:      'center',
    },
    modalBtnConfirmText: {
      color:      MODAL_BTN_TEXT,
      fontSize:   13,
      fontWeight: '700',
    },
    /* ── Modal: detalle de usuario (ojito) ── */
    detalleOverlay: {
      flex:              1,
      backgroundColor:   MODAL_OVERLAY,
      justifyContent:    'center',
      alignItems:        'center',
      paddingHorizontal: 24,
    },
    detalleCard: {
      backgroundColor:   TABLE_BG,
      borderRadius:      24,
      paddingTop:        28,
      paddingBottom:     28,
      paddingHorizontal: 24,
      width:             '100%',
      maxWidth:          320,
      alignItems:        'center',
      ...(isWeb && { boxShadow: '0px 12px 32px rgba(0,0,0,0.5)' }),
    },
    detalleCloseBtn: {
      position: 'absolute',
      right:    16,
      top:      16,
      padding:  4,
    },
    detalleAvatar: {
      width:           84,
      height:          84,
      borderRadius:    42,
      backgroundColor: '#D9D9D9',
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
      marginBottom:    16,
    },
    detalleAvatarImage: {
      width:  84,
      height: 84,
    },
    detalleNombre: {
      color:        TEXT_PRIMARY,
      fontSize:     18,
      fontWeight:   '800',
      marginBottom: 18,
      textAlign:    'center',
    },
    detalleLine: {
      flexDirection: 'row',
      alignItems:    'center',
      flexWrap:      'wrap',
      justifyContent: 'center',
      marginBottom:  12,
      gap:           4,
    },
    detalleLabel: {
      color:      TEXT_PRIMARY,
      fontSize:   14,
      fontWeight: '800',
    },
    detalleValue: {
      color:      TEXT_SECONDARY,
      fontSize:   14,
      fontWeight: '500',
    },
    detalleEstadoDot: {
      width:        9,
      height:       9,
      borderRadius: 5,
      backgroundColor: ESTADO_BG,
      marginLeft:   2,
    },
    detalleEstadoDotOff: {
      backgroundColor: ESTADO_TEXT_OFF,
    },
    
  });
};

export default createStyles;