import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 600;

  // ── Mismas variables que DetalleBarberiaStyles ──
  const CARD_BG      = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const LIST_ITEM_BG = isDark ? '#1A2230' : '#FFFFFF';
  const TAB_BG       = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const TAB_BG_ACTIVE= isDark ? 'rgba(255,255,255,0.16)' : '#1A1A1A';
  const WHITE        = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED        = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const MUTED_LIGHT  = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const BORDER       = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const BTN_BG       = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const ACTIVE_GREEN = '#22C55E';
  const DANGER_RED   = '#EF4444';

  const MODAL_BG      = isDark ? '#1A2230' : '#FFFFFF';
const MODAL_OVERLAY = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.35)';
const INPUT_BORDER  = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
const PILL_INACTIVE = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
const PILL_ACTIVE_BG   = isDark ? '#FFFFFF' : '#1A1A1A';
const PILL_ACTIVE_TEXT = isDark ? '#1A1A1A' : '#FFFFFF';
const CANCEL_BORDER = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';

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
    body: { flex: 1 },
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
      flexDirection:   'row',
      backgroundColor: CARD_BG,
      borderRadius:    18,
      padding:         isSmall ? 16 : 22,
      marginBottom:    20,
      ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }),
    },
    statItem: {
      flex:       1,
      alignItems: 'center',
    },
    statDivider: {
      width:           1,
      backgroundColor: BORDER,
    },
    statLabel: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '700',
      marginBottom: 6,
    },
    statValue: {
      color:      WHITE,
      fontSize:   18,
      fontWeight: '800',
    },

    /* ── Tabs ── */
    tabsRow: {
      flexDirection:  'row',
      justifyContent: 'center',
      gap:            10,
      marginBottom:   20,
    },
    tabPill: {
      backgroundColor:   TAB_BG,
      borderRadius:      20,
      paddingHorizontal: 18,
      paddingVertical:   9,
    },
    tabPillActive:     { backgroundColor: TAB_BG_ACTIVE },
    tabPillText:       { color: MUTED, fontSize: 13, fontWeight: '700' },
    tabPillTextActive: { color: '#FFFFFF' },

    /* ── Card de membresía ── */
    card: {
      backgroundColor: CARD_BG,
      borderRadius:    18,
      padding:         isSmall ? 18 : 24,
      ...(isWeb && { boxShadow: isDark ? '0px 4px 14px rgba(0,0,0,0.3)' : '0px 4px 14px rgba(0,0,0,0.1)' }),
    },
    barberiaNombre: {
      color:        WHITE,
      fontSize:     16,
      fontWeight:   '800',
      textAlign:    'center',
      marginBottom: 14,
    },
    estadoRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            8,
      marginBottom:   20,
    },
    estadoDot:   { width: 9, height: 9, borderRadius: 5 },
    estadoText:  { color: WHITE, fontSize: 14, fontWeight: '700' },

    label: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '700',
      textAlign:    'center',
      marginBottom: 4,
      marginTop:    14,
    },
    value: {
      color:      MUTED,
      fontSize:   14,
      fontWeight: '600',
      textAlign:  'center',
    },

    actionsRow: {
      flexDirection: isSmall ? 'column' : 'row',
      gap:           12,
      marginTop:     24,
    },
    actionBtn: {
      flex:            1,
      backgroundColor: BTN_BG,
      borderRadius:    20,
      paddingVertical: 12,
      alignItems:      'center',
    },
    actionBtnText: { color: WHITE, fontSize: 13, fontWeight: '700' },

    /* ── Historial de pagos — mismo estilo que DetalleBarberiaStyles ── */
    listContainer: { gap: 12 },

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
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      backgroundColor:   LIST_ITEM_BG,
      borderRadius:      16,
      paddingVertical:   14,
      paddingHorizontal: 18,
      ...(isWeb && { boxShadow: isDark ? '0px 2px 10px rgba(0,0,0,0.25)' : '0px 2px 10px rgba(0,0,0,0.08)' }),
    },
    pagoItemFecha: {
      flex:       1,
      color:      WHITE,
      fontSize:   14,
      fontWeight: '700',
    },
    pagoItemCentro: {
      flex:       1,
      alignItems: 'center',
    },
    pagoItemMonto: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '700',
    },
    pagoItemEstado: {
      flex:       1,
      fontSize:   13,
      fontWeight: '600',
      textAlign:  'right',
    },
    pagoItemEstadoPagado:   { color: MUTED },
    pagoItemEstadoPendiente:{ color: MUTED },
    pagoItemEstadoVencido:  { color: DANGER_RED },

    pagoBtnRegistrar: {
      backgroundColor:   BTN_BG,
      borderRadius:      16,
      paddingVertical:   7,
      paddingHorizontal: 14,
    },
    pagoBtnRegistrarText: { color: WHITE, fontSize: 12, fontWeight: '700' },

    /* ── Estado vacío ── */
    emptyState: { alignItems: 'center', paddingVertical: 30 },
    emptyText: {
      color:      MUTED_LIGHT,
      fontSize:   13,
      fontWeight: '600',
      marginTop:  10,
      textAlign:  'center',
    },


/* ── Modal: registrar pago ── */
    modalOverlay: {
      flex:            1,
      backgroundColor: MODAL_OVERLAY,
      justifyContent:  'center',
      alignItems:      'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      backgroundColor:   MODAL_BG,
      borderRadius:      20,
      paddingTop:        20,
      paddingBottom:     20,
      paddingHorizontal: 22,
      width:             '100%',
      maxWidth:          340,
      ...(isWeb && { boxShadow: isDark ? '0px 12px 32px rgba(0,0,0,0.5)' : '0px 12px 32px rgba(0,0,0,0.18)' }),
    },
    modalHeader: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'center',
      marginBottom:   14,
      position:       'relative',
    },
    modalTitle: {
      color:      WHITE,
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
      color:        WHITE,
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
      borderColor:       CANCEL_BORDER,
      borderRadius:      20,
      paddingVertical:   11,
      alignItems:        'center',
    },
    modalBtnCancelText: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '600',
    },
    modalBtnConfirm: {
      flex:              1,
      backgroundColor:   PILL_ACTIVE_BG,
      borderRadius:      20,
      paddingVertical:   11,
      alignItems:        'center',
    },
    modalBtnConfirmText: {
      color:      PILL_ACTIVE_TEXT,
      fontSize:   13,
      fontWeight: '700',
    },
  });
};

export default createStyles;