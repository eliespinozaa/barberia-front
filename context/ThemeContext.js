import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
  mode: 'light',
  colors: {
    background: '#F5F5F0',
    surface: '#FFFFFF',
    primary: '#1A1A1A',
    secondary: '#C9A84C',
    accent: '#8B0000',

    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
navText: '#FFFFFF',
    textMuted: '#8A8A8A',
    textLight: '#A0A0A0',
    iconSecondary: '#6B6B6B',

    border: '#E0E0E0',
    error: '#E74C3C',
    success: '#4CAF50',
    warning: '#FF9800',

    background: '#F5F5F0',
    surface: '#FFFFFF',
    primary: '#1A1A1A',
    secondary: '#C9A84C',
    accent: '#8B0000',
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    border: '#E0E0E0',
    error: '#E74C3C',
    success: '#4CAF50',
    warning: '#FF9800',
    cardBackground: '#FFFFFF',
    headerBackground: '#1A1A1A',
    navBackground: '#1A1A1A',
    inputBackground: '#F5F5F0',
    shadowColor: '#000',
    heroBackground: '#1A1A1A',
    sectionBackground: '#F5F5F0',
    sectionAltBackground: '#EBEBEB',
    footerBackground: '#1A1A1A',
    statsBackground: '#C9A84C',
    ctaBackground: '#C9A84C',
    ctaText: '#1A1A1A',
    statNumber: '#1A1A1A',
    statLabel: 'rgba(0,0,0,0.6)',
  }
};

export const darkTheme = {
  
 mode: 'dark',
  colors: {
    background: '#0B1120',
    surface: '#1A1A1A',
    primary: '#C9A84C',
    secondary: '#C9A84C',
    accent: '#E74C3C',

    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',
navText: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.45)',
    textLight: 'rgba(255,255,255,0.30)',
    iconSecondary: 'rgba(255,255,255,0.50)',

    border: '#2C2C2C',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',


    background: '#0B1120',
    surface: '#1A1A1A',
    primary: '#C9A84C',
    secondary: '#C9A84C',
    accent: '#E74C3C',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.45)',
    border: '#2C2C2C',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',
    cardBackground: '#0B1014',
    headerBackground: '#0B1014',
    navBackground: '#0B1014',
    inputBackground: '#1A1A1A',
    shadowColor: '#000',
    heroBackground: '#0B1120',
    sectionBackground: '#0B1120',
    sectionAltBackground: '#0B1014',
    footerBackground: '#0B1120',
    statsBackground: '#C9A84C',
    ctaBackground: '#C9A84C',
    ctaText: '#1A1A1A',
    statNumber: '#1A1A1A',
    statLabel: 'rgba(0,0,0,0.6)',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@barber_theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('@barber_theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};