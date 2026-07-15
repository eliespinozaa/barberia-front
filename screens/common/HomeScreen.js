import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  tokenManager,
  barberiaAPI,
  resenaAPI,
  servicioAPI,
} from "../../config/api";
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
    title: "Elige tu servicio",
    desc: "Corte, barba o combo — selecciona el servicio que necesitas.",
  },
  {
    number: "02",
    title: "Elige tu barbero",
    desc: "Escoge al barbero de tu preferencia dentro de la barbería.",
  },
  {
    number: "03",
    title: "Selecciona fecha y hora",
    desc: "Consulta la disponibilidad real y elige el horario que te convenga.",
  },
  {
    number: "04",
    title: "Confirma tu cita",
    desc: "Revisa los datos y confirma. Recibirás el comprobante al instante.",
  },
];

const normalizarPrecio = (valor) => {
  if (valor == null) return 0;
  if (typeof valor === "number") return valor;
  if (typeof valor === "object" && "parsedValue" in valor)
    return valor.parsedValue;
  return Number(valor) || 0;
};

const construirUriImagen = (base64) => {
  if (!base64) return null;
  if (base64.startsWith("data:")) return base64;
  return `data:image/jpeg;base64,${base64}`;
};

const iconoPorNombre = (nombre = "") => {
  const n = nombre.toLowerCase();
  if (n.includes("barba") || n.includes("afeit") || n.includes("rasur"))
    return "brush-outline";
  if (n.includes("combo") || n.includes("premium")) return "sparkles-outline";
  if (n.includes("color") || n.includes("mecha") || n.includes("tinte"))
    return "color-palette-outline";
  if (
    n.includes("tratamiento") ||
    n.includes("hidrat") ||
    n.includes("keratina")
  )
    return "water-outline";
  if (n.includes("fade") || n.includes("degrad")) return "happy-outline";
  return "cut-outline";
};

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

  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const nativeDrv = Platform.OS !== "web";

  useEffect(() => {
    const cargarHomeData = async () => {
      setLoadingShops(true);
      setLoadingServices(true);

      const res = await barberiaAPI.listar();

      if (res?.success && Array.isArray(res.data)) {
        const activas = res.data.filter(
          (b) => b.estado !== false && b.estado !== 0,
        );
        const destacadas = activas.slice(0, 3);

        // ── Barberías + reseñas (igual que antes) ──
        const conResumen = await Promise.all(
          destacadas.map(async (shop) => {
            const resResumen = await resenaAPI.resumen(shop.idBarberia);
            return {
              ...shop,
              id: shop.idBarberia,
              rating: resResumen?.success ? resResumen.data?.promedio : null,
              totalResenas: resResumen?.success
                ? resResumen.data?.totalResenas
                : 0,
            };
          }),
        );
        setShops(conResumen);
        setLoadingShops(false);

        // ── Servicios reales de esas mismas barberías ──
        const resultadosServicios = await Promise.all(
          destacadas.map((shop) =>
            servicioAPI.listarPorBarberia(shop.idBarberia),
          ),
        );

        const mapaServicios = new Map();
        resultadosServicios.forEach((resServ) => {
          if (resServ?.success && Array.isArray(resServ.data)) {
            resServ.data.forEach((s) => {
              const clave = (s.nombre || "").trim().toLowerCase();
              if (!clave) return;
              if (mapaServicios.has(clave)) {
                mapaServicios.get(clave).count += 1;
              } else {
                mapaServicios.set(clave, {
                  nombre: s.nombre,
                  precio: normalizarPrecio(s.precio),
                  icon: iconoPorNombre(s.nombre),
                  imagen: s.imagen || null,
                  count: 1,
                });
              }
            });
          }
        });

        const listaServicios = Array.from(mapaServicios.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
          .map((s) => ({ ...s, hot: s.count > 1 }));

        setServices(listaServicios);
        setLoadingServices(false);
      } else {
        setShops([]);
        setLoadingShops(false);
        setServices([]);
        setLoadingServices(false);
      }
    };

    cargarHomeData();
  }, []);

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
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
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
              <Image
                source={require("../../assets/Logo.png")}
                style={styles.heroBadgeLogo}
                resizeMode="contain"
              />
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

        <Animated.View style={[styles.section, animStyle]}>
          <View style={styles.sectionEyebrow}>
            <View style={styles.sectionEyebrowLine} />
            <Text style={styles.sectionEyebrowText}>Lo más solicitado</Text>
          </View>
          <Text style={styles.sectionTitle}>Servicios populares</Text>
          <Text style={styles.sectionSubtitle}>
            Servicios reales que ofrecen nuestras barberías registradas.
          </Text>

          {loadingServices ? (
            <Text
              style={{
                color: theme.colors.textMuted,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Cargando servicios...
            </Text>
          ) : services.length === 0 ? (
            <Text
              style={{
                color: theme.colors.textMuted,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Aún no hay servicios registrados.
            </Text>
          ) : (
            <View style={styles.servicesGrid}>
              {services.map((svc, i) => (
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
                    {svc.imagen ? (
                      <Image
                        source={{ uri: construirUriImagen(svc.imagen) }}
                        style={styles.serviceImageInner}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name={svc.icon} size={24} color="#C9A84C" />
                    )}
                  </View>
                  <Text style={styles.serviceTitle}>{svc.nombre}</Text>
                  <View style={styles.servicePrice}>
                    <Text style={styles.servicePriceFrom}>desde</Text>
                    <Text style={styles.servicePriceValue}>${svc.precio}</Text>
                    <Text style={styles.servicePriceCurrency}>MXN</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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

          {loadingShops ? (
            <Text
              style={{
                color: theme.colors.textMuted,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Cargando barberías...
            </Text>
          ) : shops.length === 0 ? (
            <Text
              style={{
                color: theme.colors.textMuted,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Aún no hay barberías registradas.
            </Text>
          ) : (
            <View style={styles.shopsGrid}>
              {shops.map((shop) => (
                <View key={shop.id} style={styles.shopCard}>
                  <View style={styles.shopCardImage}>
                    {shop.imagen ? (
                      <Image
                        source={{ uri: shop.imagen }}
                        style={styles.shopCardImageInner}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.shopCardImageInner}>
                        <Ionicons
                          name="cut"
                          size={40}
                          color="#C9A84C"
                          style={{ opacity: 0.6 }}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.shopCardBody}>
                    <View style={styles.shopCardHeader}>
                      <Text style={styles.shopCardName}>{shop.nombre}</Text>
                      {shop.rating != null && (
                        <View style={styles.shopCardRating}>
                          <Ionicons name="star" size={12} color="#C9A84C" />
                          <Text style={styles.shopCardRatingText}>
                            {Number(shop.rating).toFixed(1)}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.shopCardAddressRow}>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color={theme.colors.textMuted}
                      />
                      <Text style={styles.shopCardAddress}>
                        {shop.direccion || "Dirección no disponible"}
                      </Text>
                    </View>
                    {shop.totalResenas > 0 && (
                      <View style={styles.shopCardMeta}>
                        <Text style={styles.shopCardReviews}>
                          {shop.totalResenas} reseñas
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.ctaSection}>
          {/* ──<View style={styles.ctaIconWrap}>
            <Ionicons
              name="cut"
              size={isSmallScreen ? 28 : 32}
              color="#C9A84C"
            />
          </View>─── */}
          <Text style={styles.ctaTitle}>¿Eres dueño de una barbería?</Text>
          <Text style={styles.ctaSubtitle}>
            Únete a cientos de negocios que ya gestionan sus citas y clientes
            con Barber System.
          </Text>
          <View style={styles.ctaBtns}>
            {/* ──  <TouchableOpacity
              style={styles.ctaBtnDark}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.85}
            >
              <Ionicons name="storefront-outline" size={18} color="#C9A84C" />
              <Text style={styles.ctaBtnDarkText}>Registrar mi barbería</Text>
            </TouchableOpacity> ─── */}
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
              <Image
                source={require("../../assets/Logo.png")}
                style={styles.footerLogoImage}
                resizeMode="contain"
              />
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
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>
              © 2026 Barber System. Todos los derechos reservados.
            </Text>
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
