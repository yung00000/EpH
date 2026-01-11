# OTA Update Not Working - Fix Summary

## Most Likely Cause

Your **Google Play build was created BEFORE the channel was added** to `eas.json`.

According to [Expo's documentation](https://docs.expo.dev/deploy/send-over-the-air-updates/), the build must have a channel configured to receive updates.

## How to Verify

Run this command:

```bash
eas build:list --platform android --limit 5
```

Look at your production build (the one on Google Play). Check the **Channel** column:

- ❌ **Empty/No channel** → This is the problem! Build predates channel configuration
- ❌ **Wrong channel** → Build listening to wrong channel
- ✅ **"production"** → Channel is correct, look for other issues

## The Fix

### Step 1: Rebuild with channel configuration

```bash
# Install EAS CLI if needed
npm install -g eas-cli

# Login
eas login

# Rebuild with updated eas.json (now includes channel: "production")
eas build --platform android --profile production
```

### Step 2: Submit to Google Play

After the build completes (10-20 minutes):

1. Download the AAB from Expo dashboard
2. Upload to Google Play Console (closed testing track)
3. Wait for approval

### Step 3: Publish an update

After the new build is live on Google Play:

```bash
eas update --channel production --message "Test update"
```

### Step 4: Test

On a device with the NEW build from Google Play:

1. Force close the app
2. Reopen (update downloads in background)
3. Force close again
4. Reopen (update applies)

## Using npm scripts (easier)

We've added helpful scripts to package.json:

```bash
# Build production AAB
npm run eas:build:aab

# Publish update to production
npm run eas:update:production "Your update message"

# List published updates
npm run eas:update:list

# Check builds
npm run eas:build:list
```

## Why This Happens

When `eas.json` didn't have the `"channel": "production"` field, builds were created without a channel assignment. These builds cannot receive OTA updates because they don't know which channel to listen to.

**Before (no OTA updates):**
```json
"production": {
  "distribution": "store",
  "android": {
    "buildType": "app-bundle"
  }
  // No channel specified!
}
```

**After (OTA updates work):**
```json
"production": {
  "distribution": "store",
  "android": {
    "buildType": "app-bundle"
  },
  "channel": "production"  // ← Now specified!
}
```

## What Updates Can Do

✅ **OTA updates CAN update:**
- JavaScript code
- React components  
- Styling
- Images and assets
- Bug fixes

❌ **OTA updates CANNOT update:**
- Native code
- AndroidManifest.xml
- App permissions
- New native modules

## Alternative: Test with preview build first

Before rebuilding production, test OTA updates work with preview:

```bash
# Build preview APK with channel
eas build --platform android --profile preview

# Install APK on device

# Publish update
eas update --channel preview --message "Test"

# Test on device (force close twice)
```

If preview updates work, then production will too after rebuild.

## Timeline

1. **Today**: Rebuild and upload to Google Play → 30 minutes
2. **1-3 days**: Google Play review and approval
3. **After approval**: Publish OTA updates anytime (instant delivery)

## Need More Help?

See detailed guides:
- `OTA_UPDATE_GUIDE.md` - Complete OTA setup guide
- `verify-ota-setup.md` - Step-by-step verification

Or run diagnostics:
```bash
eas build:list --platform android
eas update:list --branch production
```

## Quick Start

If you just want to fix it now:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
# Wait for build, then upload to Google Play
# After live, publish updates with:
eas update --channel production --message "First update"
```
