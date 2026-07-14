import React, { useState, useCallback, useMemo } from 'react';
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
import createStyles from '../../styles/barber/BarberResenasStyles';
import { resenaAPI, tokenManager, barberoAPI } from '../../config/api';
import LoadingOverlay from '../../components/LoadingOverlay';

// ── Helper: normaliza números que pueden venir como {parsedValue} o como número plano ──
const num = (valor) => {
  if (valor == null) return 0;
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'object' && 'parsedValue' in valor) return valor.parsedValue;
  return Number(valor) || 0;
};

// ── Helper: calcula "hace X días" a partir del createdAt ──
const calcularDiasAgo = (fechaISO) => {
  if (!fechaISO) return 0;
  const diffMs = Date.now() - new Date(fechaISO).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

// ── Componente: fila de estrellas ──
const Estrellas = ({ calificacion, size = 16, styles }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Ionicons
        key={n}
        name={n <= calificacion ? 'star' : 'star-outline'}
        size={size}
        color={n <= calificacion ? '#F5B301' : 'rgba(255,255,255,0.35)'}
      />
    ))}
  </View>
);

// ── Componente: tarjeta de una reseña individual ──
const ReseñaCard = ({ reseña, styles }) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewCardName}>{reseña.nombre}</Text>
    <Estrellas calificacion={reseña.calificacion} styles={styles} />
    <Text style={styles.reviewCardQuote} numberOfLines={1}>
      &ldquo;{reseña.comentario}&rdquo;
    </Text>
    <Text style={styles.reviewCardDate}>
      {reseña.diasAgo === 0
        ? 'Hoy'
        : `Hace ${reseña.diasAgo} ${reseña.diasAgo === 1 ? 'dia' : 'dias'}`}
    </Text>
  </View>
);

const BarberResenasScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';
  const mutedColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';

  const [idBarberia, setIdBarberia] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [resumen, setResumen] = useState({ promedio: 0, total: 0, desglose: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

const LIMITE_INICIAL = 4; 

const [mostrarTodas, setMostrarTodas] = useState(false);
const [cargandoMas, setCargandoMas] = useState(false);


const handleVerTodas = () => {
  if (mostrarTodas) return; 
  setCargandoMas(true);
  setTimeout(() => {
    setMostrarTodas(true);
    setCargandoMas(false);
  }, 500);
};


  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    const user = await tokenManager.getUser();
    if (!user?.id) {
      setCargando(false);
      return;
    }

    const resBarbero = await barberoAPI.obtenerPorUsuario(user.id);
    if (!resBarbero.success) {
      setError(resBarbero.error || 'No se pudo obtener tu información de barbero');
      setCargando(false);
      return;
    }

    const idBarberiaActual = resBarbero.data.idBarberia;
    setIdBarberia(idBarberiaActual);

    const [resLista, resResumen] = await Promise.all([
      resenaAPI.listarPorBarberia(idBarberiaActual),
      resenaAPI.resumen(idBarberiaActual),
    ]);

    if (resLista.success) {
      setReseñas(resLista.data.map((r) => ({
        id: r.id,
        nombre: r.nombreUsuario || 'Usuario',
        calificacion: r.calificacion,
        comentario: r.comentario,
        diasAgo: calcularDiasAgo(r.createdAt),
      })));
    } else {
      setError(resLista.error);
    }

    if (resResumen.success) {
      const porEstrella = {};
      (resResumen.data.desglose || []).forEach((d) => {
        porEstrella[d.estrellas] = num(d.porcentaje);
      });

      setResumen({
        promedio: num(resResumen.data.promedio),
        total: resResumen.data.total ?? 0,
        desglose: [5, 4, 3, 2, 1].map((n) => ({ estrellas: n, porcentaje: porEstrella[n] ?? 0 })),
      });
    } else {
      setError((prev) => prev ?? resResumen.error);
    }

    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const barraMax = useMemo(
    () => Math.max(...resumen.desglose.map((d) => d.porcentaje), 1),
    [resumen.desglose]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <LoadingOverlay visible={cargando} message="Cargando reseñas..." />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Reseñas</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>
          {error && <Text style={{ color: '#E85D5D', marginBottom: 12 }}>{error}</Text>}

          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeaderRow}>
              <Ionicons name="star-outline" size={22} color="#F5B301" />
              <Text style={styles.summaryRating}>{resumen.promedio}</Text>
            </View>
            <Text style={styles.summaryCount}>{resumen.total} reseñas</Text>
            <View style={styles.breakdownList}>
              {resumen.desglose.map((fila) => (
                <View key={fila.estrellas} style={styles.breakdownRow}>
                  <Text style={styles.breakdownNumber}>{fila.estrellas}</Text>
                  <Ionicons name="star-outline" size={14} color={styles.breakdownStarColor.color} />
                  <View style={styles.breakdownTrack}>
                    <View style={[styles.breakdownFill, { width: `${(fila.porcentaje / barraMax) * 100}%` }]} />
                  </View>
                  <Text style={styles.breakdownPercent}>{fila.porcentaje}%</Text>
                </View>
              ))}
            </View>
          </View>

         <View style={styles.reviewsHeaderRow}>
  <Text style={styles.sectionTitle}>Ultimas reseñas</Text>
  {!mostrarTodas && reseñas.length > LIMITE_INICIAL && (
    <TouchableOpacity
      style={styles.verTodasBtn}
      onPress={handleVerTodas}
      disabled={cargandoMas}
    >
      <Text style={styles.verTodasBtnText}>
        {cargandoMas ? 'Cargando...' : 'Ver todas'}
      </Text>
    </TouchableOpacity>
  )}
</View>



{cargandoMas && (
  <View style={{ paddingVertical: 16, alignItems: 'center' }}>
    <Text style={{ color: mutedColor, fontSize: 13 }}>Cargando más reseñas...</Text>
  </View>
)}

          {reseñas.length === 0 && !cargando ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={36} color={mutedColor} />
              <Text style={styles.emptyText}>Aún no hay reseñas.</Text>
            </View>
          ) : (
            <View style={styles.reviewsGrid}>
              {reseñas.slice(0, 5).map((reseña) => (
                <ReseñaCard key={reseña.id} reseña={reseña} styles={styles} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BarberResenasScreen;