//
//  CalculatorEngine.swift
//  RunCalcPro
//
//  Calculation logic for EpH and Track calculators
//

import Foundation

struct CalculatorEngine {
    
    // MARK: - EpH Calculations
    
    /// Convert time string (hh:mm:ss or hh:mm) to hours (decimal)
    static func hmsToHours(_ timeStr: String) throws -> Double {
        let pattern = #"^(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$"#
        let regex = try NSRegularExpression(pattern: pattern, options: [])
        let nsString = timeStr.trimmingCharacters(in: .whitespaces) as NSString
        let results = regex.matches(in: timeStr, options: [], range: NSRange(location: 0, length: nsString.length))
        
        guard let match = results.first, match.numberOfRanges >= 2 else {
            throw CalculatorError.invalidTimeFormat
        }
        
        let hoursRange = match.range(at: 1)
        guard hoursRange.location != NSNotFound else {
            throw CalculatorError.invalidTimeFormat
        }
        
        let hours = Int(nsString.substring(with: hoursRange)) ?? 0
        var minutes = 0
        var seconds = 0
        
        if match.numberOfRanges > 2 {
            let minutesRange = match.range(at: 2)
            if minutesRange.location != NSNotFound {
                minutes = Int(nsString.substring(with: minutesRange)) ?? 0
            }
        }
        
        if match.numberOfRanges > 3 {
            let secondsRange = match.range(at: 3)
            if secondsRange.location != NSNotFound {
                seconds = Int(nsString.substring(with: secondsRange)) ?? 0
            }
        }
        
        return Double(hours) + Double(minutes) / 60.0 + Double(seconds) / 3600.0
    }
    
    /// Convert hours (decimal) to hh:mm:ss format
    static func hoursToHMS(_ hours: Double) -> String {
        let totalSeconds = Int(round(hours * 3600))
        let hours = totalSeconds / 3600
        let minutes = (totalSeconds % 3600) / 60
        let seconds = totalSeconds % 60
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
    
    /// Calculate EpH given distance, elevation, and time
    static func calculateEpH(distanceKm: Double, elevationM: Double, timeStr: String) throws -> Double {
        let hours = try hmsToHours(timeStr)
        guard hours > 0 else {
            throw CalculatorError.invalidTime
        }
        
        let totalEp = distanceKm + elevationM / 100.0
        return totalEp / hours
    }
    
    /// Calculate estimated time given distance, elevation, and EpH
    static func calculateTime(distanceKm: Double, elevationM: Double, eph: Double) throws -> String {
        guard eph > 0 else {
            throw CalculatorError.invalidEpH
        }
        
        let totalEp = distanceKm + elevationM / 100.0
        let hours = totalEp / eph
        return hoursToHMS(hours)
    }
    
    // MARK: - Track Calculations
    
    /// Parse pace string (M:SS or M) to seconds per kilometer
    static func parsePace(_ paceStr: String) throws -> Int {
        if paceStr.contains(":") {
            let components = paceStr.split(separator: ":")
            guard components.count == 2,
                  let minutes = Int(components[0]),
                  let seconds = Int(components[1]) else {
                throw CalculatorError.invalidPaceFormat
            }
            
            guard minutes >= 0, minutes <= 60 else {
                throw CalculatorError.invalidPaceFormat
            }
            guard seconds >= 0, seconds <= 59 else {
                throw CalculatorError.invalidPaceFormat
            }
            
            return minutes * 60 + seconds
        } else {
            guard let minutes = Int(paceStr), minutes >= 0, minutes <= 60 else {
                throw CalculatorError.invalidPaceFormat
            }
            return minutes * 60
        }
    }
    
    /// Calculate 400m time and splits from pace
    static func calculateTrackTimes(paceSeconds: Int) -> TrackCalculationResult {
        // Total time for 400 meters (0.4 km)
        let totalSeconds = Double(paceSeconds) * 0.4
        let totalMinutes = Int(totalSeconds / 60)
        let totalRemSeconds = Int(totalSeconds.truncatingRemainder(dividingBy: 60))
        
        // Time per 100 meters (0.1 km)
        let splitSeconds = Double(paceSeconds) * 0.1
        
        return TrackCalculationResult(
            totalTimeMinutes: totalMinutes,
            totalTimeSeconds: totalRemSeconds, // Store remainder seconds for formatting
            split100m: Int(splitSeconds),
            split200m: Int(splitSeconds * 2),
            split300m: Int(splitSeconds * 3),
            split400m: Int(totalSeconds)
        )
    }
    
    // MARK: - Formatting
    
    static func formatTime(minutes: Int, seconds: Int) -> String {
        return String(format: "%d:%02d", minutes, seconds)
    }
}

enum CalculatorError: LocalizedError {
    case invalidTimeFormat
    case invalidTime
    case invalidEpH
    case invalidPaceFormat
    
    var errorDescription: String? {
        switch self {
        case .invalidTimeFormat:
            return "Invalid time format. Use hh:mm:ss or hh:mm"
        case .invalidTime:
            return "Time must be greater than 0"
        case .invalidEpH:
            return "EpH must be greater than 0"
        case .invalidPaceFormat:
            return "Invalid pace format. Use M:SS (e.g., 4:30) or M (e.g., 7)"
        }
    }
}

