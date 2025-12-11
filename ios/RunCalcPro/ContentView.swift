//
//  ContentView.swift
//  RunCalcPro
//
//  Main navigation view
//

import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            EpHCalculatorView()
                .tabItem {
                    Label("EpH", systemImage: "chart.line.uptrend.xyaxis")
                }
                .tag(0)
            
            TrackCalculatorView()
                .tabItem {
                    Label("400m", systemImage: "figure.run")
                }
                .tag(1)
        }
    }
}

#Preview {
    ContentView()
}

