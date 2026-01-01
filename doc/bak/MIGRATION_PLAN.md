# React Native Expo Migration Plan
## RunCalc Pro - FastAPI to React Native Conversion

**Project:** EpH Calculator Suite → React Native Expo App  
**Goal:** Convert web app to mobile app with Android APK, iOS app, and OTA updates  
**Current Status:** FastAPI web application  
**Target:** React Native Expo application  

---

## 📋 Pre-Migration Checklist

### Prerequisites Verification
- [ ] Expo.dev free tier account confirmed ✅
- [ ] Node.js installed (v18+ recommended)
- [ ] npm or yarn installed
- [ ] Git repository initialized
- [ ] Backup of current FastAPI project

---

## 🗂️ Phase 1: Project Setup & Structure

### Step 1.1: Initialize Expo Project
**Action:** Create new Expo TypeScript project  
**Location:** New directory `RunCalcPro/` (separate from current FastAPI project)  
**Command:**
```bash
npx create-expo-app RunCalcPro --template blank-typescript
cd RunCalcPro
```

**Files Created:**
- `package.json`
- `tsconfig.json`
- `app.json`
- `App.tsx`
- `babel.config.js`

**Confirmation Required:** ✅ Proceed with Step 1.1?

---

### Step 1.2: Install Dependencies
**Action:** Install required npm packages  
**Dependencies:**
- Navigation: `@react-navigation/native`, `@react-navigation/stack`
- Screen support: `react-native-screens`, `react-native-safe-area-context`
- Storage: `@react-native-async-storage/async-storage`
- Updates: `expo-updates`
- Localization: `expo-localization`, `i18next`, `react-i18next`
- TypeScript types: `@types/react`, `@types/react-native`

**Command:**
```bash
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-updates expo-localization i18next react-i18next
npm install --save-dev @types/react @types/react-native
```

**Confirmation Required:** ✅ Proceed with Step 1.2?

---

### Step 1.3: Create Project Structure
**Action:** Create folder structure for organized code  
**Structure:**
```
RunCalcPro/
├── src/
│   ├── App.tsx                 # Main app entry
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Navigation setup
│   ├── screens/
│   │   ├── EpHCalculatorScreen.tsx
│   │   └── TrackCalculatorScreen.tsx
│   ├── components/
│   │   ├── CalculatorCard.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── HistorySection.tsx
│   ├── utils/
│   │   ├── calculations.ts    # Calculation logic
│   │   └── storage.ts          # AsyncStorage helpers
│   ├── i18n/
│   │   ├── translations.ts     # Translation strings
│   │   └── i18nConfig.ts       # i18n configuration
│   └── types/
│       └── index.ts            # TypeScript types
├── assets/                     # Images, icons
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
└── package.json
```

**Confirmation Required:** ✅ Proceed with Step 1.3?

---

## 🔧 Phase 2: Core Configuration Files

### Step 2.1: Configure app.json
**Action:** Set up Expo app configuration with OTA updates  
**Features:**
- App name: "RunCalc Pro"
- Version: 1.1.0
- iOS bundle identifier
- Android package name
- OTA updates configuration
- Runtime version policy

**Confirmation Required:** ✅ Proceed with Step 2.1?

---

### Step 2.2: Configure EAS Build (eas.json)
**Action:** Create EAS Build configuration for Android APK and iOS  
**Profiles:**
- `development`: For development builds
- `preview`: For Android APK testing
- `production`: For app store releases

**Confirmation Required:** ✅ Proceed with Step 2.2?

---

## 💻 Phase 3: Core Logic & Utilities

### Step 3.1: Create Calculation Utilities
**Action:** Port calculation logic from Python to TypeScript  
**File:** `src/utils/calculations.ts`  
**Functions:**
- `hmsToHours()` - Convert time string to hours
- `hoursToHms()` - Convert hours to time string
- `calculateEph()` - Calculate EpH from distance, elevation, time
- `calculateTime()` - Calculate time from distance, elevation, EpH
- `parsePace()` - Parse pace string (M:SS format)
- `calculateTrackTimes()` - Calculate 400m splits
- `formatTime()` - Format seconds as time string

**Confirmation Required:** ✅ Proceed with Step 3.1?

---

### Step 3.2: Create Storage Utilities
**Action:** Create AsyncStorage helpers for history persistence  
**File:** `src/utils/storage.ts`  
**Functions:**
- `saveHistory()` - Save calculation history
- `loadHistory()` - Load calculation history
- `clearHistory()` - Clear calculation history
- `saveLanguage()` - Save language preference
- `loadLanguage()` - Load language preference

**Confirmation Required:** ✅ Proceed with Step 3.2?

---

### Step 3.3: Create TypeScript Types
**Action:** Define TypeScript interfaces and types  
**File:** `src/types/index.ts`  
**Types:**
- `Language` - 'en' | 'zh'
- `CalculationMode` - 'eph' | 'time'
- `EpHHistoryItem` - EpH calculation history item
- `TrackHistoryItem` - Track calculation history item
- `EpHResult` - EpH calculation result
- `TrackResult` - Track calculation result

**Confirmation Required:** ✅ Proceed with Step 3.3?

---

## 🌐 Phase 4: Internationalization (i18n)

### Step 4.1: Create Translation Files
**Action:** Port translations from Python to TypeScript  
**File:** `src/i18n/translations.ts`  
**Content:**
- English translations (en)
- Traditional Chinese translations (zh)
- EpH calculator strings
- Track calculator strings
- Common UI strings

**Confirmation Required:** ✅ Proceed with Step 4.1?

---

### Step 4.2: Configure i18n System
**Action:** Set up i18next configuration  
**File:** `src/i18n/i18nConfig.ts`  
**Features:**
- Language detection
- Language switching
- Fallback language
- AsyncStorage persistence

**Confirmation Required:** ✅ Proceed with Step 4.2?

---

## 🧩 Phase 5: Reusable Components

### Step 5.1: Create LanguageSwitcher Component
**Action:** Build language switcher component  
**File:** `src/components/LanguageSwitcher.tsx`  
**Features:**
- Toggle between EN/繁
- Save preference to AsyncStorage
- Update app language immediately

**Confirmation Required:** ✅ Proceed with Step 5.1?

---

### Step 5.2: Create ThemeToggle Component
**Action:** Build dark/light theme toggle  
**File:** `src/components/ThemeToggle.tsx`  
**Features:**
- Toggle dark/light mode
- Use system theme detection
- Save preference

**Confirmation Required:** ✅ Proceed with Step 5.2?

---

### Step 5.3: Create HistorySection Component
**Action:** Build reusable history display component  
**File:** `src/components/HistorySection.tsx`  
**Features:**
- Display calculation history
- Click to fill form
- Clear history button
- Empty state message

**Confirmation Required:** ✅ Proceed with Step 5.3?

---

## 📱 Phase 6: Screen Components

### Step 6.1: Create EpH Calculator Screen
**Action:** Build EpH calculator screen  
**File:** `src/screens/EpHCalculatorScreen.tsx`  
**Features:**
- Mode selection (EpH calculation / Time estimation)
- Input fields (distance, elevation, time/eph)
- Calculation logic
- Result display
- Error handling
- History integration
- Language support
- Theme support

**Confirmation Required:** ✅ Proceed with Step 6.1?

---

### Step 6.2: Create Track Calculator Screen
**Action:** Build 400m track calculator screen  
**File:** `src/screens/TrackCalculatorScreen.tsx`  
**Features:**
- Pace input (M:SS format)
- 400m total time calculation
- Split times (100m, 200m, 300m, 400m)
- Result display
- Error handling
- History integration
- Language support
- Theme support

**Confirmation Required:** ✅ Proceed with Step 6.2?

---

## 🧭 Phase 7: Navigation Setup

### Step 7.1: Create App Navigator
**Action:** Set up React Navigation  
**File:** `src/navigation/AppNavigator.tsx`  
**Features:**
- Stack navigator
- Two screens (EpH Calculator, Track Calculator)
- Header configuration
- Navigation between screens

**Confirmation Required:** ✅ Proceed with Step 7.1?

---

### Step 7.2: Update Main App Component
**Action:** Integrate navigation and providers  
**File:** `src/App.tsx`  
**Features:**
- NavigationContainer
- SafeAreaProvider
- OTA update check
- Theme provider
- Language provider

**Confirmation Required:** ✅ Proceed with Step 7.2?

---

## 🎨 Phase 8: Styling & Theming

### Step 8.1: Create Theme System
**Action:** Implement dark/light theme system  
**Features:**
- Color palette for light mode
- Color palette for dark mode
- Theme context/provider
- StyleSheet utilities

**Confirmation Required:** ✅ Proceed with Step 8.1?

---

### Step 8.2: Apply Consistent Styling
**Action:** Style all components consistently  
**Features:**
- Match web app design
- Mobile-optimized spacing
- Responsive layouts
- Touch-friendly buttons

**Confirmation Required:** ✅ Proceed with Step 8.2?

---

## 🔄 Phase 9: OTA Updates Setup

### Step 9.1: Configure OTA Updates
**Action:** Set up Expo Updates for OTA  
**Files:**
- Update `app.json` with updates configuration
- Add update check in `App.tsx`
- Configure runtime version

**Features:**
- Automatic update check on app launch
- Manual update check option
- Update notification
- Error handling

**Confirmation Required:** ✅ Proceed with Step 9.1?

---

### Step 9.2: Test OTA Update Flow
**Action:** Test update mechanism  
**Steps:**
1. Build app with EAS
2. Publish update with `eas update`
3. Verify update downloads
4. Test update installation

**Confirmation Required:** ✅ Proceed with Step 9.2?

---

## 🏗️ Phase 10: Build Configuration

### Step 10.1: Configure EAS Build
**Action:** Set up EAS Build for cloud builds  
**Steps:**
1. Run `eas login` (if not already logged in)
2. Run `eas build:configure`
3. Review generated `eas.json`
4. Configure Android package name
5. Configure iOS bundle identifier (can skip if not doing iOS)

**Confirmation Required:** ✅ Proceed with Step 10.1?

---

### Step 10.2: Build Android APK ⭐ **APK CREATION STEP**
**Action:** Build Android APK file for installation  
**Command:**
```bash
eas build --platform android --profile preview
```

**What Happens:**
1. Code is uploaded to Expo servers
2. Build runs in cloud (10-20 minutes)
3. APK file is generated
4. Download link provided in Expo dashboard
5. Download APK and install on Android device

**Expected Result:**
- ✅ APK file downloadable from Expo dashboard
- ✅ Can install directly on Android devices
- ✅ No Google Play account needed
- ✅ Ready for testing and distribution

**See:** `ANDROID_APK_GUIDE.md` for detailed APK build instructions

**Confirmation Required:** ✅ Proceed with Step 10.2?

---

### Step 10.3: Build iOS App ⚠️ **OPTIONAL - SKIP FOR NOW**
**Action:** Build iOS app (requires Apple Developer account)  
**Status:** ⚠️ **SKIP** - No Apple Developer account yet

**Note:** 
- Requires Apple Developer Program ($99/year)
- Can be done later when you have Apple Developer account
- Focus on Android APK for now

**Command (for future reference):**
```bash
eas build --platform ios --profile production
```

**Confirmation Required:** ⚠️ Skip iOS build? (Yes - we'll do Android APK only)

---

## 🧪 Phase 11: Testing & Quality Assurance

### Step 11.1: Local Testing
**Action:** Test app in Expo Go  
**Steps:**
1. Run `npx expo start`
2. Scan QR code with Expo Go app
3. Test EpH calculator
4. Test Track calculator
5. Test language switching
6. Test theme switching
7. Test history functionality
8. Test error handling

**Confirmation Required:** ✅ Proceed with Step 11.1?

---

### Step 11.2: Device Testing
**Action:** Test on physical devices  
**Steps:**
1. Install APK on Android device
2. Test all features
3. Test on different screen sizes
4. Test dark/light themes
5. Test language switching
6. Verify calculations accuracy

**Confirmation Required:** ✅ Proceed with Step 11.2?

---

### Step 11.3: Calculation Verification
**Action:** Verify calculations match Python backend  
**Steps:**
1. Test EpH calculations
2. Test time calculations
3. Test track calculations
4. Compare with web app results
5. Verify edge cases

**Confirmation Required:** ✅ Proceed with Step 11.3?

---

## 📦 Phase 12: Deployment & Documentation

### Step 12.1: Create README
**Action:** Create comprehensive README  
**File:** `README.md`  
**Content:**
- Project description
- Installation instructions
- Development setup
- Build instructions
- OTA update instructions
- Project structure

**Confirmation Required:** ✅ Proceed with Step 12.1?

---

### Step 12.2: Create Migration Notes
**Action:** Document migration process  
**File:** `MIGRATION_NOTES.md`  
**Content:**
- Changes from web app
- Known differences
- Future improvements
- Troubleshooting guide

**Confirmation Required:** ✅ Proceed with Step 12.2?

---

## ✅ Final Checklist

### Pre-Launch Verification
- [ ] All features working
- [ ] Calculations accurate
- [ ] UI/UX polished
- [ ] Dark mode working
- [ ] Language switching working
- [ ] History persistence working
- [ ] Error handling complete
- [ ] OTA updates configured
- [ ] Android APK built and tested
- [ ] README complete
- [ ] Code commented
- [ ] No console errors

### Launch Readiness
- [ ] App tested on multiple devices
- [ ] Performance optimized
- [ ] Memory leaks checked
- [ ] Battery usage acceptable
- [ ] User experience validated
- [ ] Ready for distribution

---

## 📊 Progress Tracking

**Total Steps:** 25  
**Completed:** 0  
**In Progress:** 0  
**Pending:** 25  

**Current Phase:** Pre-Migration  
**Next Step:** Step 1.1 - Initialize Expo Project

---

## 🚀 Quick Start Commands

```bash
# Development
npx expo start

# Build Android APK
eas build --platform android --profile preview

# Publish OTA Update
eas update --branch production --message "Update description"

# Check EAS status
eas whoami
```

---

## 📝 Notes

- Keep FastAPI backend separate (can be used for future API integration)
- Mobile app will be standalone (no backend required)
- All calculations done client-side
- History stored locally on device
- OTA updates allow instant bug fixes without app store

## 📱 Android APK Creation

**APK Build Location:** Phase 10, Step 10.2  
**Command:** `eas build --platform android --profile preview`  
**Result:** APK file from Expo dashboard  
**See:** `ANDROID_APK_GUIDE.md` for complete APK build guide

**iOS Build:** Optional - Skip for now (requires Apple Developer account)

---

**Last Updated:** 2024-12-XX  
**Status:** Ready for Review  
**Next Action:** User confirmation to proceed with Phase 1

