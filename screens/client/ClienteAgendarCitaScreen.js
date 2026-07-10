import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/client/ClienteAgendarCitaStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { tokenManager, clienteAPI, servicioAPI, barberoAPI, usuariosAPI, horarioAPI, citaAPI } from '../../config/api';

const STEPS = [
  { n: 1, label: 'Servicio' },
  { n: 2, label: 'Barbero' },
  { n: 3, label: 'Fecha' },
  { n: 4, label: 'Hora' },
  { n: 5, label: 'Confirmar' },
];

const DIAS_SEMANA_LARGO = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const formatearFechaLarga = (fechaObj) => {
  if (!fechaObj) return '';
  const fecha = new Date(fechaObj.anio, fechaObj.mes, fechaObj.dia);
  const dia = DIAS_SEMANA_LARGO[fecha.getDay()];
  return `${dia}, ${fechaObj.dia} de ${MESES[fechaObj.mes].toLowerCase()} de ${fechaObj.anio}`;
};

const num = (valor) => {
  if (valor == null) return 0;
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'object' && 'parsedValue' in valor) return valor.parsedValue;
  return Number(valor) || 0;
};

const DIAS_SEMANA_DB = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

const obtenerDiaSemanaDB = (fechaObj) => {
  const fecha = new Date(fechaObj.anio, fechaObj.mes, fechaObj.dia);
  return DIAS_SEMANA_DB[fecha.getDay()];
};

const formatearFechaISO = (fechaObj) => {
  const mm = String(fechaObj.mes + 1).padStart(2, '0');
  const dd = String(fechaObj.dia).padStart(2, '0');
  return `${fechaObj.anio}-${mm}-${dd}`;
};

const generarSlotsHora = (horaApertura, horaCierre) => {
  const [hIni] = horaApertura.split(':').map(Number);
  const [hFin] = horaCierre.split(':').map(Number);
  const slots = [];
  for (let h = hIni; h < hFin; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
};

const DIAS_SEMANA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const generarDiasDelMes = (mes, anio) => {
  const primerDia = new Date(anio, mes, 1).getDay(); // 0=Domingo
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let d = 1; d <= totalDias; d++) celdas.push(d);

  while (celdas.length % 7 !== 0) celdas.push(null);

  const filas = [];
  for (let i = 0; i < celdas.length; i += 7) {
    filas.push(celdas.slice(i, i + 7));
  }
  return filas;
};

const esFechaPasada = (dia, mes, anio) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(anio, mes, dia);
  return fecha < hoy;
};

const agruparPorCategoria = (servicios) => {
  const grupos = { CORTES: [], BARBA: [], OTROS: [] };
  servicios.forEach((s) => {
    const nombre = (s.nombre || '').toLowerCase();
    if (nombre.includes('barba') || nombre.includes('afeit')) {
      grupos.BARBA.push(s);
    } else {
      grupos.CORTES.push(s);
    }
  });
  return Object.entries(grupos).filter(([, items]) => items.length > 0);
};

const ClienteAgendarCitaScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isWeb = Platform.OS === 'web';

  const [cargando, setCargando] = useState(true);
  const [barberia, setBarberia] = useState(null);
  const [servicios, setServicios] = useState([]);

  const [confirmando, setConfirmando] = useState(false);

  // Modal de resultado (éxito / error), reemplaza al modal inline anterior
  const [resultado, setResultado] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const [barberos, setBarberos] = useState([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);

  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const [step, setStep] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const cargarDatos = useCallback(async () => {
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

    const resServicios = await servicioAPI.listarPorBarberia(resBarberia.data.id);
    if (resServicios.success) {
      const normalizados = resServicios.data.map((s) => ({
        ...s,
        precio: num(s.precio),
      }));
      setServicios(normalizados);
    }

    const resBarberos = await barberoAPI.listarPorBarberia(resBarberia.data.id);
    if (resBarberos.success) {
      const barberosConNombre = await Promise.all(
        resBarberos.data.map(async (b) => {
          const resUsuario = await usuariosAPI.obtenerPorId(b.idUsuario);
          return {
            ...b,
            nombre: resUsuario.success
              ? (resUsuario.data.nombreCompleto || resUsuario.data.nombre || 'Barbero')
              : 'Barbero',
            imagen: resUsuario.success ? resUsuario.data.fotoPerfil : null,
          };
        })
      );
      setBarberos(barberosConNombre);
    }

    setCargando(false);
  }, []);

  const cargarHorariosDisponibles = useCallback(async () => {
    if (!barberia?.id || !barberoSeleccionado || !fechaSeleccionada) return;

    setCargandoHorarios(true);
    setHoraSeleccionada(null);

    const diaSemana = obtenerDiaSemanaDB(fechaSeleccionada);
    const fechaISO = formatearFechaISO(fechaSeleccionada);

    const resHorario = await horarioAPI.listarPorBarberia(barberia.id);
    const horarioDelDia = resHorario.success
      ? resHorario.data.find((h) => h.diaSemana === diaSemana && h.estado === 1)
      : null;

    if (!horarioDelDia) {
      setHorariosDisponibles([]);
      setCargandoHorarios(false);
      return;
    }

    let slots = generarSlotsHora(horarioDelDia.horaApertura, horarioDelDia.horaCierre);

    // Si la fecha seleccionada es HOY, quitamos las horas que ya pasaron
    const ahora = new Date();
    const esHoy =
      fechaSeleccionada.dia === ahora.getDate() &&
      fechaSeleccionada.mes === ahora.getMonth() &&
      fechaSeleccionada.anio === ahora.getFullYear();

    if (esHoy) {
      const horaActual = ahora.getHours();
      const minutoActual = ahora.getMinutes();
      slots = slots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number);
        return h > horaActual || (h === horaActual && m > minutoActual);
      });
    }

    const resCitas = await citaAPI.listarPorFecha(barberia.id, fechaISO);
    const ocupadas = new Set();
    if (resCitas.success) {
      resCitas.data
        .filter((c) => c.idBarbero === barberoSeleccionado.id && c.estado !== 'CANCELADA')
        .forEach((c) => {
          const horaCorta = c.hora?.slice(0, 5);
          ocupadas.add(horaCorta);
        });
    }

    setHorariosDisponibles(slots.map((hora) => ({ hora, ocupada: ocupadas.has(hora) })));
    setCargandoHorarios(false);
  }, [barberia, barberoSeleccionado, fechaSeleccionada]);

  const handleConfirmarCita = useCallback(async () => {
    const userActual = await tokenManager.getUser();
    if (!userActual?.id || !barberia?.id || !barberoSeleccionado || !fechaSeleccionada || !horaSeleccionada || !servicioSeleccionado) return;

    setConfirmando(true);

    const payload = {
      idCliente: userActual.id,
      idBarberia: barberia.id,
      idBarbero: barberoSeleccionado.id,
      idServicio: servicioSeleccionado.id,
      fecha: formatearFechaISO(fechaSeleccionada),
      horaInicio: `${horaSeleccionada}:00`,
      duracionMinutos: servicioSeleccionado.duracion || 60,
      notas: servicioSeleccionado.nombre,
    };

    const res = await citaAPI.crear(payload);
    setConfirmando(false);

    if (res.success) {
      const correo = userActual.correo || userActual.email || '';
      setResultado({
        visible: true,
        type: 'success',
        title: 'Cita agendada exitosamente',
        message:
          `Tu cita se agendó para el día ${formatearFechaLarga(fechaSeleccionada)} a las ${horaSeleccionada} horas.\n\n` +
          `No olvides asistir a ${barberia?.direccion || 'la dirección de la barbería'}.` +
          (correo ? `\n\nEl comprobante fue enviado a ${correo}.` : ''),
      });
    } else {
      const esHorarioOcupado = res.status === 409 || res.error?.includes('ya no está disponible');

      if (esHorarioOcupado) {
        setStep(4);
        cargarHorariosDisponibles();
      }

      setResultado({
        visible: true,
        type: 'error',
        title: esHorarioOcupado ? 'Horario no disponible' : 'Algo salió mal',
        message: esHorarioOcupado
          ? 'Ese horario ya fue tomado por otro cliente. Elige otra hora disponible.'
          : 'No se pudo agendar tu cita. Intenta de nuevo.',
      });

      console.warn('No se pudo agendar:', res.error);
    }
  }, [barberia, barberoSeleccionado, fechaSeleccionada, horaSeleccionada, servicioSeleccionado, cargarHorariosDisponibles]);

  const handleCerrarResultado = () => {
    const fueExito = resultado.type === 'success';
    setResultado({ visible: false, type: 'success', title: '', message: '' });
    if (fueExito) {
      navigation.navigate('ClientHomeScreen');
    }
  };

  useEffect(() => {
    if (step === 4) cargarHorariosDisponibles();
  }, [step, cargarHorariosDisponibles]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const categorias = useMemo(() => agruparPorCategoria(servicios), [servicios]);

  const puedeAvanzar =
    step === 1 ? !!servicioSeleccionado :
    step === 2 ? !!barberoSeleccionado :
    step === 3 ? !!fechaSeleccionada :
    step === 4 ? !!horaSeleccionada :
    true;

  const handleMesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(anioActual - 1);
    } else {
      setMesActual(mesActual - 1);
    }
  };

  const handleMesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(anioActual + 1);
    } else {
      setMesActual(mesActual + 1);
    }
  };

  const handleSiguiente = () => {
    if (!puedeAvanzar) return;
    if (step === STEPS.length) {
      handleConfirmarCita();
      return;
    }
    if (step < STEPS.length) setStep(step + 1);
  };

  const handleAtras = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <LoadingOverlay visible={cargando} message="Cargando servicios..." />
      <LoadingOverlay visible={confirmando} message="Agendando tu cita..." />

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

      {/* ── Título + back ── */}
      <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleAtras}>
          <Ionicons name="arrow-back" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>Agendar cita</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>

          {/* ── Stepper ── */}
          <View style={styles.stepperRow}>
            {STEPS.map((s, idx) => {
              const isActive = s.n === step;
              const isDone = s.n < step;
              return (
                <React.Fragment key={s.n}>
                  <View style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        isActive && styles.stepCircleActive,
                        isDone && styles.stepCircleDone,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepCircleText,
                          isActive && styles.stepCircleTextActive,
                          isDone && styles.stepCircleTextDone,
                        ]}
                      >
                        {s.n}
                      </Text>
                    </View>
                    <Text style={[styles.stepLabel, (isActive || isDone) && styles.stepLabelActive]}>
                      {s.label}
                    </Text>
                  </View>
                  {idx < STEPS.length - 1 && (
                    <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* ── Paso 1: Servicio ── */}
          {step === 1 && (
            <>
              {categorias.length === 0 && !cargando ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="cut-outline"
                    size={36}
                    color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                  />
                  <Text style={styles.emptyText}>No hay servicios disponibles</Text>
                </View>
              ) : (
                categorias.map(([nombreCategoria, items]) => (
                  <CategoriaServicios
                    key={nombreCategoria}
                    titulo={nombreCategoria}
                    items={items}
                    seleccionado={servicioSeleccionado}
                    onSeleccionar={setServicioSeleccionado}
                    styles={styles}
                    isWeb={isWeb}
                  />
                ))
              )}
            </>
          )}

          {/* ── Paso 2: Barbero ── */}
          {step === 2 && (
            <View style={styles.categoriaSection}>
              <Text style={styles.categoriaTitulo}>Barbero(s)</Text>

              {barberos.length === 0 && !cargando ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="person-outline"
                    size={36}
                    color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                  />
                  <Text style={styles.emptyText}>No hay barberos disponibles</Text>
                </View>
              ) : (
                <View style={styles.barberosRow}>
                  {barberos.map((b) => {
                    const isSel = barberoSeleccionado?.id === b.id;
                    return (
                      <TouchableOpacity
                        key={b.id}
                        style={[styles.barberoCard, isSel && styles.barberoCardSeleccionado]}
                        onPress={() => setBarberoSeleccionado(b)}
                        activeOpacity={0.85}
                      >
                        {isSel && (
                          <View style={styles.barberoCheckBadge}>
                            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                          </View>
                        )}

                        <View style={styles.barberoAvatarWrap}>
                          {b.imagen ? (
                            <Image source={{ uri: b.imagen }} style={styles.barberoAvatarImg} />
                          ) : (
                            <Ionicons name="person" size={22} color="#9CA3AF" />
                          )}
                        </View>

                        <Text style={styles.barberoNombre} numberOfLines={2}>{b.nombre}</Text>

                        <View style={[styles.barberoBtn, isSel && styles.barberoBtnSeleccionado]}>
                          <Text style={[styles.barberoBtnText, isSel && styles.barberoBtnTextSeleccionado]}>
                            {isSel ? 'Seleccionado' : 'Seleccionar'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ── Paso 3: Fecha ── */}
          {step === 3 && (
            <View style={styles.categoriaSection}>
              <Text style={styles.categoriaTitulo}>Fecha</Text>
              <Calendario
                mes={mesActual}
                anio={anioActual}
                fechaSeleccionada={fechaSeleccionada}
                onSeleccionarFecha={setFechaSeleccionada}
                onMesAnterior={handleMesAnterior}
                onMesSiguiente={handleMesSiguiente}
                styles={styles}
              />
            </View>
          )}

          {/* ── Paso 4: Hora ── */}
          {step === 4 && (
            <View style={styles.categoriaSection}>
              <Text style={styles.categoriaTitulo}>Hora</Text>

              {cargandoHorarios ? (
                <Text style={styles.emptyText}>Cargando horarios...</Text>
              ) : horariosDisponibles.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="time-outline"
                    size={36}
                    color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                  />
                  <Text style={styles.emptyText}>No hay horarios disponibles ese día</Text>
                </View>
              ) : (
                <View style={styles.horariosGrid}>
                  {horariosDisponibles.map(({ hora, ocupada }) => {
                    const isSel = horaSeleccionada === hora;
                    return (
                      <TouchableOpacity
                        key={hora}
                        style={[
                          styles.horaSlot,
                          isSel && styles.horaSlotSeleccionada,
                          ocupada && styles.horaSlotOcupada,
                        ]}
                        disabled={ocupada}
                        onPress={() => setHoraSeleccionada(hora)}
                      >
                        <Text style={[styles.horaSlotTexto, isSel && styles.horaSlotTextoSeleccionada]}>
                          {hora}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ── Paso 5: Confirmar ── */}
          {step === 5 && (
            <View style={styles.confirmarCard}>
              <Text style={styles.confirmarTitulo}>Confirmar datos</Text>

              <View style={styles.confirmarFila}>
                <Text style={styles.confirmarLabel}>Fecha</Text>
                <Text style={styles.confirmarValor}>{formatearFechaLarga(fechaSeleccionada)}</Text>
              </View>

              <View style={styles.confirmarFila}>
                <Text style={styles.confirmarLabel}>Hora</Text>
                <Text style={styles.confirmarValor}>{horaSeleccionada}</Text>
              </View>

              <View style={styles.confirmarFila}>
                <Text style={styles.confirmarLabel}>Servicio</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Text style={styles.confirmarValorMuted}>{servicioSeleccionado?.nombre}</Text>
                  <Text style={styles.confirmarValorFuerte}>${servicioSeleccionado?.precio}</Text>
                </View>
              </View>

              <View style={styles.confirmarFila}>
                <Text style={styles.confirmarLabel}>Barbero</Text>
                <Text style={styles.confirmarValor}>{barberoSeleccionado?.nombre}</Text>
              </View>

              <View style={styles.confirmarFila}>
                <Text style={styles.confirmarLabel}>Barbería</Text>
                <Text style={styles.confirmarValor}>{barberia?.nombre}</Text>
              </View>

              <View style={[styles.confirmarFila, { borderBottomWidth: 0 }]}>
                <Text style={styles.confirmarLabel}>Ubicación</Text>
                <Text style={[styles.confirmarValor, { textAlign: 'right', flexShrink: 1 }]}>
                  {barberia?.direccion || 'Dirección no disponible'}
                </Text>
              </View>
            </View>
          )}

          {/* ── Pasos futuros (placeholder) ── */}
          {step > 5 && (
            <View style={styles.emptyState}>
              <Ionicons name="construct-outline" size={36} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
              <Text style={styles.emptyText}>Paso "{STEPS[step - 1].label}" próximamente</Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── FAB siguiente ── */}
      <TouchableOpacity
        style={[styles.fabNext, !puedeAvanzar && { opacity: 0.4 }]}
        onPress={handleSiguiente}
        disabled={!puedeAvanzar}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={handleCerrarResultado}
      />
    </SafeAreaView>
  );
};

const Calendario = ({ mes, anio, fechaSeleccionada, onSeleccionarFecha, onMesAnterior, onMesSiguiente, styles }) => {
  const filas = generarDiasDelMes(mes, anio);

  return (
    <View style={styles.calendarioCard}>
      <View style={styles.calendarioHeader}>
        <Text style={styles.calendarioMesTexto}>{MESES[mes]} de {anio}</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity style={styles.calendarioNavBtn} onPress={onMesAnterior}>
            <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarioNavBtn} onPress={onMesSiguiente}>
            <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarioSemanaRow}>
        {DIAS_SEMANA.map((d, i) => (
          <View key={i} style={styles.calendarioSemanaCell}>
            <Text style={styles.calendarioSemanaTexto}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarioSemanas}>
        {filas.map((fila, i) => (
          <View key={i} style={styles.calendarioDiaRow}>
            {fila.map((dia, j) => {
              if (dia == null) {
                return <View key={j} style={styles.calendarioDiaCell} />;
              }
              const deshabilitado = esFechaPasada(dia, mes, anio);
              const isSel =
                fechaSeleccionada?.dia === dia &&
                fechaSeleccionada?.mes === mes &&
                fechaSeleccionada?.anio === anio;

              return (
                <TouchableOpacity
                  key={j}
                  style={styles.calendarioDiaCell}
                  disabled={deshabilitado}
                  onPress={() => onSeleccionarFecha({ dia, mes, anio })}
                >
                  <View style={[styles.calendarioDiaCirculo, isSel && styles.calendarioDiaCirculoSeleccionado]}>
                    <Text style={[styles.calendarioDiaTexto, deshabilitado && styles.calendarioDiaTextoDeshabilitado]}>
                      {dia}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

// ── Sub-componente: carrusel de una categoría (con flechas en web) ──
const CategoriaServicios = ({ titulo, items, seleccionado, onSeleccionar, styles, isWeb }) => {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const SCROLL_STEP = 180;

  const scrollMax = Math.max(contentWidth - carouselWidth, 0);

  const handleScrollLeft = () => {
    const nuevo = Math.max(scrollX - SCROLL_STEP, 0);
    scrollRef.current?.scrollTo({ x: nuevo, animated: true });
  };
  const handleScrollRight = () => {
    const nuevo = Math.min(scrollX + SCROLL_STEP, scrollMax);
    scrollRef.current?.scrollTo({ x: nuevo, animated: true });
  };

  const emoji = titulo === 'BARBA' ? '🧔' : titulo === 'CORTES' ? '✂️' : '';

  return (
    <View style={styles.categoriaSection}>
      <Text style={styles.categoriaTitulo}>{titulo} {emoji}</Text>

      <View style={styles.carouselWrapper}>
        {isWeb && scrollX > 0 && (
          <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowLeft]} onPress={handleScrollLeft}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
          onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
          onContentSizeChange={(w) => setContentWidth(w)}
          onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
          scrollEventThrottle={16}
        >
          {items.map((s) => {
            const isSel = seleccionado?.id === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.servicioCard, isSel && styles.servicioCardSeleccionado]}
                onPress={() => onSeleccionar(s)}
                activeOpacity={0.85}
              >
                {isSel && (
                  <View style={styles.servicioCheckBadge}>
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                )}

                <View style={styles.servicioImgWrap}>
                  {s.imagen ? (
                    <Image source={{ uri: s.imagen }} style={styles.servicioImg} />
                  ) : (
                    <Ionicons name="cut-outline" size={22} color="#9CA3AF" />
                  )}
                </View>

                <Text style={styles.servicioNombre} numberOfLines={1}>{s.nombre}</Text>
                <Text style={styles.servicioPrecio}>${s.precio}</Text>

                <View style={[styles.servicioBtn, isSel && styles.servicioBtnSeleccionado]}>
                  <Text style={[styles.servicioBtnText, isSel && styles.servicioBtnTextSeleccionado]}>
                    {isSel ? 'Seleccionado' : 'Seleccionar'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isWeb && scrollX < scrollMax && (
          <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowRight]} onPress={handleScrollRight}>
            <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ClienteAgendarCitaScreen;