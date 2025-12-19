/**
 * Storage utilities using AsyncStorage
 * Handles persistence of calculation history and user preferences
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  EPH_HISTORY: 'ephCalculatorHistory',
  TRACK_HISTORY: 'trackCalculatorHistory',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// EpH Calculator History
export interface EpHHistoryItem {
  mode: 'eph' | 'time';
  distance: string;
  elevation: string;
  time?: string;
  eph?: string;
  result: string;
  timestamp: string;
}

// Track Calculator History
export interface TrackHistoryItem {
  pace: string;
  total_time: string;
  total_seconds: number;
  split_100m: number;
  split_200m: number;
  split_300m: number;
  split_400m: number;
  timestamp: string;
}

/**
 * Save EpH calculation history
 */
export async function saveEphHistory(item: EpHHistoryItem): Promise<void> {
  try {
    const history = await loadEphHistory();
    const newHistory = [item, ...history].slice(0, 10); // Keep last 10 items
    await AsyncStorage.setItem(STORAGE_KEYS.EPH_HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving EpH history:', error);
    throw error;
  }
}

/**
 * Load EpH calculation history
 */
export async function loadEphHistory(): Promise<EpHHistoryItem[]> {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.EPH_HISTORY);
    if (historyData) {
      return JSON.parse(historyData);
    }
    return [];
  } catch (error) {
    console.error('Error loading EpH history:', error);
    return [];
  }
}

/**
 * Clear EpH calculation history
 */
export async function clearEphHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.EPH_HISTORY);
  } catch (error) {
    console.error('Error clearing EpH history:', error);
    throw error;
  }
}

/**
 * Delete a specific EpH history item by index
 */
export async function deleteEphHistoryItem(index: number): Promise<void> {
  try {
    const history = await loadEphHistory();
    if (index >= 0 && index < history.length) {
      const newHistory = history.filter((_, i) => i !== index);
      await AsyncStorage.setItem(STORAGE_KEYS.EPH_HISTORY, JSON.stringify(newHistory));
    }
  } catch (error) {
    console.error('Error deleting EpH history item:', error);
    throw error;
  }
}

/**
 * Save Track calculation history
 */
export async function saveTrackHistory(item: TrackHistoryItem): Promise<void> {
  try {
    const history = await loadTrackHistory();
    const newHistory = [item, ...history].slice(0, 10); // Keep last 10 items
    await AsyncStorage.setItem(STORAGE_KEYS.TRACK_HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving Track history:', error);
    throw error;
  }
}

/**
 * Load Track calculation history
 */
export async function loadTrackHistory(): Promise<TrackHistoryItem[]> {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.TRACK_HISTORY);
    if (historyData) {
      return JSON.parse(historyData);
    }
    return [];
  } catch (error) {
    console.error('Error loading Track history:', error);
    return [];
  }
}

/**
 * Clear Track calculation history
 */
export async function clearTrackHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TRACK_HISTORY);
  } catch (error) {
    console.error('Error clearing Track history:', error);
    throw error;
  }
}

/**
 * Delete a specific Track history item by index
 */
export async function deleteTrackHistoryItem(index: number): Promise<void> {
  try {
    const history = await loadTrackHistory();
    if (index >= 0 && index < history.length) {
      const newHistory = history.filter((_, i) => i !== index);
      await AsyncStorage.setItem(STORAGE_KEYS.TRACK_HISTORY, JSON.stringify(newHistory));
    }
  } catch (error) {
    console.error('Error deleting Track history item:', error);
    throw error;
  }
}

/**
 * Save language preference
 */
export async function saveLanguage(language: 'en' | 'zh'): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.error('Error saving language:', error);
    throw error;
  }
}

/**
 * Load language preference
 */
export async function loadLanguage(): Promise<'en' | 'zh' | null> {
  try {
    const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (language === 'en' || language === 'zh') {
      return language;
    }
    return null;
  } catch (error) {
    console.error('Error loading language:', error);
    return null;
  }
}

/**
 * Save theme preference
 */
export async function saveTheme(theme: 'light' | 'dark' | 'automatic'): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
}

/**
 * Load theme preference
 */
export async function loadTheme(): Promise<'light' | 'dark' | 'automatic' | null> {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'light' || theme === 'dark' || theme === 'automatic') {
      return theme;
    }
    return null;
  } catch (error) {
    console.error('Error loading theme:', error);
    return null;
  }
}

