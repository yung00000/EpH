/**
 * History Section Component
 * Displays calculation history with ability to fill forms and clear history
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';
import { EpHHistoryItem, TrackHistoryItem } from '../utils/storage';
import { formatTime } from '../utils/calculations';

interface HistorySectionProps {
  history: EpHHistoryItem[] | TrackHistoryItem[];
  onItemPress: (item: EpHHistoryItem | TrackHistoryItem) => void;
  onClear: () => void;
  onDeleteItem?: (index: number) => void;
  language: Language;
  type: 'eph' | 'track';
}

export default function HistorySection({
  history,
  onItemPress,
  onClear,
  onDeleteItem,
  language,
  type,
}: HistorySectionProps) {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

  const translations = {
    en: {
      title: 'Calculation History',
      clear: 'Clear',
      noHistory: 'No calculation history',
      clearConfirm: 'Are you sure you want to clear all history?',
    },
    zh: {
      title: '計算歷史',
      clear: '清除',
      noHistory: '暫無計算歷史',
      clearConfirm: '確定要清除所有歷史記錄嗎？',
    },
  };

  const t = translations[language];

  const handleClear = () => {
    Alert.alert(t.clearConfirm, '', [
      { text: language === 'en' ? 'Cancel' : '取消', style: 'cancel' },
      {
        text: language === 'en' ? 'OK' : '確定',
        onPress: onClear,
        style: 'destructive',
      },
    ]);
  };

  const renderDeleteAction = (index: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          if (onDeleteItem) {
            Alert.alert(
              language === 'en' ? 'Delete Item' : '刪除項目',
              language === 'en' ? 'Are you sure you want to delete this item?' : '確定要刪除此項目嗎？',
              [
                { text: language === 'en' ? 'Cancel' : '取消', style: 'cancel' },
                {
                  text: language === 'en' ? 'Delete' : '刪除',
                  style: 'destructive',
                  onPress: () => onDeleteItem(index),
                },
              ]
            );
          }
        }}
      >
        <Ionicons name="trash" size={20} color="#ffffff" />
      </TouchableOpacity>
    );
  };

  const renderEphHistoryItem = (item: EpHHistoryItem, index: number) => {
    const modeText =
      item.mode === 'eph'
        ? language === 'en'
          ? 'Time → Pace'
          : '時間→配速'
        : language === 'en'
        ? 'Pace → Time'
        : '配速→時間';

    const dataDisplay =
      item.mode === 'eph'
        ? `${language === 'en' ? 'Distance' : '距離'}: ${item.distance} km | ${
            language === 'en' ? 'Elevation' : '海拔'
          }: ${item.elevation} m | ${language === 'en' ? 'Time' : '時間'}: ${
            item.time
          }`
        : `${language === 'en' ? 'Distance' : '距離'}: ${item.distance} km | ${
            language === 'en' ? 'Elevation' : '海拔'
          }: ${item.elevation} m | EpH: ${item.eph}`;

    const content = (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => onItemPress(item)}
      >
        <View style={styles.historyContent}>
          <View style={styles.historyHeader}>
            <View
              style={[
                styles.modeBadge,
                item.mode === 'eph' ? styles.modeBadgeEph : styles.modeBadgeTime,
              ]}
            >
              <Text
                style={[
                  styles.modeBadgeText,
                  item.mode === 'eph'
                    ? styles.modeBadgeTextEph
                    : styles.modeBadgeTextTime,
                ]}
              >
                {modeText.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.historyData}>{dataDisplay}</Text>
          <Text style={styles.historyResult}>{item.result}</Text>
        </View>
      </TouchableOpacity>
    );

    if (onDeleteItem) {
      return (
        <Swipeable
          key={index}
          renderRightActions={() => renderDeleteAction(index)}
          overshootRight={false}
        >
          {content}
        </Swipeable>
      );
    }

    return <View key={index}>{content}</View>;
  };

  const renderTrackHistoryItem = (item: TrackHistoryItem, index: number) => {
    const content = (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => onItemPress(item)}
      >
        <View style={styles.historyContent}>
          <View style={styles.historyHeader}>
            <View style={[styles.modeBadge, styles.modeBadgeTrack]}>
              <Text style={[styles.modeBadgeText, styles.modeBadgeTextTrack]}>
                {item.pace} min/km
              </Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={styles.trackSplits}>
            <Text style={styles.splitText}>
              {language === 'en' ? '100m' : '100米'}:{' '}
              <Text style={styles.splitValue}>{formatTime(item.split_100m)}</Text>
            </Text>
            <Text style={[styles.splitText, styles.splitTextSpacing]}>
              {language === 'en' ? '200m' : '200米'}:{' '}
              <Text style={styles.splitValue}>{formatTime(item.split_200m)}</Text>
            </Text>
            <Text style={[styles.splitText, styles.splitTextSpacing]}>
              {language === 'en' ? '300m' : '300米'}:{' '}
              <Text style={styles.splitValue}>{formatTime(item.split_300m)}</Text>
            </Text>
            <Text style={[styles.splitText, styles.splitText400m, styles.splitTextSpacing]}>
              {language === 'en' ? '400m' : '400米'}:{' '}
              <Text style={styles.splitValue}>{formatTime(item.split_400m)}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    if (onDeleteItem) {
      return (
        <Swipeable
          key={index}
          renderRightActions={() => renderDeleteAction(index)}
          overshootRight={false}
        >
          {content}
        </Swipeable>
      );
    }

    return <View key={index}>{content}</View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="time-outline"
            size={20}
            color={isDark ? '#ffffff' : '#1e293b'}
          />
          <Text style={[styles.title, styles.titleSpacing]}>{t.title}</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="trash-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
            <Text style={styles.clearButtonText}>{t.clear}</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.noHistory}</Text>
        </View>
      ) : (
        <ScrollView style={styles.historyList}>
          {type === 'eph'
            ? (history as EpHHistoryItem[]).map((item, index) =>
                renderEphHistoryItem(item, index)
              )
            : (history as TrackHistoryItem[]).map((item, index) =>
                renderTrackHistoryItem(item, index)
              )}
        </ScrollView>
      )}
    </View>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    titleSpacing: {
      marginLeft: 8,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
    },
    clearButtonText: {
      fontSize: 14,
      color: isDark ? '#94a3b8' : '#64748b',
      marginLeft: 4,
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? '#94a3b8' : '#64748b',
      fontStyle: 'italic',
    },
    historyList: {
      maxHeight: 400,
    },
    historyItem: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    historyContent: {
      // Removed gap - using marginTop on children instead
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    modeBadgeEph: {
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    },
    modeBadgeTime: {
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
    },
    modeBadgeTrack: {
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    },
    modeBadgeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    modeBadgeTextEph: {
      color: isDark ? '#34d399' : '#10b981',
    },
    modeBadgeTextTime: {
      color: isDark ? '#60a5fa' : '#2563eb',
    },
    modeBadgeTextTrack: {
      color: isDark ? '#34d399' : '#10b981',
    },
    timestamp: {
      fontSize: 11,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    historyData: {
      fontSize: 13,
      color: isDark ? '#ffffff' : '#1e293b',
      marginTop: 4,
    },
    historyResult: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#34d399' : '#10b981',
      marginTop: 4,
    },
    trackSplits: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
    },
    splitText: {
      fontSize: 12,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    splitTextSpacing: {
      marginLeft: 12,
    },
    splitText400m: {
      fontWeight: '600',
      color: isDark ? '#34d399' : '#10b981',
    },
    splitValue: {
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    deleteAction: {
      backgroundColor: '#ef4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 8,
      marginBottom: 8,
    },
  });
}

