import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { tokenManager, barberiaAPI } from '../../config/api';
import createStyles from '../../styles/owner/OwnerHomeStyles';

const SIDEBAR_ITEMS = [
  { label: 'Inicio',          icon: 'home-outline',       screen: 'OwnerHomeScreen', active: true },
  { label: 'Citas Agendadas', icon: 'calendar-outline',   screen: 'CitasAgendadasScreen' },
  { label: 'Clientes',        icon: 'people-outline',     screen: 'AdminClientesScreen' },
  { label: 'Barberos',        icon: 'cut-outline',        screen: 'AdminBarberosScreen' },
  { label: 'Servicios',       icon: 'list-outline',       screen: 'AdminServiciosScreen' },
  { label: 'Promociones',     icon: 'flash-outline',      screen: 'AdminPromocionesScreen' },
  { label: 'Horarios',        icon: 'time-outline',       screen: 'AdminHorariosScreen' },
  { label: 'Membresía',       icon: 'card-outline',       screen: 'MembresiaScreen' },
  { label: 'Reseñas',         icon: 'star-outline',       screen: 'ResenasScreen' },
];

const STATS_ROW1 = [
  { label: 'Citas de hoy',     value: '8',         icon: 'time-outline' },
  { label: 'Citas canceladas', value: '0',         icon: 'close-circle-outline' },
  { label: 'Ingresos',         value: '$ 10, 340', icon: 'arrow-down-outline' },
  { label: 'Promociones',      value: '5',         icon: 'flash-outline' },
];

const STATS_ROW2 = [
  { label: 'Clientes nuevos', value: '2',    icon: 'person-add-outline' },
  { label: 'Calificación',    value: '9.0',  icon: 'star-outline' },
  { label: 'Reseñas',         value: '+99',  icon: 'happy-outline' },
  { label: 'Servicios',       value: '12',   icon: 'document-text-outline' },
];
const ACCESOS_DIRECTOS = [
  { titulo: 'Clientes',    desc: 'Registra y elimina a clientes de manera rápida.', screen: 'AdminClientesScreen' },
  { titulo: 'Servicios',   desc: 'Administra el catálogo de servicios que ofrecemos en nuestra barbería', screen: 'AdminServiciosScreen' },
  { titulo: 'Promociones', desc: 'Crea nuevas promociones y así obtener nuevas visitas', screen: 'AdminPromocionesScreen' },
];

const OwnerHomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);
  const isLarge = width >= 1024;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

 const [barberia, setBarberia] = useState(null);

useEffect(() => {
  const cargarBarberia = async () => {
    const user = await tokenManager.getUser();
    if (!user?.id) return;

    const res = await barberiaAPI.obtenerPorUsuario(user.id);
    if (res.success) {
      setBarberia(res.data); 
    } else {
      console.log('Error al traer barbería:', res.error);
    }
  };
  cargarBarberia();
}, []);

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

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
            <Ionicons name="cut" size={20} color="#C9A84C" />
          </View>
          <Text style={styles.navTitle}>Classic Barber</Text>
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
          <TouchableOpacity style={styles.dropdownItem} onPress={() => setDropdownVisible(false)}>
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
    onPress={() => item.screen && navigation.navigate(item.screen, { barberiaId: barberia?.id })}
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

        {/* ── Sidebar ── */}
        {isLarge && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarItems}>
           {SIDEBAR_ITEMS.map((item) => (
  <TouchableOpacity
    key={item.label}
    style={styles.drawerItem}
    onPress={() => {
      setDrawerVisible(false);
      if (item.screen) navigation.navigate(item.screen, { barberiaId: barberia?.id });
    }}
  >
    <Text style={[styles.drawerText, item.active && styles.drawerTextActive]}>
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
    onPress={() => navigation.navigate(acc.screen, { barberiaId: barberia?.id })}
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