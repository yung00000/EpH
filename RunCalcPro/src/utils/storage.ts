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
  ARTICLES: 'runningArticles',
  ARTICLES_LAST_FETCH: 'articlesLastFetch',
  EVENTS: 'raceEvents',
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
  mode?: 'paceToTime' | 'timeToPace'; // Optional: track calculation mode
  distance?: '10km' | 'halfMarathon' | 'marathon'; // Optional: for timeToPace mode
  completedTime?: string; // Optional: for timeToPace mode
}

/**
 * Save EpH calculation history
 */
export async function saveEphHistory(item: EpHHistoryItem): Promise<void> {
  try {
    const history = await loadEphHistory();
    const newHistory = [item, ...history].slice(0, 20); // Keep last 20 items
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
    const newHistory = [item, ...history].slice(0, 20); // Keep last 20 items
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

// Article interface
export interface Article {
  title: string;
  content: string;
  created_at: string | null;
}

export interface ArticlesCache {
  articles: Article[];
  lastFetchTimestamp: number;
  lastArticleId?: string; // Use created_at as unique identifier
}

/**
 * Save articles to cache
 */
export async function saveArticlesCache(articles: Article[]): Promise<void> {
  try {
    const cache: ArticlesCache = {
      articles,
      lastFetchTimestamp: Date.now(),
      lastArticleId: articles.length > 0 ? articles[0].created_at || undefined : undefined,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving articles cache:', error);
    throw error;
  }
}

/**
 * Load articles from cache
 */
export async function loadArticlesCache(): Promise<Article[]> {
  try {
    const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (cacheData) {
      const cache: ArticlesCache = JSON.parse(cacheData);
      return cache.articles || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading articles cache:', error);
    return [];
  }
}

/**
 * Get last fetch timestamp
 */
export async function getLastFetchTimestamp(): Promise<number | null> {
  try {
    const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (cacheData) {
      const cache: ArticlesCache = JSON.parse(cacheData);
      return cache.lastFetchTimestamp || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting last fetch timestamp:', error);
    return null;
  }
}

/**
 * Get last article ID (most recent article's created_at)
 */
export async function getLastArticleId(): Promise<string | null> {
  try {
    const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (cacheData) {
      const cache: ArticlesCache = JSON.parse(cacheData);
      return cache.lastArticleId || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting last article ID:', error);
    return null;
  }
}

/**
 * Merge new articles with cached articles (remove duplicates)
 */
export function mergeArticles(cachedArticles: Article[], newArticles: Article[]): Article[] {
  const articleMap = new Map<string, Article>();
  
  // Add cached articles first
  cachedArticles.forEach((article) => {
    const key = article.created_at || article.title;
    if (key) {
      articleMap.set(key, article);
    }
  });
  
  // Add new articles (will overwrite duplicates)
  newArticles.forEach((article) => {
    const key = article.created_at || article.title;
    if (key) {
      articleMap.set(key, article);
    }
  });
  
  // Convert back to array and sort by created_at (newest first)
  return Array.from(articleMap.values()).sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

// Race Event interface
export interface RaceEvent {
  id: string;
  eventName: string;
  date: string;
  type: 'Race' | 'Training' | 'Event';
  distance: '5KM' | '10KM' | 'Half Marathon' | 'Marathon' | 'Trail Run' | 'Other';
  customDistance?: string; // Optional, only required for Trail Run and Other
  eventNotes?: string; // Optional, for Event type to add additional notes/description
  createdAt: string;
}

/**
 * Save race event
 */
export async function saveRaceEvent(event: Omit<RaceEvent, 'id' | 'createdAt'>): Promise<void> {
  try {
    const events = await loadRaceEvents();
    const newEvent: RaceEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newEvents = [newEvent, ...events];
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
  } catch (error) {
    console.error('Error saving race event:', error);
    throw error;
  }
}

/**
 * Load race events
 */
export async function loadRaceEvents(): Promise<RaceEvent[]> {
  try {
    const eventsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
    if (eventsData) {
      return JSON.parse(eventsData);
    }
    return [];
  } catch (error) {
    console.error('Error loading race events:', error);
    return [];
  }
}

/**
 * Delete a race event by ID
 */
export async function deleteRaceEvent(eventId: string): Promise<void> {
  try {
    const events = await loadRaceEvents();
    const newEvents = events.filter((event) => event.id !== eventId);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
  } catch (error) {
    console.error('Error deleting race event:', error);
    throw error;
  }
}

/**
 * Clear all race events
 */
export async function clearRaceEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.EVENTS);
  } catch (error) {
    console.error('Error clearing race events:', error);
    throw error;
  }
}
