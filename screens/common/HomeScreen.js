import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { tokenManager } from "../../config/api";
import SharedNavbar from "../../components/SharedNavbar";
import createStyles from "../../styles/common/BarberStyles";
import { useTheme } from "../../context/ThemeContext";

const SERVICES = [
  {
    icon: "cut-outline",
    title: "Corte Clásico",
    desc: "Corte tradicional con las técnicas más refinadas del oficio.",
    price: "80",
    hot: false,
  },
  {
    icon: "brush-outline",
    title: "Barba & Rasurado",
    desc: "Perfilado y rasurado con navaja, toalla caliente y aceites.",
    price: "60",
    hot: true,
  },
  {
    icon: "sparkles-outline",
    title: "Combo Premium",
    desc: "Corte + barba + tratamiento capilar en una sola sesión.",
    price: "130",
    hot: false,
  },
  {
    icon: "color-palette-outline",
    title: "Color & Mechas",
    desc: "Tintes y mechas con productos de alta gama para cabello.",
    price: "150",
    hot: false,
  },
  {
    icon: "water-outline",
    title: "Tratamiento Capilar",
    desc: "Hidratación profunda y control del cabello con keratina.",
    price: "200",
    hot: false,
  },
  {
    icon: "happy-outline",
    title: "Skin Fade",
    desc: "Degradado moderno desde cero hasta cualquier largo.",
    price: "100",
    hot: true,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Encuentra tu barbería",
    desc: "Busca entre cientos de barberías verificadas cerca de ti.",
  },
  {
    number: "02",
    title: "Elige tu servicio",
    desc: "Selecciona el corte, barbero y horario que mejor te convenga.",
  },
  {
    number: "03",
    title: "Confirma tu cita",
    desc: "Recibe confirmación al instante y recordatorio antes de tu cita.",
  },
  {
    number: "04",
    title: "¡Disfruta el resultado!",
    desc: "Llega, relájate y sal con el mejor look de tu vida.",
  },
];

const MOCK_SHOPS = [
  {
    id: 1,
    name: "The Royal Barber",
    address: "Av. Reforma 450, Col. Centro",
    rating: "4.9",
    reviews: 328,
    tag: "Abierto ahora",
    specialty: "Skin Fade",
  },
  {
    id: 2,
    name: "Old School Cuts",
    address: "Calle Morelos 112, Zona Rosa",
    rating: "4.7",
    reviews: 215,
    tag: "Cierra a las 8pm",
    specialty: "Barba clásica",
  },
  {
    id: 3,
    name: "Elite Barbershop",
    address: "Blvd. Juárez 88, Centro Histórico",
    rating: "5.0",
    reviews: 412,
    tag: "Más popular",
    specialty: "Combo Premium",
  },
];

const HeroPattern = () => {
  if (Platform.OS === "web") return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 1,
            height: "200%",
            backgroundColor: "rgba(201,168,76,0.05)",
            left: `${i * 10}%`,
            top: "-50%",
            transform: [{ rotate: "30deg" }],
          }}
        />
      ))}
      <View
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: 190,
          borderWidth: 1,
          borderColor: "rgba(201,168,76,0.06)",
          right: -90,
          top: -70,
        }}
      />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;
  const WHITE = theme.colors.text;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  const nativeDrv = Platform.OS !== "web";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await tokenManager.getToken();
        const userData = await tokenManager.getUser();
        if (token && userData) {
          const dashboards = {
            CLIENTE: "ClientDashboard",
            BARBERO: "BarberDashboard",
            DUENO: "OwnerDashboard",
            SUPER_ADMIN: "SuperAdminDashboard",
          };
          const dest = dashboards[userData.rol];
          if (dest) {
            navigation.reset({
              index: 0,
              routes: [{ name: "LoadingScreen", params: { user: userData } }],
            });
          }
        }
      } catch (e) {
        console.error("Error checkAuth HomeScreen:", e);
      }
    };
    checkAuth();
  }, [navigation]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: nativeDrv,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: nativeDrv,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: nativeDrv,
      }),
    ]).start();
  }, []);

  const animStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  };

  const handleWhatsApp = () =>
    Linking.openURL(
      "https://wa.me/521234567890?text=Hola,%20quiero%20información%20sobre%20Barber%20System",
    );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SharedNavbar navigation={navigation} currentScreen="Home" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.heroContainer, animStyle]}>
          <View style={styles.heroBg} />
          <HeroPattern />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="cut" size={12} color="#C9A84C" />
              <Text style={styles.heroBadgeText}>
                La plataforma #1 para barberías
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              Tu look{"\n"}
              <Text style={styles.heroTitleAccent}>perfecto</Text> a un clic
            </Text>
            <Text style={styles.heroSubtitle}>
              Encuentra las mejores barberías, reserva tu cita al instante y
              olvídate de las esperas.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.heroBtnPrimary}
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.85}
              >
                <Text style={styles.heroBtnPrimaryText}>Reservar cita</Text>
                <Ionicons name="arrow-forward" size={18} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroBtnSecondary}
                onPress={() => navigation.navigate("Barberias")}
                activeOpacity={0.85}
              >
                <Ionicons name="location-outline" size={18} color={WHITE} />
                <Text style={styles.heroBtnSecondaryText}>Ver barberías</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <Animated.View style={[styles.statsStrip, animStyle]}>
          {[
            { n: "500+", l: "Barberías" },
            { n: "12K+", l: "Clientes" },
            { n: "98%", l: "Satisfacción" },
            { n: "50K+", l: "Citas agendadas" },
          ].map((s, i) => (
            <View
              key={i}
              style={[
                styles.statItem,
                i < 3 && !isSmallScreen && styles.statItemBorder,
              ]}
            >
              <Text style={styles.statNumber}>{s.n}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.section, animStyle]}>
          <View style={styles.sectionEyebrow}>
            <View style={styles.sectionEyebrowLine} />
            <Text style={styles.sectionEyebrowText}>Lo más solicitado</Text>
          </View>
          <Text style={styles.sectionTitle}>Servicios populares</Text>
          <Text style={styles.sectionSubtitle}>
            Desde cortes clásicos hasta tratamientos premium — todo en un solo
            lugar.
          </Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((svc, i) => (
              <View
                key={i}
                style={[styles.serviceCard, svc.hot && styles.serviceCardHot]}
              >
                {svc.hot && (
                  <View style={styles.serviceHotBadge}>
                    <Text style={styles.serviceHotBadgeText}>🔥 Popular</Text>
                  </View>
                )}
                <View style={styles.serviceIconCircle}>
                  <Ionicons name={svc.icon} size={24} color="#C9A84C" />
                </View>
                <Text style={styles.serviceTitle}>{svc.title}</Text>
                <Text style={styles.serviceDesc}>{svc.desc}</Text>
                <View style={styles.servicePrice}>
                  <Text style={styles.servicePriceFrom}>desde</Text>
                  <Text style={styles.servicePriceValue}>${svc.price}</Text>
                  <Text style={styles.servicePriceCurrency}>MXN</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.sectionAlt}>
          <View style={styles.sectionEyebrow}>
            <View style={styles.sectionEyebrowLine} />
            <Text style={styles.sectionEyebrowText}>Súper fácil</Text>
          </View>
          <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
          <Text style={styles.sectionSubtitle}>
            En menos de 2 minutos tienes tu cita confirmada.
          </Text>
          <View style={styles.stepsContainer}>
            {STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.number}</Text>
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
                {/* Conector horizontal entre pasos — solo en pantallas medianas/grandes */}
                {!isSmallScreen && i < STEPS.length - 1 && (
                  <View style={styles.stepConnector} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionEyebrow}>
            <View style={styles.sectionEyebrowLine} />
            <Text style={styles.sectionEyebrowText}>Verificadas</Text>
          </View>
          <Text style={styles.sectionTitle}>Barberías destacadas</Text>
          <Text style={styles.sectionSubtitle}>
            Negocios verificados con los mejores ratings de la comunidad.
          </Text>
          <View style={styles.shopsGrid}>
            {MOCK_SHOPS.map((shop) => (
              <View key={shop.id} style={styles.shopCard}>
                <View style={styles.shopCardImage}>
                  <View style={styles.shopCardImageInner}>
                    <Ionicons
                      name="cut"
                      size={40}
                      color="#C9A84C"
                      style={{ opacity: 0.6 }}
                    />
                  </View>
                </View>
                <View style={styles.shopCardBody}>
                  <View style={styles.shopCardHeader}>
                    <Text style={styles.shopCardName}>{shop.name}</Text>
                    <View style={styles.shopCardRating}>
                      <Ionicons name="star" size={12} color="#C9A84C" />
                      <Text style={styles.shopCardRatingText}>
                        {shop.rating}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.shopCardAddressRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={theme.colors.textMuted}
                    />
                    <Text style={styles.shopCardAddress}>{shop.address}</Text>
                  </View>
                  <View style={styles.shopCardMeta}>
                    <Text style={styles.shopCardSpecialty}>
                      ✦ {shop.specialty}
                    </Text>
                    <Text style={styles.shopCardReviews}>
                      {shop.reviews} reseñas
                    </Text>
                  </View>
                  <View style={styles.shopCardFooter}>
                    <View style={styles.shopCardTag}>
                      <Text style={styles.shopCardTagText}>{shop.tag}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.shopCardBtn}
                      onPress={() => navigation.navigate("Login")}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.shopCardBtnText}>Reservar</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={14}
                        color="#1A1A1A"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaIconWrap}>
            <Ionicons
              name="cut"
              size={isSmallScreen ? 28 : 32}
              color="#C9A84C"
            />
          </View>
          <Text style={styles.ctaTitle}>¿Eres dueño de una barbería?</Text>
          <Text style={styles.ctaSubtitle}>
            Únete a cientos de negocios que ya gestionan sus citas y clientes
            con Barber System. Gratis por 30 días.
          </Text>
          <View style={styles.ctaBtns}>
            <TouchableOpacity
              style={styles.ctaBtnDark}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.85}
            >
              <Ionicons name="storefront-outline" size={18} color="#C9A84C" />
              <Text style={styles.ctaBtnDarkText}>Registrar mi barbería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaBtnLight}
              onPress={handleWhatsApp}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#1A1A1A" />
              <Text style={styles.ctaBtnLightText}>Hablar con ventas</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerBrandName}>✂ BARBER SYSTEM</Text>
              <Text style={styles.footerBrandDesc}>
                La plataforma líder para conectar clientes con las mejores
                barberías de México.
              </Text>
              <View style={styles.footerSocial}>
                {["logo-instagram", "logo-facebook", "logo-tiktok"].map(
                  (icon, i) => (
                    <TouchableOpacity key={i} style={styles.footerSocialBtn}>
                      <Ionicons name={icon} size={16} color="#C9A84C" />
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

            {!isSmallScreen && (
              <>
                <View style={styles.footerCol}>
                  <Text style={styles.footerColTitle}>Plataforma</Text>
                  {["Barberías", "Servicios", "Precios", "Promociones"].map(
                    (l, i) => (
                      <Text key={i} style={styles.footerLink}>
                        {l}
                      </Text>
                    ),
                  )}
                </View>
                <View style={styles.footerCol}>
                  <Text style={styles.footerColTitle}>Empresa</Text>
                  {["Nosotros", "Blog", "Carreras", "Prensa"].map((l, i) => (
                    <Text key={i} style={styles.footerLink}>
                      {l}
                    </Text>
                  ))}
                </View>
                <View style={styles.footerCol}>
                  <Text style={styles.footerColTitle}>Legal</Text>
                  {["Privacidad", "Términos", "Cookies"].map((l, i) => (
                    <Text key={i} style={styles.footerLink}>
                      {l}
                    </Text>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>
              © 2026 Barber System. Todos los derechos reservados.
            </Text>
            {!isSmallScreen && (
              <View style={styles.footerBottomLinks}>
                <Text style={styles.footerBottomLink}>Privacidad</Text>
                <Text style={styles.footerBottomLink}>Términos</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleWhatsApp}
        activeOpacity={0.85}
      >
        <Ionicons
          name="logo-whatsapp"
          size={isSmallScreen ? 24 : 28}
          color="#FFF"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
