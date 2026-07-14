import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/barber/BarberHorariosStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import { tokenManager, barberoAPI, horarioAPI } from '../../config/api';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const formatearHora = (hora) => {
  if (!hora) return '';
  return hora.length > 5 ? hora.substring(0, 5) : hora;
};

// Igual que en AdminEditarHorarioScreen, pero solo para mostrar
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
      abierto:      h ? h.estado === 1 : false,
      horaApertura: h ? formatearHora(h.horaApertura) : '--:--',
      horaCierre:   h ? formatearHora(h.horaCierre)   : '--:--',
    };
  });
};

const BarberHorariosScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);
  const isDark = theme.mode === 'dark';

  const [cargando, setCargando] = useState(true);
  const [dias, setDias] = useState(() => inicializarDias([]));

  const cargarHorario = useCallback(async () => {
    setCargando(true);

    const user = await tokenManager.getUser();
    if (!user?.id) {
      setCargando(false);
      return;
    }

    const resBarbero = await barberoAPI.obtenerPorUsuario(user.id);
    if (!resBarbero.success) {
      setCargando(false);
      return;
    }

    const resHorario = await horarioAPI.listarPorBarberia(resBarbero.data.idBarberia);
    if (resHorario.success) {
      setDias(inicializarDias(resHorario.data));
    }

    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarHorario();
    }, [cargarHorario])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LoadingOverlay visible={cargando} message="Cargando horario..." />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerPill}>
          <Text style={styles.headerTitle}>Horario</Text>
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
              {dias.map((d) => (
                <View key={d.dia} style={styles.diaCol}>
                  {/* Nombre del día */}
                  <Text style={styles.diaNombre}>{d.dia}</Text>

                  {/* Estado abierto/cerrado — solo visual, sin onPress */}
                  <View style={styles.checkRow}>
                    <View style={[styles.checkbox, d.abierto && styles.checkboxChecked]}>
                      {d.abierto && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={[styles.checkLabel, d.abierto && styles.checkLabelAbierto]}>
                      {d.abierto ? 'Abierto' : 'Cerrado'}
                    </Text>
                  </View>

                  {/* Hora apertura */}
                  <Text style={styles.horaLabel}>Hora de apertura:</Text>
                  <View style={[styles.horaInput, !d.abierto && styles.horaInputDisabled]}>
                    <Text style={[styles.horaInputText, !d.abierto && styles.horaInputTextDisabled]}>
                      {d.horaApertura}
                    </Text>
                  </View>

                  {/* Hora cierre */}
                  <Text style={styles.horaLabel}>Hora de cierre:</Text>
                  <View style={[styles.horaInput, !d.abierto && styles.horaInputDisabled]}>
                    <Text style={[styles.horaInputText, !d.abierto && styles.horaInputTextDisabled]}>
                      {d.horaCierre}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ── Botón actualizar ──
              Comentado a propósito: por ahora el barbero solo puede VER su
              horario, no editarlo. Cuando se habilite la edición, descomentar
              y traer de vuelta la lógica de handleGuardar / validar de
              AdminEditarHorarioScreen.

            <TouchableOpacity
              style={[styles.saveBtn, guardando && { opacity: 0.6 }]}
              onPress={handleGuardar}
              disabled={guardando}
            >
              <Text style={styles.saveBtnText}>
                {guardando ? 'Guardando...' : 'Actualizar'}
              </Text>
            </TouchableOpacity>
            */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BarberHorariosScreen;