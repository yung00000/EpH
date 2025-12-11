//
//  WebViewApp.swift
//  WKWebViewWrapper
//
//  Alternative: WKWebView wrapper for the FastAPI web app
//  This is a simpler approach that wraps your existing web app
//

import SwiftUI
import WebKit

@main
struct WebViewApp: App {
    var body: some Scene {
        WindowGroup {
            WebViewWrapper()
        }
    }
}

struct WebViewWrapper: UIViewRepresentable {
    // Change this URL to your deployed FastAPI app
    let url = URL(string: "http://localhost:8080")!
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("Failed to load: \(error.localizedDescription)")
        }
    }
}

