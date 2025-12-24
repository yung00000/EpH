/**
 * EpH Calculator Screen
 * Main screen for EpH calculations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { calculateEph, calculateTime } from '../utils/calculations';
import {
  saveEphHistory,
  loadEphHistory,
  clearEphHistory,
  deleteEphHistoryItem,
  EpHHistoryItem,
  TrackHistoryItem,
} from '../utils/storage';
import { Language } from '../types';
import Settings from '../components/Settings';
import HistorySection from '../components/HistorySection';
import { loadLanguage } from '../utils/storage';
import '../i18n/i18nConfig';

export default function EpHCalculatorScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const [language, setLanguage] = useState<Language>('zh');
  const [mode, setMode] = useState<'eph' | 'time' | ''>('eph');
  const [distance, setDistance] = useState('');
  const [elevation, setElevation] = useState('');
  const [time, setTime] = useState('');
  const [eph, setEph] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<EpHHistoryItem[]>([]);

  const styles = createStyles(isDark);

  useEffect(() => {
    loadSavedLanguage();
    loadHistory();
  }, []);

  const loadSavedLanguage = async () => {
    const savedLang = await loadLanguage();
    if (savedLang) {
      setLanguage(savedLang);
    }
  };

  const loadHistory = async () => {
    const historyData = await loadEphHistory();
    setHistory(historyData);
  };

  const handleCalculate = async () => {
    setError('');
    setResult('');

    if (!mode) {
      setError(t('eph.errorMode'));
      return;
    }

    if (!distance || !elevation) {
      setError(t('eph.fillDistanceElevation'));
      return;
    }

    const distanceNum = parseFloat(distance);
    const elevationNum = parseFloat(elevation);

    if (isNaN(distanceNum) || isNaN(elevationNum)) {
      setError(t('eph.errorInvalid'));
      return;
    }

    setLoading(true);

    try {
      if (mode === 'eph') {
        if (!time) {
          setError(t('eph.timeRequired'));
          setLoading(false);
          return;
        }
        const ephValue = calculateEph(distanceNum, elevationNum, time);
        const resultText = t('eph.resultEph', { value: ephValue.toFixed(2) });
        setResult(resultText);
        await saveEphHistory({
          mode: 'eph',
          distance,
          elevation,
          time,
          result: resultText,
          timestamp: new Date().toLocaleString(),
        });
        await loadHistory();
      } else {
        if (!eph) {
          setError(t('eph.ephRequired'));
          setLoading(false);
          return;
        }
        const ephNum = parseFloat(eph);
        const timeValue = calculateTime(distanceNum, elevationNum, ephNum);
        const resultText = t('eph.resultTime', { value: timeValue });
        setResult(resultText);
        await saveEphHistory({
          mode: 'time',
          distance,
          elevation,
          eph,
          result: resultText,
          timestamp: new Date().toLocaleString(),
        });
        await loadHistory();
      }
    } catch (err: any) {
      setError(err.message || t('eph.errorInvalid'));
    } finally {
      setLoading(false);
    }
  };

  const fillFromHistory = (item: EpHHistoryItem) => {
    setMode(item.mode);
    setDistance(item.distance);
    setElevation(item.elevation);
    if (item.mode === 'eph') {
      setTime(item.time || '');
      setEph('');
    } else {
      setEph(item.eph || '');
      setTime('');
    }
    setResult('');
    setError('');
  };

  const handleClearHistory = async () => {
    await clearEphHistory();
    await loadHistory();
  };

  const handleDeleteItem = async (index: number) => {
    await deleteEphHistoryItem(index);
    await loadHistory();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonActive]}
            onPress={() => {}}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextActive]}>
              {t('common.ephCalculator')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonSpacing]}
            onPress={() => navigation.navigate('TrackCalculator' as never)}
          >
            <Text style={styles.navButtonText}>{t('common.trackCalculator')}</Text>
          </TouchableOpacity>
          <View style={styles.settingsWrapper}>
            <Settings
              language={language}
              onLanguageChange={(lang) => {
                setLanguage(lang);
              }}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('eph.title')}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('eph.modeLabel')}</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'eph' ? styles.modeButtonActive : null]}
                onPress={() => {
                  setMode('eph');
                  setEph('');
                  setResult('');
                  setError('');
                }}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    mode === 'eph' ? styles.modeButtonTextActive : null,
                  ]}
                >
                  {t('eph.modeEph')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, styles.modeButtonSpacing, mode === 'time' ? styles.modeButtonActive : null]}
                onPress={() => {
                  setMode('time');
                  setTime('');
                  setResult('');
                  setError('');
                }}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    mode === 'time' ? styles.modeButtonTextActive : null,
                  ]}
                >
                  {t('eph.modeTime')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('eph.distanceLabel')}</Text>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              placeholder="0.0"
              keyboardType="decimal-pad"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('eph.elevationLabel')}</Text>
            <TextInput
              style={styles.input}
              value={elevation}
              onChangeText={setElevation}
              placeholder="0"
              keyboardType="number-pad"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            />
          </View>

          {mode === 'eph' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('eph.timeLabel')}</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder={t('eph.timePlaceholder')}
                placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
              />
            </View>
          )}

          {mode === 'time' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('eph.ephLabel')}</Text>
              <TextInput
                style={styles.input}
                value={eph}
                onChangeText={setEph}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('eph.submitButton')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {(result || error) && (
          <View style={styles.resultCard}>
            {result ? (
              <Text style={styles.resultText}>{result}</Text>
            ) : (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
        )}

        <HistorySection
          history={history}
          onItemPress={fillFromHistory as (item: EpHHistoryItem | TrackHistoryItem) => void}
          onClear={handleClearHistory}
          onDeleteItem={handleDeleteItem}
          language={language}
          type="eph"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 12,
    },
    navContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingsWrapper: {
      marginLeft: 12,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#3b82f6' : '#2563eb',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#94a3b8' : '#64748b',
      textAlign: 'center',
    },
    card: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 16,
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 8,
    },
    input: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#1e293b',
    },
    modeContainer: {
      flexDirection: 'row',
    },
    modeButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      alignItems: 'center',
    },
    modeButtonSpacing: {
      marginLeft: 8,
    },
    modeButtonActive: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderColor: isDark ? '#3b82f6' : '#2563eb',
    },
    modeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    modeButtonTextActive: {
      color: '#ffffff',
    },
    button: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    resultCard: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      alignItems: 'center',
    },
    resultText: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#34d399' : '#10b981',
    },
    errorText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#f87171' : '#ef4444',
    },
    navButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
    },
    navButtonSpacing: {
      marginLeft: 8,
    },
    navButtonActive: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderColor: isDark ? '#3b82f6' : '#2563eb',
    },
    navButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    navButtonTextActive: {
      color: '#ffffff',
    },
  });
}

