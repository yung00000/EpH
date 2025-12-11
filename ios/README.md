# RunCalc Pro - iOS App

Native iOS app for EpH and 400m Track calculations, converted from the FastAPI web application.

## Features

- ✅ **Native SwiftUI Interface** - Beautiful, native iOS design
- ✅ **EpH Calculator** - Calculate EpH or estimated time
- ✅ **400m Track Calculator** - Calculate 400m time and splits from pace
- ✅ **Bilingual Support** - English and Traditional Chinese (EN/繁)
- ✅ **Calculation History** - Local storage for previous calculations
- ✅ **Offline Capable** - All calculations run locally, no internet required

## Requirements

- Xcode 15.0 or later
- iOS 16.0 or later
- macOS 13.0 or later (for macOS app)

## Setup Instructions

### 1. Create Xcode Project

1. Open Xcode
2. Create a new project:
   - Choose **iOS** → **App**
   - Product Name: `RunCalcPro`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: **None** (we'll use UserDefaults)

### 2. Add Files to Project

Copy all files from the `ios/RunCalcPro/` directory into your Xcode project:

```
RunCalcPro/
├── RunCalcProApp.swift          (Replace the default App file)
├── ContentView.swift
├── Models/
│   └── CalculatorModels.swift
├── Utilities/
│   ├── CalculatorEngine.swift
│   └── Localization.swift
└── Views/
    ├── EpHCalculatorView.swift
    └── TrackCalculatorView.swift
```

**In Xcode:**
1. Right-click on your project in the navigator
2. Select "Add Files to [Project Name]..."
3. Select all the files from the `ios/RunCalcPro/` directory
4. Make sure "Copy items if needed" is checked
5. Click "Add"

### 3. Organize Files in Xcode

Create groups (folders) in Xcode to organize:
- **Models** - for `CalculatorModels.swift`
- **Utilities** - for `CalculatorEngine.swift` and `Localization.swift`
- **Views** - for `EpHCalculatorView.swift` and `TrackCalculatorView.swift`

### 4. Build and Run

1. Select your target device or simulator
2. Press `Cmd + R` to build and run
3. The app should launch with both calculators available in a tab view

## Project Structure

```
RunCalcPro/
├── RunCalcProApp.swift          # App entry point
├── ContentView.swift            # Main tab navigation
├── Models/
│   └── CalculatorModels.swift   # Data models
├── Utilities/
│   ├── CalculatorEngine.swift   # Calculation logic
│   └── Localization.swift       # Bilingual strings
└── Views/
    ├── EpHCalculatorView.swift  # EpH calculator UI
    └── TrackCalculatorView.swift # 400m track calculator UI
```

## Features Overview

### EpH Calculator
- Calculate EpH from distance, elevation, and time
- Calculate estimated time from distance, elevation, and target EpH
- Bilingual interface (English/Traditional Chinese)
- Calculation history with local storage

### 400m Track Calculator
- Calculate 400m total time from pace
- Calculate split times for 100m, 200m, 300m, and 400m
- Pace input in min:sec format (e.g., 4:30)
- Calculation history with local storage

## Customization

### Changing Default Language

In `EpHCalculatorView.swift` and `TrackCalculatorView.swift`, change:
```swift
@State private var language: AppLanguage = .chinese
```
to:
```swift
@State private var language: AppLanguage = .english
```

### App Icon and Assets

1. Add your app icon to `Assets.xcassets`
2. Update app name in project settings if needed

## Testing

The app includes:
- Input validation
- Error handling
- Local storage for history
- Bilingual support

Test on:
- iPhone (various sizes)
- iPad (if supporting)
- iOS Simulator

## Deployment

### TestFlight

1. Archive your app in Xcode (Product → Archive)
2. Upload to App Store Connect
3. Add to TestFlight for beta testing

### App Store

1. Complete App Store Connect listing
2. Submit for review
3. Once approved, your app will be available on the App Store

## Notes

- All calculations are performed locally (no backend required)
- History is stored in UserDefaults (persists between app launches)
- The app works completely offline
- Calculations match the original FastAPI implementation exactly

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Make sure all files are added to the target
2. Check that Swift version is 5.9 or later
3. Ensure iOS deployment target is 16.0 or later

### Missing Files

If files are missing:
1. Verify all files are in the project navigator
2. Check that files are added to the correct target in Build Phases

## License

Same license as the main project (MIT License).

