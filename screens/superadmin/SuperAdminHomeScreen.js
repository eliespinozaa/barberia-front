import React, { useState } from 'react';
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
import { tokenManager } from '../../config/api';
import createStyles from '../../styles/superadmin/SuperAdminHomeStyles';

const SIDEBAR_ITEMS = [
  { label: 'Inicio',      icon: 'home-outline',    active: true },
  { label: 'Barberías',   icon: 'storefront-outline' },
  { label: 'Usuarios',    icon: 'people-outline' },
  { label: 'Membresias',  icon: 'card-outline' },
];

const STATS_RESUMEN = [
  { label: 'Barberias',    value: '12',  icon: 'time-outline' },
  { label: 'Clientes',     value: '25',  icon: 'close-circle-outline' },
  { label: 'Activas',      value: '10',  icon: 'arrow-down-outline' },
  { label: 'Suspendidas',  value: '2',   icon: 'flash-outline' },
];

const STATS_SUSCRIPCIONES = [
  { label: 'Pagadas',     value: '9.0',  icon: 'briefcase-outline' },
  { label: 'Por vencer',  value: '+99',  icon: 'warning-outline' },
  { label: 'Vencidas',    value: '12',   icon: 'close-square-outline' },
];

const ACCESOS_DIRECTOS = [
  { titulo: 'Barberias',  desc: 'Administra de forma rapida el cataologo de barberias' },
  { titulo: 'Usuarios',   desc: 'Gestion de los usuarios' },
  { titulo: 'Membresias', desc: 'Administra los pagos y suscripciones de manera rapida' },
];

const SuperAdminHomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);
  const isLarge = width >= 1024;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

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
    onPress={() => {
      if (item.label === 'Barberias') {
        navigation.navigate('BarberiasScreen');
      }
    }}
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
          onPress={() => {
            if (item.label === 'Barberias') {
              navigation.navigate('BarberiasScreen');
            }
          }}
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
              {STATS_RESUMEN.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <View style={styles.statHeaderRow}>
                    <Ionicons name={s.icon} size={18} color="#FFFFFF" />
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              ))}
            </View>

            {/* Divisor */}
            <View style={styles.statsDivider} />

            {/* Suscripciones */}
            <Text style={styles.statsSectionTitle}>Suscripciones</Text>
            <View style={styles.statsGrid}>
              {STATS_SUSCRIPCIONES.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <View style={styles.statHeaderRow}>
                    <Ionicons name={s.icon} size={18} color="#FFFFFF" />
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                  <Text style={styles.statValue}>{s.value}</Text>
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
    onPress={() => {
  if (acc.titulo === 'Barberias') {
    navigation.navigate('BarberiasScreen');
  }
}}
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