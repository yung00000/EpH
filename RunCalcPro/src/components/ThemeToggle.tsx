/**
 * Theme Toggle Component
 * Allows users to toggle between light and dark themes
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const styles = createStyles(isDark);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleTheme}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={16}
        color={isDark ? '#ffffff' : '#1e293b'}
      />
    </TouchableOpacity>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    button: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: 4,
      padding: 8,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

