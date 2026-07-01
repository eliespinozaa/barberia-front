import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { tokenManager, barberiaAPI, usuariosAPI, suscripcionAPI } from '../../config/api';
import createStyles from '../../styles/superadmin/SuperAdminHomeStyles';

const SIDEBAR_ITEMS = [
  { label: 'Inicio',      icon: 'home-outline',      screen: null },
  { label: 'Barberías',   icon: 'storefront-outline', screen: 'BarberiasScreen' },
  { label: 'Usuarios',    icon: 'people-outline',     screen: 'UsuariosScreen' },
  { label: 'Membresias',  icon: 'card-outline',       screen: 'MembresiasScreen' },
  { label: 'Mi Perfil',   icon: 'person-outline',     screen: 'PerfilScreen' },
];





const ACCESOS_DIRECTOS = [
  { titulo: 'Barberias',  desc: 'Administra de forma rapida el catálogo de barberias',         screen: 'BarberiasScreen' },
  { titulo: 'Usuarios',   desc: 'Gestión de los usuarios',                                     screen: 'UsuariosScreen' },
  { titulo: 'Membresias', desc: 'Administra los pagos y suscripciones de manera rapida',       screen: 'MembresiasScreen' },
];

const SuperAdminHomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);
  const isLarge = width >= 1024;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);


  const [cargandoStats, setCargandoStats] = useState(true);
const [statsResumen, setStatsResumen] = useState({
  barberias: 0,
  clientes: 0,
  activas: 0,
  suspendidas: 0,
});
const [statsSuscripciones, setStatsSuscripciones] = useState({
  pagadas: 0,
  porVencer: 0,
  vencidas: 0,
});

const cargarStats = useCallback(async () => {
  setCargandoStats(true);

  const [barberiasRes, usuariosRes] = await Promise.all([
    barberiaAPI.listar(),
    usuariosAPI.listar2(),
  ]);

  const barberias = barberiasRes.success ? barberiasRes.data : [];
  const usuarios = usuariosRes.success ? usuariosRes.data : [];

  const clientes = usuarios.filter((u) => u.rol === 'CLIENTE').length;
  const activas = barberias.filter((b) => b.estado === 1).length;
  const suspendidas = barberias.filter((b) => b.estado !== 1).length;

  setStatsResumen({
    barberias: barberias.length,
    clientes,
    activas,
    suspendidas,
  });

 const suscripcionesRes = await Promise.all(
  barberias.map((b) => suscripcionAPI.obtenerActiva(b.idBarberia))
);

  let pagadas = 0;
  let porVencer = 0;
  let vencidas = 0;
  const hoy = new Date();
  const en7Dias = new Date();
  en7Dias.setDate(hoy.getDate() + 7);

  suscripcionesRes.forEach((res) => {
    if (!res.success || !res.data) return;
    const sub = res.data;

    if (sub.estado === 'VENCIDA') {
      vencidas += 1;
      return;
    }
    if (sub.estado === 'ACTIVA') {
      const fechaFin = new Date(sub.fechaFin);
      if (fechaFin <= en7Dias && fechaFin >= hoy) {
        porVencer += 1;
      } else {
        pagadas += 1;
      }
    }
  });

  setStatsSuscripciones({ pagadas, porVencer, vencidas });
  setCargandoStats(false);
}, []);

useFocusEffect(
  useCallback(() => {
    cargarStats();
  }, [cargarStats])
);

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

  const handleNavegar = (screen) => {
  setDrawerVisible(false);
  if (screen) navigation.navigate(screen);
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
          <Text style={styles.navTitle}>Barber System</Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navIconBtn}>
            <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navAvatar}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Ionicons name="person-outline" size={22} color="#FFFFFF" />
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
            Hola, bienvenido al sistema de super administración...
          </Text>

          {/* ── Panel de stats ── */}
          <View style={styles.statsPanel}>

            {/* Resumen general */}
            <Text style={styles.statsSectionTitle}>Resumen general</Text>
           <View style={styles.statsGrid}>
  {[
    { label: 'Barberias',   value: statsResumen.barberias,   icon: 'storefront-outline' },
    { label: 'Clientes',    value: statsResumen.clientes,    icon: 'people-outline' },
    { label: 'Activas',     value: statsResumen.activas,     icon: 'checkmark-circle-outline' },
    { label: 'Suspendidas', value: statsResumen.suspendidas, icon: 'close-circle-outline' },
  ].map((s) => (
    <View key={s.label} style={styles.statItem}>
      <View style={styles.statHeaderRow}>
        <Ionicons name={s.icon} size={18} color="#FFFFFF" />
        <Text style={styles.statLabel}>{s.label}</Text>
      </View>
      <Text style={styles.statValue}>{cargandoStats ? '...' : s.value}</Text>
    </View>
  ))}
</View>

            {/* Divisor */}
            <View style={styles.statsDivider} />

            {/* Suscripciones */}
            <Text style={styles.statsSectionTitle}>Suscripciones</Text>
           
           <View style={styles.statsGrid}>
  {[
    { label: 'Pagadas',    value: statsSuscripciones.pagadas,   icon: 'checkmark-done-outline' },
    { label: 'Por vencer', value: statsSuscripciones.porVencer, icon: 'warning-outline' },
    { label: 'Vencidas',   value: statsSuscripciones.vencidas,  icon: 'close-square-outline' },
  ].map((s) => (
    <View key={s.label} style={styles.statItem}>
      <View style={styles.statHeaderRow}>
        <Ionicons name={s.icon} size={18} color="#FFFFFF" />
        <Text style={styles.statLabel}>{s.label}</Text>
      </View>
      <Text style={styles.statValue}>{cargandoStats ? '...' : s.value}</Text>
    </View>
  ))}
</View>

          </View>

          {/* ── Accesos Directos ── */}
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

export default SuperAdminHomeScreen;