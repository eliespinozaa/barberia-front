import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * ResultModal
 * Modal centrado para indicar si una operación (crear/actualizar/eliminar)
 * terminó bien o con error. Se adapta solo al modo claro/oscuro.
 *
 * Uso:
 *   <ResultModal
 *     visible={resultado.visible}
 *     type="success"            // "success" | "error"
 *     title="¡Listo!"
 *     message="La barbería se creó correctamente."
 *     onClose={() => setResultado({ visible: false })}
 *   />
 */
const ResultModal = ({
  visible,
  type = 'success',
  title,
  message,
  onClose,
  confirmText = 'Aceptar',
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const esExito = type === 'success';

  const cardBg    = isDark ? '#1A2230' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const iconBg    = esExito ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
  const iconColor = esExito ? '#22C55E' : '#EF4444';
  const tituloDefault = esExito ? '¡Listo!' : 'Algo salió mal';

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons
              name={esExito ? 'checkmark' : 'close'}
              size={30}
              color={iconColor}
            />
          </View>

          <Text style={[styles.title, { color: textColor }]}>
            {title || tituloDefault}
          </Text>

          {!!message && (
            <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: iconColor }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex:              1,
    backgroundColor:   'rgba(0,0,0,0.6)',
    justifyContent:    'center',
    alignItems:        'center',
    paddingHorizontal: 24,
  },
  card: {
    width:             '100%',
    maxWidth:          320,
    borderRadius:      20,
    paddingVertical:   28,
    paddingHorizontal: 26,
    alignItems:        'center',
    gap:               10,
  },
  iconCircle: {
    width:          56,
    height:         56,
    borderRadius:   28,
    justifyContent: 'center',
    alignItems:     'center',
    marginBottom:   6,
  },
  title: {
    fontSize:   16,
    fontWeight: '700',
    textAlign:  'center',
  },
  message: {
    fontSize:     13,
    fontWeight:   '500',
    textAlign:    'center',
    opacity:      0.85,
    lineHeight:   18,
    marginBottom: 8,
  },
  button: {
    borderRadius:      20,
    paddingVertical:   11,
    paddingHorizontal: 36,
    marginTop:         4,
  },
  buttonText: {
    color:      '#FFFFFF',
    fontSize:   13,
    fontWeight: '700',
  },
};

export default ResultModal;