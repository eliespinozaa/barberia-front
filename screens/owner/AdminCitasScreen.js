import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/owner/AdminCitasStyles';
import { citaAPI } from '../../config/api';
import LoadingOverlay from '../../components/LoadingOverlay';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DIAS_SEMANA_CORTO = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const DIAS_SEMANA_LARGO = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const formatearFechaISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ── Calendario mensual, portado de AgendarCita.js ──
function Calendario({ selected, onSelect, styles }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.month ?? today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) =>
    d && viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate();

  const isSelected = (d) => {
    if (!d || !selected) return false;
    return selected.day === d && selected.month === viewMonth && selected.year === viewYear;
  };

  return (
    <View style={styles.calendarBox}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarMonthTitle}>
          {MESES[viewMonth]} de {viewYear}
        </Text>

        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.calendarNavBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={18} color={styles.calendarNavIconColor.color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMonth} style={styles.calendarNavBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={18} color={styles.calendarNavIconColor.color} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarRow}>
        {DIAS_SEMANA_CORTO.map((d, i) => (
          <Text key={i} style={styles.calendarDayLabel}>{d}</Text>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.calendarRow}>
          {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((d, colIdx) => {
            const sel = isSelected(d);
            const tod = isToday(d);

            return (
              <TouchableOpacity
                key={colIdx}
                style={[
                  styles.calendarCell,
                  tod && !sel && styles.calendarCellToday,
                  sel && styles.calendarCellSelected,
                ]}
                onPress={() => d && onSelect({ day: d, month: viewMonth, year: viewYear })}
                activeOpacity={d ? 0.7 : 1}
                disabled={!d}
              >
                {d ? (
                  <Text
                    style={[
                      styles.calendarCellText,
                      tod && !sel && styles.calendarCellTodayText,
                      sel && styles.calendarCellSelectedText,
                    ]}
                  >
                    {d}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ── Tarjeta de una cita ──
const CitaCard = ({ cita, styles, onConfirmar, onCancelar, onFinalizar, enCurso }) => {
  const finalizada = cita.estado === 'CANCELADA' || cita.estado === 'COMPLETADA';

  return (
    <View style={[
      styles.citaCard,
      enCurso && styles.citaCardEnCurso,
      finalizada && styles.citaCardFinalizada,
    ]}>
      <Text style={styles.citaHora}>{cita.hora}</Text>
      <Text style={styles.citaNombre}>{cita.nombreCliente}</Text>
      <Text style={styles.citaServicio}>{cita.servicio}</Text>
      <Text style={styles.citaPrecio}>$ {cita.precio}</Text>

      {enCurso ? (
        <TouchableOpacity style={styles.btnFinalizar} onPress={() => onFinalizar(cita.id)}>
          <Text style={styles.btnFinalizarText}>Finalizar</Text>
        </TouchableOpacity>
      ) : finalizada ? (
        <Text style={styles.citaEstadoBadge}>
          {cita.estado === 'CANCELADA' ? 'Cancelada' : 'Completada'}
        </Text>
      ) : (
        <>
          {cita.estado === 'PENDIENTE' && (
            <TouchableOpacity style={styles.btnConfirmar} onPress={() => onConfirmar(cita.id)}>
              <Text style={styles.btnConfirmarText}>Confirmar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnCancelar} onPress={() => onCancelar(cita.id)}>
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const AdminCitasScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';
  const mutedColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';

  const idBarberia = route?.params?.barberiaId ?? null;

  const [tab, setTab] = useState('hoy'); // 'hoy' | 'manana' | 'calendario'
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null); // {day, month, year}

  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCitas = useCallback(async (fecha) => {
    if (!idBarberia || !fecha) {
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);

    const res = await citaAPI.listarPorFecha(idBarberia, formatearFechaISO(fecha));
    if (res.success) {
      setCitas(res.data);
    } else {
      setError(res.error);
      setCitas([]);
    }
    setCargando(false);
  }, [idBarberia]);

  useFocusEffect(
    useCallback(() => {
      if (tab === 'hoy') {
        cargarCitas(new Date());
      } else if (tab === 'manana') {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        cargarCitas(mañana);
      } else if (tab === 'calendario' && fechaSeleccionada) {
        cargarCitas(new Date(fechaSeleccionada.year, fechaSeleccionada.month, fechaSeleccionada.day));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, fechaSeleccionada, cargarCitas])
  );

  const handleCambiarTab = (nuevoTab) => {
    if (nuevoTab === 'calendario' && tab === 'calendario') {
      setFechaSeleccionada(null); // vuelve al grid si ya estabas ahí
      return;
    }
    setTab(nuevoTab);
    if (nuevoTab === 'calendario') setFechaSeleccionada(null);
  };

  const handleSeleccionarDia = (fechaObj) => {
    setFechaSeleccionada(fechaObj);
    cargarCitas(new Date(fechaObj.year, fechaObj.month, fechaObj.day));
  };

  const ejecutarAccion = async (accion, idCita) => {
    setProcesando(true);
    const res = await accion(idCita);
    setProcesando(false);

    if (res.success) {
      if (tab === 'hoy') cargarCitas(new Date());
      else if (tab === 'manana') {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        cargarCitas(mañana);
      } else if (fechaSeleccionada) {
        cargarCitas(new Date(fechaSeleccionada.year, fechaSeleccionada.month, fechaSeleccionada.day));
      }
    } else {
      Alert.alert('Error', res.error || 'No se pudo completar la acción');
    }
  };

  const handleConfirmar = (idCita) => ejecutarAccion(citaAPI.confirmar, idCita);
  const handleCancelar  = (idCita) => ejecutarAccion(citaAPI.cancelar, idCita);
  const handleFinalizar = (idCita) => ejecutarAccion(citaAPI.finalizar, idCita);
const citaEnCurso = tab === 'hoy' ? citas.find((c) => c.estado === 'EN_PROCESO') : null;
const siguientesCitas = citas.filter((c) => c.estado !== 'EN_PROCESO');

  const mostrarCalendarioGrid = tab === 'calendario' && !fechaSeleccionada;
  const mostrarListaCitas = tab === 'hoy' || tab === 'manana' || (tab === 'calendario' && fechaSeleccionada);

  const tituloHeader = () => {
    if (tab === 'hoy') {
      const hoy = new Date();
      return `Hoy - ${DIAS_SEMANA_LARGO[hoy.getDay()]} ${hoy.getDate()}`;
    }
    if (tab === 'manana') return 'Citas de mañana';
    if (fechaSeleccionada) {
      return `Citas del dia ${fechaSeleccionada.day} de ${MESES[fechaSeleccionada.month].toLowerCase()} de ${fechaSeleccionada.year}`;
    }
    return 'Selecciona una fecha';
  };

  const labelSeccion = () => {
    if (tab === 'hoy') return 'Siguientes citas';
    if (tab === 'manana') return 'Citas del dia de mañana';
    if (fechaSeleccionada) {
      return `Citas del dia ${fechaSeleccionada.day} de ${MESES[fechaSeleccionada.month].toLowerCase()} de ${fechaSeleccionada.year}`;
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <LoadingOverlay visible={procesando} message="Procesando..." />

     <View style={styles.header}>
  <View style={styles.headerTopRow}>
    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle} numberOfLines={1}>{tituloHeader()}</Text>
  </View>

  <View style={styles.headerPillWrap}>
    <View style={styles.headerPill}>
      <Text style={styles.headerPillText}>Citas</Text>
    </View>
  </View>
</View>

      <View style={styles.tabsRow}>
        {[
          { key: 'hoy', label: 'Hoy' },
          { key: 'manana', label: 'Mañana' },
          { key: 'calendario', label: 'Calendario' },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => handleCambiarTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyInner} showsVerticalScrollIndicator={false}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {mostrarCalendarioGrid && (
          <Calendario
            selected={fechaSeleccionada}
            onSelect={handleSeleccionarDia}
            styles={styles}
          />
        )}

        {mostrarListaCitas && (
          <>
            {citaEnCurso && (
  <>
    <Text style={styles.sectionLabelEnCurso}>En curso</Text>
    <View style={styles.enCursoWrap}>
      <CitaCard cita={citaEnCurso} styles={styles} enCurso onFinalizar={handleFinalizar} />
    </View>
  </>
)}

<Text style={styles.sectionLabel}>{labelSeccion()}</Text>

            {siguientesCitas.length === 0 && !cargando ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-clear-outline" size={36} color={mutedColor} />
                <Text style={styles.emptyText}>No hay citas para este día.</Text>
              </View>
            ) : (
              <View style={styles.citasGrid}>
                {siguientesCitas.map((cita) => (
                  <CitaCard
                    key={cita.id}
                    cita={cita}
                    styles={styles}
                    onConfirmar={handleConfirmar}
                    onCancelar={handleCancelar}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminCitasScreen;