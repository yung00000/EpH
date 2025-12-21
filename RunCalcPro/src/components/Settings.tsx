/**
 * Settings Component
 * Gear icon button that opens a settings modal with various options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Language } from '../types';
import { saveLanguage } from '../utils/storage';
// App version from app.json
const APP_VERSION = '1.1.0';

interface SettingsProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Settings({ language, onLanguageChange }: SettingsProps) {
  const { isDark, theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const appVersion = APP_VERSION;

  const handleLanguageChange = async (lang: Language) => {
    i18n.changeLanguage(lang);
    await saveLanguage(lang);
    setCurrentLanguage(lang);
    onLanguageChange(lang);
  };

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('automatic');
    } else {
      setTheme('light');
    }
  };

  const getThemeText = () => {
    if (theme === 'light') {
      return t('common.lightMode');
    } else if (theme === 'dark') {
      return t('common.darkMode');
    } else {
      return t('common.automatic');
    }
  };

  const handleContactUs = async () => {
    const email = 'admin@runcals.com';
    Alert.alert(
      t('common.contactUs'),
      email,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.copied'),
          onPress: async () => {
            await Clipboard.setStringAsync(email);
            Alert.alert(
              t('common.copied'),
              t('common.emailCopied'),
              [{ text: t('common.ok') }]
            );
          },
        },
      ]
    );
  };

  const styles = createStyles(isDark);

  return (
    <>
      <TouchableOpacity
        style={styles.gearButton}
        onPress={() => setModalVisible(true)}
        accessibilityLabel={t('common.openSettings')}
      >
        <Ionicons
          name="settings-outline"
          size={20}
          color={isDark ? '#ffffff' : '#1e293b'}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('common.settings')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={isDark ? '#ffffff' : '#1e293b'}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Language Switching */}
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>
                  {t('common.switchLanguage')}
                </Text>
                <View style={styles.menuItem}>
                  <LanguageSwitcher
                    language={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                </View>
              </View>

              {/* Dark/Light Mode */}
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>
                  {t('common.switchTheme')}
                </Text>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleThemeChange}
                >
                  <View style={styles.menuItemContent}>
                    <Ionicons
                      name={isDark ? 'moon-outline' : 'sunny-outline'}
                      size={20}
                      color={isDark ? '#ffffff' : '#1e293b'}
                    />
                    <Text style={styles.menuItemText}>{getThemeText()}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#94a3b8' : '#64748b'}
                  />
                </TouchableOpacity>
              </View>

              {/* App Version Info */}
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>
                  {t('common.appInformation')}
                </Text>
                <View style={styles.menuItem}>
                  <View style={styles.menuItemContent}>
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={isDark ? '#ffffff' : '#1e293b'}
                    />
                    <Text style={styles.menuItemText}>
                      {t('common.version')}
                    </Text>
                  </View>
                  <Text style={styles.versionText}>{appVersion}</Text>
                </View>
              </View>

              {/* Contact Us */}
              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleContactUs}
                >
                  <View style={styles.menuItemContent}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={isDark ? '#ffffff' : '#1e293b'}
                    />
                    <Text style={styles.menuItemText}>{t('common.contactUs')}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#94a3b8' : '#64748b'}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    gearButton: {
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    closeButton: {
      padding: 4,
    },
    modalBody: {
      padding: 20,
    },
    menuSection: {
      marginBottom: 24,
    },
    menuSectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#94a3b8' : '#64748b',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#1e293b',
      marginLeft: 12,
    },
    versionText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#94a3b8' : '#64748b',
    },
  });
}

