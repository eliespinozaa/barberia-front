import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/client/ClienteCitasStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { tokenManager, clienteAPI, citaAPI } from '../../config/api';

const ITEMS_POR_PAGINA = 10;

// Colores fijos por estado (no cambian con el tema, deben leerse bien sobre
// la card blanca/oscura en ambos modos)
const ESTADOS_CONFIG = {
  PENDIENTE:  { label: 'Pendiente',  bg: '#F5B940', text: '#1A1A1A' },
  CONFIRMADA: { label: 'Confirmada', bg: '#5AA9F7', text: '#1A1A1A' },
  EN_PROCESO: { label: 'En proceso', bg: '#9B8CF2', text: '#FFFFFF' },
  COMPLETADA: { label: 'Completada', bg: '#4ADE80', text: '#1A1A1A' },
  CANCELADA:  { label: 'Cancelada',  bg: '#F87171', text: '#1A1A1A' },
};

const formatearHora = (horaStr) => (horaStr ? horaStr.slice(0, 5) : '--:--');

const construirPaginas = (total, actual) => {
  const numeros = Array.from({ length: total }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === total || Math.abs(n - actual) <= 1
  );
  return numeros.reduce((acc, n, idx) => {
    if (idx > 0 && n - numeros[idx - 1] > 1) acc.push('...');
    acc.push(n);
    return acc;
  }, []);
};

const ClienteCitasScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';
  const esMovil = width < 700;

  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [barberia, setBarberia] = useState(null);
  const [citas, setCitas] = useState([]);
  const [pagina, setPagina] = useState(1);

  const [resultado, setResultado] = useState({ visible: false, type: 'success', title: '', message: '' });
  const [citaACancelar, setCitaACancelar] = useState(null);

  const cargarCitas = useCallback(async () => {
    setCargando(true);
    const userActual = await tokenManager.getUser();
    if (!userActual?.id) {
      setCargando(false);
      return;
    }

    const resBarberia = await clienteAPI.obtenerBarberiaAsociada(userActual.id);
    if (!resBarberia.success) {
      setCargando(false);
      return;
    }
    setBarberia(resBarberia.data);

    // Supuesto: citaAPI.historial(clienteId, barberiaId) -> GET /citas/historial
    const resHistorial = await citaAPI.historial(userActual.id, resBarberia.data.id);
    if (resHistorial.success) {
      setCitas(resHistorial.data || []);
    }

    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarCitas();
      setPagina(1);
    }, [cargarCitas])
  );

  const totalPaginas = Math.max(Math.ceil(citas.length / ITEMS_POR_PAGINA), 1);

  const citasPagina = useMemo(() => {
    const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
    return citas.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [citas, pagina]);

  const paginasVisibles = useMemo(() => construirPaginas(totalPaginas, pagina), [totalPaginas, pagina]);

  const irPrimera = () => setPagina(1);
  const irUltima = () => setPagina(totalPaginas);

  const handleEditar = (cita) => {
  navigation.navigate('ClienteEditarCitasScreen', { cita }); 
};

  const handleResena = (cita) => {
    navigation.navigate('ClienteResenaScreen', { idCita: cita.id });
  };

  const ejecutarCancelacion = async () => {
    if (!citaACancelar) return;
    const cita = citaACancelar;
    setCitaACancelar(null);
    setProcesando(true);

    // Supuesto: citaAPI.cancelar(idCita) -> PATCH /citas/{idCita}/cancelar
    const res = await citaAPI.cancelar(cita.id);
    setProcesando(false);

    if (res.success) {
      setResultado({
        visible: true,
        type: 'success',
        title: 'Cita cancelada',
        message: 'Tu cita fue cancelada correctamente.',
      });
      cargarCitas();
    } else {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo cancelar',
        message: res.error || 'Intenta de nuevo más tarde.',
      });
    }
  };

  const Badge = ({ estado }) => {
    const cfg = ESTADOS_CONFIG[estado] || { label: estado, bg: '#D1D5DB', text: '#1A1A1A' };
    return (
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.badgeTexto, { color: cfg.text }]}>{cfg.label}</Text>
      </View>
    );
  };

  const Acciones = ({ cita }) => {
    const { estado } = cita;

    if (estado === 'PENDIENTE') {
      return (
        <View style={styles.accionesRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => handleEditar(cita)}>
                      <Feather name="edit-2" size={18} color="#1A1A1A" />

          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCitaACancelar(cita)}>
                      <Feather name="trash-2" size={18} color="#EF4444" />

          </TouchableOpacity>
        </View>
      );
    }

    if (estado === 'CONFIRMADA' || estado === 'EN_PROCESO') {
      return (
        <View style={styles.accionesRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCitaACancelar(cita)}>
                      <Feather name="trash-2" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      );
    }

    if (estado === 'COMPLETADA') {
      return (
        <TouchableOpacity style={styles.resenaBtn} onPress={() => handleResena(cita)}>
          <Ionicons name="star" size={13} color="#B8860B" />
          <Text style={styles.resenaBtnTexto}>Dejar reseña</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <LoadingOverlay visible={cargando} message="Cargando tus citas..." />
      <LoadingOverlay visible={procesando} message="Procesando..." />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.navLogoWrap}>
            {barberia?.imagen ? (
              <Image source={{ uri: barberia.imagen }} style={styles.navLogoImg} />
            ) : (
              <Ionicons name="cut" size={18} color="#C9A84C" />
            )}
          </View>
          <Text style={styles.navBarberia}>{barberia?.nombre || 'Mi Barbería'}</Text>
        </View>
        <TouchableOpacity style={styles.navAvatar}>
          <Ionicons name="person-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Título + back + agregar ── */}
      <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
        </TouchableOpacity>

        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>Mis citas</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('ClienteAgendarCitaScreen')}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.bodyInner} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>

          {!esMovil && (
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.colBarbero]}>Barbero</Text>
              <Text style={[styles.headerCell, styles.colServicio]}>Servicio</Text>
              <Text style={[styles.headerCell, styles.colFecha]}>Fecha</Text>
              <Text style={[styles.headerCell, styles.colHora]}>Hora</Text>
              <Text style={[styles.headerCell, styles.colEstatus]}>Estatus</Text>
              <Text style={[styles.headerCell, styles.colAcciones]}>Acciones</Text>
            </View>
          )}

          <View style={styles.tableCard}>

            {citasPagina.length === 0 && !cargando ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="calendar-outline"
                  size={36}
                  color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                />
                <Text style={styles.emptyText}>Aún no tienes citas registradas</Text>
              </View>
            ) : esMovil ? (
              citasPagina.map((c) => (
                <View key={c.id} style={styles.mobileCard}>
                  <View style={styles.mobileCardHeader}>
                    <Text style={styles.mobileCardBarbero} numberOfLines={1}>{c.barberoNombre}</Text>
                    <Badge estado={c.estado} />
                  </View>
                  <Text style={styles.mobileCardServicio} numberOfLines={1}>{c.servicioNombre}</Text>
                  <View style={styles.mobileCardFila}>
                    <Text style={styles.mobileCardDato}>{c.fecha}</Text>
                    <Text style={styles.mobileCardDato}>{formatearHora(c.horaInicio)}</Text>
                  </View>
                  <View style={styles.mobileCardAcciones}>
                    <Acciones cita={c} />
                  </View>
                </View>
              ))
            ) : (
              citasPagina.map((c) => (
                <View key={c.id} style={styles.dataRow}>
                  <Text style={[styles.dataCell, styles.colBarbero]} numberOfLines={1}>{c.barberoNombre}</Text>
                  <Text style={[styles.dataCell, styles.colServicio]} numberOfLines={1}>{c.servicioNombre}</Text>
                  <Text style={[styles.dataCell, styles.colFecha]}>{c.fecha}</Text>
                  <Text style={[styles.dataCell, styles.colHora]}>{formatearHora(c.horaInicio)}</Text>
                  <View style={styles.colEstatus}>
                    <Badge estado={c.estado} />
                  </View>
                  <View style={styles.colAcciones}>
                    <Acciones cita={c} />
                  </View>
                </View>
              ))
            )}

            {citas.length > 0 && (
              <View style={styles.paginacionWrap}>
                <Text style={styles.paginacionTexto}>
                  Mostrando {(pagina - 1) * ITEMS_POR_PAGINA + 1}-
                  {Math.min(pagina * ITEMS_POR_PAGINA, citas.length)} de {citas.length} resultados
                </Text>

                <View style={styles.paginacionBotones}>
                  <TouchableOpacity onPress={irPrimera} disabled={pagina === 1} style={styles.paginaNavBtn}>
                    <Ionicons name="play-skip-back" size={13} color={pagina === 1 ? '#B0B0B0' : (isDark ? '#FFFFFF' : '#1A1A1A')} />
                  </TouchableOpacity>

                  {paginasVisibles.map((n, idx) =>
                    n === '...' ? (
                      <Text key={`dots-${idx}`} style={styles.paginaDots}>…</Text>
                    ) : (
                      <TouchableOpacity
                        key={n}
                        style={[styles.paginaNum, n === pagina && styles.paginaNumActiva]}
                        onPress={() => setPagina(n)}
                      >
                        <Text style={[styles.paginaNumTexto, n === pagina && styles.paginaNumTextoActiva]}>
                          {n}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}

                  <TouchableOpacity onPress={irUltima} disabled={pagina === totalPaginas} style={styles.paginaNavBtn}>
                    <Ionicons name="play-skip-forward" size={13} color={pagina === totalPaginas ? '#B0B0B0' : (isDark ? '#FFFFFF' : '#1A1A1A')} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>
        </View>
      </ScrollView>

      {/* ── Confirmación de cancelación (Sí / No) ── */}
 {citaACancelar && (
  <View style={styles.confirmOverlay}>
    <View style={styles.confirmCard}>
      <Text style={styles.confirmTitulo}>
        ¿Estás seguro de que deseas{'\n'}cancelar esta cita?
      </Text>
      <View style={styles.confirmBotones}>
        <TouchableOpacity
          style={styles.confirmBtnNo}
          onPress={() => setCitaACancelar(null)}
        >
          <Text style={styles.confirmBtnNoTexto}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmBtnSi}
          onPress={ejecutarCancelacion}
        >
          <Text style={styles.confirmBtnSiTexto}>Sí, cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() => setResultado({ visible: false, type: 'success', title: '', message: '' })}
      />
    </SafeAreaView>
  );
};

export default ClienteCitasScreen;