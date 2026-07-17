import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  TextInput,        
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/DetalleBarberiaStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import Tooltip from '../../components/Tooltip';
import { barberiaAPI, usuariosAPI, suscripcionAPI, barberoAPI, servicioAPI, pagoAPI } from '../../config/api';

const TABS = ['Barberos', 'Servicios', 'Membresia'];
const PRECIO_MEMBRESIA = 499; // TODO: mover a BD cuando exista columna de precio

const DetalleBarberiaScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const barberiaId = route?.params?.barberiaId;
  const [barberia, setBarberia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tabActivo, setTabActivo] = useState('Barberos');
  const [barberos, setBarberos] = useState([]);
  const [cargandoBarberos, setCargandoBarberos] = useState(false);

  const [servicios, setServicios] = useState([]);
  const [cargandoServicios, setCargandoServicios] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [eliminandoServicio, setEliminandoServicio] = useState(false);

const [pagoARegistrar, setPagoARegistrar] = useState(null);
const [registrandoPago, setRegistrandoPago] = useState(false);
const [formPago, setFormPago] = useState({ metodoPago: 'EFECTIVO', referencia: '' });

  const [barberoAEliminar, setBarberoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [resultado, setResultado] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  // ── Membresía ──
  const [subTabMembresia, setSubTabMembresia] = useState('Membresia'); // 'Membresia' | 'Historial de pagos'
  const [suscripcionDetalle, setSuscripcionDetalle] = useState(null);
  const [cambiandoEstadoSuscripcion, setCambiandoEstadoSuscripcion] = useState(false);
const [creandoSuscripcion, setCreandoSuscripcion] = useState(false);

  const [pagos, setPagos] = useState([]);
  const [cargandoPagos, setCargandoPagos] = useState(false);

  const cerrarResultado = () => {
    setResultado((prev) => ({ ...prev, visible: false }));
  };

  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia} ${MESES[parseInt(mes, 10) - 1]}`;
  };

  const MESES_LARGO = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const formatearFechaLarga = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia} de ${MESES_LARGO[parseInt(mes, 10) - 1]} ${anio}`;
  };

  

  const cargarBarberos = useCallback(async (idBarberia) => {
    if (!idBarberia) return;
    setCargandoBarberos(true);
    const barberosRes = await barberoAPI.listarPorBarberia(idBarberia);
    if (!barberosRes.success) {
      console.log(barberosRes.error);
      setBarberos([]);
      setCargandoBarberos(false);
      return;
    }
    const usuariosRes = await Promise.all(
      barberosRes.data.map((b) => usuariosAPI.obtenerPorId(b.idUsuario))
    );
    const dataTransformada = barberosRes.data.map((b, index) => {
      const usuarioRes = usuariosRes[index];
      const usuario = usuarioRes.success ? usuarioRes.data : null;
      return {
        id: b.id,
        idUsuario: b.idUsuario,
        nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sin asignar',
        correo: usuario ? usuario.email : '',
        telefono: usuario ? usuario.telefono : '',
        activo: b.estado === 1,
        foto: usuario?.fotoPerfil || null,
      };
    });
    setBarberos(dataTransformada);
    setCargandoBarberos(false);
  }, []);

  const cargarServicios = useCallback(async (idBarberia) => {
    if (!idBarberia) return;
    setCargandoServicios(true);
    const res = await servicioAPI.listarPorBarberia(idBarberia);
    if (!res.success) {
      console.log(res.error);
      setServicios([]);
      setCargandoServicios(false);
      return;
    }
    const dataTransformada = res.data.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      descripcion: s.descripcion,
      precio: s.precio,
      imagen: s.imagen,
      activo: s.estado === 1,
    }));
    setServicios(dataTransformada);
    setCargandoServicios(false);
  }, []);

  const cargarPagos = useCallback(async (idBarberia) => {
    if (!idBarberia) return;
    setCargandoPagos(true);
    const res = await pagoAPI.listarPorBarberia(idBarberia);
    if (!res.success) {
      console.log(res.error);
      setPagos([]);
      setCargandoPagos(false);
      return;
    }
    setPagos(res.data);
    setCargandoPagos(false);
  }, []);


  const confirmarRegistrarPago = async () => {
  if (!pagoARegistrar) return;
  setRegistrandoPago(true);
  const res = await pagoAPI.registrarPago(pagoARegistrar.id, {
    idSuscripcion: pagoARegistrar.idSuscripcion,
    idBarberia: barberia.id,
    monto: PRECIO_MEMBRESIA,
    metodoPago: formPago.metodoPago,
    referencia: formPago.referencia,
  });
  setRegistrandoPago(false);

  if (!res.success) {
    setPagoARegistrar(null);
    setResultado({ visible: true, type: 'error', title: 'Error', message: res.error });
    return;
  }

  setPagos((prev) =>
    prev.map((p) =>
      p.id === pagoARegistrar.id
        ? { ...p, estado: 'PAGADO', monto: PRECIO_MEMBRESIA, fechaPago: new Date().toISOString() }
        : p
    )
  );
  setPagoARegistrar(null);
  setResultado({ visible: true, type: 'success', title: '¡Listo!', message: 'Pago registrado correctamente.' });
};

  const [servicioDetalle, setServicioDetalle] = useState(null);

  useEffect(() => {
    if (tabActivo === 'Servicios' && barberia?.id) {
      cargarServicios(barberia.id);
    }
  }, [tabActivo, barberia?.id, cargarServicios]);

  useFocusEffect(
    useCallback(() => {
      if (tabActivo === 'Servicios' && barberia?.id) {
        cargarServicios(barberia.id);
      }
    }, [tabActivo, barberia?.id, cargarServicios])
  );

  useEffect(() => {
    if (tabActivo === 'Barberos' && barberia?.id) {
      cargarBarberos(barberia.id);
    }
  }, [tabActivo, barberia?.id, cargarBarberos]);

  useFocusEffect(
    useCallback(() => {
      if (tabActivo === 'Barberos' && barberia?.id) {
        cargarBarberos(barberia.id);
      }
    }, [tabActivo, barberia?.id, cargarBarberos])
  );

  useEffect(() => {
    if (tabActivo === 'Membresia' && subTabMembresia === 'Historial de pagos' && barberia?.id) {
      cargarPagos(barberia.id);
    }
  }, [tabActivo, subTabMembresia, barberia?.id, cargarPagos]);

  useEffect(() => {
    const cargarBarberia = async () => {
      setCargando(true);
      try {
        const barberiaRes = await barberiaAPI.obtenerPorId(barberiaId);
        if (!barberiaRes.success) {
          console.log(barberiaRes.error);
          return;
        }
        const b = barberiaRes.data;
        const [usuarioRes, suscripcionRes] = await Promise.all([
          usuariosAPI.obtenerPorId(b.idUsuario),
          suscripcionAPI.obtenerActiva(b.id),
        ]);
        const usuario = usuarioRes.success ? usuarioRes.data : null;
        const suscripcion = suscripcionRes.success ? suscripcionRes.data : null;
        setSuscripcionDetalle(suscripcion);
        setBarberia({
          id: b.id,
          nombre: b.nombre,
          direccion: b.direccion,
          telefono: b.telefono,
          foto: usuario?.fotoPerfil,
          activa: b.estado === 1,
          dueno: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sin asignar',
          email: usuario ? usuario.email : 'N/A',
          suscripcion: {
            estado: suscripcion ? suscripcion.estado : 'N/A',
            ultimoPago: suscripcion ? formatearFecha(suscripcion.fechaInicio) : 'N/A',
            vence: suscripcion ? formatearFecha(suscripcion.fechaFin) : 'N/A',
          },
        });
      } catch (e) {
        console.log(e);
      } finally {
        setCargando(false);
      }
    };
    if (barberiaId) {
      cargarBarberia();
    }
  }, [barberiaId]);

  const handleAgregar = () => {
    if (tabActivo === 'Servicios') {
      navigation.navigate('EditarServicioScreen', { barberiaId: barberia.id });
      return;
    }
    if (tabActivo !== 'Barberos') {
      console.log(`Agregar ${tabActivo} (pendiente de conectar)`);
      return;
    }
    navigation.navigate('EditarBarberoScreen', { barberiaId: barberia.id });
  };

  const handleEditar = (item) => {
    navigation.navigate('EditarBarberoScreen', {
      barbero: item,
      barberiaId: barberia.id,
    });
  };

  const handleEliminar = (item) => {
    setBarberoAEliminar(item);
  };

  const cerrarModalEliminar = () => {
    setBarberoAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!barberoAEliminar) return;

    setEliminando(true);

    const res = await barberoAPI.eliminar(barberoAEliminar.id);

    setEliminando(false);

    if (!res.success) {
      setBarberoAEliminar(null);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo eliminar',
        message: res.error || 'Ocurrió un error al eliminar al barbero.',
      });
      return;
    }

    setBarberos((prev) => prev.filter((b) => b.id !== barberoAEliminar.id));
    setBarberoAEliminar(null);
    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'El barbero se eliminó correctamente.',
    });
  };

  const handleEditarServicio = (servicio) => {
    navigation.navigate('EditarServicioScreen', { servicio, barberiaId: barberia.id });
  };

  const handleEliminarServicio = (servicio) => {
    setServicioAEliminar(servicio);
  };

  const cerrarModalEliminarServicio = () => {
    setServicioAEliminar(null);
  };

  const confirmarEliminarServicio = async () => {
    if (!servicioAEliminar) return;

    setEliminandoServicio(true);
    const res = await servicioAPI.eliminar(servicioAEliminar.id);
    setEliminandoServicio(false);

    if (!res.success) {
      setServicioAEliminar(null);
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo eliminar',
        message: res.error || 'Ocurrió un error al eliminar el servicio.',
      });
      return;
    }

    setServicios((prev) => prev.filter((s) => s.id !== servicioAEliminar.id));
    setServicioAEliminar(null);
    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'El servicio se eliminó correctamente.',
    });
  };

  const formatearPrecio = (precio) => {
    const num = Number(precio);
    if (Number.isNaN(num)) return '$0';
    return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
  };

  // ── Membresía: handlers ──
  const handleSuspenderMembresia = async () => {
    if (!suscripcionDetalle?.id) return;
    setCambiandoEstadoSuscripcion(true);
    const res = await suscripcionAPI.suspender(suscripcionDetalle.id);
    setCambiandoEstadoSuscripcion(false);

    if (!res.success) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo suspender',
        message: res.error || 'Ocurrió un error al suspender la membresía.',
      });
      return;
    }

    setSuscripcionDetalle((prev) => ({ ...prev, estado: 'SUSPENDIDA' }));
    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'La membresía se suspendió correctamente.',
    });
  };


  const handleReactivarMembresia = async () => {
  if (!suscripcionDetalle?.id) return;
  setCambiandoEstadoSuscripcion(true);
  const res = await suscripcionAPI.reactivar(suscripcionDetalle.id);
  setCambiandoEstadoSuscripcion(false);

  if (!res.success) {
    setResultado({
      visible: true,
      type: 'error',
      title: 'No se pudo reactivar',
      message: res.error || 'Ocurrió un error al reactivar la membresía.',
    });
    return;
  }

  setSuscripcionDetalle(res.data);

  setBarberia((prev) => ({
    ...prev,
    suscripcion: {
      estado:     res.data.estado,
      ultimoPago: formatearFecha(res.data.fechaInicio),
      vence:      formatearFecha(res.data.fechaFin),
    },
  }));

  setResultado({
    visible: true,
    type: 'success',
    title: '¡Listo!',
    message: 'La membresía se reactivó correctamente.',
  });
};


const handleCrearMembresia = async () => {
  if (!barberia?.id) return;
  setCreandoSuscripcion(true);
  const res = await suscripcionAPI.crear(barberia.id);
  setCreandoSuscripcion(false);

  if (!res.success) {
    setResultado({
      visible: true,
      type: 'error',
      title: 'No se pudo crear',
      message: res.error || 'Ocurrió un error al crear la membresía.',
    });
    return;
  }

  setSuscripcionDetalle(res.data);

  setBarberia((prev) => ({
    ...prev,
    suscripcion: {
      estado:     res.data.estado,
      ultimoPago: formatearFecha(res.data.fechaInicio),
      vence:      formatearFecha(res.data.fechaFin),
    },
  }));

  setResultado({
    visible: true,
    type: 'success',
    title: '¡Listo!',
    message: 'La membresía se creó correctamente, con su primer pago pendiente.',
  });
};

  const isWeb = Platform.OS === 'web';
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



// Después:
const formatearMesAnioPago = (pago) => {
  const fecha = pago.fechaPago || pago.fechaInicio;
  if (!fecha) return 'N/A';
  const [anio, mes] = fecha.split('-');
  return `${MESES_LARGO[parseInt(mes, 10) - 1]} de ${anio}`;
};

const renderFilaPago = (pago) => {
  const esPendiente = pago.estado === 'PENDIENTE';
  return (
    <View key={pago.id} style={styles.pagoItem}>
      <Text style={styles.pagoItemFecha}>{formatearMesAnioPago(pago)}</Text>

      <View style={styles.pagoItemCentro}>
        {esPendiente ? (
          <TouchableOpacity
  style={styles.pagoBtnRegistrar}
  onPress={() => {
    setFormPago({ metodoPago: 'EFECTIVO', referencia: '' });
    setPagoARegistrar(pago);
  }}
>
            <Text style={styles.pagoBtnRegistrarText}>Registrar pago</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.pagoItemMonto}>{formatearMonto(pago.monto)}</Text>
        )}
      </View>

      <Text
        style={[
          styles.pagoItemEstado,
          pago.estado === 'PAGADO'
            ? styles.pagoItemEstadoPagado
            : pago.estado === 'PENDIENTE'
            ? styles.pagoItemEstadoPendiente
            : styles.pagoItemEstadoVencido,
        ]}
      >
        {pago.estado === 'PAGADO' ? 'Pagado' : pago.estado === 'PENDIENTE' ? 'Pendiente' : 'Vencido'}
      </Text>
    </View>
  );
};

const pagosPendientes = pagos.filter((p) => p.estado === 'PENDIENTE');
const pagosResto = pagos.filter((p) => p.estado !== 'PENDIENTE');

const formatearMonto = (monto) => {
  const num = Number(monto);
  if (Number.isNaN(num) || monto == null) return '$0';
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
};

  const renderMembresia = () => {
  const estado = suscripcionDetalle?.estado; // 'ACTIVA' | 'VENCIDA' | 'SUSPENDIDA' | undefined
  const esActiva = estado === 'ACTIVA';
  const sinSuscripcion = !suscripcionDetalle;

  return (
    <View>
       {/* ── Línea separadora entre tabs y contenido ── */}
      <View style={styles.subTabsDivider} />
      {/* ── Sub-tabs internos ── */}
      <View style={styles.subTabsRow}>
        {['Membresia', 'Historial de pagos'].map((sub) => (
          <TouchableOpacity
            key={sub}
            style={[styles.subTabPill, subTabMembresia === sub && styles.subTabPillActive]}
            onPress={() => setSubTabMembresia(sub)}
          >
            <Text
              style={[
                styles.subTabPillText,
                subTabMembresia === sub && styles.subTabPillTextActive,
              ]}
            >
              {sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={subTabMembresia === 'Membresia' ? styles.membresiaSectionCard : undefined}>
  {subTabMembresia === 'Membresia' ? (
          sinSuscripcion ? (
            <View style={styles.membresiaCard}>
              <Ionicons
                name="card-outline"
                size={36}
                color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.membresiaCardTitle}>SIN MEMBRESÍA</Text>
              <Text style={[styles.membresiaFechaValor, { marginBottom: 20, textAlign: 'center' }]}>
                Esta barbería aún no tiene una suscripción registrada.
              </Text>
              <TouchableOpacity style={styles.membresiaBtnReactivar} onPress={handleCrearMembresia}>
                <Text style={styles.membresiaBtnText}>Crear membresía</Text>
              </TouchableOpacity>
            </View>
          ) : (
          <View style={styles.membresiaCard}>
            <Text style={styles.membresiaCardTitle}>
              {esActiva ? 'MEMBRESIA ACTIVA' : estado === 'SUSPENDIDA' ? 'MEMBRESIA SUSPENDIDA' : 'MEMBRESIA VENCIDA'}
            </Text>

            <View style={styles.membresiaEstadoRow}>
              <View
                style={[
                  styles.statusDot,
                  esActiva ? styles.statusDotActive : styles.statusDotInactive,
                ]}
              />
              <Text style={styles.membresiaEstadoText}>
                {esActiva ? 'Activo' : estado === 'SUSPENDIDA' ? 'Suspendido' : 'Vencido'}
              </Text>
            </View>

            <View style={styles.membresiaFechaBlock}>
              <Text style={styles.membresiaFechaLabel}>Inicio</Text>
              <Text style={styles.membresiaFechaValor}>
                {formatearFechaLarga(suscripcionDetalle?.fechaInicio)}
              </Text>
            </View>

            <View style={styles.membresiaFechaBlock}>
              <Text style={styles.membresiaFechaLabel}>Vencimiento</Text>
              <Text style={styles.membresiaFechaValor}>
                {formatearFechaLarga(suscripcionDetalle?.fechaFin)}
              </Text>
            </View>

            <Text style={styles.membresiaPrecio}>
              {formatearMonto(PRECIO_MEMBRESIA)} / mes
            </Text>

            <View style={styles.membresiaActions}>
              <TouchableOpacity
                style={styles.membresiaBtnSuspender}
                onPress={handleSuspenderMembresia}
                disabled={!esActiva}
              >
                <Text style={styles.membresiaBtnText}>Suspender membresía</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.membresiaBtnReactivar}
                onPress={handleReactivarMembresia}
                disabled={esActiva}
              >
                <Text style={styles.membresiaBtnText}>Reactivar membresía</Text>
              </TouchableOpacity>
            </View>
          </View>
          )
        ) : (
          <View style={styles.pagosListContainer}>
            {pagos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={36} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
                <Text style={styles.emptyText}>No hay pagos registrados</Text>
              </View>
            ) : (
              <>
                {pagosPendientes.length > 0 && (
                  <>
                    <Text style={styles.pagosGrupoTitulo}>Pendiente</Text>
                    <View style={styles.pagosGrupoLista}>
                      {pagosPendientes.map((pago) => renderFilaPago(pago))}
                    </View>
                  </>
                )}

                <Text style={styles.pagosGrupoTitulo}>Todo</Text>
                <View style={styles.pagosGrupoLista}>
                  {pagosResto.map((pago) => renderFilaPago(pago))}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

  const renderListado = () => {
    if (tabActivo === 'Membresia') {
      return renderMembresia();
    }

    if (tabActivo === 'Servicios') {
      if (servicios.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Ionicons name="cut-outline" size={36} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
            <Text style={styles.emptyText}>No hay servicios registrados</Text>
          </View>
        );
      }

      return (
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
            {servicios.map((servicio) => (
              <View key={servicio.id} style={styles.serviceCard}>
                <View style={styles.serviceInfoBtn}>
                  <Tooltip label="Detalle" position="bottom">
                    <TouchableOpacity onPress={() => setServicioDetalle(servicio)}>
                      <Ionicons name="information-circle-outline" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </Tooltip>
                </View>

                <View style={styles.serviceCardImage}>
                  {servicio.imagen ? (
                    <Image source={{ uri: servicio.imagen }} style={styles.serviceCardImageImg} />
                  ) : (
                    <Ionicons name="cut-outline" size={26} color="#9CA3AF" />
                  )}
                </View>
                <Text style={styles.serviceCardName} numberOfLines={1}>{servicio.nombre}</Text>
                <Text style={styles.serviceCardPrice}>{formatearPrecio(servicio.precio)}</Text>

                <View style={styles.serviceCardActions}>
                  <Tooltip label="Editar">
                    <TouchableOpacity onPress={() => handleEditarServicio(servicio)}>
                      <Feather name="edit-2" size={18} color="#1A1A1A" />
                    </TouchableOpacity>
                  </Tooltip>
                  <Tooltip label="Eliminar">
                    <TouchableOpacity onPress={() => handleEliminarServicio(servicio)}>
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </Tooltip>
                </View>
              </View>
            ))}
          </ScrollView>

          {isWeb && scrollX < scrollMax && (
            <TouchableOpacity style={[styles.carouselArrow, styles.carouselArrowRight]} onPress={handleScrollRight}>
              <Ionicons name="chevron-forward" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (tabActivo !== 'Barberos') {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="construct-outline" size={36} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
          <Text style={styles.emptyText}>
            Sección de {tabActivo} próximamente
          </Text>
        </View>
      );
    }
    if (barberos.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={36} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
          <Text style={styles.emptyText}>No hay barberos registrados</Text>
        </View>
      );
    }
    return barberos.map((item) => (
      <View key={item.id} style={styles.listItem}>
        <View style={styles.listItemAvatar}>
          {item.foto ? (
            <Image source={{ uri: item.foto }} style={styles.listItemAvatarImage} />
          ) : (
            <Ionicons name="person" size={20} color="#9CA3AF" />
          )}
        </View>
        <View style={styles.listItemInfo}>
          <Text style={styles.listItemName}>{item.nombre}</Text>
          <Text style={styles.listItemStatus}>
            Estatus {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        <View style={styles.listItemActions}>
          <Tooltip label="Editar">
            <TouchableOpacity style={styles.listItemActionBtn} onPress={() => handleEditar(item)}>
              <Feather name="edit-2" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
            </TouchableOpacity>
          </Tooltip>
          <Tooltip label="Eliminar">
            <TouchableOpacity style={styles.listItemActionBtn} onPress={() => handleEliminar(item)}>
              <Feather name="trash-2" size={20} color="#EF4444" />
            </TouchableOpacity>
          </Tooltip>
        </View>
      </View>
    ));
  };

  // ── Mostrar el FAB de agregar solo cuando aplica ──
  const mostrarFab = tabActivo === 'Barberos' || tabActivo === 'Servicios';

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>{barberia?.nombre || 'Barbería'}</Text>
        </View>
      </View>
      {barberia && (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrap}>
            {/* ── Card de info ── */}
            <View style={styles.infoCard}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoColumnTitle}>INFO GENERAL</Text>
                <Text style={styles.infoLine}>Dueño: {barberia.dueno}</Text>
                <Text style={styles.infoLine}>Email: {barberia.email}</Text>
                <Text style={styles.infoLine}>Tel: {barberia.telefono}</Text>
                <Text style={styles.infoLine}>Dirección: {barberia.direccion}</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoColumnTitle}>ESTADO</Text>
                <View style={styles.estadoRow}>
                  <View
                    style={[
                      styles.statusDot,
                      barberia.activa ? styles.statusDotActive : styles.statusDotInactive,
                    ]}
                  />
                  <Text style={styles.infoLine}>
                    {barberia.activa ? 'Activa' : 'Suspendida'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoColumnTitle}>SUSCRIPCIÓN</Text>
                <Text style={styles.infoLine}>Estado: {barberia.suscripcion?.estado}</Text>
                <Text style={styles.infoLine}>Último pago: {barberia.suscripcion?.ultimoPago}</Text>
                <Text style={styles.infoLine}>Vence: {barberia.suscripcion?.vence}</Text>
              </View>
            </View>
            {/* ── Tabs ── */}
            <View style={styles.tabsRow}>
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabPill, tabActivo === tab && styles.tabPillActive]}
                  onPress={() => setTabActivo(tab)}
                >
                  <Text
                    style={[
                      styles.tabPillText,
                      tabActivo === tab && styles.tabPillTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.listHeader}>
  {mostrarFab && (
                <Tooltip label="Agregar">
                  <TouchableOpacity style={styles.fab} onPress={handleAgregar}>
                    <MaterialCommunityIcons
                      name="plus-thick"
                      size={20}
                      color={theme.mode === 'dark' ? '#0B1014' : '#FFFFFF'}
                    />
                  </TouchableOpacity>
                </Tooltip>
              )}
            </View>

            {/* ── Listado ── */}
            <View style={styles.listContainer}>
              {renderListado()}
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── Modal: confirmar eliminar barbero ── */}
      <Modal
        transparent
        visible={!!barberoAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar barbero</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminar}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar a este barbero? Esta acción no se puede deshacer.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={cerrarModalEliminar}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnConfirm} onPress={confirmarEliminar}>
                <Text style={styles.modalBtnConfirmText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={!!servicioDetalle}
        animationType="fade"
        onRequestClose={() => setServicioDetalle(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{servicioDetalle?.nombre}</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setServicioDetalle(null)}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              {servicioDetalle?.descripcion || 'Sin descripción disponible.'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* ── Modal: confirmar eliminar servicio ── */}
      <Modal
        transparent
        visible={!!servicioAEliminar}
        animationType="fade"
        onRequestClose={cerrarModalEliminarServicio}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar servicio</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModalEliminarServicio}>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar este servicio? Esta acción no se puede deshacer.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={cerrarModalEliminarServicio}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnConfirm} onPress={confirmarEliminarServicio}>
                <Text style={styles.modalBtnConfirmText}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
  transparent
  visible={!!pagoARegistrar}
  animationType="fade"
  onRequestClose={() => setPagoARegistrar(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Registrar pago</Text>
        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPagoARegistrar(null)}>
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.modalMessage}>
        Monto: {formatearMonto(PRECIO_MEMBRESIA)}
      </Text>

      {/* Selector de método de pago */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
        {['EFECTIVO', 'TRANSFERENCIA'].map((metodo) => (
          <TouchableOpacity
            key={metodo}
            onPress={() => setFormPago((prev) => ({ ...prev, metodoPago: metodo }))}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 16,
              backgroundColor:
                formPago.metodoPago === metodo
                  ? '#FFFFFF'
                  : 'rgba(255,255,255,0.12)',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: formPago.metodoPago === metodo ? '#1A1A1A' : '#FFFFFF',
              }}
            >
              {metodo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Referencia (opcional) */}
      <TextInput
        placeholder="Referencia (opcional)"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={formPago.referencia}
        onChangeText={(v) => setFormPago((prev) => ({ ...prev, referencia: v }))}
        style={{
          color: '#FFFFFF',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          fontSize: 13,
          marginBottom: 18,
        }}
      />

      <View style={styles.modalActions}>
        <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setPagoARegistrar(null)}>
          <Text style={styles.modalBtnCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalBtnConfirm} onPress={confirmarRegistrarPago}>
          <Text style={styles.modalBtnConfirmText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

<LoadingOverlay visible={registrandoPago} message="Registrando pago..." />

      <LoadingOverlay visible={cargando} message="Cargando barbería..." />
      <LoadingOverlay visible={cargandoBarberos} message="Cargando barberos..." />
      <LoadingOverlay visible={eliminando} message="Eliminando barbero..." />
      <LoadingOverlay visible={cargandoServicios} message="Cargando servicios..." />
      <LoadingOverlay visible={eliminandoServicio} message="Eliminando servicio..." />
      <LoadingOverlay visible={cargandoPagos} message="Cargando pagos..." />

      <LoadingOverlay visible={creandoSuscripcion} message="Creando membresía..." />
<LoadingOverlay visible={cambiandoEstadoSuscripcion} message="Actualizando membresía..." />

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={cerrarResultado}
      />
    </SafeAreaView>
  );
};

export default DetalleBarberiaScreen;