/**
 * Language Switcher Component
 * Allows users to switch between English and Traditional Chinese
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    >
      <Text style={styles.buttonText}>
        {language === 'zh' ? '繁' : 'EN'}
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
      paddingHorizontal: 12,
      minWidth: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#1e293b',
    },
  });
}

