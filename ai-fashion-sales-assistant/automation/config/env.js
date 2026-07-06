require("dotenv").config();

module.exports = {
  // Server
  PORT: process.env.PORT || 3000,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Instagram
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_VERIFY_TOKEN: process.env.INSTAGRAM_VERIFY_TOKEN,
  INSTAGRAM_PAGE_ID: process.env.INSTAGRAM_PAGE_ID,

  // WhatsApp
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI,
};
