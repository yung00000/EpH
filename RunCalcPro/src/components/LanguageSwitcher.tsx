/**
 * Language Switcher Component
 * Allows users to switch between English and Traditional Chinese
 * Displays icon-style language indicator with stacked characters
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Language } from '../types';
import { saveLanguage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSwitcher({
  language,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  const handleLanguageChange = async (lang: Language) => {
    i18n.changeLanguage(lang);
    await saveLanguage(lang);
    onLanguageChange(lang);
  };

  const styles = createStyles(isDark);

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    handleLanguageChange(newLanguage);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleLanguage}
      accessibilityLabel={language === 'zh' ? 'Switch to English' : 'Switch to Chinese'}
    >
      <Text style={styles.text}>
        <Text style={language === 'zh' ? styles.activeText : styles.inactiveText}>中</Text>
        <Text style={styles.separator}>/</Text>
        <Text style={language === 'en' ? styles.activeText : styles.inactiveText}>Eng</Text>
      </Text>
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
      paddingVertical: 6,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 13,
      fontWeight: '500',
    },
    activeText: {
      color: isDark ? '#3b82f6' : '#2563eb',
      fontWeight: '700',
    },
    inactiveText: {
      color: isDark ? '#94a3b8' : '#64748b',
      fontWeight: '400',
    },
    separator: {
      color: isDark ? '#64748b' : '#94a3b8',
      fontWeight: '400',
    },
  });
}

