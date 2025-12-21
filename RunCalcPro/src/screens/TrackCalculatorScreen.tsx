/**
 * Track Calculator Screen
 * 400m track calculator screen
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { parsePace, calculateTrackTimes, formatTime, formatTimeMinSec, formatTimeLong } from '../utils/calculations';
import {
  saveTrackHistory,
  loadTrackHistory,
  clearTrackHistory,
  deleteTrackHistoryItem,
  TrackHistoryItem,
} from '../utils/storage';
import { Language } from '../types';
import Settings from '../components/Settings';
import HistorySection from '../components/HistorySection';
import { loadLanguage } from '../utils/storage';
import '../i18n/i18nConfig';

export default function TrackCalculatorScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const [language, setLanguage] = useState<Language>('zh');
  const [pace, setPace] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TrackHistoryItem[]>([]);

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
    const historyData = await loadTrackHistory();
    setHistory(historyData);
  };

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    if (!pace.trim()) {
      setError(t('track.enterPace'));
      return;
    }

    setLoading(true);

    try {
      const paceSeconds = parsePace(pace.trim());
      const times = calculateTrackTimes(paceSeconds);
      const totalTimeStr = formatTimeMinSec(times.totalMinutes, times.totalRemSeconds);

      const resultData = {
        total_time_min: totalTimeStr,
        total_time_sec: times.totalSeconds,
        split_100m: times.split100m,
        split_200m: times.split200m,
        split_300m: times.split300m,
        split_400m: times.split400m,
        time10km: times.time10km,
        timeHalfMarathon: times.timeHalfMarathon,
        timeMarathon: times.timeMarathon,
      };

      setResult(resultData);

      await saveTrackHistory({
        pace: pace.trim(),
        total_time: totalTimeStr,
        total_seconds: times.totalSeconds,
        split_100m: times.split100m,
        split_200m: times.split200m,
        split_300m: times.split300m,
        split_400m: times.split400m,
        timestamp: new Date().toLocaleString(),
      });
      await loadHistory();
    } catch (err: any) {
      setError(err.message || t('track.errorPaceFormat'));
    } finally {
      setLoading(false);
    }
  };

  const fillFromHistory = (item: TrackHistoryItem) => {
    setPace(item.pace);
    setError('');
    
    // Recalculate full results including 10km, half marathon, marathon
    try {
      const paceSeconds = parsePace(item.pace);
      const times = calculateTrackTimes(paceSeconds);
      const totalTimeStr = formatTimeMinSec(times.totalMinutes, times.totalRemSeconds);

      const resultData = {
        total_time_min: totalTimeStr,
        total_time_sec: times.totalSeconds,
        split_100m: times.split100m,
        split_200m: times.split200m,
        split_300m: times.split300m,
        split_400m: times.split400m,
        time10km: times.time10km,
        timeHalfMarathon: times.timeHalfMarathon,
        timeMarathon: times.timeMarathon,
      };

      setResult(resultData);
    } catch (err: any) {
      setError(err.message || t('track.errorPaceFormat'));
      setResult(null);
    }
  };

  const handleClearHistory = async () => {
    await clearTrackHistory();
    await loadHistory();
  };

  const handleDeleteItem = async (index: number) => {
    await deleteTrackHistoryItem(index);
    await loadHistory();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Settings
          language={language}
          onLanguageChange={(lang) => {
            setLanguage(lang);
          }}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('EpHCalculator' as never)}
          >
            <Text style={styles.navButtonText}>{t('common.ephCalculator')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonSpacing, styles.navButtonActive]}
            onPress={() => {}}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextActive]}>
              {t('common.trackCalculator')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('track.title')}</Text>
          <Text style={styles.subtitle}>{t('track.subtitle')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('track.title')}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('track.paceLabel')}</Text>
            <TextInput
              style={styles.input}
              value={pace}
              onChangeText={setPace}
              placeholder={t('track.pacePlaceholder')}
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            />
            <Text style={styles.examples}>{t('track.paceExamples')}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('track.submitButton')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.resultCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.totalTimeContainer}>
              <Text style={styles.breakdownTitle}>{t('track.breakdownByDistance')}</Text>
              <View style={styles.raceTimesContainer}>
                <View style={[styles.raceTimeRow, styles.raceTimeRowBorder]}>
                  <Text style={styles.raceTimeLabel}>{t('track.split400m')}</Text>
                  <Text style={styles.totalTimeValue}>{result.total_time_min}</Text>
                </View>
                <View style={[styles.raceTimeRow, styles.raceTimeRowBorder]}>
                  <Text style={styles.raceTimeLabel}>{t('track.race10km')}</Text>
                  <Text style={styles.raceTimeValue}>{formatTimeLong(result.time10km)}</Text>
                </View>
                <View style={[styles.raceTimeRow, styles.raceTimeRowBorder]}>
                  <Text style={styles.raceTimeLabel}>{t('track.raceHalfMarathon')}</Text>
                  <Text style={styles.raceTimeValue}>{formatTimeLong(result.timeHalfMarathon)}</Text>
                </View>
                <View style={styles.raceTimeRow}>
                  <Text style={styles.raceTimeLabel}>{t('track.raceMarathon')}</Text>
                  <Text style={styles.raceTimeValue}>{formatTimeLong(result.timeMarathon)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.splitsContainer}>
              <View style={styles.splitItem}>
                <Text style={styles.splitLabel}>{t('track.split100m').toUpperCase()}</Text>
                <Text style={styles.splitTime}>{formatTime(result.split_100m)}</Text>
              </View>
              <View style={styles.splitItem}>
                <Text style={styles.splitLabel}>{t('track.split200m').toUpperCase()}</Text>
                <Text style={styles.splitTime}>{formatTime(result.split_200m)}</Text>
              </View>
              <View style={styles.splitItem}>
                <Text style={styles.splitLabel}>{t('track.split300m').toUpperCase()}</Text>
                <Text style={styles.splitTime}>{formatTime(result.split_300m)}</Text>
              </View>
              <View style={styles.splitItem}>
                <Text style={styles.splitLabel}>{t('track.split400m').toUpperCase()}</Text>
                <Text style={[styles.splitTime, styles.splitTime400m]}>
                  {formatTime(result.split_400m)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <HistorySection
          history={history}
          onItemPress={fillFromHistory}
          onClear={handleClearHistory}
          onDeleteItem={handleDeleteItem}
          language={language}
          type="track"
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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
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
      marginBottom: 8,
    },
    examples: {
      fontSize: 12,
      color: isDark ? '#94a3b8' : '#64748b',
      fontStyle: 'italic',
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
    },
    totalTimeContainer: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderColor: isDark ? '#34d399' : '#10b981',
    },
    breakdownTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#94a3b8' : '#64748b',
      marginBottom: 12,
      textAlign: 'center',
    },
    totalTimeValue: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#34d399' : '#10b981',
    },
    raceTimesContainer: {
      width: '100%',
    },
    raceTimeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    raceTimeRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    raceTimeLabel: {
      fontSize: 13,
      color: isDark ? '#94a3b8' : '#64748b',
      fontWeight: '500',
    },
    raceTimeValue: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    splitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    splitItem: {
      width: '48%',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      alignItems: 'center',
    },
    splitLabel: {
      fontSize: 12,
      color: isDark ? '#94a3b8' : '#64748b',
      marginBottom: 4,
    },
    splitTime: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    splitTime400m: {
      color: isDark ? '#34d399' : '#10b981',
    },
    errorText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#f87171' : '#ef4444',
      textAlign: 'center',
    },
    navContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
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

