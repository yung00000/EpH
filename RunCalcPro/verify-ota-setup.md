# OTA Update Setup Verification

Run these commands to verify your OTA update setup is correct:

## 1. Check EAS CLI is installed

```bash
eas --version
```

Expected: Should show version number (e.g., `eas-cli/0.x.x`)

If not installed:
```bash
npm install -g eas-cli
```

## 2. Check if logged in

```bash
eas whoami
```

Expected: Should show your Expo username

If not logged in:
```bash
eas login
```

## 3. Check your builds and their channels

```bash
eas build:list --platform android --limit 5
```

Look for:
- **Channel** column - should show "production" for your Google Play build
- **Runtime Version** - should match your app version (1.2.1)

⚠️ **CRITICAL**: If your Google Play build shows:
- No channel or empty channel → You need to rebuild
- Different channel → You need to rebuild
- Build was created before you added channel to eas.json → You need to rebuild

## 4. Check published updates

```bash
eas update:list --branch production
```

Expected: 
- Should show updates published to the production branch
- If empty → No updates have been published yet

## 5. Verify app.json configuration

Check your `RunCalcPro/app.json`:

```json
"updates": {
  "enabled": true,
  "checkAutomatically": "ON_LOAD",
  "fallbackToCacheTimeout": 0,
  "url": "https://u.expo.dev/71a0d103-c75d-42f9-8b9b-44bc1f8fe109"
}
```

✅ All fields are present and correct

## 6. Verify eas.json configuration

Check your `RunCalcPro/eas.json`:

```json
"production": {
  "distribution": "store",
  "android": {
    "buildType": "app-bundle",
    "autoIncrement": true
  },
  "channel": "production"  // ← THIS IS CRITICAL
}
```

✅ Channel is set to "production"

## Diagnosis

### Scenario 1: Build is OLD (created before channel was added)

**Symptoms:**
- Update function says "No update available"
- `eas build:list` shows no channel or old build date

**Solution:**
```bash
# Rebuild with channel configuration
eas build --platform android --profile production

# After build completes, submit to Google Play
```

### Scenario 2: No updates published

**Symptoms:**
- `eas update:list --branch production` is empty
- Update function says "No update available"

**Solution:**
```bash
# Publish an update
eas update --channel production --message "Test update"
```

### Scenario 3: Update published but not received

**Symptoms:**
- `eas update:list --branch production` shows updates
- App still shows "No update available"

**Solution:**
1. Check runtime version matches: `eas build:list` vs `app.json` version
2. Force close app and reopen TWICE (updates apply on second launch)
3. Check device has internet connection
4. Check update was published to correct channel

## Quick Test Workflow

1. Make a small visible change (e.g., change a text color)
2. Publish update:
   ```bash
   eas update --channel production --message "Test color change"
   ```
3. Verify it published:
   ```bash
   eas update:list --branch production
   ```
4. On device with production build:
   - Force close app
   - Reopen (update downloads)
   - Force close again
   - Reopen (update applies - you should see the color change)

## Most Likely Issue

If your Google Play build was uploaded **before December 2024** (before channels were added to eas.json), you need to:

1. Rebuild: `eas build --platform android --profile production`
2. Upload new build to Google Play
3. Wait for new build to be approved and published
4. Then OTA updates will work for that new build

## Need Help?

Run this command to see detailed build info:
```bash
eas build:view [BUILD_ID]
```

Get your build ID from:
```bash
eas build:list --platform android
```
