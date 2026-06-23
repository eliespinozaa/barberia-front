import { StyleSheet } from 'react-native';

const createStyles = (theme) => {
  const isDark = theme.mode === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0B1120' : '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
    },

    content: {
      alignItems: 'center',
      paddingHorizontal: 40,
      width: '100%',
      maxWidth: 360,
    },

    iconWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderWidth: 2,
      borderColor: '#C9A84C',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      ...(isDark
        ? {}
        : { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 }),
    },

    title: {
      fontSize: 24,
      fontWeight: '900',
      color: isDark ? '#FFF' : '#1A1A1A',
      textAlign: 'center',
      lineHeight: 32,
      marginBottom: 10,
    },

    titleAccent: {
      color: '#C9A84C',
    },

    subtitle: {
      fontSize: 14,
      color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.55)',
      marginBottom: 32,
      textAlign: 'center',
    },

    progressBg: {
      width: '100%',
      height: 4,
      backgroundColor: isDark
        ? 'rgba(201,168,76,0.2)'
        : 'rgba(201,168,76,0.15)',
      borderRadius: 2,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      backgroundColor: '#C9A84C',
      borderRadius: 2,
    },
  });
};

export default createStyles;