import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { tokenManager, barberiaAPI, dashboardAPI } from '../../config/api';
import createStyles from '../../styles/owner/OwnerHomeStyles';

const SIDEBAR_ITEMS = [
  { label: 'Inicio',          icon: 'home-outline',       screen: null, active: true },
  { label: 'Citas Agendadas', icon: 'calendar-outline',   screen: 'AdminCitasScreen' },
  { label: 'Clientes',        icon: 'people-outline',     screen: 'AdminClientesScreen' },
  { label: 'Barberos',        icon: 'cut-outline',        screen: 'AdminBarberosScreen' },
  { label: 'Servicios',       icon: 'list-outline',       screen: 'AdminServiciosScreen' },
  { label: 'Promociones',     icon: 'flash-outline',      screen: 'AdminPromocionesScreen' },
  { label: 'Horarios',        icon: 'time-outline',       screen: 'AdminHorariosScreen' },
  { label: 'Membresía',       icon: 'card-outline',       screen: 'AdminMembresiaScreen' },
  { label: 'Reseñas',         icon: 'star-outline',       screen: 'AdminReseñasScreen' },
];

const ACCESOS_DIRECTOS = [
  { titulo: 'Citas Agendadas', desc: 'Consulta y gestiona las citas programadas del día.', screen: 'AdminCitasScreen' },
  { titulo: 'Clientes',        desc: 'Registra y elimina a clientes de manera rápida.', screen: 'AdminClientesScreen' },
  { titulo: 'Barberos',        desc: 'Agrega, edita o elimina a los barberos de tu equipo.', screen: 'AdminBarberosScreen' },
  { titulo: 'Servicios',       desc: 'Administra el catálogo de servicios que ofrecemos en nuestra barbería', screen: 'AdminServiciosScreen' },
  { titulo: 'Promociones',     desc: 'Crea nuevas promociones y así obtener nuevas visitas', screen: 'AdminPromocionesScreen' },
  { titulo: 'Horarios',        desc: 'Define y ajusta los horarios de atención de tu barbería.', screen: 'AdminHorariosScreen' },
  { titulo: 'Membresía',       desc: 'Revisa el estado y los pagos de tu membresía.', screen: 'AdminMembresiaScreen' },
  { titulo: 'Reseñas',         desc: 'Lee lo que opinan tus clientes sobre tu barbería.', screen: 'AdminReseñasScreen' },
];

const OwnerHomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);
  const isLarge = width >= 1024;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [barberia, setBarberia] = useState(null);
  const [cargandoBarberia, setCargandoBarberia] = useState(true);

  // ── Resumen del dashboard ──
  const [resumen, setResumen] = useState(null);
  const [cargandoResumen, setCargandoResumen] = useState(false);

  const cargarBarberia = useCallback(async () => {
    setCargandoBarberia(true);
    const user = await tokenManager.getUser();
    if (!user?.id) {
      setCargandoBarberia(false);
      return;
    }

    const res = await barberiaAPI.obtenerPorUsuario(user.id);
    if (res.success) {
      setBarberia(res.data);
    } else {
      console.log('Error al traer barbería:', res.error);
    }
    setCargandoBarberia(false);
  }, []);

  const cargarResumen = useCallback(async (idBarberia) => {
    if (!idBarberia) return;
    setCargandoResumen(true);
    const res = await dashboardAPI.obtenerResumen(idBarberia);
    if (res.success) {
      setResumen(res.data);
    } else {
      console.log('Error al traer el resumen:', res.error);
    }
    setCargandoResumen(false);
  }, []);

  // Recarga la barbería cada vez que la pantalla vuelve a tener foco
  useFocusEffect(
    useCallback(() => {
      cargarBarberia();
    }, [cargarBarberia])
  );

  // En cuanto ya tengamos el id de la barbería, pedimos el resumen
  useFocusEffect(
    useCallback(() => {
      if (barberia?.id) {
        cargarResumen(barberia.id);
      }
    }, [barberia?.id, cargarResumen])
  );

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

  // ── Un solo handler de navegación, igual que en SuperAdminHomeScreen ──
  const handleNavegar = (screen) => {
    setDrawerVisible(false);
    if (screen) navigation.navigate(screen, { barberiaId: barberia?.id });
  };

  const formatearIngresos = (valor) => {
    const num = Number(valor ?? 0);
    return `$ ${num.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const STATS_ROW1 = [
    { label: 'Citas de hoy',     value: resumen?.citasHoy ?? '—',             icon: 'time-outline' },
    { label: 'Citas canceladas', value: resumen?.citasCanceladas ?? '—',      icon: 'close-circle-outline' },
    { label: 'Ingresos',         value: formatearIngresos(resumen?.ingresos), icon: 'arrow-down-outline' },
    { label: 'Promociones',      value: resumen?.promociones ?? '—',          icon: 'flash-outline' },
  ];

  const STATS_ROW2 = [
    { label: 'Clientes nuevos', value: resumen?.clientesNuevos ?? '—',        icon: 'person-add-outline' },
    { label: 'Calificación',    value: resumen?.calificacion ?? '—',          icon: 'star-outline' },
    { label: 'Reseñas',         value: `+${resumen?.["reseñas"] ?? 0}`,           icon: 'happy-outline' },
    { label: 'Servicios',       value: resumen?.servicios ?? '—',             icon: 'document-text-outline' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>

      {/* ── Navbar superior ── */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
  {!isLarge && (
    <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerVisible(true)}>
      <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  )}
  <View style={styles.navLogoWrap}>
    {barberia?.imagen ? (
      <Image source={{ uri: barberia.imagen }} style={styles.navLogoImage} />
    ) : (
      <Ionicons name="cut" size={20} color="#C9A84C" />
    )}
  </View>
  <Text style={styles.navTitle} numberOfLines={1}>
    {barberia?.nombre || 'Cargando...'}
  </Text>
</View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navIcon}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navAvatar}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Ionicons name="person-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Dropdown perfil ── */}
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { setDropdownVisible(false); navigation.navigate('PerfilScreen'); }}
          >
            <Ionicons name="person-outline" size={18} color="#FFFFFF" />
            <Text style={styles.dropdownText}>Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { toggleTheme(); setDropdownVisible(false); }}>
            <Ionicons name="moon-outline" size={18} color="#FFFFFF" />
            <Text style={styles.dropdownText}>Modo Oscuro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            <Text style={styles.dropdownText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Drawer móvil ── */}
      {drawerVisible && (
        <>
          <TouchableOpacity
            style={styles.drawerOverlay}
            activeOpacity={1}
            onPress={() => setDrawerVisible(false)}
          />
          <View style={styles.drawer}>
            <TouchableOpacity style={styles.drawerClose} onPress={() => setDrawerVisible(false)}>
              <Ionicons name="close-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <View>
              {SIDEBAR_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.sidebarItem}
                  onPress={() => handleNavegar(item.screen)}
                >
                  <Text style={[styles.sidebarText, item.active && styles.sidebarTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.bodyRow}>

        {/* ── Sidebar grande ── */}
        {isLarge && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarItems}>
              {SIDEBAR_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.sidebarItem}
                  onPress={() => handleNavegar(item.screen)}
                >
                  <Text style={[styles.sidebarText, item.active && styles.sidebarTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Contenido principal ── */}
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.mainContentInner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.greeting}>
            Hola, bienvenido al sistema de administración...
          </Text>

          <View style={styles.statsPanel}>
            <View style={styles.statsGrid}>
              {STATS_ROW1.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <View style={styles.statHeaderRow}>
                    <Ionicons name={s.icon} size={16} color="#C9A84C" />
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statsGrid}>
              {STATS_ROW2.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <View style={styles.statHeaderRow}>
                    <Ionicons name={s.icon} size={16} color="#C9A84C" />
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Accesos Directos</Text>
          {ACCESOS_DIRECTOS.map((acc) => (
            <TouchableOpacity
              key={acc.titulo}
              style={styles.accesoCard}
              onPress={() => handleNavegar(acc.screen)}
            >
              <Text style={styles.accesoTitulo}>{acc.titulo}</Text>
              <Text style={styles.accesoDesc}>{acc.desc}</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default OwnerHomeScreen;