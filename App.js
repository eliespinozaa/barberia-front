import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from './config/api';
import { ThemeProvider } from './context/ThemeContext';

import HomeScreen    from './screens/common/HomeScreen';
import LoginScreen   from './screens/common/LoginScreen';
import LoadingScreen from './screens/common/LoadingScreen';
import RegisterScreen from './screens/common/RegisterScreen';
import CatalogosScreen  from './screens/common/CatalogosScreen';
import ClientHomeScreen from './screens/client/ClientHomeScreen';
import OwnerHomeScreen from './screens/owner/OwnerHomeScreen';
import SuperAdminHomeScreen from './screens/superadmin/SuperAdminHomeScreen';
import BarberHomeScreen from './screens/barber/BarberHomeScreen';
import BarberiasScreen from './screens/superadmin/BarberiasScreen';
import BarberiasNuevaScreen from './screens/superadmin/BarberiasNuevaScreen';
import DetalleBarberiaScreen from './screens/superadmin/DetalleBarberiaScreen';
import EditarBarberoScreen from './screens/superadmin/EditarBarberoScreen';
import EditarServicioScreen from './screens/superadmin/EditarServicioScreen';
import UsuariosScreen from './screens/superadmin/UsuariosScreen';
import EditarUsuarioScreen from './screens/superadmin/EditarUsuarioScreen';
import MembresiasScreen from './screens/superadmin/MembresiasScreen';
import DetalleMembresiaScreen from './screens/superadmin/DetalleMembresiaScreen';
import PerfilScreen from './screens/superadmin/PerfilScreen';

import AdminClientesScreen from './screens/owner/AdminClientesScreen';
import AdminBarberosScreen from './screens/owner/AdminBarberosScreen';
import AdminServiciosScreen from './screens/owner/AdminServiciosScreen';
import AdminPromocionesScreen from './screens/owner/AdminPromocionesScreen';
import AdminEditarPromocionScreen from './screens/owner/AdminEditarPromocionScreen';
import AdminHorariosScreen from './screens/owner/AdminHorariosScreen';
import AdminEditarHorarioScreen from './screens/owner/AdminEditarHorarioScreen';
import AdminMembresiaScreen from './screens/owner/AdminMembresiaScreen';
import AdminReseñasScreen from './screens/owner/AdminReseñasScreen';
import AdminCitasScreen from './screens/owner/AdminCitasScreen';


import ClienteAgendarCitaScreen from './screens/client/ClienteAgendarCitaScreen';
import ClienteCitasScreen from './screens/client/ClienteCitasScreen';
import ClienteEditarCitasScreen from './screens/client/ClienteEditarCitasScreen';


import BarberCitasScreen from './screens/barber/BarberCitasScreen';
import BarberHorariosScreen from './screens/barber/BarberHorariosScreen';
import BarberResenasScreen from './screens/barber/BarberResenasScreen';








const Stack = createNativeStackNavigator();
const PERSISTENCE_KEY = 'BARBER_NAV_STATE';

const linking = {
  prefixes: ['http://localhost:8081', 'barbersystem://'],
  config: {
    screens: {
      Home:     '',
      Login:    'login',
      Register: 'register',
    },
  },
};

export default function App() {
  const [isReady,         setIsReady]         = useState(false);
  const [initialState,    setInitialState]    = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = verificando
  const navigationRef = useRef();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token    = await tokenManager.getToken();
        const userData = await tokenManager.getUser();

        if (token && userData) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }

        let hasDeepLink = false;
        if (typeof window !== 'undefined') {
          hasDeepLink = window.location.pathname !== '/';
        }

        if (!hasDeepLink) {
          try {
            const saved = await AsyncStorage.getItem(PERSISTENCE_KEY);
            if (saved) setInitialState(JSON.parse(saved));
          } catch (_) {}
        }
      } catch (e) {
        console.error('Bootstrap error:', e);
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, []);

  if (!isReady || isAuthenticated === null) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <View style={{ flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#C9A84C', fontSize: 22, fontWeight: '900', letterSpacing: 2 }}>
              ✂ BARBER SYSTEM
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 8 }}>
              Cargando...
            </Text>
          </View>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          initialState={initialState}
          onStateChange={(state) => {
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
          }}
        >
          <Stack.Navigator
            initialRouteName={isAuthenticated ? 'LoadingScreen' : 'Home'}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Home"  component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{ gestureEnabled: false, animation: 'fade' }}
            />

           
            <Stack.Screen name="Register"       component={RegisterScreen} />

<Stack.Screen name="CatalogosScreen"  component={CatalogosScreen}  options={{ gestureEnabled: false }} />
<Stack.Screen name="ClientHomeScreen" component={ClientHomeScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="OwnerHomeScreen"  component={OwnerHomeScreen}  options={{ gestureEnabled: false }} />
<Stack.Screen name="SuperAdminHomeScreen" component={SuperAdminHomeScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="BarberHomeScreen"   component={BarberHomeScreen}   options={{ gestureEnabled: false }} />
<Stack.Screen name="BarberiasScreen"    component={BarberiasScreen}    options={{ gestureEnabled: false }} />
<Stack.Screen name="BarberiasNuevaScreen" component={BarberiasNuevaScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="DetalleBarberiaScreen" component={DetalleBarberiaScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="EditarBarberoScreen" component={EditarBarberoScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="EditarServicioScreen" component={EditarServicioScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="UsuariosScreen" component={UsuariosScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="EditarUsuarioScreen" component={EditarUsuarioScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="MembresiasScreen" component={MembresiasScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="DetalleMembresiaScreen" component={DetalleMembresiaScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="PerfilScreen" component={PerfilScreen} options={{ gestureEnabled: false }} />

<Stack.Screen name="AdminClientesScreen" component={AdminClientesScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminBarberosScreen" component={AdminBarberosScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminServiciosScreen" component={AdminServiciosScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminPromocionesScreen" component={AdminPromocionesScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminEditarPromocionScreen" component={AdminEditarPromocionScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminEditarHorarioScreen" component={AdminEditarHorarioScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminHorariosScreen" component={AdminHorariosScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminMembresiaScreen" component={AdminMembresiaScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminReseñasScreen" component={AdminReseñasScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="AdminCitasScreen" component={AdminCitasScreen} options={{ gestureEnabled: false }} />


<Stack.Screen name="ClienteAgendarCitaScreen" component={ClienteAgendarCitaScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="ClienteCitasScreen" component={ClienteCitasScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="ClienteEditarCitasScreen" component={ClienteEditarCitasScreen} options={{ gestureEnabled: false }} />


<Stack.Screen name="BarberCitasScreen" component={BarberCitasScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="BarberHorariosScreen" component={BarberHorariosScreen} options={{ gestureEnabled: false }} />
<Stack.Screen name="BarberResenasScreen" component={BarberResenasScreen} options={{ gestureEnabled: false }} />






          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}