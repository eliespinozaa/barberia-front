import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const Tooltip = ({ label, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  // En móvil no existe "hover", así que solo renderizamos los hijos tal cual
  if (!isWeb) return children;

  return (
    <View
      style={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <View style={[styles.bubble, position === 'top' ? styles.bubbleTop : styles.bubbleBottom]}>
          <Text style={styles.bubbleText}>{label}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    ...(isWeb ? { position: 'relative' } : {}),
  },
  bubble: {
    position:          'absolute',
    backgroundColor:   '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      6,
    zIndex:            50,
    ...(isWeb ? { whiteSpace: 'nowrap' } : {}),
  },
  bubbleTop: {
    bottom:       '100%',
    marginBottom: 6,
  },
  bubbleBottom: {
    top:       '100%',
    marginTop: 6,
  },
  bubbleText: {
    color:      '#FFFFFF',
    fontSize:   11,
    fontWeight: '600',
  },
});

export default Tooltip;