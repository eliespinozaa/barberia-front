import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '../../styles/common/CatalogosStyles';
import { clienteAPI, tokenManager, barberiaAPI } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const getImagenUri = (imagen) => {
  if (!imagen) return null;
  if (imagen.startsWith('data:image')) return imagen;
  return `data:image/png;base64,${imagen}`;
};

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const normalizar = (str) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const formatHora = (hora) => {
  if (!hora) return '';
  const [h, m] = hora.split(':').map(Number);
  const periodo = h >= 12 ? 'PM' : 'AM';
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hora12} ${periodo}` : `${hora12}:${String(m).padStart(2, '0')} ${periodo}`;
};

const obtenerHorarioHoy = (horarios) => {
  if (!horarios || horarios.length === 0) return null;

  const hoy = DIAS_SEMANA[new Date().getDay()];
  const horarioHoy = horarios.find(
    (h) => normalizar(h.diaSemana) === normalizar(hoy) && h.estado === 1
  );

  if (!horarioHoy) return null;

  return `${formatHora(horarioHoy.horaApertura)} - ${formatHora(horarioHoy.horaCierre)}`;
};

const BarberiCard = ({ item, styles, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.avatarWrap}>
      {item.imagen ? (
        <Image source={{ uri: getImagenUri(item.imagen) }} style={styles.avatarImg} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
    </View>

    <Text style={styles.cardNombre}>{item.nombre}</Text>

{item.calificacion != null && (
  <View style={styles.ratingRow}>
    <Ionicons name="star-outline" size={16} color="#333" />
    <Text style={styles.ratingText}>{item.calificacion.toFixed(1)}</Text>
  </View>
)}

<Text style={styles.sectionBold}>Horarios</Text>
{item.horarios?.length > 0 ? (
  DIAS_SEMANA.slice(1).concat(DIAS_SEMANA[0]).map((dia) => {
    const horario = item.horarios.find(
      (h) => normalizar(h.diaSemana) === normalizar(dia)
    );
    return (
     <View
  key={dia}
  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 2 }}
>
  <Text style={[styles.sectionLabel, { width: 80 }]}>{dia}</Text>
  <Text style={[styles.sectionSmall, { flex: 1, textAlign: 'right' }]}>
    {horario
      ? `${formatHora(horario.horaApertura)} - ${formatHora(horario.horaCierre)}`
      : 'Cerrado'}
  </Text>
</View>
    );
  })
) : (
  <Text style={styles.sectionSmall}>Sin horarios registrados</Text>
)}

    <Text style={styles.sectionLabel}>Teléfono</Text>
    <Text style={styles.sectionBold}>{item.telefono}</Text>

    <Text style={styles.sectionLabel}>Dirección</Text>
    <Text style={styles.sectionSmall}>{item.direccion}</Text>
  </TouchableOpacity>
);

const CatalogoScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const CARD_WIDTH =
    width < 375 ? width * 0.60 :
    width < 768 ? width * 0.50 :
    Math.min(width * 0.38, 300);
  const CARD_MARGIN = width < 375 ? 8 : 12;
  const ITEM_SIZE = CARD_WIDTH + CARD_MARGIN * 2;

  const ARROW_BTN_WIDTH = isSmallScreen ? 34 : 44;
  const ARROW_MARGIN = isSmallScreen ? 2 : 4;
  const [listWidth, setListWidth] = useState(0);
  const flatListPadding = listWidth > 0 ? (listWidth - CARD_WIDTH) / 2 : 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);
  const flatListRef = useRef(null);
  const [error, setError] = useState('');
const { theme } = useTheme();           
  const styles = createStyles(width, theme); 

  const [barberias, setBarberias] = useState([]);
const [loadingList, setLoadingList] = useState(true);

  const goTo = (index) => {
    const next = Math.max(0, Math.min(index, barberias.length - 1));
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  useEffect(() => {
  const cargarBarberias = async () => {
    setLoadingList(true);
    const res = await barberiaAPI.listar();

    if (res.success) {
      const mapeadas = res.data.map((b) => ({
        id: b.idBarberia,
        nombre: b.nombre,
        direccion: b.direccion,
        telefono: b.telefono,
        imagen: b.imagen,
        estado: b.estado === 1 ? 'Abierto' : 'Cerrado',
        calificacion: b.calificacion ?? null, 
         horarios: b.horarios ?? [],          
  horario: obtenerHorarioHoy(b.horarios), 
      }));
      setBarberias(mapeadas);
    } else {
      setError(res.error);
    }
    setLoadingList(false);
  };

  cargarBarberias();
}, []);

  const onViewableChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;


  const handleSelectBarberia = async (item) => {
  setError('');
  setSelectedBar(item);
  setLoading(true);

  try {
    const userActual = await tokenManager.getUser();
    if (!userActual?.id) {
      throw new Error('No se encontró sesión activa');
    }

    const res = await clienteAPI.asociarBarberia(item.id, userActual.id);
    if (!res.success) {
      setLoading(false);
      setError(res.error || 'No se pudo asociar la barbería');
      return;
    }

    const { imagen, ...itemSinImagen } = item;

    const userActualizado = {
      ...userActual,
      clienteAsociado: item.id,
      barberiaInfo: itemSinImagen,
    };

    try {
      await AsyncStorage.setItem('@barber_user', JSON.stringify(userActualizado));
    } catch (storageError) {
      console.log('⚠️ No se pudo persistir localmente:', storageError?.message);
    }

    navigation.replace('ClientHomeScreen', {
      user: userActualizado,
      barberia: item,
    });

  } catch (e) {
    console.log('❌ Excepción en handleSelectBarberia:', e?.message || e);
    setLoading(false);
    setError(e?.message || 'Error de conexión');
  }
};

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>

      {/* Modal de carga */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <View style={styles.loadingIconWrap}>
              <Ionicons name="cut" size={28} color="#C9A84C" />
            </View>
            <ActivityIndicator size="large" color="#C9A84C" style={{ marginBottom: 12 }} />
            <Text style={styles.loadingTitle}>Entrando a</Text>
            <Text style={styles.loadingNombre}>{selectedBar?.nombre}</Text>
            <Text style={styles.loadingSubtitle}>Preparando tu experiencia...</Text>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleWrap}>
          <Text style={styles.titleText}>Catálogo de Barberias</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color={theme.dark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>

{!!error && (
  <View style={{ 
    backgroundColor: '#E74C3C22', 
    marginHorizontal: 20, 
    marginBottom: 10,
    padding: 12, 
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }}>
    <Ionicons name="alert-circle-outline" size={16} color="#E74C3C" />
    <Text style={{ color: '#E74C3C', fontSize: 13 }}>{error}</Text>
  </View>
)}
      {/* Carrusel */}
     
     <View style={styles.carouselWrap}>
  <TouchableOpacity
    style={[styles.arrowBtn, currentIndex === 0 && styles.arrowDisabled]}
    onPress={() => goTo(currentIndex - 1)}
    disabled={currentIndex === 0}
  >
    <Ionicons name="chevron-back" size={20} color={theme.dark ? '#FFF' : '#000'} />
  </TouchableOpacity>


{loadingList ? (
  <ActivityIndicator size="large" color="#C9A84C" style={{ marginTop: 40 }} />
) : barberias.length === 0 ? (
  <Text style={{ textAlign: 'center', marginTop: 40 }}>No hay barberías disponibles</Text>
) : (
 
 <View style={{ flex: 1, overflow: 'hidden', backgroundColor: theme.colors.background }}
    onLayout={(e) => setListWidth(e.nativeEvent.layout.width)} 
  >
    
    {listWidth > 0 && (
      <FlatList
        ref={flatListRef}
        initialScrollIndex={1}
        data={barberias}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BarberiCard
            item={item}
            styles={styles}
            onPress={() => handleSelectBarberia(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={{ paddingHorizontal: flatListPadding }}
        onViewableItemsChanged={onViewableChanged}
        viewabilityConfig={viewConfig}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
      />
    )}
  </View> 
)}

  <TouchableOpacity
    style={[
      styles.arrowBtn,
      currentIndex === barberias.length - 1 && styles.arrowDisabled,
    ]}
    onPress={() => goTo(currentIndex + 1)}
    disabled={currentIndex === barberias.length - 1}
  >
    <Ionicons name="chevron-forward" size={20} color={theme.dark ? '#FFF' : '#000'} />
    
  </TouchableOpacity>
</View>
    </SafeAreaView>
  );
};

export default CatalogoScreen;