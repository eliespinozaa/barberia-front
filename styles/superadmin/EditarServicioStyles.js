import { StyleSheet, Platform } from 'react-native';

const createStyles = (width, theme) => {
  const isSmall = width < 768;
  const isWeb   = Platform.OS === 'web';
  const isDark  = theme.mode === 'dark';

  const NAVBAR        = '#0B1014';
  const CONTENT_MAX_W = isSmall ? '100%' : 600;
  const CARD_BG       = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const WHITE         = isDark ? '#FFFFFF' : '#1A1A1A';
  const MUTED         = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const INPUT_BG      = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const BORDER        = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'center',
      backgroundColor:   NAVBAR,
      paddingHorizontal: isSmall ? 16 : 28,
      paddingVertical:   isSmall ? 14 : 18,
      position:          'relative',
    },
    backBtn: {
      position:        'absolute',
      left:            isSmall ? 16 : 28,
      width:           40,
      height:          40,
      borderRadius:    20,
      backgroundColor: 'rgba(255,255,255,0.12)',
      justifyContent:  'center',
      alignItems:      'center',
    },
    headerPill: {
      backgroundColor:   '#FFFFFF',
      borderRadius:      24,
      paddingHorizontal: 28,
      paddingVertical:   10,
    },
    headerTitle: {
      color:      '#1A1A1A',
      fontSize:   isSmall ? 16 : 18,
      fontWeight: '700',
    },

    body: {
      flex: 1,
    },
    bodyInner: {
      padding:       isSmall ? 16 : 28,
      paddingBottom: 40,
      alignItems:    'center',
    },
    contentWrap: {
      width:    '100%',
      maxWidth: CONTENT_MAX_W,
    },

    imagePicker: {
      alignSelf:       'center',
      width:           110,
      height:          110,
      borderRadius:    24,
      backgroundColor: CARD_BG,
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
      marginBottom:    24,
      borderWidth:     1,
      borderColor:     BORDER,
    },
    imagePreview: {
      width:  110,
      height: 110,
    },
    imagePlaceholder: {
      justifyContent: 'center',
      alignItems:     'center',
    },
    imagePlaceholderText: {
      color:    MUTED,
      fontSize: 11,
      fontWeight: '600',
      marginTop: 6,
    },

    label: {
      color:        WHITE,
      fontSize:     13,
      fontWeight:   '700',
      marginBottom: 8,
      marginTop:    4,
    },
    input: {
      backgroundColor:   INPUT_BG,
      borderRadius:      14,
      paddingHorizontal: 16,
      paddingVertical:   12,
      fontSize:          14,
      color:             WHITE,
      marginBottom:      18,
      borderWidth:       1,
      borderColor:       BORDER,
    },
    inputMultiline: {
      minHeight:   80,
      textAlignVertical: 'top',
    },

  column: {
  marginBottom: 24,
},
statusRow: {
  flexDirection:  'row',
  alignItems:     'center',
  justifyContent: 'space-between',
  backgroundColor: INPUT_BG,
  borderRadius:    14,
  paddingHorizontal: 16,
  paddingVertical:   12,
  borderWidth:     1,
  borderColor:     BORDER,
},
statusLabel: {
  color:      WHITE,
  fontSize:   14,
  fontWeight: '600',
},

    saveBtn: {
      backgroundColor:   isDark ? '#FFFFFF' : '#1A1A1A',
      borderRadius:      24,
      paddingVertical:   14,
      alignItems:        'center',
      marginTop:         12,
      ...(isWeb
        ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.3)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          }),
    },
    saveBtnText: {
      color:      isDark ? '#0B1014' : '#FFFFFF',
      fontSize:   15,
      fontWeight: '700',
    },
  });

  styles.placeholderColor = MUTED;

  return styles;
};

export default createStyles;