//
//  TrackCalculatorView.swift
//  RunCalcPro
//
//  400m Track Calculator view
//

import SwiftUI

struct TrackCalculatorView: View {
    @State private var language: AppLanguage = .chinese
    @State private var pace: String = ""
    @State private var result: TrackCalculationResult?
    @State private var errorMessage: String = ""
    @State private var showingError = false
    @State private var history: [TrackHistoryItem] = []
    
    private var strings: LocalizedStrings {
        LocalizedStrings(language: language)
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text(strings.trackTitle)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.blue)
                        
                        Text(strings.trackSubtitle)
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
                        VStack(alignment: .leading, spacing: 8) {
                            Text(strings.paceLabel)
                                .font(.headline)
                            
                            TextField(strings.pacePlaceholder, text: $pace)
                                .textFieldStyle(.roundedBorder)
                                .keyboardType(.numbersAndPunctuation)
                        }
                        
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
                        .disabled(pace.isEmpty)
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 2)
                    
                    // Results
                    if let result = result {
                        VStack(spacing: 16) {
                            // Total Time
                            VStack(spacing: 8) {
                                Text(strings.totalTime)
                                    .font(.headline)
                                    .foregroundColor(.secondary)
                                
                                Text(CalculatorEngine.formatTime(minutes: result.totalTimeMinutes, seconds: result.totalTimeSeconds))
                                    .font(.title)
                                    .fontWeight(.bold)
                                    .foregroundColor(.green)
                            }
                            
                            Divider()
                            
                            // Split Times
                            VStack(alignment: .leading, spacing: 12) {
                                Text(strings.splitsTitle)
                                    .font(.headline)
                                
                                HStack(spacing: 16) {
                                    VStack {
                                        Text(strings.split100m)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                        Text("\(result.split100m)s")
                                            .font(.headline)
                                    }
                                    
                                    VStack {
                                        Text(strings.split200m)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                        Text("\(result.split200m)s")
                                            .font(.headline)
                                    }
                                    
                                    VStack {
                                        Text(strings.split300m)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                        Text("\(result.split300m)s")
                                            .font(.headline)
                                    }
                                    
                                    VStack {
                                        Text(strings.split400m)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                        Text("\(result.split400m)s")
                                            .font(.headline)
                                    }
                                }
                            }
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
                                TrackHistoryRow(item: item, language: language) {
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
        guard !pace.isEmpty else { return }
        
        do {
            let paceSeconds = try CalculatorEngine.parsePace(pace)
            let calculationResult = CalculatorEngine.calculateTrackTimes(paceSeconds: paceSeconds)
            result = calculationResult
            
            // Save to history
            let historyItem = TrackHistoryItem(
                pace: pace,
                result: calculationResult,
                timestamp: Date()
            )
            history.insert(historyItem, at: 0)
            if history.count > 10 {
                history = Array(history.prefix(10))
            }
            saveHistory()
            
            errorMessage = ""
        } catch {
            showError(error.localizedDescription)
        }
    }
    
    private func showError(_ message: String) {
        errorMessage = message
        showingError = true
        result = nil
    }
    
    private func loadFromHistory(_ item: TrackHistoryItem) {
        pace = item.pace
        result = item.result
    }
    
    private func clearHistory() {
        history = []
        saveHistory()
    }
    
    private func saveHistory() {
        if let encoded = try? JSONEncoder().encode(history) {
            UserDefaults.standard.set(encoded, forKey: "trackCalculatorHistory")
        }
    }
    
    private func loadHistory() {
        if let data = UserDefaults.standard.data(forKey: "trackCalculatorHistory"),
           let decoded = try? JSONDecoder().decode([TrackHistoryItem].self, from: data) {
            history = decoded
        }
    }
}

struct TrackHistoryItem: Identifiable, Codable {
    let id: UUID
    let pace: String
    let result: TrackCalculationResult
    let timestamp: Date
    
    init(pace: String, result: TrackCalculationResult, timestamp: Date) {
        self.id = UUID()
        self.pace = pace
        self.result = result
        self.timestamp = timestamp
    }
}

struct TrackHistoryRow: View {
    let item: TrackHistoryItem
    let language: AppLanguage
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Pace: \(item.pace)")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text("400m: \(CalculatorEngine.formatTime(minutes: item.result.totalTimeMinutes, seconds: item.result.totalTimeSeconds))")
                        .font(.subheadline)
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
}

#Preview {
    TrackCalculatorView()
}

