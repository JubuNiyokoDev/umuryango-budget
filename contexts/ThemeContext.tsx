import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundAlt: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  card: string;
  border: string;
  shadow: string;
}

const lightTheme: Theme = {
  primary: '#1976D2',
  secondary: '#4CAF50',
  accent: '#81C784',
  background: '#FAFAFA',
  backgroundAlt: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  success: '#2E7D32',
  warning: '#FF9800',
  error: '#F44336',
  card: '#FFFFFF',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme: Theme = {
  primary: '#42A5F5',
  secondary: '#66BB6A',
  accent: '#A5D6A7',
  background: '#121212',
  backgroundAlt: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  card: '#2D2D2D',
  border: '#404040',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  changeTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback to light theme if context is not available
    return {
      theme: lightTheme,
      themeMode: 'light' as ThemeMode,
      changeTheme: async () => {}
    };
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>(() => {
    // Provide immediate default theme based on system
    const systemScheme = Appearance.getColorScheme();
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  });

  useEffect(() => {
    loadTheme();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    });

    return () => subscription?.remove();
  }, [themeMode]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      const mode = (savedTheme as ThemeMode) || 'system';
      setThemeMode(mode);
      
      const newTheme = mode === 'system' 
        ? (Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme)
        : (mode === 'dark' ? darkTheme : lightTheme);
      
      setTheme(newTheme);
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const changeTheme = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      
      const newTheme = mode === 'system' 
        ? (Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme)
        : (mode === 'dark' ? darkTheme : lightTheme);
      
      setTheme(newTheme);
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};