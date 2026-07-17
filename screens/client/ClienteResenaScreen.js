import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from '../../styles/client/ClienteResenaStyles';
import LoadingOverlay from '../../components/LoadingOverlay';
import ResultModal from '../../components/ResultModal';
import { tokenManager, clienteAPI, resenaAPI } from '../../config/api';

const ClienteResenaScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = createStyles(width, theme);

  const { idCita } = route.params;

  const [verificando, setVerificando] = useState(true);
  const [yaReseno, setYaReseno] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');

  const [resultado, setResultado] = useState({
    visible: false, type: 'success', title: '', message: '',
  });

  const verificarResena = useCallback(async () => {
    setVerificando(true);
    const res = await resenaAPI.existePorCita(idCita);
    if (res.success) {
      setYaReseno(!!res.data);
    }
    setVerificando(false);
  }, [idCita]);

  useFocusEffect(
    useCallback(() => {
      verificarResena();
    }, [verificarResena])
  );

  const handleEnviar = async () => {
    if (calificacion === 0) {
      setResultado({
        visible: true, type: 'error', title: 'Falta la calificación',
        message: 'Selecciona al menos una estrella antes de enviar.',
      });
      return;
    }

    setEnviando(true);

    const userActual = await tokenManager.getUser();
    const resBarberia = await clienteAPI.obtenerBarberiaAsociada(userActual.id);
    const idBarberia = resBarberia?.data?.id;

    const payload = {
      idUsuario: userActual.id,
      idBarberia,
      idCita,
      calificacion,
      comentario,
    };

    const res = await resenaAPI.crear(payload);
    setEnviando(false);

    if (res.success) {
      setResultado({
        visible: true, type: 'success', title: '¡Gracias!',
        message: 'Tu reseña se envió correctamente.',
      });
    } else {
      setResultado({
        visible: true, type: 'error', title: 'No se pudo enviar',
        message: res.error || 'Ocurrió un error al enviar tu reseña.',
      });
    }
  };

  const cerrarResultado = () => {
    const fueExito = resultado.type === 'success';
    setResultado((prev) => ({ ...prev, visible: false }));
    if (fueExito) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <LoadingOverlay visible={verificando} message="Cargando..." />
      <LoadingOverlay visible={enviando} message="Enviando reseña..." />

      <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>Reseñas</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color="#1A1A1A" />
          </TouchableOpacity>

          {yaReseno ? (
            <View style={styles.yaResenoWrap}>
              <Ionicons name="checkmark-circle" size={40} color="#22C55E" />
              <Text style={styles.yaResenoTexto}>
                Ya dejaste una reseña para esta cita.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.calificacionRow}>
                <Text style={styles.label}>Calificación:</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={styles.starBtn}
                      onPress={() => setCalificacion(n)}
                    >
                      <Ionicons
                        name={n <= calificacion ? 'star' : 'star-outline'}
                        size={26}
                        color="#F5B940"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.label}>Comentario:</Text>
              <TextInput
                style={styles.comentarioInput}
                placeholder=""
                placeholderTextColor="rgba(0,0,0,0.35)"
                multiline
                numberOfLines={3}
                value={comentario}
                onChangeText={setComentario}
              />

              <TouchableOpacity
                style={[styles.btnEnviar, enviando && styles.btnEnviarDisabled]}
                onPress={handleEnviar}
                disabled={enviando}
              >
                <Text style={styles.btnEnviarTexto}>
                  {enviando ? 'Enviando...' : 'Enviar'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

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

export default ClienteResenaScreen;