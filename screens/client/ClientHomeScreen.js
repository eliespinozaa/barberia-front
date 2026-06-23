import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../../styles/client/ClientHomeStyles';
import { tokenManager } from '../../config/api';
import { useTheme } from '../../context/ThemeContext';

const PROMOCIONES = [
  {
    id: 1,
    titulo: 'Fade + Barba',
    desc: 'Obtén corte fade y perfilado de barba con descuento.',
    badge: '20% de descuento',
    validez: 'Válido hasta...',
  },
  {
    id: 2,
    titulo: '2×1 en corte infantil',
    desc: '',
    badge: '',
    validez: 'Válido hasta...',
  },
  {
    id: 3,
    titulo: 'Primer corte con descuento',
    desc: '15% OFF para nuevos clientes.',
    badge: '',
    validez: 'Válido hasta...',
  },
];

const ClientHomeScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const barberia = route?.params?.barberia;
  const user = route?.params?.user;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const isWeb = Platform.OS === 'web';
const { theme, toggleTheme } = useTheme(); // ← agrega esto
  const styles = createStyles(width, theme);  // ← pasa el theme

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
          <View style={styles.navLogoWrap}>
            <Ionicons name="cut" size={18} color="#C9A84C" />
          </View>
          <Text style={styles.navBarberia}>{barberia?.nombre || 'Mi Barbería'}</Text>
        </View>

        {width >= 768 && (
          <View style={styles.navLinks}>
            <TouchableOpacity><Text style={styles.navLinkActive}>Inicio</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navLink}>Agendar cita</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.navLink}>Mis citas</Text></TouchableOpacity>
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

      {/* ── Dropdown perfil ── */}
      {dropdownVisible && (
        <View style={styles.dropdown}>
         <TouchableOpacity style={styles.dropdownItem} onPress={() => setDropdownVisible(false)}>
  <Ionicons name="person-outline" size={18} color={theme.colors.text} />
  <Text style={styles.dropdownText}>Mi Perfil</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.dropdownItem} onPress={() => { toggleTheme(); setDropdownVisible(false); }}>
  <Ionicons name="moon-outline" size={18} color={theme.colors.text} />
  <Text style={styles.dropdownText}>Modo Oscuro</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
  <Ionicons name="log-out-outline" size={18} color={theme.colors.text} />
  <Text style={styles.dropdownText}>Cerrar Sesión</Text>
</TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Saludo ── */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            Hola {user?.nombreCompleto?.split(' ')[0] || 'Cliente'}, Bienvenido a {barberia?.nombre || 'tu barbería'}
          </Text>
        </View>

        {/* ── Hero: video + mapa ── */}
        <View style={styles.heroRow}>
          <View style={styles.heroVideo}>
            {/* Placeholder video — reemplaza con tu componente de video */}
            <View style={styles.videoPlaceholder} />
          </View>
          <View style={styles.heroMap}>
            {/* Placeholder mapa — reemplaza con MapView */}
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location-outline" size={32} color="#888" />
              <View style={styles.mapControls}>
                <Text style={styles.mapControlBtn}>＋</Text>
                <Text style={styles.mapControlBtn}>－</Text>
                <Text style={styles.mapControlBtn}>⊕</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Promociones ── */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Promociones</Text>
          <View style={styles.promoGrid}>
            {PROMOCIONES.map((promo) => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoCardHeader}>
                  <Text style={styles.promoCardTitulo}>{promo.titulo}</Text>
                  <View style={styles.promoIconWrap}>
                    <Ionicons name="flash" size={16} color="#C9A84C" />
                  </View>
                </View>
                {!!promo.desc && (
                  <Text style={styles.promoCardDesc}>{promo.desc}</Text>
                )}
                {!!promo.badge && (
                  <Text style={styles.promoCardBadge}>{promo.badge}</Text>
                )}
                <Text style={styles.promoCardValidez}>{promo.validez}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom nav (móvil) ── */}
      {width < 768 && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Ionicons name="home-outline" size={22} color="#C9A84C" />
            <Text style={[styles.bottomNavText, { color: '#C9A84C' }]}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Ionicons name="calendar-outline" size={22} color="#888" />
            <Text style={styles.bottomNavText}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Ionicons name="time-outline" size={22} color="#888" />
            <Text style={styles.bottomNavText}>Mis citas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Ionicons name="person-outline" size={22} color="#888" />
            <Text style={styles.bottomNavText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
};

export default ClientHomeScreen;