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
import createStyles from '../../styles/owner/AdminHorariosStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import { horarioAPI } from '../../config/api';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const formatearHora = (hora) => {
  if (!hora) return null;
  // Si viene como "08:00:00" truncamos a "08:00"
  return hora.length > 5 ? hora.substring(0, 5) : hora;
};

const AdminHorariosScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);

  const barberiaId = route?.params?.barberiaId;

  const [horarios, setHorarios] = useState([]); // array de objetos del backend
  const [cargando, setCargando] = useState(true);

  const cargarHorarios = useCallback(async () => {
    if (!barberiaId) return;
    setCargando(true);
    const res = await horarioAPI.listarPorBarberia(barberiaId);
    if (res.success) {
      setHorarios(res.data);
    } else {
      setHorarios([]);
    }
    setCargando(false);
  }, [barberiaId]);

  useFocusEffect(
    useCallback(() => {
      cargarHorarios();
    }, [cargarHorarios])
  );

  // Busca el horario de un día concreto
  const getHorarioDia = (dia) =>
    horarios.find(
      (h) => h.diaSemana?.toLowerCase() === dia.toLowerCase()
    );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          <Text style={styles.sectionTitle}>Horario semanal</Text>

          <View style={styles.card}>
            {DIAS.map((dia, idx) => {
              const h = getHorarioDia(dia);
              const abierto = h && h.estado === 1;
              const apertura = abierto ? formatearHora(h.horaApertura) : null;
              const cierre   = abierto ? formatearHora(h.horaCierre)   : null;

              return (
                <View
                  key={dia}
                  style={[
                    styles.fila,
                    idx === DIAS.length - 1 && styles.filaLast,
                  ]}
                >
                  <Text style={styles.filaDia}>{dia}</Text>
                  <Text style={[styles.filaHora, !abierto && styles.filaHoraCerrado]}>
                    {abierto ? `${apertura} - ${cierre}` : 'Cerrado'}
                  </Text>
                </View>
              );
            })}

            {/* ── Botón editar ── */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate('AdminEditarHorarioScreen', {
                  barberiaId,
                  horarios,
                })
              }
            >
              <Text style={styles.editBtnText}>Editar Horario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LoadingOverlay visible={cargando} message="Cargando horario..." />
    </SafeAreaView>
  );
};

export default AdminHorariosScreen;