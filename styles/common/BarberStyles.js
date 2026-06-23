import { StyleSheet, Platform, Dimensions } from 'react-native';

const createStyles = (width, theme) => {

const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;
const isLargeScreen = width >= 768;
const isWeb = Platform.OS === 'web';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD = theme.colors.secondary;
const DARK = theme.colors.sectionBackground;
const DARK2 = theme.colors.sectionAltBackground;
const CARD_BG = theme.colors.cardBackground;
const BORDER = theme.colors.border;
const WHITE = theme.colors.text;

const TEXT_SECONDARY = theme.colors.textSecondary;
const TEXT_MUTED = theme.colors.textMuted;
const TEXT_LIGHT = theme.colors.textLight;
const ICON_SECONDARY = theme.colors.iconSecondary;
// ─── Helpers de layout ───────────────────────────────────────────────────────
// Ancho de tarjeta en grids de 2 o 3 columnas sin usar % en margin
// para evitar desbordamiento en React Native
const GRID_PAD   = isSmallScreen ? 20 : isLargeScreen ? 80 : 40;   // padding de sección
const GRID_GAP   = isSmallScreen ? 12 : isLargeScreen ? 18 : 14;   // espacio entre cards
const CARD_W_2   = (width - GRID_PAD * 2 - GRID_GAP)     / 2;     // 2 columnas
const CARD_W_3   = (width - GRID_PAD * 2 - GRID_GAP * 2) / 3;     // 3 columnas

return StyleSheet.create({

  // ─── Layout base ─────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: DARK,
  },
  scrollContainer: {
    flex: 1,
  },

  // ─── Hero ─────────────────────────────────────────────────────────────────
  heroContainer: {
    width: '100%',
    minHeight: isSmallScreen ? 460 : isMediumScreen ? 520 : 640,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: theme.colors.background,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: theme.colors.background,
  },
  heroContent: {
    paddingHorizontal: isSmallScreen ? 24 : isMediumScreen ? 32 : isLargeScreen ? 100 : 48,
    paddingVertical:   isSmallScreen ? 60 : isMediumScreen ? 72 : 88,
    alignItems:        isLargeScreen ? 'flex-start' : 'center',
    maxWidth:          isLargeScreen ? 680 : undefined,
    zIndex: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.5)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: isSmallScreen ? 20 : 26,
    alignSelf: isLargeScreen ? 'flex-start' : 'center',
  },
  heroBadgeText: {
    color: GOLD,
    fontSize: isSmallScreen ? 10 : isLargeScreen ? 12 : 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: isSmallScreen ? 34 : isMediumScreen ? 42 : isLargeScreen ? 64 : 48,
    fontWeight: '900',
    color: WHITE,
    textAlign: isLargeScreen ? 'left' : 'center',
    lineHeight: isSmallScreen ? 42 : isMediumScreen ? 52 : isLargeScreen ? 76 : 58,
    letterSpacing: -1,
    marginBottom: isSmallScreen ? 14 : 20,
  },
  heroTitleAccent: {
    color: GOLD,
  },
  heroSubtitle: {
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : isLargeScreen ? 18 : 17,
    color: TEXT_SECONDARY,
    textAlign: isLargeScreen ? 'left' : 'center',
    lineHeight: isSmallScreen ? 24 : 28,
    marginBottom: isSmallScreen ? 32 : 42,
    maxWidth: isLargeScreen ? 520 : isMediumScreen ? 460 : undefined,
  },
  heroButtons: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: isSmallScreen ? 'stretch' : 'center',
    alignSelf: isLargeScreen ? 'flex-start' : 'center',
    width: isSmallScreen ? '100%' : undefined,
  },
  heroBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    paddingHorizontal: isSmallScreen ? 22 : isLargeScreen ? 32 : 26,
    paddingVertical:   isSmallScreen ? 13 : isLargeScreen ? 16 : 14,
    borderRadius: 8,
    marginRight:   isSmallScreen ? 0 : 12,
    marginBottom:  isSmallScreen ? 12 : 0,
    minWidth:      isSmallScreen ? undefined : 180,
    // Web hover hint via cursor
    ...(isWeb && { cursor: 'pointer' }),
  },
  heroBtnPrimaryText: {
    color: '#1A1A1A',
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '800',
    marginRight: 8,
  },
  heroBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: isSmallScreen ? 22 : isLargeScreen ? 32 : 26,
    paddingVertical:   isSmallScreen ? 13 : isLargeScreen ? 16 : 14,
    borderRadius: 8,
    minWidth: isSmallScreen ? undefined : 180,
    ...(isWeb && { cursor: 'pointer' }),
  },
  heroBtnSecondaryText: {
    color: WHITE,
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '600',
    marginLeft: 8,
  },

  // ─── Stats strip ──────────────────────────────────────────────────────────
  statsStrip: {
    flexDirection: 'row',
    flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
    backgroundColor: GOLD,
  },
  statItem: {
    flex:    isSmallScreen ? undefined : 1,
    width:   isSmallScreen ? '50%'     : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 18 : isLargeScreen ? 26 : 22,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.15)',
  },
  statNumber: {
    fontSize: isSmallScreen ? 24 : isLargeScreen ? 36 : 30,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: isSmallScreen ? 10 : isLargeScreen ? 12 : 11,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // ─── Secciones ────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: GRID_PAD,
    paddingVertical:   isSmallScreen ? 48 : isLargeScreen ? 80 : 60,
    backgroundColor:   DARK,
  },
  sectionAlt: {
    paddingHorizontal: GRID_PAD,
    paddingVertical:   isSmallScreen ? 48 : isLargeScreen ? 80 : 60,
    backgroundColor:   DARK2,
  },
  sectionEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionEyebrowLine: {
    width: 32,
    height: 2,
    backgroundColor: GOLD,
    marginRight: 10,
  },
  sectionEyebrowText: {
    color: GOLD,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 24 : isLargeScreen ? 40 : 32,
    fontWeight: '900',
    color: WHITE,
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: isSmallScreen ? 30 : isLargeScreen ? 50 : 40,
  },
  sectionSubtitle: {
    fontSize: isSmallScreen ? 14 : isLargeScreen ? 16 : 15,
    color: TEXT_MUTED,
    lineHeight: 26,
    marginBottom: isSmallScreen ? 28 : 40,
    maxWidth: 560,
  },

  // ─── Service cards ────────────────────────────────────────────────────────
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap en web, margen manual en nativo
    ...(isWeb ? { gap: GRID_GAP } : {}),
  },
  serviceCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
    borderWidth: 1,
    borderColor: BORDER,
    // Anchos responsivos SIN % en margin (evita overflow en RN)
    width: isSmallScreen
      ? '100%'
      : isLargeScreen
        ? CARD_W_3
        : CARD_W_2,
    // En nativo usamos marginBottom; en web el gap lo cubre
    marginBottom: GRID_GAP,
    marginRight: isWeb
      ? 0
      : isSmallScreen
        ? 0
        : (width % 2 === 0 ? 0 : 0), // gap calculado en CARD_W
  },
  serviceCardHot: {
    borderColor: BORDER,
  },
  serviceHotBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  serviceHotBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  serviceIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  serviceTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 13,
   color: TEXT_MUTED,
    lineHeight: 20,
    marginBottom: 16,
  },
  servicePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  servicePriceFrom: {
    fontSize: 11,
     color: TEXT_MUTED,
    marginRight: 4,
  },
  servicePriceValue: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: '800',
    color: GOLD,
    marginRight: 4,
  },
  servicePriceCurrency: {
    fontSize: 13,
    color: GOLD,
  },

  // ─── Cómo funciona ────────────────────────────────────────────────────────
  stepsContainer: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  },
  step: {
    flex: isSmallScreen ? undefined : 1,
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 0 : isLargeScreen ? 20 : 10,
    marginBottom: isSmallScreen ? 28 : 0,
  },
  stepNumber: {
    width:  isSmallScreen ? 50 : isLargeScreen ? 58 : 54,
    height: isSmallScreen ? 50 : isLargeScreen ? 58 : 54,
    borderRadius: isSmallScreen ? 25 : isLargeScreen ? 29 : 27,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumberText: {
    fontSize: isSmallScreen ? 17 : isLargeScreen ? 21 : 19,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  stepConnector: {
    width: isLargeScreen ? 32 : 24,
    height: 2,
    backgroundColor: BORDER,
    // Alineado verticalmente al centro del círculo
    marginTop: isSmallScreen ? 25 : isLargeScreen ? 29 : 27,
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  stepDesc: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ─── Barberías destacadas ─────────────────────────────────────────────────
  shopsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...(isWeb ? { gap: GRID_GAP } : {}),
  },
  shopCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    width: isSmallScreen
      ? '100%'
      : isLargeScreen
        ? CARD_W_3
        : CARD_W_2,
    marginBottom: GRID_GAP,
  },
  shopCardImage: {
    width: '100%',
    height: isSmallScreen ? 150 : isLargeScreen ? 190 : 170,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopCardImageInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopCardBody: {
    padding: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
  },
  shopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  shopCardName: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '700',
    color: WHITE,
    flex: 1,
    marginRight: 8,
  },
  shopCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.18)',
  },
  shopCardRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: GOLD,
    marginLeft: 4,
  },
  shopCardAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  shopCardAddress: {
    fontSize: 12,
    color: TEXT_MUTED,
    flex: 1,
    marginLeft: 4,
  },
  shopCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  shopCardSpecialty: {
    fontSize: 12,
    color: GOLD,
    fontWeight: '600',
  },
  shopCardReviews: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  shopCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopCardTag: {
    backgroundColor:theme.colors.surface,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: BORDER,
  },
  shopCardTagText: {
    fontSize: 11,
    color: WHITE,
    fontWeight: '700',
  },
  shopCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOLD,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    ...(isWeb && { cursor: 'pointer' }),
  },
  shopCardBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 4,
  },

  // ─── CTA Section ──────────────────────────────────────────────────────────
  ctaSection: {
    paddingHorizontal: isSmallScreen ? 24 : isLargeScreen ? 80 : 60,
    paddingVertical:   isSmallScreen ? 52 : isLargeScreen ? 90 : 70,
    backgroundColor: GOLD,
    alignItems: 'center',
  },
  ctaIconWrap: {
    width: isSmallScreen ? 60 : 68,
    height: isSmallScreen ? 60 : 68,
    borderRadius: isSmallScreen ? 30 : 34,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 18 : 22,
  },
  ctaTitle: {
    fontSize: isSmallScreen ? 24 : isLargeScreen ? 40 : 32,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: isSmallScreen ? 30 : isLargeScreen ? 48 : 40,
    letterSpacing: -0.5,
  },
  ctaSubtitle: {
    fontSize: isSmallScreen ? 14 : isLargeScreen ? 16 : 15,
    color: 'rgba(0,0,0,0.52)',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 28 : 36,
    maxWidth: 480,
    lineHeight: 26,
  },
  ctaBtns: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: isSmallScreen ? 'stretch' : 'center',
    width: isSmallScreen ? '100%' : undefined,
  },
  ctaBtnDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD_BG,
    paddingHorizontal: isSmallScreen ? 22 : isLargeScreen ? 30 : 26,
    paddingVertical:   isSmallScreen ? 13 : isLargeScreen ? 15 : 14,
    borderRadius: 8,
    marginRight:  isSmallScreen ? 0 : 12,
    marginBottom: isSmallScreen ? 12 : 0,
    ...(isWeb && { cursor: 'pointer' }),
  },
  ctaBtnDarkText: {
    color: GOLD,
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  ctaBtnLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: isSmallScreen ? 22 : isLargeScreen ? 30 : 26,
    paddingVertical:   isSmallScreen ? 13 : isLargeScreen ? 15 : 14,
    borderRadius: 8,
    ...(isWeb && { cursor: 'pointer' }),
  },
  ctaBtnLightText: {
    color: '#1A1A1A',
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    marginLeft: 8,
  },

  // ─── Footer ───────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: DARK,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: isSmallScreen ? 20 : isLargeScreen ? 80 : 40,
    paddingTop: isSmallScreen ? 36 : 52,
    paddingBottom: isSmallScreen ? 24 : 32,
  },
  footerTop: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    marginBottom: isSmallScreen ? 28 : 40,
  },
  footerBrand: {
    flex: isSmallScreen ? undefined : 1.5,
    marginBottom: isSmallScreen ? 28 : 0,
    marginRight:  isSmallScreen ? 0 : isLargeScreen ? 56 : 36,
  },
  footerBrandName: {
    fontSize: isSmallScreen ? 14 : 17,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  footerBrandDesc: {
    fontSize: isSmallScreen ? 12 : 13,
     color: TEXT_MUTED,
    lineHeight: 20,
    maxWidth: 260,
    marginBottom: isSmallScreen ? 16 : 20,
  },
  footerSocial: {
    flexDirection: 'row',
  },
  footerSocialBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  footerCol: {
    flex: 1,
    marginRight: isLargeScreen ? 20 : 0,
  },
  footerColTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  footerLink: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 10,
    lineHeight: 20,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 20,
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerCopyright: {
    fontSize: isSmallScreen ? 11 : 12,
     color: TEXT_MUTED,
    textAlign: isSmallScreen ? 'center' : 'left',
    marginBottom: isSmallScreen ? 8 : 0,
  },
  footerBottomLinks: {
    flexDirection: 'row',
  },
  footerBottomLink: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginLeft: 20,
  },

  // ─── FAB WhatsApp ─────────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: isSmallScreen ? 20 : 28,
    right:  isSmallScreen ? 18 : 24,
    width:  isSmallScreen ? 50 : 56,
    height: isSmallScreen ? 50 : 56,
    borderRadius: isSmallScreen ? 25 : 28,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
};

export default createStyles;