# RunCals Pro

A comprehensive running calculator app for iOS and Android, built with React Native Expo.

## Version 1.2.1

### Features

#### 🏃 EpH Calculator
Calculate Equivalent Horizontal Distance (EpH) and estimated completion times for trail runs and hilly races.
- Calculate EpH from distance, elevation gain, and time
- Estimate completion time based on EpH value
- Input validation and error handling
- Calculation history with swipe-to-delete

#### ⏱️ Pacing Calculator
Calculate pace, splits, and race times for various distances.
- **Pace to Time Mode**: Enter pace → Get times for different distances
- **Time to Pace Mode**: Enter completed time → Calculate pace
- 400m track splits (100m, 200m, 300m, 400m)
- Race time estimates (10km, Half Marathon, Marathon)
- Dual-mode calculation with color-coded history
- Input validation and error handling
- Calculation history with swipe-to-delete

#### 📅 Race Events (NEW in v1.2.1)
Track and manage your upcoming races.
- Add race events with name, date, type, and optional distance
- Event types: 5KM, 10KM, Half Marathon, Marathon, Trail Run, Other
- Calendar date picker for easy date selection
- Upcoming event card with countdown timer
- Swipe-to-delete event management
- Local storage for offline access

#### 📰 Running Tips & Articles (NEW in v1.2.1)
Access running articles and tips.
- Fetch latest articles from API
- Date filter dropdown (Today, specific dates)
- Article caching for offline access
- Pull-to-refresh functionality

#### ⚙️ Settings
- **Language**: Toggle between English and Traditional Chinese (中/Eng)
- **Theme**: Dark mode, Light mode, or Automatic (follows system)
- **Check for Updates**: OTA updates via Expo Updates
- **Contact Us**: Copy email address (admin@runcals.com)
- **App Version**: Display current version and build info

### Technical Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation 7
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Styling**: StyleSheet API with dynamic theming
- **Storage**: AsyncStorage for local data persistence
- **Internationalization**: react-i18next
- **Gestures**: react-native-gesture-handler (swipe-to-delete)
- **Updates**: Expo Updates (OTA)
- **Date Picker**: @react-native-community/datetimepicker

### Build & Deploy

#### Prerequisites
- Node.js 18+
- Expo CLI
- EAS CLI (for production builds)
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

#### Environment Variables
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_API_BASE_URL=https://api-articles.runcals.com
EXPO_PUBLIC_API_KEY=your_api_key_here
```

#### Development
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

#### Production Build
```bash
# Build for Android (AAB)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

#### EAS Secrets (Recommended for Production)
Store API keys securely using EAS Secrets:
```bash
eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value https://api-articles.runcals.com --type string
eas secret:create --name EXPO_PUBLIC_API_KEY --value your_api_key_here --type string
```

### Project Structure
```
RunCalcPro/
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React Context (Theme)
│   ├── i18n/              # Translations
│   ├── navigation/        # Navigation setup
│   ├── screens/           # Main screens
│   │   ├── EpHCalculatorScreen.tsx
│   │   ├── TrackCalculatorScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities (storage, calculations)
├── assets/                # Images, icons, splash
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
└── package.json           # Dependencies
```

### Features by Version

#### Version 1.2.1 (Current)
- Race Events tracker with countdown
- Running Tips & Articles integration
- Enhanced swipe-to-delete for events
- Improved UI and navigation spacing

#### Version 1.2.0
- Pacing Calculator: Time to Pace mode
- Color-coded history badges
- OTA update checker in Settings
- Enhanced history display

#### Version 1.1.0
- History limit increased to 20 records
- FlatList optimization for history
- App name updated to "RunCals Pro"
- UI improvements

#### Version 1.0.0
- Initial release
- EpH Calculator
- Pacing Calculator (formerly 400m Track Calculator)
- Basic history storage (10 records)
- Language and theme support

### Screenshots
(Add screenshots here)

### License
© 2025 RunCals Pro. All rights reserved.

### Contact
For questions or support, contact: admin@runcals.com

### Links
- Website: https://runcals.com
- API Documentation: https://api-articles.runcals.com/docs

---

Built with ❤️ for runners by runners.
