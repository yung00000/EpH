/**
 * Theme Context
 * Manages app theme state (light/dark/automatic)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { loadTheme, saveTheme } from '../utils/storage';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [theme, setThemeState] = useState<Theme>('automatic');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  useEffect(() => {
    // Update isDark based on current theme and system color scheme
    if (theme === 'automatic') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme, systemColorScheme]);

  const loadSavedTheme = async () => {
    const savedTheme = await loadTheme();
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await saveTheme(newTheme);
    // Don't call updateIsDark() here - let the useEffect handle it
    // when theme state updates
  };

  const toggleTheme = async () => {
    let newTheme: Theme;
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'automatic';
    } else {
      newTheme = 'light';
    }
    await setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

