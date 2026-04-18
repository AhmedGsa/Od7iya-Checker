const axios = require('axios');
const https = require('https');

require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TARGET_WILAYA_CODE = '41';
const CHECK_INTERVAL_SECONDS = 10;

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

async function checkWilayaAvailability() {
  try {
    const response = await axios.get('https://adhahi.dz/api/v1/public/wilaya-quotas', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const wilayas = response.data;
    const targetWilaya = wilayas.find(w => w.wilayaCode === TARGET_WILAYA_CODE);

    if (!targetWilaya) {
      console.log(`[${new Date().toISOString()}] Wilaya ${TARGET_WILAYA_CODE} not found in response`);
      return false;
    }

    console.log(`[${new Date().toISOString()}] Wilaya ${TARGET_WILAYA_CODE} (${targetWilaya.wilayaNameFr}): available = ${targetWilaya.available}`);

    if (targetWilaya.available === true) {
      await sendTelegramNotification(targetWilaya);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error checking wilaya availability:`, error.message);
    return false;
  }
}

async function sendTelegramNotification(wilaya) {
  const message = `✅ *Wilaya Alert!*

Wilaya ${wilaya.wilayaCode} - ${wilaya.wilayaNameFr} / ${wilaya.wilayaNameAr}
is now *AVAILABLE*!`;

  try {
    await axios.post(TELEGRAM_API_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log(`[${new Date().toISOString()}] Telegram notification sent!`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error sending Telegram notification:`, error.message);
  }
}

async function main() {
  console.log('========================================');
  console.log('Wilaya Quota Checker Started');
  console.log(`Target Wilaya Code: ${TARGET_WILAYA_CODE}`);
  console.log(`Check Interval: Every ${CHECK_INTERVAL_SECONDS} seconds`);
  console.log('========================================');

  const isAvailable = await checkWilayaAvailability();

  if (isAvailable) {
    console.log('Target wilaya is available! Notification sent. Exiting.');
    process.exit(0);
  } else {
    console.log(`Target wilaya is not available. Will check again in ${CHECK_INTERVAL_SECONDS} seconds...`);
    
    setInterval(async () => {
      const available = await checkWilayaAvailability();
      if (available) {
        console.log('Target wilaya is available! Notification sent. Exiting.');
        process.exit(0);
      }
    }, CHECK_INTERVAL_SECONDS * 1000);
  }
}

main();
