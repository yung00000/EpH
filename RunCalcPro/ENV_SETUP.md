# Environment Variables Setup

This app uses environment variables to securely store API credentials.

## Setup Instructions

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace `your_api_key_here` with your actual API key:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://api-articles.runcals.com
   EXPO_PUBLIC_API_KEY=your_actual_api_key_here
   ```

## Environment Variables

- `EXPO_PUBLIC_API_BASE_URL`: The base URL for the articles API
- `EXPO_PUBLIC_API_KEY`: Your API key for authentication

## Important Notes

- The `.env` file is already included in `.gitignore` and will not be committed to version control
- Never commit your actual API keys to the repository
- For Expo builds, you'll need to configure these as secrets in EAS

## EAS Build Configuration

For production builds with EAS, add your environment variables as secrets:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_KEY --value your_actual_api_key_here
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value https://api-articles.runcals.com
```

Then update `eas.json` to include the environment variables in your build profile.

