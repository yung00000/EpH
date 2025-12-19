# 🏗️ Local Development Build Guide

## Overview

This guide explains how to build and test your app **locally** without using Expo Go. This is useful when:
- Expo Go has compatibility issues
- You want to test native features
- You need faster iteration during development
- You want to test production-like builds locally

---

## 🎯 Option 1: Local Development Build (Recommended)

### Prerequisites

1. **Android Studio** installed
   - Download: https://developer.android.com/studio
   - Install Android SDK (API 33 or higher)
   - Install Android SDK Build-Tools

2. **Java JDK** (version 17 recommended)
   - Check: `java -version`
   - Download if needed: https://adoptium.net/

3. **Environment Variables** (Windows)
   ```powershell
   # Add to System Environment Variables:
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   JAVA_HOME=C:\Program Files\Java\jdk-17
   
   # Add to PATH:
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %JAVA_HOME%\bin
   ```

4. **Android Emulator or Physical Device**
   - Create AVD in Android Studio, OR
   - Enable USB Debugging on physical device

### Build Steps

#### Step 1: Prebuild Native Code (First Time Only)

```bash
cd RunCalcPro
npx expo prebuild
```

**What this does:**
- Generates `android/` and `ios/` native folders
- Creates native project structure
- Configures native dependencies

**Note:** You can delete these folders later - they'll be regenerated when needed.

#### Step 2: Build and Run Development Build

```bash
# Build and install on connected device/emulator
npx expo run:android
```

**Or use the npm script:**
```bash
npm run android:build
```

**What happens:**
1. Compiles native code locally
2. Builds APK
3. Installs on connected device/emulator
4. Starts Metro bundler
5. Launches app

**First build takes 5-10 minutes** (downloads dependencies)
**Subsequent builds are faster** (1-2 minutes)

#### Step 3: Build Release APK (For Testing)

```bash
# Build release APK
npx expo run:android --variant release
```

**Or use the npm script:**
```bash
npm run android:build:release
```

**APK Location:**
```
RunCalcPro/android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Option 2: EAS Build Local (Alternative)

This uses EAS Build but runs on your local machine instead of Expo servers.

### Prerequisites

Same as Option 1, plus:
- Docker Desktop installed (for EAS Build local)
- More disk space (~10GB)

### Build Steps

```bash
# Build locally using EAS
eas build --local --platform android --profile preview
```

**Or use the npm script:**
```bash
npm run eas:build:local
```

**What happens:**
1. Downloads build environment (Docker image)
2. Builds APK in isolated environment
3. Outputs APK file

**Note:** First build downloads Docker image (~5GB), takes longer.

---

## 🔄 Development Workflow

### Daily Development

1. **Start Metro Bundler:**
   ```bash
   npm start
   ```

2. **In another terminal, build and run:**
   ```bash
   npm run android:build
   ```

3. **Make code changes:**
   - JavaScript/TypeScript changes: Reload app (press `r` in Metro or shake device)
   - Native changes: Rebuild (`npm run android:build`)

### Testing Release Builds

```bash
# Build release APK
npm run android:build:release

# APK location:
# RunCalcPro/android/app/build/outputs/apk/release/app-release.apk

# Install on device:
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 🐛 Troubleshooting

### Error: "SDK location not found"
```bash
# Set ANDROID_HOME environment variable
# Windows PowerShell:
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
```

### Error: "Java version mismatch"
- Ensure Java JDK 17 is installed
- Check: `java -version`
- Update `JAVA_HOME` environment variable

### Error: "Gradle build failed"
```bash
# Clean build
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Error: "Device not found"
```bash
# Check connected devices
adb devices

# If no devices, start emulator:
# Android Studio → AVD Manager → Start emulator
```

### Error: "Metro bundler not starting"
```bash
# Clear cache and restart
npx expo start --clear
```

---

## 📊 Comparison: Expo Go vs Local Build

| Feature | Expo Go | Local Build |
|---------|---------|-------------|
| **Setup Time** | Instant | 10-15 min (first time) |
| **Build Time** | N/A | 1-2 min (dev), 3-5 min (release) |
| **Native Features** | Limited | Full access |
| **Custom Native Code** | ❌ No | ✅ Yes |
| **Production Testing** | ❌ No | ✅ Yes |
| **OTA Updates** | ✅ Yes | ✅ Yes |
| **Debugging** | Basic | Full native debugging |

---

## ✅ Quick Commands Reference

```bash
# Development build (installs and runs)
npm run android:build

# Release build (creates APK)
npm run android:build:release

# Start Metro bundler only
npm start

# Clean build
cd android && ./gradlew clean && cd ..

# Check connected devices
adb devices

# Install APK manually
adb install android/app/build/outputs/apk/release/app-release.apk

# View logs
adb logcat | grep ReactNativeJS
```

---

## 🎯 Recommended Approach

**For Development:**
- Use `npx expo run:android` for local development builds
- Faster iteration than cloud builds
- Full native feature access

**For Testing/Release:**
- Use `eas build --platform android --profile preview` for cloud builds
- Consistent build environment
- No local setup required
- Shareable download links

**For Production:**
- Use `eas build --platform android --profile production`
- Optimized builds
- Signed APKs/AABs
- Ready for distribution

---

## 📝 Next Steps

1. ✅ Install Android Studio and Java JDK
2. ✅ Set up environment variables
3. ✅ Run `npx expo prebuild` (first time)
4. ✅ Run `npm run android:build` to test
5. ✅ Build release APK when ready

**Need help?** Check Expo docs: https://docs.expo.dev/build/introduction/

