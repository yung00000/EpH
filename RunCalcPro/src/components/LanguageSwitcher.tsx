/**
 * Language Switcher Component
 * Allows users to switch between English and Traditional Chinese
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          language === 'zh' ? styles.buttonActive : null,
        ]}
        onPress={() => handleLanguageChange('zh')}
      >
        <Text
          style={[
            styles.buttonText,
            language === 'zh' ? styles.buttonTextActive : null,
          ]}
        >
          繁
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          styles.buttonSpacing,
          language === 'en' ? styles.buttonActive : null,
        ]}
        onPress={() => handleLanguageChange('en')}
      >
        <Text
          style={[
            styles.buttonText,
            language === 'en' ? styles.buttonTextActive : null,
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      minWidth: 40,
      alignItems: 'center',
    },
    buttonSpacing: {
      marginLeft: 4,
    },
    buttonActive: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderColor: isDark ? '#3b82f6' : '#2563eb',
    },
    buttonText: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    buttonTextActive: {
      color: '#ffffff',
    },
  });
}

