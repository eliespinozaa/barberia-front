import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
   Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/superadmin/DetalleMembresiaStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { barberiaAPI, suscripcionAPI, pagoAPI } from '../../config/api';

const TABS = ['Membresia', 'Historial de pagos'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const PRECIO_MEMBRESIA = 499; 
const formatearFechaLarga = (fechaISO) => {
  if (!fechaISO) return 'N/A';
  const [anio, mes, dia] = fechaISO.split('-');
  return `${parseInt(dia, 10)} de ${MESES[parseInt(mes, 10) - 1]} ${anio}`;
};


const formatearMonto = (monto) => {
  if (monto == null) return '$0';
  const num = typeof monto === 'object'
    ? (monto.parsedValue ?? Number(monto.source ?? 0))
    : Number(monto);
  if (Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
};

const formatearMesAnio = (pago) => {
  const fecha = pago.fechaPago || pago.fechaInicio;
  if (!fecha) return 'N/A';
  const [anio, mes] = fecha.split('T')[0].split('-');
  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return `${MESES[parseInt(mes, 10) - 1]} ${anio}`;
};

const formatearFechaCorta = (fechaISO) => {
  if (!fechaISO) return 'N/A';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

const DetalleMembresiaScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const barberiaId = route?.params?.barberiaId;

  const [tabActivo, setTabActivo] = useState('Membresia');
  const [cargando, setCargando] = useState(true);
  const [accionando, setAccionando] = useState(false);

  const [barberia, setBarberia] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [pagos, setPagos] = useState([]);

  const [pagoARegistrar, setPagoARegistrar] = useState(null);
const [registrandoPago, setRegistrandoPago] = useState(false);
const [formPago, setFormPago] = useState({ metodoPago: 'EFECTIVO', referencia: '' });

  const [resultado, setResultado] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });




  const cerrarResultado = () => {
    setResultado((prev) => ({ ...prev, visible: false }));
  };

  const cargarDatos = useCallback(async () => {
    if (!barberiaId) return;
    setCargando(true);

    const [barberiaRes, suscripcionRes, pagosRes] = await Promise.all([
      barberiaAPI.obtenerPorId(barberiaId),
      suscripcionAPI.obtenerActiva(barberiaId),
      pagoAPI.listarPorBarberia(barberiaId),
    ]);

    setBarberia(barberiaRes.success ? barberiaRes.data : null);
    setSuscripcion(suscripcionRes.success ? suscripcionRes.data : null);
    setPagos(pagosRes.success ? pagosRes.data : []);

    setCargando(false);
  }, [barberiaId]);

  useEffect(() => {
  cargarDatos();
}, [tabActivo, cargarDatos]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const pagados = pagos.filter((p) => p.estado === 'PAGADO');
  const pendientes = pagos.filter((p) => p.estado === 'PENDIENTE' || p.estado === 'VENCIDO');
 const adeudo = Math.round(
  pendientes.reduce(
    (acc, p) => acc + (p.monto?.parsedValue ?? Number(p.monto?.source ?? 0)),
    0
  ) * 100
) / 100;

  const montoMensual = pagados[0]?.monto?.parsedValue ?? pagados[0]?.monto?.source ?? null;

  const handleSuspender = async () => {
    if (!suscripcion) return;
    setAccionando(true);
    const res = await suscripcionAPI.suspender(suscripcion.id);
    setAccionando(false);

    if (!res.success) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo suspender',
        message: res.error || 'Ocurrió un error al suspender la membresía.',
      });
      return;
    }

    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'La membresía se suspendió correctamente.',
    });
    cargarDatos();
  };

  const handleReactivar = async () => {
    if (!suscripcion) return;
    setAccionando(true);
    const res = await suscripcionAPI.reactivar(suscripcion.id);
    setAccionando(false);

    if (!res.success) {
      setResultado({
        visible: true,
        type: 'error',
        title: 'No se pudo reactivar',
        message: res.error || 'Ocurrió un error al reactivar la membresía.',
      });
      return;
    }

    setResultado({
      visible: true,
      type: 'success',
      title: '¡Listo!',
      message: 'La membresía se reactivó correctamente.',
    });
    cargarDatos();
  };


  const confirmarRegistrarPago = async () => {
  if (!pagoARegistrar) return;
  setRegistrandoPago(true);
  const res = await pagoAPI.registrarPago(pagoARegistrar.id, {
    idSuscripcion: pagoARegistrar.idSuscripcion ?? suscripcion?.id,
    idBarberia: barberiaId,
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
  setResultado({
    visible: true,
    type: 'success',
    title: '¡Listo!',
    message: 'Pago registrado correctamente.',
  });
};

  const estadoInfo = (() => {
    if (!suscripcion) return { color: '#EF4444', label: 'Sin membresía activa' };
    if (suscripcion.estado === 'ACTIVA') return { color: '#22C55E', label: 'Membresia activa' };
    if (suscripcion.estado === 'SUSPENDIDA') return { color: '#F59E0B', label: 'Membresia suspendida' };
    return { color: '#EF4444', label: 'Membresia vencida' };
  })();

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
              <Text style={styles.statLabel}>Pagos</Text>
              <Text style={styles.statValue}>{cargando ? '...' : pagados.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pendientes</Text>
              <Text style={styles.statValue}>{cargando ? '...' : pendientes.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Adeudo</Text>
              <Text style={styles.statValue}>
  {cargando ? '...' : formatearMonto(adeudo)}
</Text>
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

          {/* ── Contenido ── */}
          {tabActivo === 'Membresia' ? (
            <View style={styles.card}>
              <Text style={styles.barberiaNombre}>{barberia?.nombre || '—'}</Text>

              <View style={styles.estadoRow}>
                <View style={[styles.estadoDot, { backgroundColor: estadoInfo.color }]} />
                <Text style={styles.estadoText}>{estadoInfo.label}</Text>
              </View>

              <Text style={styles.label}>Inicio</Text>
              <Text style={styles.value}>{formatearFechaLarga(suscripcion?.fechaInicio)}</Text>

              <Text style={styles.label}>Vencimiento</Text>
              <Text style={styles.value}>{formatearFechaLarga(suscripcion?.fechaFin)}</Text>

              <Text style={styles.label}>Pago mensual</Text>
              <Text style={styles.value}>
                {montoMensual ? `$${montoMensual} MXN / mes` : '$499 MXN / mes'}
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleSuspender}
                  disabled={!suscripcion || suscripcion.estado !== 'ACTIVA' || accionando}
                >
                  <Text style={styles.actionBtnText}>Suspender membresía</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleReactivar}
                  disabled={!suscripcion || suscripcion.estado === 'ACTIVA' || accionando}
                >
                  <Text style={styles.actionBtnText}>Reactivar membresía</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {pagos.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={32} color={theme.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} />
                  <Text style={styles.emptyText}>No hay pagos registrados</Text>
                </View>
              ) : (
                <>
  {pagos.filter(p => p.estado === 'PENDIENTE').length > 0 && (
    <>
      <Text style={styles.pagosGrupoTitulo}>Pendientes</Text>
      <View style={styles.pagosGrupoLista}>
        {pagos.filter(p => p.estado === 'PENDIENTE').map(p => (
          <View key={p.id} style={styles.pagoItem}>
            <Text style={styles.pagoItemFecha}>{formatearMesAnio(p)}</Text>
            <View style={styles.pagoItemCentro}>
             <TouchableOpacity
  style={styles.pagoBtnRegistrar}
  onPress={() => {
    setFormPago({ metodoPago: 'EFECTIVO', referencia: '' });
    setPagoARegistrar(p);
  }}
>
  <Text style={styles.pagoBtnRegistrarText}>Registrar pago</Text>
</TouchableOpacity>
            </View>
            <Text style={[styles.pagoItemEstado, styles.pagoItemEstadoPendiente]}>
              Pendiente
            </Text>
          </View>
        ))}
      </View>
    </>
  )}

  <Text style={styles.pagosGrupoTitulo}>Todo</Text>
  <View style={styles.pagosGrupoLista}>
    {pagos.filter(p => p.estado !== 'PENDIENTE').map(p => (
      <View key={p.id} style={styles.pagoItem}>
        <Text style={styles.pagoItemFecha}>{formatearMesAnio(p)}</Text>
        <View style={styles.pagoItemCentro}>
          <Text style={styles.pagoItemMonto}>{formatearMonto(p.monto)}</Text>
        </View>
        <Text style={[
          styles.pagoItemEstado,
          p.estado === 'PAGADO' ? styles.pagoItemEstadoPagado : styles.pagoItemEstadoVencido,
        ]}>
          {p.estado === 'PAGADO' ? 'Pagado' : 'Vencido'}
        </Text>
      </View>
    ))}
  </View>
</>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <LoadingOverlay visible={cargando} message="Cargando membresía..." />
      <LoadingOverlay visible={accionando} message="Procesando..." />

      <ResultModal
        visible={resultado.visible}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={cerrarResultado}
      />




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
  <Ionicons name="close" size={18} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
</TouchableOpacity>
      </View>

      <Text style={styles.modalMessage}>
        Monto: {formatearMonto(PRECIO_MEMBRESIA)}
      </Text>

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
            ? (theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A')
            : (theme.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'),
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: formPago.metodoPago === metodo
            ? (theme.mode === 'dark' ? '#1A1A1A' : '#FFFFFF')
            : (theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'),
        }}
      >
        {metodo}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<TextInput
  placeholder="Referencia (opcional)"
  placeholderTextColor={theme.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
  value={formPago.referencia}
  onChangeText={(v) => setFormPago((prev) => ({ ...prev, referencia: v }))}
  style={{
    color: theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A',
    borderWidth: 1,
    borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
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

    </SafeAreaView>
  );
};

export default DetalleMembresiaScreen;