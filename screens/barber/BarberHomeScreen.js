import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { tokenManager, barberoAPI, citaAPI } from '../../config/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/barber/BaberHomeStyles';

const SIDEBAR_ITEMS = [
  { label: 'Inicio',          icon: 'home-outline',      active: true,  screen: null },
  { label: 'Citas',       icon: 'calendar-outline',  screen: 'BarberCitasScreen' },
  { label: 'Horario',    icon: 'time-outline',      screen: 'BarberHorariosScreen' },
  { label: 'Reseñas',     icon: 'star-outline',      screen: 'BarberResenasScreen' },
];


const ESTADO_LABELS = {
  PENDIENTE:  { label: 'Pendiente',  color: '#C9A84C' },
  CONFIRMADA: { label: 'Confirmada', color: '#5AA9F7' },
  EN_PROCESO: { label: 'En proceso', color: '#9B8CF2' },
  COMPLETADA: { label: 'Completada', color: '#4CAF50' },
  CANCELADA:  { label: 'Cancelada',  color: '#F44336' },
};

const BarberHomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);
  const isLarge = width >= 1024;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerVisible, setDrawerVisible]     = useState(false);


  const [cargando, setCargando] = useState(true);
const [citasHoy, setCitasHoy] = useState([]);
const [statsData, setStatsData] = useState({ hoy: 0, completadas: 0, canceladas: 0 });

const formatearFechaISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const irA = (screen) => {
  if (!screen) return; 
  navigation.navigate(screen);
};

const formatearHora = (horaStr) => {
  if (!horaStr) return '--:--';
  const [h, m] = horaStr.split(':');
  const hora = parseInt(h, 10);
  const sufijo = hora >= 12 ? 'PM' : 'AM';
  const hora12 = hora % 12 === 0 ? 12 : hora % 12;
  return `${hora12}:${m} ${sufijo}`;
};

const cargarDatos = useCallback(async () => {
  setCargando(true);
  const user = await tokenManager.getUser();
  if (!user?.id) {
    setCargando(false);
    return;
  }

  const resBarbero = await barberoAPI.obtenerPorUsuario(user.id);
  if (!resBarbero.success) {
    setCargando(false);
    return;
  }
  const barbero = resBarbero.data;

  const fechaHoy = formatearFechaISO(new Date());

  const resCitas = await citaAPI.listarPorFecha(barbero.idBarberia, fechaHoy);

  if (resCitas.success) {
    const propias = resCitas.data.filter((c) => c.idBarbero === barbero.id);
    setCitasHoy(propias);

    setStatsData({
      hoy: propias.length,
      completadas: propias.filter((c) => c.estado === 'COMPLETADA').length,
      canceladas: propias.filter((c) => c.estado === 'CANCELADA').length,
    });
  }

  setCargando(false);
}, []);

useFocusEffect(
  useCallback(() => {
    cargarDatos();
  }, [cargarDatos])
);

const STATS = [
  { label: 'Citas de hoy', value: String(statsData.hoy), icon: 'calendar-outline' },
  { label: 'Completadas', value: String(statsData.completadas), icon: 'checkmark-circle-outline' },
  { label: 'Canceladas', value: String(statsData.canceladas), icon: 'close-circle-outline' },
];

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>

      {/* ── Navbar ── */}
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
      style={styles.drawerItem}
      onPress={() => {
        setDrawerVisible(false);
        irA(item.screen);
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
      style={styles.sidebarItem}
      onPress={() => irA(item.screen)}
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
            Hola, bienvenido a tu panel de barbero...
          </Text>

          {/* ── Stats ── */}
          <View style={styles.statsPanel}>
            <Text style={styles.statsSectionTitle}>Resumen de hoy</Text>
            <View style={styles.statsGrid}>
              {STATS.map((s) => (
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
          
{/* ── Citas de hoy ── */}
<Text style={styles.sectionTitle}>Citas de hoy</Text>
{citasHoy.length === 0 && !cargando ? (
  <Text style={styles.greeting}>No tienes citas para hoy.</Text>
) : (
  citasHoy.map((cita) => {
    const estado = ESTADO_LABELS[cita.estado] ?? ESTADO_LABELS.PENDIENTE;
    return (
      <TouchableOpacity key={cita.id} style={styles.citaCard}>
        <View style={styles.citaRow}>
          <View style={styles.citaInfo}>
            <Text style={styles.citaCliente}>{cita.nombreCliente}</Text>
            <Text style={styles.citaServicio}>{cita.servicio}</Text>
          </View>
          <View style={styles.citaMeta}>
            <Text style={styles.citaHora}>{formatearHora(cita.hora)}</Text>
            <View style={[styles.citaEstadoBadge, { borderColor: estado.color }]}>
              <Text style={[styles.citaEstadoText, { color: estado.color }]}>
                {estado.label}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  })
)}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BarberHomeScreen;