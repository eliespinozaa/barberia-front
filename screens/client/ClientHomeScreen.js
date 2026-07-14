import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import createStyles from "../../styles/client/ClientHomeStyles";
import {
  tokenManager,
  clienteAPI,
  promocionAPI,
  servicioAPI,
  citaAPI,
} from "../../config/api";
import { useTheme } from "../../context/ThemeContext";
import LoadingOverlay from "../../components/LoadingOverlay";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// ── Helper: desenreda números que vienen como {parsedValue} o como número plano ──
const num = (valor) => {
  if (valor == null) return 0;
  if (typeof valor === "number") return valor;
  if (typeof valor === "object" && "parsedValue" in valor)
    return valor.parsedValue;
  return Number(valor) || 0;
};

const formatearFechaCita = (fechaISO) => {
  if (!fechaISO) return "";
  const f = new Date(fechaISO + "T00:00:00");
  return `${f.getDate()} de ${MESES[f.getMonth()]}`;
};

const ClientHomeScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(route?.params?.user ?? null);
  const [barberia, setBarberia] = useState(null);
  const [promociones, setPromociones] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [proximaCita, setProximaCita] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const userActual = user ?? (await tokenManager.getUser());
      if (!userActual?.id) {
        setError("No se pudo identificar al usuario");
        return;
      }
      setUser(userActual);

      const resBarberia = await clienteAPI.obtenerBarberiaAsociada(
        userActual.id,
      );
      if (!resBarberia.success) {
        setError(resBarberia.error);
        return;
      }
      setBarberia(resBarberia.data);

      const idBarberia = resBarberia.data.id;

      const [resPromos, resServicios, resCitas] = await Promise.all([
        promocionAPI.listarPorBarberia(idBarberia),
        servicioAPI.listarPorBarberia(idBarberia),
        citaAPI.historial(userActual.id, idBarberia),
      ]);

      if (resPromos.success) setPromociones(resPromos.data);

      if (resServicios.success) {
        // Normalizamos precio (puede venir como {source, parsedValue})
        const serviciosNormalizados = resServicios.data
          .slice(0, 4)
          .map((s) => ({
            ...s,
            precio: num(s.precio),
          }));
        setServicios(serviciosNormalizados);
      }

      if (resCitas.success) {
        const hoy = new Date().toISOString().split("T")[0];
        const futuras = resCitas.data
          .filter(
            (c) =>
              c.fecha >= hoy &&
              c.estado !== "CANCELADA" &&
              c.estado !== "COMPLETADA",
          )
          .sort((a, b) => a.fecha.localeCompare(b.fecha));
        setProximaCita(futuras[0] ?? null);
      }
    } catch (e) {
      setError("Error inesperado al cargar los datos");
    } finally {
      setCargando(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace("Home");
  };

  const abrirEnMaps = () => {
    if (!barberia?.direccion) return;
    const query = encodeURIComponent(
      `${barberia.direccion}`,
    );
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url);
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <LoadingOverlay visible={cargando} message="Cargando tu barbería..." />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.navLogoWrap}>
            {barberia?.imagen ? (
              <Image
                source={{ uri: barberia.imagen }}
                style={styles.navLogoImg}
              />
            ) : (
              <Ionicons name="cut" size={18} color="#C9A84C" />
            )}
          </View>
          <Text style={styles.navBarberia}>
            {barberia?.nombre || "Mi Barbería"}
          </Text>
        </View>

        {width >= 768 && (
          <View style={styles.navLinks}>
            <TouchableOpacity>
              <Text style={styles.navLinkActive}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownVisible(false); navigation.navigate('ClienteAgendarCitaScreen'); }}>
              <Text style={styles.navLink}>Agendar cita</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDropdownVisible(false); navigation.navigate('ClienteCitasScreen'); }}>
              <Text style={styles.navLink}>Mis citas</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navIcon}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIcon}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Ionicons name="person-circle-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
  style={styles.dropdownItem}
  onPress={() => { setDropdownVisible(false); navigation.navigate('PerfilScreen'); }}
>
  <Ionicons name="person-outline" size={18} color={theme.colors.text} />
  <Text style={styles.dropdownText}>Mi Perfil</Text>
</TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              toggleTheme();
              setDropdownVisible(false);
            }}
          >
            <Ionicons name="moon-outline" size={18} color={theme.colors.text} />
            <Text style={styles.dropdownText}>Modo Oscuro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={18}
              color={theme.colors.text}
            />
            <Text style={styles.dropdownText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {error && (
          <Text
            style={{ color: "#E85D5D", textAlign: "center", marginTop: 12 }}
          >
            {error}
          </Text>
        )}

        {/* ── Saludo ── */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            Hola {user?.nombreCompleto?.split(" ")[0] || "Cliente"}, Bienvenido
            a {barberia?.nombre || "tu barbería"}
          </Text>
        </View>

        {/* ── Próxima cita ── */}
        {proximaCita && (
          <View style={styles.proximaCitaCard}>
            <View style={styles.proximaCitaHeader}>
              <Ionicons name="calendar" size={20} color="#C9A84C" />
              <Text style={styles.proximaCitaLabel}>Tu próxima cita</Text>
            </View>
            <Text style={styles.proximaCitaFecha}>
              {formatearFechaCita(proximaCita.fecha)} ·{" "}
              {proximaCita.horaInicio?.slice(0, 5)}
            </Text>
            <Text style={styles.proximaCitaEstado}>{proximaCita.estado}</Text>
          </View>
        )}

        {/* ── Hero: video + tarjeta de ubicación ── */}
        <View style={styles.heroRow}>
          <View style={styles.heroVideo}>
            <View style={styles.videoPlaceholder} />
          </View>
          <View style={styles.heroMap}>
            <TouchableOpacity
              style={styles.addressCard}
              onPress={abrirEnMaps}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={28} color="#C9A84C" />
              <Text style={styles.addressText} numberOfLines={2}>
                {barberia?.direccion || "Dirección no disponible"}
              </Text>
              <View style={styles.addressBtn}>
                <Ionicons name="navigate-outline" size={14} color="#0B1014" />
                <Text style={styles.addressBtnText}>Cómo llegar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Servicios destacados ── */}
        {servicios.length > 0 && (
          <View style={styles.promoSection}>
            <Text style={styles.promoTitle}>Servicios destacados</Text>
            <View style={styles.promoGrid}>
              {servicios.map((s) => (
                <View key={s.id} style={styles.promoCard}>
                  <View style={styles.promoCardHeader}>
                    <Text style={styles.promoCardTitulo}>{s.nombre}</Text>
                    <View style={styles.promoIconWrap}>
                      {s.imagen ? (
                        <Image
                          source={{ uri: s.imagen }}
                          style={styles.promoIconImg}
                        />
                      ) : (
                        <Ionicons
                          name="cut-outline"
                          size={16}
                          color="#C9A84C"
                        />
                      )}
                    </View>
                  </View>
                  {!!s.descripcion && (
                    <Text style={styles.promoCardDesc} numberOfLines={2}>
                      {s.descripcion}
                    </Text>
                  )}
                  <Text style={styles.promoCardBadge}>$ {s.precio}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Promociones ── */}
        {promociones.length > 0 && (
          <View style={styles.promoSection}>
            <Text style={styles.promoTitle}>Promociones</Text>
            <View style={styles.promoGrid}>
              {promociones.map((promo) => (
                <View key={promo.id} style={styles.promoCard}>
                  <View style={styles.promoCardHeader}>
                    <Text style={styles.promoCardTitulo}>{promo.titulo}</Text>
                    <View style={styles.promoIconWrap}>
                      {promo.imagen ? (
                        <Image
                          source={{ uri: promo.imagen }}
                          style={styles.promoIconImg}
                        />
                      ) : (
                        <Ionicons name="flash" size={16} color="#C9A84C" />
                      )}
                    </View>
                  </View>
                  {!!promo.descripcion && (
                    <Text style={styles.promoCardDesc}>
                      {promo.descripcion}
                    </Text>
                  )}
                  {!!promo.descuento && (
                    <Text style={styles.promoCardBadge}>
                      {num(promo.descuento)}% de descuento
                    </Text>
                  )}
                  <Text style={styles.promoCardValidez}>
                    Válido hasta {formatearFechaCita(promo.fechaFin)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom nav (móvil) ── */}
      {width < 768 && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Ionicons name="home-outline" size={22} color="#C9A84C" />
            <Text style={[styles.bottomNavText, { color: "#C9A84C" }]}>
              Inicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ClienteAgendarCitaScreen')}>
            <Ionicons name="calendar-outline" size={22} color="#888" />
            <Text style={styles.bottomNavText}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ClienteCitasScreen')}>
            <Ionicons name="time-outline" size={22} color="#888" />
            <Text style={styles.bottomNavText}>Mis citas</Text>
          </TouchableOpacity>
         <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('PerfilScreen')}>
  <Ionicons name="person-outline" size={22} color="#888" />
  <Text style={styles.bottomNavText}>Perfil</Text>
</TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ClientHomeScreen;
