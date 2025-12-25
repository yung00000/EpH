# RunCals Pro

A comprehensive suite of professional calculators for running and cycling performance analysis, available as both a **web application** (FastAPI) and a **mobile app** (React Native Expo).

## 📱 Applications

1. **EpH Calculator** - Calculate Effort Points per Hour for running/cycling
2. **400m Track Calculator** - Specialized calculator for 400m track time and split calculations

## 🚀 Available Platforms

### 🌐 Web Application (FastAPI)
- **Location**: Root directory (`app.py`)
- **Access**: Browser-based web interface
- **Deployment**: Docker or local Python server

### 📱 Mobile Application (React Native Expo)
- **Location**: `RunCalcPro/` directory
- **Platforms**: Android APK, iOS (requires Apple Developer account)
- **Features**: Native mobile experience with OTA updates

---

## 🌐 Web Application (FastAPI)

### Features

#### EpH Calculator
- **Dual Calculation Modes**: Calculate EpH from time or estimate completion time from EpH
- **Bilingual Support**: English and Traditional Chinese interfaces with compact labels (EN/繁)
- **Professional UI**: Modern, responsive design with intuitive user experience
- **Calculation History**: Local storage for tracking previous calculations
- **Real-time Validation**: Input validation and error handling
- **Mobile-First Design**: Compact, space-efficient design optimized for mobile devices

#### 400m Track Calculator
- **Pace Input**: Enter pace in min:sec per km format (e.g., 4:30, 7:00)
- **400m Total Time**: Calculate total time to complete 400m with compact display
- **Split Times**: Calculate split times for 100m, 200m, 300m, and 400m in horizontal layout
- **Race Times**: Calculate 10km, Half Marathon, and Marathon completion times
- **Formula-based**: Uses exact formulas for accurate calculations
- **Professional UI**: Consistent design language with the EpH calculator
- **Calculation History**: Local storage for tracking previous calculations
- **Real-time Validation**: Input validation and error handling
- **Mobile-First Design**: Compact, space-efficient UI optimized for mobile devices

### What is EpH?

EpH (Effort Points per Hour) is a metric that combines distance and elevation gain to measure the intensity of a route. It's calculated as:

```
EpH = (Distance + Elevation/100) / Time
```

Where:
- Distance is in kilometers
- Elevation is in meters
- Time is in hours

### 400m Track Calculator Formulas

The 400m calculator uses the exact formulas:

- **Input**: Pace in min:sec per km (e.g., "4:30")
- **Convert Pace to seconds**: `(minutes * 60) + seconds`
- **400m Total Time**: `pace_seconds * 0.4` (since 400m = 0.4 km)
- **100m Split Time**: `pace_seconds * 0.1` (since 100m = 0.1 km)
- **Split Times**: 
  - 100m: `split_100m`
  - 200m: `split_100m * 2`
  - 300m: `split_100m * 3`
  - 400m: `total_seconds`

### Technology Stack

- **Backend**: FastAPI (Python) with Pydantic v2 validation
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables, mobile-first responsive design
- **Icons**: Font Awesome
- **Server**: Uvicorn (ASGI)
- **Validation**: Pydantic v2 with strict field validation

### Installation & Usage

#### Prerequisites

- Python 3.8+
- pip

#### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd EpH
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the unified application:
```bash
python app.py
```

**Access URLs:**
- EpH Calculator: `http://localhost:8080`
- 400m Track Calculator: `http://localhost:8080/track`

#### Docker Deployment

1. Build the Docker image:
```bash
docker build -t eph-calculator .
```

2. Run the container:
```bash
docker run -p 8080:8080 eph-calculator
```

### API Endpoints

- `GET /`: EpH Calculator interface
- `GET /track`: 400m Track Calculator interface
- `POST /calculate`: Calculate EpH or estimated time
- `POST /track/calculate`: Calculate 400m time and splits from pace
- `GET /health`: Health check endpoint

---

## 📱 Mobile Application (React Native Expo)

### Features

#### EpH Calculator
- ✅ Calculate EpH from distance, elevation, and time
- ✅ Calculate estimated completion time from EpH
- ✅ Default mode: "Calculate EpH" (auto-selected)
- ✅ Bilingual support (English/Traditional Chinese)
- ✅ Dark/Light/Automatic theme support
- ✅ Calculation history with swipe-to-delete (up to 20 records)
- ✅ History count display (X/20 format)
- ✅ Input validation and error handling

#### 400m Track Calculator
- ✅ Calculate 400m time and splits from pace
- ✅ Display split times for 100m, 200m, 300m, 400m
- ✅ Calculate 10km, Half Marathon, and Marathon times
- ✅ Bilingual support (English/Traditional Chinese)
- ✅ Dark/Light/Automatic theme support
- ✅ Calculation history with swipe-to-delete (up to 20 records)
- ✅ History count display (X/20 format)
- ✅ Input validation and error handling

#### Settings Menu
- ✅ Language switching (中/Eng style toggle)
- ✅ Dark/Light mode toggle
- ✅ App version information
- ✅ Contact Us (copy email to clipboard)

#### Additional Features
- ✅ Over-The-Air (OTA) updates via Expo Updates
- ✅ Persistent local storage (AsyncStorage)
- ✅ Native navigation with React Navigation
- ✅ Gesture support (swipe-to-delete)
- ✅ FlatList for optimized history rendering (up to 20 records)
- ✅ Responsive design for all screen sizes

### Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Context API
- **Internationalization**: i18next & react-i18next
- **Storage**: AsyncStorage
- **Build System**: EAS Build (Expo Application Services)
- **Updates**: Expo Updates (OTA)

### Installation & Development

#### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`) for builds
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

#### Quick Start

1. Navigate to the mobile app directory:
```bash
cd RunCalcPro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Test in Expo Go:
   - **Android**: Scan QR code with Expo Go app
   - **iOS**: Scan QR code with Camera app (opens in Expo Go)
   - **Web**: Press `w` in terminal or visit the URL

#### Building for Production

##### Android APK (Cloud Build)

1. Login to EAS:
```bash
eas login
```

2. Configure the project:
```bash
eas build:configure
```

3. Build Android APK:
```bash
eas build --platform android --profile preview
```

The APK will be available for download from Expo's website.

##### Local Development Builds

For local builds (requires Android Studio and JDK), see `RunCalcPro/LOCAL_BUILD_GUIDE.md`.

##### iOS Build

iOS builds require an Apple Developer account. Configure in `app.json` and run:
```bash
eas build --platform ios --profile production
```

### Project Structure

```
RunCalcPro/
├── src/
│   ├── App.tsx                    # Main app with navigation & OTA
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Navigation setup
│   ├── screens/
│   │   ├── EpHCalculatorScreen.tsx # EpH Calculator
│   │   └── TrackCalculatorScreen.tsx # Track Calculator
│   ├── components/
│   │   ├── LanguageSwitcher.tsx   # Language toggle (中/Eng)
│   │   ├── ThemeToggle.tsx        # Theme toggle
│   │   ├── HistorySection.tsx     # History display with swipe-to-delete
│   │   └── Settings.tsx           # Settings modal with gear icon
│   ├── contexts/
│   │   └── ThemeContext.tsx       # Theme context provider
│   ├── utils/
│   │   ├── calculations.ts        # Calculation logic
│   │   └── storage.ts             # AsyncStorage helpers
│   ├── i18n/
│   │   ├── translations.ts        # Translation strings
│   │   └── i18nConfig.ts          # i18n setup
│   └── types/
│       └── index.ts               # TypeScript types
├── app.json                       # Expo config + OTA
├── eas.json                       # EAS Build config
└── package.json                   # Dependencies
```

### Configuration Files

- **`app.json`**: Expo configuration (app name, version, icons, OTA updates)
- **`eas.json`**: EAS Build profiles (development, preview, production)
- **`package.json`**: Dependencies and scripts

### OTA Updates

The app is configured for Over-The-Air (OTA) updates via Expo Updates:

- **Runtime Version**: Based on app version (`1.1.0`)
- **Update Check**: Automatic on app load
- **Fallback**: Uses cached version if update fails

To publish an OTA update:
```bash
eas update --branch preview --message "Update description"
```

### Troubleshooting

#### Expo Go Issues
See `RunCalcPro/EXPO_GO_FIX.md` for common Expo Go compatibility issues and solutions.

#### Build Issues
See `RunCalcPro/LOCAL_BUILD_GUIDE.md` for local build setup and troubleshooting.

#### Common Errors
- **Native module errors**: Some packages require native builds (not available in Expo Go)
- **Network errors**: Use `--tunnel` mode if on different networks
- **Cache issues**: Run `npx expo start --clear` to clear cache

---

## 📋 Usage Examples

### EpH Calculator

#### Calculating EpH
1. Select "Calculate EpH" mode
2. Enter distance in kilometers
3. Enter elevation gain in meters
4. Enter completion time (format: hh:mm:ss or hh:mm)
5. Click "Calculate"

#### Estimating Completion Time
1. Select "Calculate Estimated Time" mode
2. Enter distance in kilometers
3. Enter elevation gain in meters
4. Enter target EpH value
5. Click "Calculate"

### 400m Track Calculator

#### Calculating 400m Time and Splits
1. Enter your pace in min:sec per km format (e.g., 4:30, 7:00)
2. Click "Calculate"
3. View results:
   - Total time for 400m
   - Split times for 100m, 200m, 300m, and 400m
   - 10km, Half Marathon, and Marathon completion times

#### Pace Format Examples
- `4:30` = 4 minutes 30 seconds per kilometer
- `7:00` = 7 minutes per kilometer
- `5:15` = 5 minutes 15 seconds per kilometer

---

## 🎨 UI/UX Features

### Web Application
- **Language Switching**: Toggle between English and Traditional Chinese (EN/繁)
- **Theme Toggle**: Switch between light and dark modes
- **Input Validation**: Real-time validation with helpful error messages
- **Calculation History**: View and reuse previous calculations
- **Mobile-First Design**: Compact, space-efficient design optimized for mobile devices
- **Professional UI**: Clean, modern interface with smooth animations

### Mobile Application
- **Language Switching**: Single button toggle (中/Eng) with active language highlighted
- **Theme Toggle**: Light/Dark/Automatic mode support
- **Settings Menu**: Gear icon with modal containing all settings
- **Swipe-to-Delete**: Swipe left on history items to delete individually
- **Native Navigation**: Smooth transitions between screens
- **Responsive Design**: Adapts to all screen sizes
- **Contact Us**: Copy email address (`admin@runcals.com`) to clipboard

---

## 🧪 Testing

### Web Application
```bash
# Test the unified application
python test.py
```

### Mobile Application
```bash
# Run in development mode
cd RunCalcPro
npx expo start

# Run tests (if configured)
npm test
```

---

## 📦 Dependencies

### Web Application
See `requirements.txt` for Python dependencies.

### Mobile Application
See `RunCalcPro/package.json` for Node.js dependencies.

Key dependencies:
- `expo`: ~54.0.30
- `react-native`: 0.81.5
- `react`: 19.1.0
- `@react-navigation/native`: ^7.1.26
- `i18next`: ^25.7.3
- `expo-clipboard`: ^8.0.8
- `react-native-gesture-handler`: ~2.28.0

---

## 📝 Version History

### Version 1.1.0 (Current)
- ✅ Mobile app migration to React Native Expo
- ✅ App name updated to "RunCals Pro"
- ✅ OTA updates configured
- ✅ Settings menu with gear icon
- ✅ Swipe-to-delete for history items
- ✅ History limit increased to 20 records (from 10)
- ✅ History count display (X/20 format)
- ✅ FlatList implementation for optimized history rendering
- ✅ Default mode: "Calculate EpH" auto-selected
- ✅ Enhanced 400m calculator with race times
- ✅ Clipboard support for contact email
- ✅ Improved UI/UX for both platforms

### Previous Versions
- Unified FastAPI application
- Mobile-first web design
- Pydantic v2 validation
- Enhanced error handling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Support

For questions or support:
- **Email**: admin@runcals.com
- **Issues**: Please open an issue in the repository

---

**Version**: 1.1.0  
**Status**: Production Ready  
**Last Updated**: December 2024
