import React, { useState } from 'react';
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
import createStyles from '../../styles/owner/AdminEditarHorarioStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { horarioAPI } from '../../config/api';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const formatearHora = (hora) => {
  if (!hora) return '';
  return hora.length > 5 ? hora.substring(0, 5) : hora;
};

// Inicializa el estado de cada día con los datos que vienen del backend
const inicializarDias = (horarios) => {
  const map = {};
  (horarios || []).forEach((h) => {
    const dia = h.diaSemana?.toLowerCase();
    if (dia) map[dia] = h;
  });

  return DIAS.map((dia) => {
    const key = dia.toLowerCase();
    const h = map[key];
    return {
      dia,
      id:           h?.id        || null,
      abierto:      h ? h.estado === 1 : false,
      horaApertura: h ? formatearHora(h.horaApertura) : '',
      horaCierre:   h ? formatearHora(h.horaCierre)   : '',
    };
  });
};

const AdminEditarHorarioScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const barberiaId    = route?.params?.barberiaId;
  const horariosParam = route?.params?.horarios || [];

  const [dias, setDias] = useState(() => inicializarDias(horariosParam));
  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState({
    visible: false,
    type:    'success',
    title:   '',
    message: '',
  });

  const cerrarResultado = () => {
    const fueExito = resultado.type === 'success';
    setResultado((prev) => ({ ...prev, visible: false }));
    if (fueExito) navigation.goBack();
  };

  // Actualiza un campo de un día concreto
  const actualizarDia = (index, campo, valor) => {
    setDias((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [campo]: valor } : d))
    );
  };

  const validar = () => {
    for (const d of dias) {
      if (!d.abierto) continue;
      if (!d.horaApertura.trim() || !d.horaCierre.trim()) {
        setResultado({
          visible: true,
          type:    'error',
          title:   'Faltan horas',
          message: `Completa la hora de apertura y cierre de ${d.dia}.`,
        });
        return false;
      }
      if (d.horaCierre <= d.horaApertura) {
        setResultado({
          visible: true,
          type:    'error',
          title:   'Horario inválido',
          message: `La hora de cierre de ${d.dia} debe ser mayor a la de apertura.`,
        });
        return false;
      }
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);

    const promesas = dias.map((d) => {
      const payload = {
  idBarberia:   barberiaId,
  diaSemana:    d.dia,
  horaApertura: d.abierto ? d.horaApertura : (d.horaApertura || '08:00'),
  horaCierre:   d.abierto ? d.horaCierre   : (d.horaCierre   || '18:00'),
  estado:       d.abierto ? 1 : 0,
};

      if (d.id) {
        return horarioAPI.actualizar(d.id, payload);
      } else {
        return horarioAPI.crear(payload);
      }
    });

    const resultados = await Promise.all(promesas);
    setGuardando(false);

    const hayError = resultados.some((r) => !r.success);
    if (hayError) {
      setResultado({
        visible: true,
        type:    'error',
        title:   'Error al guardar',
        message: 'No se pudieron guardar algunos horarios. Intenta de nuevo.',
      });
      return;
    }

    setResultado({
      visible: true,
      type:    'success',
      title:   '¡Listo!',
      message: 'El horario se actualizó correctamente.',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Editar</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>
          <View style={styles.card}>
            <View style={styles.grid}>
              {dias.map((d, idx) => (
                <View key={d.dia} style={styles.diaCol}>
                  {/* Nombre del día */}
                  <Text style={styles.diaNombre}>{d.dia}</Text>

                  {/* Checkbox abierto/cerrado */}
<TouchableOpacity
  style={styles.checkRow}
  onPress={() => actualizarDia(idx, 'abierto', !d.abierto)}
  activeOpacity={0.7}
>
  <View style={[styles.checkbox, d.abierto && styles.checkboxChecked]}>
    {d.abierto && (
      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
    )}
  </View>
  <Text style={[styles.checkLabel, d.abierto && styles.checkLabelAbierto]}>
    {d.abierto ? 'Abierto' : 'Cerrado'}
  </Text>
</TouchableOpacity>

                  {/* Hora apertura */}
                  <Text style={styles.horaLabel}>Hora de apertura:</Text>
                  <View style={[styles.horaInput, !d.abierto && styles.horaInputDisabled]}>
                    <TextInput
                      style={[styles.horaInputText, !d.abierto && styles.horaInputTextDisabled]}
                      value={d.horaApertura}
                      onChangeText={(v) => actualizarDia(idx, 'horaApertura', v)}
                      placeholder="08:00"
                      placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                      editable={d.abierto}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>

                  {/* Hora cierre */}
                  <Text style={styles.horaLabel}>Hora de cierre:</Text>
                  <View style={[styles.horaInput, !d.abierto && styles.horaInputDisabled]}>
                    <TextInput
                      style={[styles.horaInputText, !d.abierto && styles.horaInputTextDisabled]}
                      value={d.horaCierre}
                      onChangeText={(v) => actualizarDia(idx, 'horaCierre', v)}
                      placeholder="18:00"
                      placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                      editable={d.abierto}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* ── Botón actualizar ── */}
            <TouchableOpacity
              style={[styles.saveBtn, guardando && { opacity: 0.6 }]}
              onPress={handleGuardar}
              disabled={guardando}
            >
              <Text style={styles.saveBtnText}>
                {guardando ? 'Guardando...' : 'Actualizar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LoadingOverlay visible={guardando} message="Guardando horario..." />

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

export default AdminEditarHorarioScreen;