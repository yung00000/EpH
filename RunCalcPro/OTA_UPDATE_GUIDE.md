# OTA (Over-The-Air) Updates Guide

## Current Configuration Status

✅ **Update URL configured**: Your app.json has the correct update URL
✅ **Channels configured**: production and preview channels are set in eas.json
✅ **Runtime version**: Set to use app version (1.2.1)

## How OTA Updates Work

According to [Expo's documentation](https://docs.expo.dev/deploy/send-over-the-air-updates/):

1. **Build** your app with a specific channel (e.g., "production")
2. **Publish** updates to that same channel
3. **Users** force close and reopen the app **twice** to receive the update

## Step-by-Step: Publishing Updates

### 1. Install EAS CLI (if not installed)

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Publish an Update

For **production builds** (Google Play):

```bash
eas update --channel production --message "Bug fixes and improvements"
```

For **preview builds** (testing):

```bash
eas update --channel preview --message "Test update"
```

### 4. Verify Update was Published

```bash
# List updates for production channel
eas update:list --branch production

# View update details
eas update:view [UPDATE_ID]
```

## Important: Channel vs Branch

- **Channel**: Configured in `eas.json` - determines which updates your build receives
- **Branch**: Used when publishing updates - typically matches the channel name

Your configuration:
- Production builds listen to: `production` channel
- Preview builds listen to: `preview` channel

## Testing Updates

1. **Install** your production build from Google Play
2. **Publish** an update: `eas update --channel production --message "Test"`
3. **Force close** the app completely
4. **Reopen** the app (update downloads in background)
5. **Force close** again
6. **Reopen** the app (update applies - you'll see changes)

## Common Issues & Solutions

### Issue 1: "No update available"

**Cause**: Channel mismatch or no update published

**Solution**:
```bash
# Check which channel your build uses
eas build:list --platform android

# Publish to the correct channel
eas update --channel production --message "Update"

# Verify it was published
eas update:list --branch production
```

### Issue 2: Update not applying

**Cause**: Runtime version mismatch

**Solution**:
- Your current runtime version: `1.2.1` (from app version)
- Updates must be published for the same runtime version
- If you change native code, you need a new build (OTA can't update native code)

### Issue 3: Build was created before channel configuration

**Cause**: Your Google Play build was created before adding `"channel": "production"` to eas.json

**Solution**: Rebuild your app with the updated configuration:
```bash
eas build --platform android --profile production
```

Then submit the new build to Google Play.

## What Can Be Updated via OTA

✅ **Can update**:
- JavaScript/TypeScript code
- React components
- Styling changes
- Bug fixes
- New features (JS only)
- Assets (images, fonts)

❌ **Cannot update** (requires new build):
- Native code changes
- New native dependencies
- AndroidManifest.xml changes
- App permissions
- App icon or splash screen

## Automatic Updates

Your app is configured to check for updates automatically on launch:

```json
"updates": {
  "enabled": true,
  "checkAutomatically": "ON_LOAD",
  "fallbackToCacheTimeout": 0,
  "url": "https://u.expo.dev/71a0d103-c75d-42f9-8b9b-44bc1f8fe109"
}
```

## Monitoring Updates

### Check update status

```bash
# List all updates
eas update:list --all

# Check specific channel
eas update:list --branch production

# View specific update
eas update:view [UPDATE_ID]
```

### Delete an update (if needed)

```bash
eas update:delete [UPDATE_ID]
```

## Workflow for Google Play Updates

1. Make JavaScript/styling changes in your code
2. Test locally: `npm start`
3. Publish update: `eas update --channel production --message "Description"`
4. Verify: `eas update:list --branch production`
5. Test on device: Force close app twice to receive update

## Emergency Rollback

If an update causes issues:

```bash
# List updates to find the previous good version
eas update:list --branch production

# Rollback to previous update
eas update --branch production --message "Rollback" --republish [PREVIOUS_UPDATE_ID]
```

## Next Steps

1. **Rebuild** your app if you haven't already with the channel configuration:
   ```bash
   eas build --platform android --profile production
   ```

2. **Deploy** the new build to Google Play

3. **Publish** your first update:
   ```bash
   eas update --channel production --message "Initial update"
   ```

4. **Test** by force closing and reopening the app twice

## Quick Reference Commands

```bash
# Publish update
eas update --channel production --message "Your message"

# List updates
eas update:list --branch production

# View specific update
eas update:view [UPDATE_ID]

# Check build channels
eas build:list --platform android

# Republish/rollback
eas update --branch production --message "Rollback" --republish [UPDATE_ID]
```

## References

- [Expo OTA Updates Documentation](https://docs.expo.dev/deploy/send-over-the-air-updates/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)
