# Converting FastAPI Web App to iOS App - Complete Guide

This guide explains how to convert your FastAPI web application to a native iOS app.

## Overview

Your FastAPI app (`RunCalc Pro`) has been converted to a native iOS app with two approaches:

1. **Native SwiftUI App** (Recommended) - Full native iOS experience
2. **WKWebView Wrapper** (Alternative) - Wraps your existing web app

## Approach 1: Native SwiftUI App (Recommended)

### Advantages
- ✅ Native iOS look and feel
- ✅ Better performance
- ✅ Works offline
- ✅ Better App Store presence
- ✅ Access to iOS features (notifications, widgets, etc.)

### Implementation

All the code has been created in the `ios/RunCalcPro/` directory:

- **RunCalcProApp.swift** - App entry point
- **ContentView.swift** - Main navigation with tabs
- **Models/CalculatorModels.swift** - Data models
- **Utilities/CalculatorEngine.swift** - Calculation logic (matches your Python code)
- **Utilities/Localization.swift** - Bilingual support
- **Views/EpHCalculatorView.swift** - EpH calculator UI
- **Views/TrackCalculatorView.swift** - 400m track calculator UI

### Setup Steps

1. **Open Xcode** and create a new iOS App project
2. **Add all files** from `ios/RunCalcPro/` to your Xcode project
3. **Build and run** - The app should work immediately

See `ios/README.md` for detailed setup instructions.

## Approach 2: WKWebView Wrapper (Alternative)

### Advantages
- ✅ Quick to implement
- ✅ Reuse existing web app
- ✅ Easy updates (just update web server)

### Disadvantages
- ❌ Requires internet connection
- ❌ Less native feel
- ❌ May have App Store review issues

### Implementation

See `ios/WKWebViewWrapper/` for the wrapper code.

## Key Conversions Made

### 1. Calculation Logic

**Python (FastAPI):**
```python
def calculate_eph(distance_km: float, elevation_m: float, time_str: str) -> float:
    hours = hms_to_hours(time_str)
    total_ep = distance_km + elevation_m / 100
    return total_ep / hours
```

**Swift:**
```swift
static func calculateEpH(distanceKm: Double, elevationM: Double, timeStr: String) throws -> Double {
    let hours = try hmsToHours(timeStr)
    let totalEp = distanceKm + elevationM / 100.0
    return totalEp / hours
}
```

### 2. Bilingual Support

**Python (FastAPI):**
```python
TRANSLATIONS = {
    'en': { 'title': 'EpH Calculator', ... },
    'zh': { 'title': 'EpH計算器', ... }
}
```

**Swift:**
```swift
struct LocalizedStrings {
    let language: AppLanguage
    
    var ephTitle: String {
        language == .english ? "EpH Calculator" : "EpH計算器"
    }
}
```

### 3. History Storage

**Python (Web):**
- Uses `localStorage` in JavaScript

**Swift:**
- Uses `UserDefaults` for local storage
- Persists between app launches

## Testing Checklist

- [ ] EpH calculation (time → EpH)
- [ ] Time estimation (EpH → time)
- [ ] 400m track calculation
- [ ] Language switching (EN/繁)
- [ ] Calculation history
- [ ] Error handling
- [ ] Input validation
- [ ] Dark mode support (automatic with SwiftUI)

## Deployment

### TestFlight (Beta Testing)

1. Archive your app in Xcode
2. Upload to App Store Connect
3. Add to TestFlight
4. Invite beta testers

### App Store

1. Complete App Store Connect listing
2. Add screenshots and description
3. Submit for review
4. Wait for approval (typically 1-3 days)

## Next Steps

1. **Choose your approach** (Native SwiftUI recommended)
2. **Set up Xcode project** (see `ios/README.md`)
3. **Test thoroughly** on real devices
4. **Customize** app icon, name, and branding
5. **Deploy** to TestFlight or App Store

## Support

If you encounter issues:
1. Check the `ios/README.md` for setup instructions
2. Verify all files are added to the Xcode project
3. Ensure iOS deployment target is 16.0+
4. Check that Swift version is 5.9+

## Additional Features You Can Add

- **Widgets** - Show recent calculations on home screen
- **Shortcuts** - Siri shortcuts for quick calculations
- **Apple Watch App** - Companion watch app
- **iCloud Sync** - Sync history across devices
- **Dark Mode** - Already supported automatically
- **Haptic Feedback** - Add haptics for button presses

## Conclusion

The native SwiftUI app provides the best user experience and is recommended for production use. All calculation logic has been faithfully converted from your Python code, ensuring identical results.

Good luck with your iOS app! 🚀

