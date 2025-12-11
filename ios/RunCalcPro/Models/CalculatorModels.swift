//
//  CalculatorModels.swift
//  RunCalcPro
//
//  Data models for calculations
//

import Foundation

enum CalculationMode: String, CaseIterable, Codable {
    case eph = "eph"
    case time = "time"
    
    var displayName: (en: String, zh: String) {
        switch self {
        case .eph:
            return ("Calculate EpH", "計算EpH")
        case .time:
            return ("Calculate Estimated Time", "計算預估時間")
        }
    }
}

struct CalculationHistory: Identifiable, Codable {
    let id: UUID
    let mode: CalculationMode
    let distance: Double
    let elevation: Double
    let time: String?
    let eph: Double?
    let result: String
    let timestamp: Date
    
    init(mode: CalculationMode, distance: Double, elevation: Double, time: String? = nil, eph: Double? = nil, result: String) {
        self.id = UUID()
        self.mode = mode
        self.distance = distance
        self.elevation = elevation
        self.time = time
        self.eph = eph
        self.result = result
        self.timestamp = Date()
    }
}

struct TrackCalculationResult: Codable {
    let totalTimeMinutes: Int
    let totalTimeSeconds: Int  // Remainder seconds (0-59) for formatting
    let split100m: Int
    let split200m: Int
    let split300m: Int
    let split400m: Int  // Total time in seconds for 400m
}

