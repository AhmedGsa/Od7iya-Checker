# Wilaya Quota Checker

A Node.js app that monitors Algerian wilaya quotas and notifies you via Telegram when a specific wilaya becomes available.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment:
   - Copy `.env.example` to `.env` (or create one)
   - Add your Telegram bot token and chat ID

3. Run the checker:
   ```bash
   npm start
   ```

## Configuration

Edit `.env` to configure:

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID |
| `TARGET_WILAYA_CODE` | The wilaya code to monitor (default: 41) |
| `CHECK_INTERVAL_SECONDS` | How often to check (default: 10 seconds) |

## How it works

- Fetches wilaya quota data from `https://adhahi.dz/api/v1/public/wilaya-quotas`
- Checks if the target wilaya has `available: true`
- Sends a Telegram notification when the wilaya becomes available
- Keeps running and checking periodically until the wilaya is available
