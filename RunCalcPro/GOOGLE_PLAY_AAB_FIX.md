# 🔐 Fix: Debug-Signed AAB Error

## Problem

**Error:** "You uploaded an APK or Android App Bundle that was signed in debug mode. You need to sign your APK or Android App Bundle in release mode."

**Cause:** The locally built AAB (`app-release.aab`) is signed with a **debug keystore**, which Google Play Console doesn't accept.

---

## ✅ Solution: Build Production-Signed AAB

You need to build a **production-signed AAB** using EAS Build. This will:
- ✅ Sign with a production keystore
- ✅ Be accepted by Google Play Console
- ✅ Be ready for store submission

---

## 🚀 Step-by-Step: Build Production AAB

### Step 1: Ensure You're Logged In to EAS

```powershell
cd RunCalcPro
eas whoami
```

If not logged in:
```powershell
eas login
```

### Step 2: Build Production AAB

```powershell
eas build --platform android --profile production
```

**What happens:**
1. Your code is uploaded to Expo servers
2. Build runs in the cloud (10-20 minutes)
3. AAB is signed with production keystore
4. You'll get a download link

**Expected output:**
```
✔ Build started
✔ Build ID: xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✔ Build URL: https://expo.dev/accounts/your-account/projects/runcals-pro/builds/xxxxxx

Waiting for build to complete...
```

### Step 3: Download Production AAB

**Option A: From Terminal**
After build completes, you'll see:
```
✔ Build finished
✔ Download: https://expo.dev/artifacts/eas/xxxxx/app-release.aab
```

**Option B: From Expo Dashboard**
1. Go to: https://expo.dev
2. Navigate to your project → **Builds**
3. Find the completed build
4. Click **Download** button

### Step 4: Upload to Google Play Console

1. Go to Google Play Console
2. Navigate to your app → **Release** → **Production** (or **Testing**)
3. Click **Create new release**
4. Upload the **production-signed AAB** from EAS Build
5. ✅ Should work without errors!

---

## 🔄 Alternative: Local Production Build (Advanced)

If you want to build locally with production signing, you need to:

### 1. Create Production Keystore

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Save the keystore file and passwords securely!

### 2. Configure Signing in `android/app/build.gradle`

```gradle
android {
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
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

### 3. Set Environment Variables

```powershell
$env:KEYSTORE_PASSWORD = "your-store-password"
$env:KEY_ALIAS = "my-key-alias"
$env:KEY_PASSWORD = "your-key-password"
```

### 4. Build Signed AAB

```powershell
cd RunCalcPro\android
.\gradlew.bat bundleRelease
```

**However:** EAS Build is **recommended** because it:
- ✅ Manages keystores securely
- ✅ Handles signing automatically
- ✅ Provides consistent builds
- ✅ No local keystore management needed

---

## 📊 Comparison: Debug vs Production AAB

| Feature | Debug AAB (Local) | Production AAB (EAS) |
|---------|-------------------|----------------------|
| **Signing** | Debug keystore | Production keystore |
| **Google Play** | ❌ Rejected | ✅ Accepted |
| **Testing** | ✅ Works locally | ✅ Works everywhere |
| **Keystore Management** | Manual | Automatic (EAS) |
| **Build Time** | 2-3 minutes | 10-20 minutes |

---

## 🎯 Recommended Workflow

### For Development/Testing:
```powershell
# Build debug AAB locally (fast)
npm run android:build:aab
```

### For Google Play Submission:
```powershell
# Build production AAB with EAS (properly signed)
eas build --platform android --profile production
```

---

## ✅ Quick Fix Summary

**To fix the Google Play error:**

1. **Build production AAB:**
   ```powershell
   cd RunCalcPro
   eas build --platform android --profile production
   ```

2. **Download the AAB** from Expo dashboard

3. **Upload to Google Play Console** - should work without errors!

---

## 🔐 Keystore Management with EAS

**First time building?** EAS will:
- Automatically generate a production keystore
- Store it securely on Expo servers
- Use it for all future production builds
- You don't need to manage it manually

**To view your keystore info:**
```powershell
eas credentials
```

---

## 📝 Notes

- **Never commit keystores to Git** - EAS handles this securely
- **Keep your EAS account secure** - it has access to your production keystore
- **Use EAS Build for production** - it's the recommended approach
- **Local builds are fine for testing** - but not for Google Play

---

**Ready to build?** Run `eas build --platform android --profile production` now! 🚀

