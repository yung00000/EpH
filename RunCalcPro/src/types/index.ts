/**
 * TypeScript type definitions for RunCals Pro
 */

/**
 * Supported languages
 */
export type Language = 'en' | 'zh';

/**
 * Calculation mode for EpH calculator
 */
export type CalculationMode = 'eph' | 'time';

/**
 * EpH calculation history item
 */
export interface EpHHistoryItem {
  mode: 'eph' | 'time';
  distance: string;
  elevation: string;
  time?: string;
  eph?: string;
  result: string;
  timestamp: string;
}

/**
 * EpH calculation result
 */
export interface EpHResult {
  result: string;
  error?: string;
}

/**
 * Track calculation history item
 */
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
 * Track calculation result
 */
export interface TrackResult {
  total_time_min: string;
  total_time_sec: number;
  split_100m: number;
  split_200m: number;
  split_300m: number;
  split_400m: number;
  error?: string;
}

/**
 * Theme preference
 */
export type Theme = 'light' | 'dark' | 'automatic';

/**
 * Track calculation times
 */
export interface TrackTimes {
  totalSeconds: number;
  totalMinutes: number;
  totalRemSeconds: number;
  split100m: number;
  split200m: number;
  split300m: number;
  split400m: number;
}

