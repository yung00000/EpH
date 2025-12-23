# 📦 Local AAB Build Guide

## Overview

**AAB (Android App Bundle)** is the format required for Google Play Store submission. Unlike APK, AAB allows Google Play to generate optimized APKs for different device configurations.

---

## 🚀 Quick Build Commands

### Method 1: Using Gradle Directly (Recommended)

```powershell
cd RunCalcPro\android
.\gradlew bundleRelease
```

**AAB Location:**
```
RunCalcPro\android\app\build\outputs\bundle\release\app-release.aab
```

### Method 2: Using Expo CLI

```powershell
cd RunCalcPro
npx expo run:android --variant release --no-build-cache
```

**Note:** This builds APK by default. For AAB, use Gradle directly (Method 1).

---

## 📝 Step-by-Step Instructions

### Prerequisites

✅ Same as APK build:
- Java 17 installed
- Android SDK configured (`ANDROID_HOME` set or `local.properties` exists)
- Gradle memory increased (already done in `gradle.properties`)

### Step 1: Clean Previous Builds (Optional but Recommended)

```powershell
cd RunCalcPro\android
.\gradlew clean
cd ..
```

### Step 2: Build AAB

```powershell
cd RunCalcPro\android
.\gradlew bundleRelease
```

**What happens:**
1. Compiles all native code
2. Bundles JavaScript and assets
3. Creates optimized AAB file
4. Signs with debug keystore (for testing)

**Build time:** 5-10 minutes (first time), 2-3 minutes (subsequent)

### Step 3: Find Your AAB

After successful build:
```
RunCalcPro\android\app\build\outputs\bundle\release\app-release.aab
```

### Step 4: Verify AAB

Check file exists and size:
```powershell
Get-Item "RunCalcPro\android\app\build\outputs\bundle\release\app-release.aab" | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

**Expected size:** ~15-25 MB (smaller than APK because it's a bundle, not a complete app)

---

## 🔐 Signing for Production

### Current Build: Debug Signed

The AAB built with `bundleRelease` is signed with a **debug keystore**. This is fine for:
- Testing locally
- Internal testing
- Development builds

### For Google Play Submission: Production Signed

You need a **production keystore** signed AAB. Options:

#### Option A: Use EAS Build (Recommended)
```powershell
eas build --platform android --profile production
```
This automatically signs with your production keystore.

#### Option B: Sign Locally (Advanced)

1. **Create keystore** (if you don't have one):
```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure signing in `android/app/build.gradle`**:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... other config
        }
    }
}
```

3. **Build signed AAB**:
```powershell
.\gradlew bundleRelease
```

---

## 📊 APK vs AAB Comparison

| Feature | APK | AAB |
|---------|-----|-----|
| **Format** | Complete app | App bundle |
| **Size** | ~30-50 MB | ~15-25 MB |
| **Google Play** | ❌ Not accepted | ✅ Required |
| **Testing** | ✅ Direct install | ⚠️ Needs conversion |
| **Optimization** | One size fits all | Device-specific |

---

## 🧪 Testing AAB Locally

AAB files cannot be installed directly on devices. To test:

### Option 1: Convert AAB to APK (Using bundletool)

1. **Download bundletool:**
   - https://github.com/google/bundletool/releases
   - Download `bundletool-all-x.x.x.jar`

2. **Generate APK set:**
```powershell
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app-release.apks --ks=path/to/keystore --ks-pass=pass:password --ks-key-alias=alias
```

3. **Install APK:**
```powershell
java -jar bundletool.jar install-apks --apks=app-release.apks
```

### Option 2: Upload to Google Play Internal Testing

1. Upload AAB to Google Play Console
2. Create internal testing track
3. Add testers
4. Download and test

### Option 3: Use EAS Build (Easier)

```powershell
eas build --platform android --profile production --local
```

---

## 🛠️ Adding npm Script for Convenience

Add this to `package.json`:

```json
{
  "scripts": {
    "android:build:aab": "cd android && gradlew bundleRelease && cd .."
  }
}
```

Then run:
```powershell
npm run android:build:aab
```

---

## 🐛 Troubleshooting

### Error: "Task 'bundleRelease' not found"
- Make sure you're in the `android` directory
- Run: `.\gradlew tasks` to see available tasks

### Error: "OutOfMemoryError"
- Already fixed in `gradle.properties` with increased memory
- If still occurs, increase further:
  ```
  org.gradle.jvmargs=-Xmx6144m -XX:MaxMetaspaceSize=2048m
  ```

### Error: "SDK location not found"
- Ensure `android/local.properties` exists with:
  ```
  sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
  ```

### AAB file not found
- Check build completed successfully (no errors)
- Look in: `android/app/build/outputs/bundle/release/`
- Run `.\gradlew clean` and rebuild

---

## ✅ Quick Reference

```powershell
# Build AAB
cd RunCalcPro\android
.\gradlew bundleRelease

# Clean build
.\gradlew clean bundleRelease

# Check AAB location
Get-Item "app\build\outputs\bundle\release\app-release.aab"

# Build for specific architecture only (faster)
.\gradlew bundleRelease -PreactNativeArchitectures=arm64-v8a
```

---

## 🎯 For Google Play Submission

**Recommended approach:**
1. Build AAB locally for testing: `.\gradlew bundleRelease`
2. Use EAS Build for production: `eas build --platform android --profile production`
3. Download signed AAB from Expo dashboard
4. Upload to Google Play Console

**Why?** EAS Build handles:
- Production keystore management
- Proper signing
- Build optimization
- Consistent build environment

---

## 📝 Summary

**To build AAB locally:**
```powershell
cd RunCalcPro\android
.\gradlew bundleRelease
```

**AAB file location:**
```
RunCalcPro\android\app\build\outputs\bundle\release\app-release.aab
```

**For Google Play:** Use `eas build --platform android --profile production` for production-signed AAB.

---

**Ready to build?** Run `.\gradlew bundleRelease` now! 🚀

