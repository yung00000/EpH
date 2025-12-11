//
//  EpHCalculatorView.swift
//  RunCalcPro
//
//  EpH Calculator main view
//

import SwiftUI

struct EpHCalculatorView: View {
    @State private var language: AppLanguage = .chinese
    @State private var mode: CalculationMode?
    @State private var distance: String = ""
    @State private var elevation: String = ""
    @State private var time: String = ""
    @State private var eph: String = ""
    @State private var result: String = ""
    @State private var errorMessage: String = ""
    @State private var showingError = false
    @State private var history: [CalculationHistory] = []
    
    private var strings: LocalizedStrings {
        LocalizedStrings(language: language)
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text(strings.ephTitle)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.blue)
                        
                        Text(strings.ephSubtitle)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top)
                    
                    // Language Switcher
                    HStack {
                        Spacer()
                        Picker("Language", selection: $language) {
                            ForEach(AppLanguage.allCases, id: \.self) { lang in
                                Text(lang.displayName).tag(lang)
                            }
                        }
                        .pickerStyle(.segmented)
                        .frame(width: 100)
                    }
                    .padding(.horizontal)
                    
                    // Calculator Card
                    VStack(alignment: .leading, spacing: 16) {
                        // Mode Selection
                        VStack(alignment: .leading, spacing: 8) {
                            Text(strings.modeLabel)
                                .font(.headline)
                            
                            Picker(strings.modeSelect, selection: $mode) {
                                Text(strings.modeSelect).tag(nil as CalculationMode?)
                                ForEach(CalculationMode.allCases, id: \.self) { calcMode in
                                    Text(language == .english ? calcMode.displayName.en : calcMode.displayName.zh)
                                        .tag(calcMode as CalculationMode?)
                                }
                            }
                            .pickerStyle(.menu)
                            .onChange(of: mode) { _ in
                                clearFields()
                            }
                        }
                        
                        // Distance
                        VStack(alignment: .leading, spacing: 8) {
                            Text(strings.distanceLabel)
                                .font(.headline)
                            
                            TextField("0.0", text: $distance)
                                .keyboardType(.decimalPad)
                                .textFieldStyle(.roundedBorder)
                        }
                        
                        // Elevation
                        VStack(alignment: .leading, spacing: 8) {
                            Text(strings.elevationLabel)
                                .font(.headline)
                            
                            TextField("0", text: $elevation)
                                .keyboardType(.numberPad)
                                .textFieldStyle(.roundedBorder)
                        }
                        
                        // Conditional Fields
                        if mode == .eph {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(strings.timeLabel)
                                    .font(.headline)
                                
                                TextField(strings.timeLabel, text: $time)
                                    .textFieldStyle(.roundedBorder)
                                    .placeholder(when: time.isEmpty) {
                                        Text("e.g., 2:30:00 or 2:30")
                                            .foregroundColor(.secondary)
                                    }
                            }
                        }
                        
                        if mode == .time {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(strings.ephLabel)
                                    .font(.headline)
                                
                                TextField("0.00", text: $eph)
                                    .keyboardType(.decimalPad)
                                    .textFieldStyle(.roundedBorder)
                            }
                        }
                        
                        // Calculate Button
                        Button(action: calculate) {
                            HStack {
                                Image(systemName: "play.fill")
                                Text(strings.calculateButton)
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }
                        .disabled(mode == nil)
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 2)
                    
                    // Results
                    if !result.isEmpty {
                        VStack(spacing: 8) {
                            Text(result)
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.green)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(12)
                        .shadow(radius: 2)
                    }
                    
                    // History
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text(strings.calculationHistory)
                                .font(.headline)
                            Spacer()
                            Button(action: clearHistory) {
                                Text(strings.clear)
                                    .font(.subheadline)
                            }
                        }
                        
                        if history.isEmpty {
                            Text(strings.noHistory)
                                .foregroundColor(.secondary)
                                .frame(maxWidth: .infinity, alignment: .center)
                                .padding()
                        } else {
                            ForEach(history.prefix(10)) { item in
                                HistoryRow(item: item, language: language) {
                                    loadFromHistory(item)
                                }
                            }
                        }
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 2)
                }
                .padding()
            }
            .navigationBarHidden(true)
            .alert(strings.error, isPresented: $showingError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage)
            }
            .onAppear {
                loadHistory()
            }
        }
    }
    
    private func calculate() {
        guard let mode = mode else { return }
        guard let distanceValue = Double(distance), distanceValue > 0 else {
            showError("Please enter a valid distance")
            return
        }
        guard let elevationValue = Double(elevation), elevationValue >= 0 else {
            showError("Please enter a valid elevation")
            return
        }
        
        do {
            if mode == .eph {
                guard !time.isEmpty else {
                    showError("Please enter time")
                    return
                }
                let ephValue = try CalculatorEngine.calculateEpH(
                    distanceKm: distanceValue,
                    elevationM: elevationValue,
                    timeStr: time
                )
                result = strings.formatEpH(ephValue)
                saveToHistory(mode: mode, distance: distanceValue, elevation: elevationValue, time: time, eph: nil, result: result)
            } else {
                guard let ephValue = Double(eph), ephValue > 0 else {
                    showError("Please enter a valid EpH value")
                    return
                }
                let timeResult = try CalculatorEngine.calculateTime(
                    distanceKm: distanceValue,
                    elevationM: elevationValue,
                    eph: ephValue
                )
                result = strings.formatTime(timeResult)
                saveToHistory(mode: mode, distance: distanceValue, elevation: elevationValue, time: nil, eph: ephValue, result: result)
            }
            errorMessage = ""
        } catch {
            showError(error.localizedDescription)
        }
    }
    
    private func clearFields() {
        time = ""
        eph = ""
        result = ""
        errorMessage = ""
    }
    
    private func showError(_ message: String) {
        errorMessage = message
        showingError = true
        result = ""
    }
    
    private func saveToHistory(mode: CalculationMode, distance: Double, elevation: Double, time: String?, eph: Double?, result: String) {
        let historyItem = CalculationHistory(
            mode: mode,
            distance: distance,
            elevation: elevation,
            time: time,
            eph: eph,
            result: result
        )
        history.insert(historyItem, at: 0)
        if history.count > 10 {
            history = Array(history.prefix(10))
        }
        saveHistory()
    }
    
    private func loadFromHistory(_ item: CalculationHistory) {
        mode = item.mode
        distance = String(item.distance)
        elevation = String(item.elevation)
        time = item.time ?? ""
        eph = item.eph.map { String($0) } ?? ""
        result = item.result
    }
    
    private func clearHistory() {
        history = []
        saveHistory()
    }
    
    private func saveHistory() {
        if let encoded = try? JSONEncoder().encode(history) {
            UserDefaults.standard.set(encoded, forKey: "ephCalculatorHistory")
        }
    }
    
    private func loadHistory() {
        if let data = UserDefaults.standard.data(forKey: "ephCalculatorHistory"),
           let decoded = try? JSONDecoder().decode([CalculationHistory].self, from: data) {
            history = decoded
        }
    }
}

struct HistoryRow: View {
    let item: CalculationHistory
    let language: AppLanguage
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(language == .english ? item.mode.displayName.en : item.mode.displayName.zh)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(item.mode == .eph ? Color.green.opacity(0.2) : Color.blue.opacity(0.2))
                        .foregroundColor(item.mode == .eph ? .green : .blue)
                        .cornerRadius(8)
                    
                    Text(formatData(item))
                        .font(.subheadline)
                        .foregroundColor(.primary)
                    
                    Text(item.result)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.green)
                }
                
                Spacer()
                
                Text(item.timestamp, style: .time)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.secondarySystemBackground))
            .cornerRadius(8)
        }
        .buttonStyle(.plain)
    }
    
    private func formatData(_ item: CalculationHistory) -> String {
        let distanceStr = String(format: "%.1f km", item.distance)
        let elevationStr = String(format: "%.0f m", item.elevation)
        
        if item.mode == .eph {
            return "\(distanceStr) | \(elevationStr) | \(item.time ?? "")"
        } else {
            return "\(distanceStr) | \(elevationStr) | EpH: \(item.eph ?? 0)"
        }
    }
}

extension View {
    func placeholder<Content: View>(
        when shouldShow: Bool,
        alignment: Alignment = .leading,
        @ViewBuilder placeholder: () -> Content) -> some View {
        
        ZStack(alignment: alignment) {
            placeholder().opacity(shouldShow ? 1 : 0)
            self
        }
    }
}

#Preview {
    EpHCalculatorView()
}

