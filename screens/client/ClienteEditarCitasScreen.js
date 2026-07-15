import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/client/ClienteEditarCitasStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';

import {
  tokenManager,
  clienteAPI,
  servicioAPI,
  barberoAPI,
  citaAPI,
  horarioAPI,
  usuariosAPI,
} from '../../config/api';
// ── Helpers de horario (mismo criterio que ClienteAgendarCitaScreen) ──
const DIAS_SEMANA_DB = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

// fecha viene como string 'YYYY-MM-DD'
const obtenerDiaSemanaDB = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fechaObj = new Date(anio, mes - 1, dia);
  return DIAS_SEMANA_DB[fechaObj.getDay()];
};

const esFechaHoy = (fechaISO) => {
  const hoy = new Date();
  const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  return fechaISO === hoyISO;
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

const ClienteEditarCitasScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const styles = createStyles(width, theme);

  const citaOriginal = route?.params?.cita || null;

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [cargando, setCargando]     = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [barberia, setBarberia]     = useState(null);

  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos]   = useState([]);

  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [cargandoHoras, setCargandoHoras]       = useState(false);

  const [servicioId, setServicioId] = useState(citaOriginal?.servicioId || null);
  const [barberoId, setBarberoId]   = useState(citaOriginal?.barberoId || null);
  const [fecha, setFecha]           = useState(citaOriginal?.fecha || '');
  const [hora, setHora]             = useState(
    citaOriginal?.horaInicio ? citaOriginal.horaInicio.slice(0, 5) : ''
  );

  const [servicioAbierto, setServicioAbierto] = useState(false);
  const [barberoAbierto, setBarberoAbierto]   = useState(false);
  const [horaAbierto, setHoraAbierto]         = useState(false);

  const [resultado, setResultado] = useState({
    visible: false, type: 'success', title: '', message: '',
  });

  const handleLogout = async () => {
    setDropdownVisible(false);
    await tokenManager.clearAll();
    navigation.replace('Home');
  };

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

 const [resServicios, resBarberos] = await Promise.all([
  servicioAPI.listarPorBarberia(resBarberia.data.id),
  barberoAPI.listarPorBarberia(resBarberia.data.id),
]);

const listaServicios = resServicios.success ? resServicios.data : [];
const barberosCrudos = resBarberos.success ? resBarberos.data : [];

const listaBarberos = await Promise.all(
  barberosCrudos.map(async (b) => {
    const resUsuario = await usuariosAPI.obtenerPorId(b.idUsuario);
    return {
      ...b,
      nombre: resUsuario.success
        ? (resUsuario.data.nombreCompleto || resUsuario.data.nombre || 'Barbero')
        : 'Barbero',
    };
  })
);

setServicios(listaServicios);
setBarberos(listaBarberos);

if (citaOriginal?.servicioNombre && !servicioId) {
  const buscadoServicio = citaOriginal.servicioNombre.trim().toLowerCase();
  const s = listaServicios.find(
    (x) => x.nombre && x.nombre.trim().toLowerCase() === buscadoServicio
  );
  if (s) setServicioId(s.id);
}
if (citaOriginal?.barberoNombre && !barberoId) {
  const buscadoBarbero = citaOriginal.barberoNombre.trim().toLowerCase();
  const b = listaBarberos.find(
    (x) => x.nombre && x.nombre.trim().toLowerCase().includes(buscadoBarbero)
  );
  if (b) setBarberoId(b.id);
}

    setCargando(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    const cargarHoras = async () => {
      if (!barberia?.id || !fecha || !barberoId) {
        setHorasDisponibles([]);
        return;
      }

      setCargandoHoras(true);

      const diaSemana = obtenerDiaSemanaDB(fecha);

      const resHorario = await horarioAPI.listarPorBarberia(barberia.id);
      const horarioDelDia = resHorario.success
  ? resHorario.data.find(
      (h) => h.diaSemana?.toUpperCase() === diaSemana && h.estado === 1
    )
  : null;

      if (!horarioDelDia) {
        setHorasDisponibles([]);
        setCargandoHoras(false);
        return;
      }

      let slots = generarSlotsHora(horarioDelDia.horaApertura, horarioDelDia.horaCierre);

      // Si la fecha elegida es HOY, quitamos las horas que ya pasaron
      if (esFechaHoy(fecha)) {
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minutoActual = ahora.getMinutes();
        slots = slots.filter((slot) => {
          const [h, m] = slot.split(':').map(Number);
          return h > horaActual || (h === horaActual && m > minutoActual);
        });
      }

    
      const resCitas = await citaAPI.listarPorFecha(barberia.id, fecha);
      const ocupadas = new Set();
      if (resCitas.success) {
        resCitas.data
          .filter((c) =>
            c.id !== citaOriginal?.id &&
            c.idBarbero === barberoId &&
            c.estado !== 'CANCELADA'
          )
          .forEach((c) => {
            const horaCorta = (c.horaInicio || c.hora)?.slice(0, 5);
            if (horaCorta) ocupadas.add(horaCorta);
          });
      }

      let libres = slots.filter((h) => !ocupadas.has(h));

    
      if (hora && !libres.includes(hora)) {
        libres = [hora, ...libres];
      }

      setHorasDisponibles(libres);
      setCargandoHoras(false);
    };

    cargarHoras();
  }, [barberia, fecha, barberoId]);

  const servicioActual = servicios.find((s) => s.id === servicioId);
  const barberoActual   = barberos.find((b) => b.id === barberoId);

  const cerrarDropdowns = () => {
    setServicioAbierto(false);
    setBarberoAbierto(false);
    setHoraAbierto(false);
  };

  
  const handleActualizar = async () => {
  if (!servicioId || !barberoId || !fecha || !hora) {
    setResultado({
      visible: true,
      type: 'error',
      title: 'Faltan datos',
      message: 'Completa servicio, barbero, fecha y hora antes de continuar.',
    });
    return;
  }

  setProcesando(true);
  try {
    const res = await citaAPI.actualizar(citaOriginal?.id, {
  idServicio: servicioId,
  idBarbero: barberoId,
  fecha,
  horaInicio: hora,
});

    if (res?.success) {
      setResultado({
        visible: true,
        type: 'success',
        title: 'Cita actualizada',
        message: 'Los cambios se guardaron correctamente.',
      });
    } else {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo actualizar',
        message: res?.error || 'Intenta de nuevo más tarde.',
      });
    }
  } catch (error) {
    setResultado({
      visible: true,
      type: 'error',
      title: 'Error inesperado',
      message: 'Ocurrió un error al actualizar la cita.',
    });
  } finally {
    setProcesando(false);
  }
};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <LoadingOverlay visible={cargando} message="Cargando cita..." />
      <LoadingOverlay visible={procesando} message="Guardando cambios..." />

      

      
      {/* ── Título + back ── */}
      <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>Editar Cita</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity activeOpacity={1} onPress={cerrarDropdowns} style={styles.formCard}>

          {/* Servicio */}
          <Text style={styles.label}>Servicio</Text>
          <View style={styles.dropdownWrap}>
            <TouchableOpacity
              style={styles.selectRow}
              onPress={() => {
                setServicioAbierto((v) => !v);
                setBarberoAbierto(false);
                setHoraAbierto(false);
              }}
            >
              <Text style={styles.selectTexto} numberOfLines={1}>
                {servicioActual?.nombre || 'Selecciona un servicio'}
              </Text>
              <View style={styles.selectRight}>
                {servicioActual?.precio != null && (
                  <Text style={styles.selectPrecio}>${servicioActual.precio}</Text>
                )}
                <Ionicons
                  name={servicioAbierto ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#1A1A1A"
                />
              </View>
            </TouchableOpacity>

           {servicioAbierto && (
  <View style={styles.optionsBox}>
    {servicios.length === 0 ? (
      <View style={styles.optionRow}>
        <Text style={styles.optionTexto}>No hay servicios disponibles</Text>
      </View>
    ) : (
      servicios.map((s) => {
        const seleccionado = s.id === servicioId;
        return (
          <TouchableOpacity
            key={s.id}
            style={[styles.optionRow, seleccionado && styles.optionRowSeleccionada]}
            onPress={() => {
              setServicioId(s.id);
              setServicioAbierto(false);
            }}
          >
            <View style={styles.optionLeft}>
              {seleccionado && (
                <Ionicons name="checkmark" size={16} color="#C9A84C" style={styles.optionCheck} />
              )}
              <Text style={styles.optionTexto}>{s.nombre}</Text>
            </View>
            <Text style={styles.optionPrecio}>${s.precio}</Text>
          </TouchableOpacity>
        );
      })
    )}
  </View>
)}
          </View>

          {/* Barbero */}
          <Text style={styles.label}>Barbero</Text>
          <View style={styles.dropdownWrap}>
            <TouchableOpacity
              style={styles.selectRow}
              onPress={() => {
                setBarberoAbierto((v) => !v);
                setServicioAbierto(false);
                setHoraAbierto(false);
              }}
            >
              <Text style={styles.selectTexto} numberOfLines={1}>
                {barberoActual?.nombre || 'Selecciona un barbero'}
              </Text>
              <Ionicons
                name={barberoAbierto ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#1A1A1A"
              />
            </TouchableOpacity>

            {barberoAbierto && (
  <View style={styles.optionsBox}>
    {barberos.length === 0 ? (
      <View style={styles.optionRow}>
        <Text style={styles.optionTexto}>No hay barberos disponibles</Text>
      </View>
    ) : (
      barberos.map((b) => {
        const seleccionado = b.id === barberoId;
        return (
          <TouchableOpacity
            key={b.id}
            style={[styles.optionRow, seleccionado && styles.optionRowSeleccionada]}
            onPress={() => {
              setBarberoId(b.id);
              setHora('');
              setBarberoAbierto(false);
            }}
          >
            <View style={styles.optionLeft}>
              {seleccionado && (
                <Ionicons name="checkmark" size={16} color="#C9A84C" style={styles.optionCheck} />
              )}
              <Text style={styles.optionTexto}>{b.nombre}</Text>
            </View>
          </TouchableOpacity>
        );
      })
    )}
  </View>
)}
          </View>

          {/* Fecha */}
          <Text style={styles.label}>Fecha</Text>
          <View style={styles.plainBox}>
            <TextInput
              style={styles.plainInput}
              value={fecha}
              onChangeText={(v) => {
                setFecha(v);
                setHora(''); // cambia la fecha -> la hora ya no está garantizada
              }}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#9A9A9A"
            />
          </View>

          {/* Hora */}
          <Text style={styles.label}>Hora</Text>
          <View style={styles.dropdownWrap}>
            <TouchableOpacity
              style={styles.selectRow}
              onPress={() => {
                setHoraAbierto((v) => !v);
                setServicioAbierto(false);
                setBarberoAbierto(false);
              }}
            >
              <Text style={styles.selectTexto}>
                {cargandoHoras ? 'Cargando horas...' : (hora || 'Selecciona una hora')}
              </Text>
              <Ionicons
                name={horaAbierto ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#1A1A1A"
              />
            </TouchableOpacity>

           {horaAbierto && (
  <View style={styles.optionsBox}>
    {horasDisponibles.length === 0 ? (
      <View style={styles.optionRow}>
        <Text style={styles.optionTexto}>
          {!barberoId || !fecha ? 'Elige barbero y fecha primero' : 'No hay horas disponibles ese día'}
        </Text>
      </View>
    ) : (
      horasDisponibles.map((h) => {
        const seleccionada = h === hora;
        return (
          <TouchableOpacity
            key={h}
            style={[styles.optionRow, seleccionada && styles.optionRowSeleccionada]}
            onPress={() => {
              setHora(h);
              setHoraAbierto(false);
            }}
          >
            <View style={styles.optionLeft}>
              {seleccionada && (
                <Ionicons name="checkmark" size={16} color="#C9A84C" style={styles.optionCheck} />
              )}
              <Text style={styles.optionTexto}>{h}</Text>
            </View>
          </TouchableOpacity>
        );
      })
    )}
  </View>
)}
          </View>

          <TouchableOpacity style={styles.actualizarBtn} onPress={handleActualizar}>
            <Text style={styles.actualizarBtnTexto}>Actualizar</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </ScrollView>

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() => {
          const eraExito = resultado.type === 'success';
          setResultado({ visible: false, type: 'success', title: '', message: '' });
          if (eraExito) navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default ClienteEditarCitasScreen;