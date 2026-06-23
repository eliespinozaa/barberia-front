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
import createStyles from '../../styles/barber/BaberHomeStyles';

const SIDEBAR_ITEMS = [
  { label: 'Inicio',          icon: 'home-outline',      active: true },
  { label: 'Mis Citas',       icon: 'calendar-outline' },
  { label: 'Mis Horarios',    icon: 'time-outline' },
  { label: 'Mis Reseñas',     icon: 'star-outline' },
];

const STATS = [
  { label: 'Citas de hoy',     value: '5',    icon: 'calendar-outline' },
  { label: 'Completadas',      value: '3',    icon: 'checkmark-circle-outline' },
  { label: 'Canceladas',       value: '1',    icon: 'close-circle-outline' },
  { label: 'Calificación',     value: '9.2',  icon: 'star-outline' },
];

// Citas de ejemplo — las reemplazarás con datos reales de tu API
const CITAS_HOY = [
  {
    id: '1',
    cliente:  'Carlos Ramírez',
    servicio: 'Corte + Barba',
    hora:     '10:00 AM',
    estado:   'pendiente',
  },
  {
    id: '2',
    cliente:  'Luis Hernández',
    servicio: 'Corte Clásico',
    hora:     '11:30 AM',
    estado:   'completada',
  },
  {
    id: '3',
    cliente:  'Andrés Torres',
    servicio: 'Barba',
    hora:     '01:00 PM',
    estado:   'pendiente',
  },
];

const ESTADO_LABELS = {
  pendiente:  { label: 'Pendiente',  color: '#C9A84C' },
  completada: { label: 'Completada', color: '#4CAF50' },
  cancelada:  { label: 'Cancelada',  color: '#F44336' },
};

const BarberHomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);
  const isLarge = width >= 1024;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerVisible, setDrawerVisible]     = useState(false);

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

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
                  onPress={() => setDrawerVisible(false)}
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
                <TouchableOpacity key={item.label} style={styles.sidebarItem}>
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
          {CITAS_HOY.map((cita) => {
            const estado = ESTADO_LABELS[cita.estado] ?? ESTADO_LABELS.pendiente;
            return (
              <TouchableOpacity key={cita.id} style={styles.citaCard}>
                <View style={styles.citaRow}>
                  <View style={styles.citaInfo}>
                    <Text style={styles.citaCliente}>{cita.cliente}</Text>
                    <Text style={styles.citaServicio}>{cita.servicio}</Text>
                  </View>
                  <View style={styles.citaMeta}>
                    <Text style={styles.citaHora}>{cita.hora}</Text>
                    <View style={[styles.citaEstadoBadge, { borderColor: estado.color }]}>
                      <Text style={[styles.citaEstadoText, { color: estado.color }]}>
                        {estado.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BarberHomeScreen;