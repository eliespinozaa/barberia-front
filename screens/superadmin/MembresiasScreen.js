import React, { useState, useCallback, useMemo,useRef  } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/MembresiasStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import { barberiaAPI, suscripcionAPI, pagoAPI } from '../../config/api';

const PAGE_SIZE = 10;
const FILTROS = ['Todas', 'Activo', 'Por vencer', 'Vencida'];

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A';
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anio}`;
};

const MembresiasScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);

  const [cargando, setCargando] = useState(true);
  const [filas, setFilas] = useState([]);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [filtro, setFiltro] = useState('Todas');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [pagina, setPagina] = useState(1);

  const filtroRef = useRef(null);
const [dropPos, setDropPos] = useState({ top: 0, left: 0 });

  const calcularEstadoVisual = (sub) => {
    if (!sub) return 'Vencida';
    if (sub.estado === 'VENCIDA') return 'Vencida';
    if (sub.estado === 'SUSPENDIDA') return 'Vencida';
    if (sub.estado === 'ACTIVA') {
      const hoy = new Date();
      const en7Dias = new Date();
      en7Dias.setDate(hoy.getDate() + 7);
      const fechaFin = new Date(sub.fechaFin);
      if (fechaFin <= en7Dias) return 'Por vencer';
      return 'Activo';
    }
    return 'Vencida';
  };

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    const barberiasRes = await barberiaAPI.listar();
    const barberias = barberiasRes.success ? barberiasRes.data : [];

    const [suscripcionesRes, pagosRes] = await Promise.all([
      Promise.all(barberias.map((b) => suscripcionAPI.obtenerActiva(b.idBarberia))),
      Promise.all(barberias.map((b) => pagoAPI.listarPorBarberia(b.idBarberia))),
    ]);

    const filasNuevas = barberias.map((b, i) => {
      const subRes = suscripcionesRes[i];
      const sub = subRes.success ? subRes.data : null;
      return {
        barberiaId: b.idBarberia,
        nombre: b.nombre,
        estadoVisual: calcularEstadoVisual(sub),
        fechaFin: sub?.fechaFin || null,
      };
    });

    const ahora = new Date();
    let totalIngresos = 0;
    pagosRes.forEach((res) => {
      if (!res.success) return;
      res.data.forEach((pago) => {
        if (pago.estado !== 'PAGADO' || !pago.fechaPago) return;
        const fechaPago = new Date(pago.fechaPago);
        if (
          fechaPago.getMonth() === ahora.getMonth() &&
          fechaPago.getFullYear() === ahora.getFullYear()
        ) {
          totalIngresos += pago.monto?.parsedValue ?? Number(pago.monto?.source ?? 0);
        }
      });
    });

    setFilas(filasNuevas);
    setIngresosMes(totalIngresos);
    setCargando(false);
  }, []);

  useFocusEffect(useCallback(() => { cargarDatos(); }, [cargarDatos]));

  const stats = useMemo(() => ({
    activas:   filas.filter((f) => f.estadoVisual === 'Activo').length,
    porVencer: filas.filter((f) => f.estadoVisual === 'Por vencer').length,
    vencidas:  filas.filter((f) => f.estadoVisual === 'Vencida').length,
  }), [filas]);

  const filasFiltradas = useMemo(() =>
    filtro === 'Todas' ? filas : filas.filter((f) => f.estadoVisual === filtro),
  [filas, filtro]);

  const totalPaginas = Math.max(1, Math.ceil(filasFiltradas.length / PAGE_SIZE));
  const filasPagina  = filasFiltradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const cambiarFiltro = (f) => {
    setFiltro(f);
    setDropdownVisible(false);
    setPagina(1);
  };

  const badgeStyle = (estadoVisual) => {
    if (estadoVisual === 'Activo')     return styles.badgeActivo;
    if (estadoVisual === 'Por vencer') return styles.badgePorVencer;
    return styles.badgeVencida;
  };

  const formatearMoneda = (num) =>
    `$${num.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Membresias</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>

          {/* ── Stats ── */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>ACTIVAS</Text>
              <Text style={styles.statValue}>{cargando ? '...' : stats.activas}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>POR VENCER</Text>
              <Text style={styles.statValue}>{cargando ? '...' : stats.porVencer}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>VENCIDAS</Text>
              <Text style={styles.statValue}>{cargando ? '...' : stats.vencidas}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>INGRESOS / MES</Text>
              <Text style={styles.statValue}>{cargando ? '...' : formatearMoneda(ingresosMes)}</Text>
            </View>
          </View>



          {/* ── Filtro ── */}
<View style={styles.filtroRow}>
  <Text style={styles.filtroLabel}>Estado:</Text>
  <TouchableOpacity
    ref={filtroRef}
    style={styles.filtroDropdown}
    onPress={() => {
      filtroRef.current?.measure((x, y, w, h, pageX, pageY) => {
        setDropPos({ top: pageY + h + 6, left: pageX });
        setDropdownVisible(true);
      });
    }}
  >
    <Text style={styles.filtroDropdownText}>{filtro}</Text>
    <Ionicons name="chevron-down" size={16} color="#1A1A1A" />
  </TouchableOpacity>
</View>

          {/* ── Tabla ── */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colBarberia]}>Barberia</Text>
            <Text style={[styles.tableHeaderText, styles.colEstado]}>Estado</Text>
            <Text style={[styles.tableHeaderText, styles.colVencimiento]}>Vencimiento</Text>
            <Text style={[styles.tableHeaderText, styles.colAcciones]}>Acciones</Text>
          </View>

          <View style={styles.tableBody}>
            {filasPagina.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="card-outline" size={32} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
                <Text style={styles.emptyText}>No hay membresías para mostrar</Text>
              </View>
            ) : (
              filasPagina.map((f, idx) => (
                <View
                  key={f.barberiaId}
                  style={[styles.tableRow, idx === filasPagina.length - 1 && styles.tableRowLast]}
                >
                  <Text style={[styles.cellText, styles.colBarberia]}>{f.nombre}</Text>
                  <View style={styles.colEstado}>
                    <View style={[styles.badge, badgeStyle(f.estadoVisual)]}>
                      <Text style={styles.badgeText}>{f.estadoVisual}</Text>
                    </View>
                  </View>
                  <Text style={[styles.cellText, styles.colVencimiento]}>
                    {formatearFecha(f.fechaFin)}
                  </Text>
                  <View style={styles.colAcciones}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('DetalleMembresiaScreen', { barberiaId: f.barberiaId })}
                    >
                      <Ionicons name="eye-outline" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* ── Paginación ── */}
          {filasFiltradas.length > 0 && (
            <View style={styles.paginationWrap}>
              <Text style={styles.paginationInfo}>
                Mostrando {(pagina - 1) * PAGE_SIZE + 1}-
                {Math.min(pagina * PAGE_SIZE, filasFiltradas.length)} de {filasFiltradas.length} resultados
              </Text>
              <View style={styles.paginationRow}>
              <TouchableOpacity style={styles.pageArrow} onPress={() => setPagina(1)} disabled={pagina === 1}>
  <Ionicons name="play-skip-back" size={14} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
</TouchableOpacity>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.pageNumber, n === pagina && styles.pageNumberActive]}
                    onPress={() => setPagina(n)}
                  >
                    <Text style={[styles.pageNumberText, n === pagina && styles.pageNumberTextActive]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.pageArrow} onPress={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>
  <Ionicons name="play-skip-forward" size={14} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
</TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── Modal del filtro ── */}
      <Modal
  transparent
  visible={dropdownVisible}
  animationType="fade"
  onRequestClose={() => setDropdownVisible(false)}
>
  <TouchableOpacity
    style={styles.dropOverlay}
    activeOpacity={1}
    onPress={() => setDropdownVisible(false)}
  >
    <View style={[styles.dropMenu, { position: 'absolute', top: dropPos.top, left: dropPos.left }]}>
      {FILTROS.map((f) => (
        <TouchableOpacity
          key={f}
          style={[styles.dropItem, f === filtro && styles.dropItemActive]}
          onPress={() => cambiarFiltro(f)}
        >
          <Text style={[styles.dropItemText, f === filtro && styles.dropItemTextActive]}>
            {f}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </TouchableOpacity>
</Modal>

      <LoadingOverlay visible={cargando} message="Cargando membresías..." />
    </SafeAreaView>
  );
};

export default MembresiasScreen;