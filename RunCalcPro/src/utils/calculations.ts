/**
 * Calculation utilities for EpH and Track calculators
 * Ported from Python FastAPI backend (app.py)
 */

/**
 * Convert hh:mm:ss or hh:mm format to hours (decimal)
 */
export function hmsToHours(timeStr: string): number {
  const pattern = /^(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$/;
  const match = timeStr.trim().match(pattern);
  
  if (!match) {
    throw new Error("Invalid time format");
  }
  
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
  return hours + minutes / 60 + seconds / 3600;
}

/**
 * Convert hours (decimal) to hh:mm:ss format
 */
export function hoursToHms(hoursDecimal: number): string {
  const totalSeconds = Math.round(hoursDecimal * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate EpH given distance, elevation, and time
 */
export function calculateEph(
  distanceKm: number,
  elevationM: number,
  timeStr: string
): number {
  const hours = hmsToHours(timeStr);
  if (hours <= 0) {
    throw new Error("Time must be greater than 0");
  }
  
  const totalEp = distanceKm + elevationM / 100;
  return totalEp / hours;
}

/**
 * Calculate estimated time given distance, elevation, and EpH
 */
export function calculateTime(
  distanceKm: number,
  elevationM: number,
  eph: number
): string {
  if (eph <= 0) {
    throw new Error("EpH must be greater than 0");
  }
  
  const totalEp = distanceKm + elevationM / 100;
  const hours = totalEp / eph;
  return hoursToHms(hours);
}

/**
 * Convert pace string (M:SS or M) to seconds per kilometer
 */
export function parsePace(paceStr: string): number {
  try {
    if (paceStr.includes(":")) {
      const [minutesStr, secondsStr] = paceStr.split(":");
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);
      
      // Validate minutes and seconds
      if (isNaN(minutes) || isNaN(seconds)) {
        throw new Error("Invalid pace format. Use M:SS (e.g., '4:30') or M (e.g., '7').");
      }
      if (minutes < 0) {
        throw new Error("Minutes cannot be negative");
      }
      if (minutes > 60) {
        throw new Error("Minutes cannot exceed 60");
      }
      if (seconds < 0 || seconds > 59) {
        throw new Error("Seconds must be between 0 and 59");
      }
      
      return minutes * 60 + seconds;
    } else {
      const minutes = parseInt(paceStr, 10);
      if (isNaN(minutes)) {
        throw new Error("Invalid pace format. Use M:SS (e.g., '4:30') or M (e.g., '7').");
      }
      if (minutes < 0) {
        throw new Error("Minutes cannot be negative");
      }
      if (minutes > 60) {
        throw new Error("Minutes cannot exceed 60");
      }
      return minutes * 60;
    }
  } catch (error: any) {
    if (error.message.includes("invalid literal") || error.message.includes("Invalid pace format")) {
      throw new Error("Invalid pace format. Use M:SS (e.g., '4:30') or M (e.g., '7').");
    }
    throw error;
  }
}

/**
 * Calculate total time for 400m and time per 100m
 */
export function calculateTrackTimes(paceSeconds: number) {
  const distanceKm = 0.4; // 400m = 0.4km
  const splitDistanceKm = 0.1; // 100m = 0.1km
  
  // Total time for 400 meters
  const totalSeconds = paceSeconds * distanceKm;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalRemSeconds = Math.floor(totalSeconds % 60);
  
  // Time per 100 meters
  const splitSeconds = paceSeconds * splitDistanceKm;
  
  // Calculate race distances
  const time10km = paceSeconds * 10; // 10km
  const timeHalfMarathon = paceSeconds * 21.0975; // Half marathon (21.0975km)
  const timeMarathon = paceSeconds * 42.195; // Marathon (42.195km)
  
  return {
    totalSeconds: Math.round(totalSeconds),
    totalMinutes,
    totalRemSeconds,
    split100m: Math.round(splitSeconds),
    split200m: Math.round(splitSeconds * 2),
    split300m: Math.round(splitSeconds * 3),
    split400m: Math.round(totalSeconds),
    time10km: Math.round(time10km),
    timeHalfMarathon: Math.round(timeHalfMarathon),
    timeMarathon: Math.round(timeMarathon),
  };
}

/**
 * Format time in seconds to HH:MM:SS format
 */
export function formatTimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds as min:sec if >= 60, otherwise as seconds
 */
export function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

/**
 * Format time as M:SS for track calculator
 */
export function formatTimeMinSec(minutes: number, seconds: number): string {
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

