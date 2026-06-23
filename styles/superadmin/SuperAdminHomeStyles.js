import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR     = '#0B1014';
  const SIDEBAR_BG = isDark ? '#0B1014' : '#F0F0F0';
  const PANEL      = isDark ? 'rgba(78,80,77,0.23)' : '#FFFFFF';
  const ACCESO_BG  = isDark ? 'rgba(78,80,77,0.23)' : '#FFFFFF';
  const WHITE      = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED      = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    /* ── Navbar ── */
    navbar: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      backgroundColor:   NAVBAR,
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 14 : 18,
    },
    navLeft: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           12,
    },
    navTitle: {
      color:      '#FFFFFF',
      fontSize:   isSmall ? 20 : 26,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    navRight: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           16,
    },
    /* campana sin fondo */
    navIconBtn: {
      width:          44,
      height:         44,
      justifyContent: 'center',
      alignItems:     'center',
    },
    /* avatar circular grande */
    navAvatar: {
      width:           48,
      height:          48,
      borderRadius:    24,
      backgroundColor: '#2A2A2A',
      justifyContent:  'center',
      alignItems:      'center',
    },
    menuBtn: {
      width:          36,
      height:         36,
      justifyContent: 'center',
      alignItems:     'center',
    },

    /* ── Body ── */
    bodyRow: {
      flex:          1,
      flexDirection: 'row',
    },

    /* ── Sidebar ── */
    sidebar: {
      width:             180,
      backgroundColor:   SIDEBAR_BG,
      borderRadius:      30,
      marginVertical:    16,
      marginLeft:        14,
      paddingTop:        28,
      paddingHorizontal: 14,
      justifyContent:    'space-between',
    },
    sidebarItems: {
      gap: 22,
    },
    sidebarItem: {
      paddingVertical: 4,
    },
    sidebarText: {
      color:      MUTED,
      fontSize:   14,
      fontWeight: '600',
      textAlign:  'center',
    },
    sidebarTextActive: {
      color:      WHITE,
      fontWeight: '700',
    },

    /* ── Logout ── */
    logoutBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             8,
      paddingVertical: 16,
      marginBottom:    16,
    },
    logoutText: {
      color:      WHITE,
      fontSize:   14,
      fontWeight: '600',
    },

    /* ── Drawer móvil ── */
    drawerOverlay: {
      position:        'absolute',
      top:              0,
      left:             0,
      right:            0,
      bottom:           0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex:           500,
    },
    drawer: {
      position:          'absolute',
      top:                0,
      left:               0,
      bottom:             0,
      width:              240,
      backgroundColor:    SIDEBAR_BG,
      paddingTop:         60,
      paddingHorizontal:  20,
      zIndex:             600,
      justifyContent:     'space-between',
    },
    drawerItem: {
      paddingVertical: 14,
    },
    drawerText: {
      color:      MUTED,
      fontSize:   15,
      fontWeight: '600',
    },
    drawerTextActive: {
      color: WHITE,
    },
    drawerClose: {
      position: 'absolute',
      top:      16,
      right:    16,
    },

    /* ── Main content ── */
    mainContent: {
      flex: 1,
    },
    mainContentInner: {
      padding:       isSmall ? 16 : 28,
      paddingBottom: 40,
    },
    greeting: {
      color:        WHITE,
      fontSize:     isSmall ? 13 : 15,
      fontWeight:   '700',
      marginBottom: 20,
    },

    /* ── Stats panel ── */
    statsPanel: {
      backgroundColor: PANEL,
      borderRadius:    24,
      padding:         isSmall ? 16 : 24,
      marginBottom:    32,
      gap:             16,
    },
    statsSectionTitle: {
      color:        WHITE,
      fontSize:     14,
      fontWeight:   '600',
      textAlign:    'center',
      marginBottom: 8,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           isSmall ? 14 : 20,
    },
    statItem: {
      flexGrow:  1,
      minWidth:  isSmall ? '42%' : 120,
      alignItems: 'center',
    },
    statHeaderRow: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           6,
      marginBottom:  6,
    },
    statLabel: {
      color:      WHITE,
      fontSize:   13,
      fontWeight: '500',
    },
    statValue: {
      color:      WHITE,
      fontSize:   20,
      fontWeight: '400',
    },
    statsDivider: {
      height:          1,
      backgroundColor: 'rgba(255,255,255,0.08)',
      marginVertical:  4,
    },

    /* ── Accesos directos ── */
    sectionTitle: {
      color:        WHITE,
      fontSize:     16,
      fontWeight:   '700',
      marginBottom: 14,
    },
    accesoCard: {
      backgroundColor: ACCESO_BG,
      borderRadius:    40,
      paddingVertical:   14,
      paddingHorizontal: 22,
      marginBottom:    12,
      ...(isDark && isWeb ? {} : {}),
      ...(!isDark && isWeb && { boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }),
    },
    accesoTitulo: {
      color:        WHITE,
      fontSize:     14,
      fontWeight:   '700',
      marginBottom: 3,
    },
    accesoDesc: {
      color:      MUTED,
      fontSize:   12,
      lineHeight: 18,
    },

    /* ── Dropdown ── */
    dropdown: {
      position:        'absolute',
      top:             isSmall ? 74 : 86,
      right:           isSmall ? 16 : 24,
      backgroundColor: '#0B1014',
      borderRadius:    12,
      paddingVertical: 8,
      minWidth:        180,
      zIndex:          999,
      borderWidth:     1,
      borderColor:     'rgba(255,255,255,0.08)',
      ...(isWeb && { boxShadow: '0px 8px 24px rgba(0,0,0,0.5)' }),
    },
    dropdownItem: {
      flexDirection:     'row',
      alignItems:        'center',
      paddingVertical:   12,
      paddingHorizontal: 16,
      gap:               12,
    },
    dropdownText: {
      color:    '#FFFFFF',
      fontSize: 14,
    },
  });
};

export default createStyles;