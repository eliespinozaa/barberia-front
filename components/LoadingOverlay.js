import React, { useEffect, useRef } from 'react';
import { Modal, View, Animated, Easing, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * LoadingOverlay
 * Spinner circular reutilizable para usar mientras se crea/actualiza/elimina algo.
 * Gira, se detiene un instante, gira de nuevo (no es un giro continuo uniforme).
 * Se adapta solo al modo claro/oscuro usando el ThemeContext de la app.
 *
 * Uso:
 *   <LoadingOverlay visible={cargando} message="Creando barbería..." />
 */
const LoadingOverlay = ({ visible, message = 'Cargando...' }) => {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    rotation.setValue(0);

    const cicloDeGiro = Animated.sequence([
      // Gira una vuelta completa
      Animated.timing(rotation, {
        toValue: 1,
        duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // Pequeña pausa antes de volver a girar
      Animated.delay(250),
    ]);

    const loop = Animated.loop(
      Animated.sequence([
        cicloDeGiro,
        // Reinicia el valor a 0 sin animación para encadenar el siguiente giro
        Animated.timing(rotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [visible]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cardBg     = isDark ? '#1A2230' : '#FFFFFF';
  const textColor  = isDark ? '#FFFFFF' : '#1A1A1A';
  const trackColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  const spinColor  = isDark ? '#FFFFFF' : (theme.colors?.primary || '#1A1A1A');

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Animated.View
            style={[
              styles.spinner,
              {
                borderColor: trackColor,
                borderTopColor: spinColor,
                transform: [{ rotate: spin }],
              },
            ]}
          />
          {!!message && (
            <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  card: {
    borderRadius:      20,
    paddingVertical:   28,
    paddingHorizontal: 36,
    alignItems:        'center',
    gap:               14,
  },
  spinner: {
    width:        44,
    height:       44,
    borderRadius: 22,
    borderWidth:  4,
  },
  message: {
    fontSize:   13,
    fontWeight: '600',
  },
};

export default LoadingOverlay;