# Wilaya Quota Checker

A Node.js app that monitors Algerian wilaya quotas and notifies you via Telegram when a specific wilaya becomes available.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the checker:
   ```bash
   npm start
   ```

## Configuration

Edit `index.js` to change:
- `TARGET_WILAYA_CODE` - The wilaya code to monitor (default: 41)
- `CHECK_INTERVAL_MINUTES` - How often to check (default: 5 minutes)

## How it works

- Fetches wilaya quota data from `https://adhahi.dz/api/v1/public/wilaya-quotas`
- Checks if the target wilaya has `available: true`
- Sends a Telegram notification when the wilaya becomes available
- Keeps running and checking periodically until the wilaya is available
