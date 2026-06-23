import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmallScreen  = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen  = width >= 768;
  const isWeb          = Platform.OS === 'web';

  const CARD_WIDTH =
    isSmallScreen  ? width * 0.60 :
    isMediumScreen ? width * 0.50 :
    Math.min(width * 0.38, 300);
  const CARD_MARGIN = isSmallScreen ? 8 : 12;

  const BG       = theme.colors.background;
  const CARD_BG  = '#FFFFFF';
  const TEXT_DK  = '#1A1A1A';
  const TEXT_MD  = '#444444';
  const ARROW_BG = 'rgba(255,255,255,0.15)';
  const TEXT = theme.dark ? '#FFFFFF' : '#1A1A1A';
const TEXT_INVERT = theme.dark ? '#FFFFFF' : '#000000';
  const HEADER_BG = theme.colors.navBackground;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
    },

    header: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: isSmallScreen ? 12 : 20,
      paddingVertical:   isSmallScreen ? 10 : 14,
     // backgroundColor:   HEADER_BG,
    },
    logo: {
      width:        isSmallScreen ? 44 : isMediumScreen ? 54 : 64,
      height:       isSmallScreen ? 44 : isMediumScreen ? 54 : 64,
      borderRadius: isSmallScreen ? 22 : isMediumScreen ? 27 : 32,
    },
    titleWrap: {
      flex:       1,
      alignItems: 'center',
    },
    titleText: {
  color: theme.dark ? '#FFF' : '#1A1A1A',
  fontSize: isSmallScreen ? 13 : isMediumScreen ? 15 : 17,
  fontWeight: '700',

  backgroundColor: theme.dark
    ? '#FFFFFF'
    : '#FFFFFF',

  paddingHorizontal: isSmallScreen ? 12 : 20,
  paddingVertical: isSmallScreen ? 7 : 10,
  borderRadius: 24,
  overflow: 'hidden',
  textAlign: 'center',
},
    settingsBtn: {
      width:          isSmallScreen ? 36 : 44,
      height:         isSmallScreen ? 36 : 44,
      justifyContent: 'center',
      alignItems:     'center',
    },
carouselWrap: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: isSmallScreen ? 12 : 20,
  backgroundColor: BG, 
},
    arrowBtn: {
      width:            isSmallScreen ? 34 : 44,
      height:           isSmallScreen ? 34 : 44,
      borderRadius:     isSmallScreen ? 17 : 22,
      backgroundColor:  ARROW_BG,
      justifyContent:   'center',
      alignItems:       'center',
      zIndex:           10,
      marginHorizontal: isSmallScreen ? 2 : 4,
      flexShrink:       0,
    },
    arrowDisabled: {
      opacity: 0.3,
    },

    card: {
      width:             CARD_WIDTH,
      marginHorizontal:  CARD_MARGIN,
      backgroundColor:   CARD_BG,
      borderRadius:      isSmallScreen ? 16 : 24,
      paddingHorizontal: isSmallScreen ? 14 : 20,
      paddingVertical:   isSmallScreen ? 16 : 24,
      alignItems:        'center',
      ...(isWeb && { boxShadow: '0px 4px 20px rgba(255, 255, 255, 0)' }),
    },

    avatarWrap: {
      position:     'relative',
      marginBottom: isSmallScreen ? 8 : 12,
    },
    avatarImg: {
      width:        isSmallScreen ? 56 : 72,
      height:       isSmallScreen ? 56 : 72,
      borderRadius: isSmallScreen ? 28 : 36,
    },
    avatarPlaceholder: {
      width:           isSmallScreen ? 56 : 72,
      height:          isSmallScreen ? 56 : 72,
      borderRadius:    isSmallScreen ? 28 : 36,
      backgroundColor: '#CCCCCC',
    },
    avatarEdit: {
      position:        'absolute',
      bottom:          0,
      right:           -4,
      width:           isSmallScreen ? 20 : 24,
      height:          isSmallScreen ? 20 : 24,
      borderRadius:    isSmallScreen ? 10 : 12,
      backgroundColor: '#EEEEEE',
      justifyContent:  'center',
      alignItems:      'center',
      borderWidth:     1,
      borderColor:     '#DDD',
    },

    cardNombre: {
      fontSize:     isSmallScreen ? 14 : isMediumScreen ? 16 : 17,
      fontWeight:   '700',
      color:        TEXT_DK,
      textAlign:    'center',
      marginBottom: isSmallScreen ? 6 : 8,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems:    'center',
      marginBottom:  isSmallScreen ? 10 : 16,
      gap:           6,
    },
    ratingText: {
      fontSize:   isSmallScreen ? 14 : 16,
      fontWeight: '600',
      color:      TEXT_DK,
    },
    sectionLabel: {
      fontSize:     isSmallScreen ? 13 : 15,
      fontWeight:   '600',
      color:        TEXT_DK,
      textAlign:    'center',
      marginTop:    isSmallScreen ? 6 : 8,
      marginBottom: 2,
    },
    sectionBold: {
      fontSize:   isSmallScreen ? 12 : 14,
      fontWeight: '700',
      color:      TEXT_DK,
      textAlign:  'center',
    },
    sectionSmall: {
      fontSize:   isSmallScreen ? 11 : 12,
      color:      TEXT_MD,
      textAlign:  'center',
      marginTop:  2,
      lineHeight: isSmallScreen ? 15 : 17,
    },

    loadingOverlay: {
      flex:            1,
      backgroundColor: 'rgba(13,27,42,0.88)',
      justifyContent:  'center',
      alignItems:      'center',
    },
    loadingBox: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingVertical:   36,
      paddingHorizontal: isSmallScreen ? 32 : 48,
      alignItems:        'center',
      minWidth:          isSmallScreen ? 220 : 260,
    },
    loadingIconWrap: {
      width:           60,
      height:          60,
      borderRadius:    30,
      backgroundColor: 'rgba(201,168,76,0.12)',
      justifyContent:  'center',
      alignItems:      'center',
      marginBottom:    16,
    },
    loadingTitle: {
      fontSize:     isSmallScreen ? 13 : 14,
      color:        '#888',
      marginBottom: 4,
    },
    loadingNombre: {
      fontSize:     isSmallScreen ? 17 : 20,
      fontWeight:   '700',
      color:        '#1A1A1A',
      textAlign:    'center',
      marginBottom: 6,
    },
    loadingSubtitle: {
      fontSize: isSmallScreen ? 11 : 12,
      color:    '#AAAAAA',
    },
  });
};

export default createStyles;