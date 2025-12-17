# Build Instructions - Phase 10

## Step 10.1: Login to Expo & Configure EAS Build

### 1. Login to Expo Account

Run this command in your terminal (in the `RunCalcPro` directory):

```bash
eas login
```

**What happens:**
- It will prompt for your email/username
- You'll be asked to authenticate (browser may open)
- Once logged in, you're ready to configure builds

### 2. Configure EAS Build

After logging in, run:

```bash
eas build:configure
```

**What this does:**
- Links your project to your Expo account
- Updates `app.json` with your project ID
- Confirms build configuration

**Note:** The `eas.json` file is already configured with:
- Preview profile (for APK testing)
- Production profile (for APK release)
- Android APK build type

---

## Step 10.2: Build Android APK

Once Step 10.1 is complete, run:

```bash
eas build --platform android --profile preview
```

**What happens:**
1. Your code is uploaded to Expo servers
2. Build runs in the cloud (10-20 minutes)
3. You'll get a build URL to track progress
4. When complete, download APK from Expo dashboard

**Expected output:**
```
✔ Build started
✔ Build ID: xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✔ Build URL: https://expo.dev/accounts/your-account/projects/your-project/builds/xxxxxx

Waiting for build to complete...
```

**After build completes:**
1. Go to https://expo.dev
2. Navigate to your project → Builds
3. Download the APK file
4. Install on Android device

---

## Step 10.3: Skip iOS Build

iOS build is **skipped** for now (no Apple Developer account).

You can do this later when you have:
- Apple Developer Program account ($99/year)
- Run: `eas build --platform ios --profile production`

---

## Quick Commands Summary

```bash
# 1. Login (run this first)
eas login

# 2. Configure (after login)
eas build:configure

# 3. Build Android APK
eas build --platform android --profile preview

# 4. Check build status
eas build:list

# 5. View build details
eas build:view [BUILD_ID]
```

---

## Troubleshooting

### If login fails:
- Make sure you have an Expo account (free tier is fine)
- Try: `eas login --help` for other login options
- Visit: https://expo.dev/signup to create account

### If build fails:
- Check build logs in Expo dashboard
- Verify `app.json` has correct package name
- Ensure all dependencies are installed: `npm install`

### If APK won't install:
- Enable "Install from unknown sources" on Android device
- Check Android version compatibility
- Verify APK file downloaded completely

---

## Next Steps After Build

1. **Test APK** on Android device
2. **Test all features** (calculators, language, theme, history)
3. **Verify calculations** match web app
4. **Publish OTA update** when needed: `eas update --branch production --message "Update description"`

---

**Ready to proceed?** Run `eas login` first! 🚀

