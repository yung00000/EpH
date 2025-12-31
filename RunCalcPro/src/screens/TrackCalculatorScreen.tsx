/**
 * Track Calculator Screen
 * Pacing calculator screen
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { parsePace, calculateTrackTimes, formatTime, formatTimeMinSec, formatTimeLong, calculatePaceFromTime, formatPace } from '../utils/calculations';
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
  const [mode, setMode] = useState<'paceToTime' | 'timeToPace'>('paceToTime');
  const [pace, setPace] = useState('');
  const [distance, setDistance] = useState<'10km' | 'halfMarathon' | 'marathon'>('10km');
  const [completedTime, setCompletedTime] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TrackHistoryItem[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showRunningTips, setShowRunningTips] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState('');

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

    if (mode === 'paceToTime') {
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
          mode: 'paceToTime',
        });
        await loadHistory();
      } catch (err: any) {
        setError(err.message || t('track.errorPaceFormat'));
      } finally {
        setLoading(false);
      }
    } else {
      // Time to Pace mode
      if (!completedTime.trim()) {
        setError(t('track.enterTime'));
        return;
      }

      setLoading(true);

      try {
        const distanceMap = {
          '10km': 10,
          'halfMarathon': 21.0975,
          'marathon': 42.195,
        };

        const paceSeconds = calculatePaceFromTime(completedTime.trim(), distanceMap[distance]);
        const paceStr = formatPace(paceSeconds);
        
        // Calculate track times from the calculated pace
        const times = calculateTrackTimes(paceSeconds);
        const totalTimeStr = formatTimeMinSec(times.totalMinutes, times.totalRemSeconds);

        const resultData = {
          mode: 'timeToPace',
          pace: paceStr,
          paceSeconds: paceSeconds,
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

        // Save to history
        await saveTrackHistory({
          pace: paceStr,
          total_time: totalTimeStr,
          total_seconds: times.totalSeconds,
          split_100m: times.split100m,
          split_200m: times.split200m,
          split_300m: times.split300m,
          split_400m: times.split400m,
          timestamp: new Date().toLocaleString(),
          mode: 'timeToPace',
          distance: distance,
          completedTime: completedTime.trim(),
        });
        await loadHistory();
      } catch (err: any) {
        setError(err.message || t('track.errorTimeFormat'));
      } finally {
        setLoading(false);
      }
    }
  };

  const fillFromHistory = (item: TrackHistoryItem) => {
    setError('');
    
    // Handle different modes
    if (item.mode === 'timeToPace') {
      // Set mode and fill time-to-pace fields
      setMode('timeToPace');
      if (item.distance) {
        setDistance(item.distance);
      }
      if (item.completedTime) {
        setCompletedTime(item.completedTime);
      }
      
      // Recalculate results
      try {
        const paceSeconds = parsePace(item.pace);
        const times = calculateTrackTimes(paceSeconds);
        const totalTimeStr = formatTimeMinSec(times.totalMinutes, times.totalRemSeconds);

        const resultData = {
          mode: 'timeToPace',
          pace: item.pace,
          paceSeconds: paceSeconds,
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
    } else {
      // Default to pace-to-time mode
      setMode('paceToTime');
      setPace(item.pace);
      
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

  const fetchRunningArticles = async () => {
    setArticlesLoading(true);
    setArticlesError('');
    try {
      const response = await fetch('https://api-articles.runcals.com/all-articles', {
        headers: {
          'X-API-Key': 'L0lUJk-_bBaKm1DOSI-3kxAfv9pbTuvsnsIlQsnIuF',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err: any) {
      setArticlesError(err.message || t('common.fetchError'));
      setArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <Text style={styles.menuButtonText}>⋮</Text>
        </TouchableOpacity>
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
          <Text style={styles.cardTitle}>{t('track.title')}</Text>

          {/* Mode Selector */}
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'paceToTime' && styles.modeButtonActive]}
              onPress={() => {
                setMode('paceToTime');
                setResult(null);
                setError('');
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'paceToTime' && styles.modeButtonTextActive]}>
                {t('track.modePaceToTime')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'timeToPace' && styles.modeButtonActive]}
              onPress={() => {
                setMode('timeToPace');
                setResult(null);
                setError('');
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'timeToPace' && styles.modeButtonTextActive]}>
                {t('track.modeTimeToPace')}
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'paceToTime' ? (
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
          ) : (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('track.distanceLabel')}</Text>
                <View style={styles.distanceContainer}>
                  <TouchableOpacity
                    style={[styles.distanceButton, distance === '10km' && styles.distanceButtonActive]}
                    onPress={() => setDistance('10km')}
                  >
                    <Text style={[styles.distanceButtonText, distance === '10km' && styles.distanceButtonTextActive]}>
                      {t('track.race10km')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.distanceButton, distance === 'halfMarathon' && styles.distanceButtonActive]}
                    onPress={() => setDistance('halfMarathon')}
                  >
                    <Text style={[styles.distanceButtonText, distance === 'halfMarathon' && styles.distanceButtonTextActive]}>
                      {t('track.raceHalfMarathon')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.distanceButton, styles.distanceButtonLast, distance === 'marathon' && styles.distanceButtonActive]}
                    onPress={() => setDistance('marathon')}
                  >
                    <Text style={[styles.distanceButtonText, distance === 'marathon' && styles.distanceButtonTextActive]}>
                      {t('track.raceMarathon')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('track.timeLabel')}</Text>
                <TextInput
                  style={styles.input}
                  value={completedTime}
                  onChangeText={setCompletedTime}
                  placeholder={t('track.timePlaceholder')}
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                />
              </View>
            </>
          )}

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
            {result.mode === 'timeToPace' && (
              <View style={styles.paceResultContainer}>
                <Text style={styles.paceResultLabel}>{t('track.paceResult')} </Text>
                <Text style={styles.paceResultValue}>{result.pace} /km</Text>
              </View>
            )}
            <View style={styles.totalTimeContainer}>
              <Text style={styles.breakdownTitle}>{t('track.breakdownByDistance')}</Text>
              <View style={styles.raceTimesContainer}>
                <View style={[styles.raceTimeRow, styles.raceTimeRowBorder]}>
                  <Text style={styles.raceTimeLabel}>{t('track.split400m')}</Text>
                  <Text style={styles.totalTimeValue}>{result.total_time_min}</Text>
                </View>
                <View style={[styles.raceTimeRow, styles.raceTimeRowBorder]}>
                  <Text style={styles.raceTimeLabel}>{t('track.race10km')}:</Text>
                  <Text style={styles.raceTimeValue}>{formatTimeLong(result.time10km)}</Text>
                </View>
                <View style={[styles.raceTimeRow, styles.raceTimeRowBorder]}>
                  <Text style={styles.raceTimeLabel}>{t('track.raceHalfMarathon')}:</Text>
                  <Text style={styles.raceTimeValue}>{formatTimeLong(result.timeHalfMarathon)}</Text>
                </View>
                <View style={styles.raceTimeRow}>
                  <Text style={styles.raceTimeLabel}>{t('track.raceMarathon')}:</Text>
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

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                setShowTips(true);
              }}
            >
              <Text style={styles.menuItemText}>{t('common.tips')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={async () => {
                setShowMenu(false);
                setShowRunningTips(true);
                await fetchRunningArticles();
              }}
            >
              <Text style={styles.menuItemText}>{t('common.runningTips')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tips Modal */}
      <Modal
        visible={showTips}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTips(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tipsModal}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsTitle}>{t('tips.title')}</Text>
              <TouchableOpacity
                onPress={() => setShowTips(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.tipsContent} showsVerticalScrollIndicator={false}>
              <View style={styles.tipSection}>
                <Text style={styles.tipSectionTitle}>{t('tips.whatIsEph')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.whatIsEphContent')}</Text>
              </View>

              <View style={styles.tipSection}>
                <Text style={styles.tipSectionTitle}>{t('tips.howToUse')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.howToUseContent')}</Text>
              </View>

              <View style={styles.tipSection}>
                <Text style={styles.tipSectionTitle}>{t('tips.trainingTips')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.trainingTip1')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.trainingTip2')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.trainingTip3')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.trainingTip4')}</Text>
              </View>

              <View style={styles.tipSection}>
                <Text style={styles.tipSectionTitle}>{t('tips.paceCalculator')}</Text>
                <Text style={styles.tipSectionContent}>{t('tips.paceCalculatorContent')}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Running Tips Modal */}
      <Modal
        visible={showRunningTips}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRunningTips(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tipsModal}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsTitle}>{t('common.runningTips')}</Text>
              <TouchableOpacity
                onPress={() => setShowRunningTips(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.tipsContent} showsVerticalScrollIndicator={false}>
              {articlesLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#2563eb'} />
                  <Text style={styles.loadingText}>{t('common.loadingArticles')}</Text>
                </View>
              )}

              {articlesError && !articlesLoading && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{articlesError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchRunningArticles}
                  >
                    <Text style={styles.retryButtonText}>{t('common.ok')}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!articlesLoading && !articlesError && articles.length === 0 && (
                <Text style={styles.noArticlesText}>{t('common.noArticles')}</Text>
              )}

              {!articlesLoading && !articlesError && articles.length > 0 && articles.map((article, index) => (
                <View key={index} style={styles.articleCard}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleContent}>{article.content}</Text>
                  {article.created_at && (
                    <Text style={styles.articleDate}>
                      {new Date(article.created_at).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    modeContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: 4,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    modeButtonActive: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
    },
    modeButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    modeButtonTextActive: {
      color: '#ffffff',
      fontWeight: '600',
    },
    formGroup: {
      marginBottom: 16,
    },
    distanceContainer: {
      flexDirection: 'row',
    },
    distanceButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      alignItems: 'center',
      marginRight: 8,
    },
    distanceButtonLast: {
      marginRight: 0,
    },
    distanceButtonActive: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderColor: isDark ? '#3b82f6' : '#2563eb',
    },
    distanceButtonText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    distanceButtonTextActive: {
      color: '#ffffff',
      fontWeight: '600',
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
    paceResultContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#3b82f6' : '#2563eb',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paceResultLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    paceResultValue: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#3b82f6' : '#2563eb',
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
    menuButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuButtonText: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#94a3b8' : '#64748b',
      lineHeight: 20,
    },
    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuModal: {
      position: 'absolute',
      top: 60,
      left: 16,
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      minWidth: 180,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    menuItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#1e293b',
      textAlign: 'left',
    },
    tipsModal: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      width: '90%',
      maxHeight: '80%',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      overflow: 'hidden',
    },
    tipsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    tipsTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    closeButton: {
      padding: 4,
    },
    closeButtonText: {
      fontSize: 24,
      fontWeight: '600',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    tipsContent: {
      padding: 20,
    },
    tipSection: {
      marginBottom: 20,
    },
    tipSectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#3b82f6' : '#2563eb',
      marginBottom: 8,
    },
    tipSectionContent: {
      fontSize: 15,
      color: isDark ? '#cbd5e1' : '#475569',
      lineHeight: 22,
      marginBottom: 4,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    retryButton: {
      marginTop: 16,
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    noArticlesText: {
      fontSize: 16,
      color: isDark ? '#94a3b8' : '#64748b',
      textAlign: 'center',
      padding: 40,
    },
    articleCard: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 12,
      lineHeight: 24,
    },
    articleContent: {
      fontSize: 15,
      color: isDark ? '#cbd5e1' : '#475569',
      lineHeight: 22,
      marginBottom: 8,
    },
    articleDate: {
      fontSize: 13,
      color: isDark ? '#64748b' : '#94a3b8',
      fontStyle: 'italic',
      marginTop: 8,
    },
  });
}

