//
//  Localization.swift
//  RunCalcPro
//
//  Bilingual support (English and Traditional Chinese)
//

import Foundation

enum AppLanguage: String, CaseIterable {
    case english = "en"
    case chinese = "zh"
    
    var displayName: String {
        switch self {
        case .english:
            return "EN"
        case .chinese:
            return "繁"
        }
    }
}

struct LocalizedStrings {
    let language: AppLanguage
    
    // EpH Calculator
    var ephTitle: String {
        language == .english ? "EpH Calculator" : "EpH計算器"
    }
    
    var ephSubtitle: String {
        language == .english ? "Professional EpH calculator for trailrunning performance analysis" : "專業的EpH計算器，用於越野跑步表現分析"
    }
    
    var modeLabel: String {
        language == .english ? "Calculation Mode:" : "計算模式："
    }
    
    var modeSelect: String {
        language == .english ? "Select" : "請選擇"
    }
    
    var distanceLabel: String {
        language == .english ? "Distance (km):" : "距離 (公里)："
    }
    
    var elevationLabel: String {
        language == .english ? "Elevation Gain (m):" : "海拔增益 (米)："
    }
    
    var timeLabel: String {
        language == .english ? "Time (hh:mm:ss or hh:mm):" : "時間 (hh:mm:ss 或 hh:mm)："
    }
    
    var ephLabel: String {
        language == .english ? "Target EpH:" : "目標EpH："
    }
    
    var calculateButton: String {
        language == .english ? "Calculate" : "計算"
    }
    
    var resultEpH: String {
        language == .english ? "EpH = %.2f" : "EpH = %.2f"
    }
    
    var resultTime: String {
        language == .english ? "Estimated Time = %@" : "預估時間 = %@"
    }
    
    // Track Calculator
    var trackTitle: String {
        language == .english ? "400m Track Calculator" : "400米賽道計算器"
    }
    
    var trackSubtitle: String {
        language == .english ? "Calculate 400m time and splits from your pace" : "根據配速計算400米時間和分段時間"
    }
    
    var paceLabel: String {
        language == .english ? "Enter your pace (min:sec per km):" : "輸入配速 (分:秒/公里)："
    }
    
    var pacePlaceholder: String {
        language == .english ? "e.g., 4:30 or 7:00" : "例如：4:30 或 7:00"
    }
    
    var totalTime: String {
        language == .english ? "Total Time for 400m:" : "400米總時間："
    }
    
    var splitsTitle: String {
        language == .english ? "Split Times:" : "分段時間："
    }
    
    var split100m: String {
        language == .english ? "100m:" : "100米："
    }
    
    var split200m: String {
        language == .english ? "200m:" : "200米："
    }
    
    var split300m: String {
        language == .english ? "300m:" : "300米："
    }
    
    var split400m: String {
        language == .english ? "400m:" : "400米："
    }
    
    // Common
    var calculationHistory: String {
        language == .english ? "Calculation History" : "計算歷史"
    }
    
    var clear: String {
        language == .english ? "Clear" : "清除"
    }
    
    var noHistory: String {
        language == .english ? "No calculation history" : "暫無計算歷史"
    }
    
    var error: String {
        language == .english ? "Error" : "錯誤"
    }
    
    func formatEpH(_ value: Double) -> String {
        return String(format: resultEpH, value)
    }
    
    func formatTime(_ time: String) -> String {
        return String(format: resultTime, time)
    }
}

