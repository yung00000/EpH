# Google Play Submission Guide

## Prerequisites

1. **Google Play Developer Account**: Sign up at https://play.google.com/console/signup
2. **Create App in Google Play Console**: Create your app at least once manually (required by Google Play API)
3. **Google Service Account Key**: Create and download a JSON key file from Google Cloud Console

## Step 1: Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in the details and create
6. Go to **Keys** tab > **Add Key** > **Create new key** > Choose **JSON**
7. Download the JSON file and save it as `google-service-account.json` in your project root

## Step 2: Configure eas.json

The `eas.json` file is already configured with:
```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

**Important**: Make sure `google-service-account.json` is in your project root directory.

## Step 3: Build Your App

Build a production Android app:

```bash
eas build --platform android --profile production
```

This will create an APK or AAB file. Wait for the build to complete.

## Step 4: Download Build (Optional)

If you need to download the build manually, use the build ID as a **positional argument**:

```bash
# List recent builds to find your build ID
eas build:list --platform android

# Download using build ID (positional argument, not a flag)
eas build:download 53590455-627b-4cc0-ad65-ccf45fcda83f --platform android
```

**Note**: The build ID should be passed as a positional argument, not with `-b` or `--build-id` flags.

## Step 5: Submit to Google Play

Submit your latest production build to Google Play:

```bash
eas submit --platform android --profile production
```

This command will:
- Use the latest build from the `production` profile
- Upload to the `internal` track (as configured in `eas.json`)
- Use the service account key for authentication

## Alternative: Submit Without Profile

If you want to submit interactively without a profile:

```bash
eas submit --platform android
```

This will prompt you to:
- Select a build
- Choose a track (internal, alpha, beta, production)
- Provide service account credentials if not configured

## Track Options

In `eas.json`, you can change the track to:
- `"internal"` - Internal testing
- `"alpha"` - Alpha testing
- `"beta"` - Beta testing  
- `"production"` - Production release

## Troubleshooting

### Error: "Unexpected arguments"
- Make sure you're using the correct command syntax
- For download: `eas build:download [build-id] --platform android` (build ID as positional argument)
- For submit: `eas submit --platform android --profile production` (no `--track` flag)

### Error: Service account key not found
- Ensure `google-service-account.json` exists in project root
- Check the path in `eas.json` matches the file location

### Error: App not found in Google Play Console
- You must manually create the app in Google Play Console at least once before using EAS Submit
- Go to Google Play Console and create your app first

## Next Steps

After submission:
1. Go to Google Play Console
2. Navigate to your app > **Testing** > **Internal testing** (or your chosen track)
3. Review the submission
4. Add release notes if needed
5. Roll out to testers or publish

