# 📱 Android APK Build Guide

## 🎯 Goal: Create Android APK File

This guide focuses on building an **Android APK** file that you can:
- ✅ Install directly on Android devices
- ✅ Share with users for testing
- ✅ Distribute without Google Play Store
- ✅ Update via OTA (Over-The-Air) updates

**Note:** iOS build is optional and can be done later when you have Apple Developer account.

---

## 🚀 Quick APK Build Process

### Step 1: Complete App Development (Phases 1-9)
- Build the React Native app
- Test in Expo Go
- Ensure all features work

### Step 2: Configure EAS Build (Phase 10, Step 10.1)
```bash
# Login to Expo account
eas login

# Configure build settings
eas build:configure
```

This creates `eas.json` with build profiles.

### Step 3: Build Android APK (Phase 10, Step 10.2) ⭐ **THIS IS WHERE APK IS CREATED**
```bash
# Build Android APK (Preview/Testing version)
eas build --platform android --profile preview
```

**What happens:**
1. Expo uploads your code to their servers
2. Build runs in the cloud (takes 10-20 minutes)
3. APK file is generated
4. You get download link from Expo dashboard
5. Download APK and install on Android device

### Step 4: Download & Install APK
1. Go to https://expo.dev
2. Navigate to your project → Builds
3. Download the APK file
4. Transfer to Android device
5. Install APK (enable "Install from unknown sources" if needed)

---

## 📋 Detailed APK Build Steps

### Phase 10: Build Configuration

#### Step 10.1: Configure EAS Build ✅
**Location in Plan:** Phase 10, Step 10.1  
**Action:** Set up EAS Build configuration

**Commands:**
```bash
# 1. Login to Expo (if not already logged in)
eas login

# 2. Configure build settings
eas build:configure
```

**What this does:**
- Creates `eas.json` file
- Sets up build profiles (preview, production)
- Configures Android package name
- Links project to your Expo account

**Files Created:**
- `eas.json` - Build configuration

**Confirmation Required:** ✅ Proceed with Step 10.1?

---

#### Step 10.2: Build Android APK ⭐ **APK CREATION STEP**
**Location in Plan:** Phase 10, Step 10.2  
**Action:** Build Android APK file

**Command:**
```bash
eas build --platform android --profile preview
```

**What happens:**
1. ✅ Code is bundled and uploaded
2. ✅ Build starts on Expo servers
3. ✅ APK is compiled (10-20 minutes)
4. ✅ APK file is ready for download
5. ✅ You receive notification/email

**Result:**
- APK file available in Expo dashboard
- Direct download link provided
- Can install on any Android device
- No Google Play account needed

**Expected Output:**
```
✔ Build started
✔ Build ID: xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✔ Build URL: https://expo.dev/accounts/your-account/projects/your-project/builds/xxxxxx

Waiting for build to complete...
```

**After Build Completes:**
- Go to Expo dashboard
- Find your build
- Click "Download" to get APK file

**Confirmation Required:** ✅ Proceed with Step 10.2?

---

#### Step 10.3: Build iOS App ⚠️ **OPTIONAL - SKIP FOR NOW**
**Location in Plan:** Phase 10, Step 10.3  
**Status:** ⚠️ **SKIP** - Requires Apple Developer account ($99/year)

**Can be done later when you:**
- Have Apple Developer account
- Want to publish to App Store
- Need iOS version

**Confirmation Required:** ⚠️ Skip iOS build? (Yes - we'll do Android APK only)

---

## 📊 APK Build Flow Diagram

```
1. Develop App (Phases 1-9)
   ↓
2. Configure EAS (Step 10.1)
   ↓
3. Run Build Command (Step 10.2) ⭐
   ↓
4. Wait for Build (10-20 min)
   ↓
5. Download APK from Expo Dashboard
   ↓
6. Install APK on Android Device
   ↓
7. Test App
   ↓
8. Publish OTA Updates (when needed)
```

---

## 🔧 APK Build Configuration

### eas.json (Created in Step 10.1)
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"  // ← This creates APK file
      }
    },
    "production": {
      "android": {
        "buildType": "apk"  // ← Or "aab" for Play Store
      }
    }
  }
}
```

### app.json (Android Configuration)
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.runcalspro",  // ← Your app ID
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    }
  }
}
```

---

## ✅ APK Build Checklist

Before building APK:
- [ ] App is fully developed and tested
- [ ] All features working in Expo Go
- [ ] EAS Build configured (`eas.json` exists)
- [ ] Android package name set in `app.json`
- [ ] Expo account logged in (`eas login`)

Build APK:
- [ ] Run `eas build --platform android --profile preview`
- [ ] Wait for build to complete (10-20 min)
- [ ] Download APK from Expo dashboard
- [ ] Install APK on Android device
- [ ] Test all features

After APK works:
- [ ] Share APK with testers
- [ ] Set up OTA updates for future updates
- [ ] Consider Google Play Store submission (optional)

---

## 🎯 Summary

**APK Creation Location:** Phase 10, Step 10.2  
**Command:** `eas build --platform android --profile preview`  
**Result:** Downloadable APK file from Expo dashboard  
**Time:** 10-20 minutes build time  
**Cost:** Free (with Expo free tier)  

**iOS Build:** Optional, can be done later when you have Apple Developer account.

---

## 📝 Next Steps

1. **Complete Phases 1-9** (App development)
2. **Proceed to Phase 10, Step 10.1** (Configure EAS)
3. **Proceed to Phase 10, Step 10.2** (Build APK) ⭐
4. **Skip Phase 10, Step 10.3** (iOS - do later)

**Ready to start?** Begin with Phase 1! 🚀

