import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TYPES = {
  loading: { bg: '#1A1A2E', border: '#C9A84C', icon: 'time-outline',             iconColor: '#C9A84C', text: '#C9A84C' },
  success: { bg: '#1A1A2E', border: '#2ecc71', icon: 'checkmark-circle-outline', iconColor: '#2ecc71', text: '#2ecc71' },
  error:   { bg: '#1A1A2E', border: '#e74c3c', icon: 'close-circle-outline',     iconColor: '#e74c3c', text: '#e74c3c' },
  info:    { bg: '#1A1A2E', border: '#C9A84C', icon: 'information-circle-outline',iconColor: '#C9A84C', text: '#FFF'   },
};

const ToastAlert = ({ visible, type = 'info', message }) => {
  const opacity  = useRef(new Animated.Value(0)).current;
  const scale    = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1,    duration: 280, useNativeDriver: true }),
        Animated.spring(scale,   { toValue: 1,    useNativeDriver: true, friction: 7 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0,    duration: 220, useNativeDriver: true }),
        Animated.timing(scale,   { toValue: 0.85, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const t = TYPES[type] || TYPES.info;

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.card, {
        backgroundColor: t.bg,
        borderColor: t.border,
        transform: [{ scale }],
      }]}>
        <View style={[styles.iconCircle, { borderColor: t.border }]}>
          <Ionicons name={t.icon} size={36} color={t.iconColor} />
        </View>
        <Text style={[styles.message, { color: t.text }]}>{message}</Text>
        <View style={[styles.bar, { backgroundColor: t.border }]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 999,
    ...(Platform.OS === 'web' && { pointerEvents: 'none' }),
  },
  card: {
    width: 260,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  bar: {
    width: '60%',
    height: 3,
    borderRadius: 10,
    opacity: 0.6,
  },
});

export default ToastAlert;