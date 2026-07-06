const axios = require("axios");
const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_PAGE_ID } = require("../config/env");

const IG_API_URL = "https://graph.facebook.com/v19.0";

// ─── Send a DM reply to a user ────────────────────────────────────────────────
async function sendMessage(recipientId, text) {
  try {
    const response = await axios.post(
      `${IG_API_URL}/${INSTAGRAM_PAGE_ID}/messages`,
      {
        recipient: { id: recipientId },
        message: { text },
        messaging_type: "RESPONSE",
      },
      {
        params: { access_token: INSTAGRAM_ACCESS_TOKEN },
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(`[Instagram] Message sent to ${recipientId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("[Instagram] sendMessage error:", error.response?.data || error.message);
    throw error;
  }
}

// ─── Send a quick reply (button options) ─────────────────────────────────────
async function sendQuickReplies(recipientId, text, quickReplies) {
  // quickReplies: [{ title: "Women's Collection", payload: "WOMENS" }, ...]
  try {
    const response = await axios.post(
      `${IG_API_URL}/${INSTAGRAM_PAGE_ID}/messages`,
      {
        recipient: { id: recipientId },
        message: {
          text,
          quick_replies: quickReplies.map((qr) => ({
            content_type: "text",
            title: qr.title,
            payload: qr.payload,
          })),
        },
        messaging_type: "RESPONSE",
      },
      {
        params: { access_token: INSTAGRAM_ACCESS_TOKEN },
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(`[Instagram] Quick replies sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    console.error("[Instagram] sendQuickReplies error:", error.response?.data || error.message);
    // Fallback to plain text
    return sendMessage(recipientId, text);
  }
}

// ─── Send welcome message with menu options ───────────────────────────────────
async function sendWelcomeMenu(recipientId) {
  return sendQuickReplies(
    recipientId,
    "Welcome to FashionHub ❤️\n\nThank you for contacting us!\nHow may I help you today?",
    [
      { title: "New Arrivals 🆕", payload: "NEW_ARRIVALS" },
      { title: "Women's Collection 👗", payload: "WOMENS" },
      { title: "Men's Collection 👔", payload: "MENS" },
      { title: "Order Tracking 📦", payload: "TRACK_ORDER" },
      { title: "Delivery Info 🚚", payload: "DELIVERY" },
    ]
  );
}

// ─── Get user profile info ────────────────────────────────────────────────────
async function getUserProfile(userId) {
  try {
    const response = await axios.get(`${IG_API_URL}/${userId}`, {
      params: {
        fields: "name,profile_pic",
        access_token: INSTAGRAM_ACCESS_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error("[Instagram] getUserProfile error:", error.response?.data || error.message);
    return { name: "Customer", profile_pic: null };
  }
}

module.exports = {
  sendMessage,
  sendQuickReplies,
  sendWelcomeMenu,
  getUserProfile,
};
