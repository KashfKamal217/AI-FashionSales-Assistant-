const express = require("express");
const router = express.Router();
const { INSTAGRAM_VERIFY_TOKEN } = require("../config/env");
const { generateReply, getUpsell, PRODUCTS } = require("../services/openai.service");
const { sendMessage, sendWelcomeMenu, getUserProfile } = require("../services/instagram.service");

// In-memory conversation history (replace with DB in production)
const conversationHistory = {};

// ─── Webhook Verification (GET) ───────────────────────────────────────────────
router.get("/webhook/instagram", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === INSTAGRAM_VERIFY_TOKEN) {
    console.log("[Instagram] Webhook verified ✅");
    return res.status(200).send(challenge);
  }

  console.warn("[Instagram] Webhook verification failed ❌");
  res.sendStatus(403);
});

// ─── Incoming Messages (POST) ─────────────────────────────────────────────────
router.post("/webhook/instagram", async (req, res) => {
  // Always respond 200 immediately to prevent Instagram retries
  res.sendStatus(200);

  try {
    const body = req.body;

    if (body.object !== "instagram") return;

    const entry = body.entry?.[0];
    const messagingEvent = entry?.messaging?.[0];

    if (!messagingEvent) return;

    const senderId = messagingEvent.sender?.id;
    const message = messagingEvent.message;
    const postback = messagingEvent.postback;

    if (!senderId) return;

    let userText = "";

    // Handle postback (quick reply button tapped)
    if (postback) {
      userText = postback.payload || postback.title || "";
    } else if (message) {
      if (message.is_echo) return; // ignore our own messages

      if (message.text) {
        userText = message.text;
      } else if (message.attachments) {
        // Handle image/audio attachments
        await sendMessage(
          senderId,
          "Thank you for the media! 😊 Please describe what you're looking for and I'll find the perfect outfit for you!"
        );
        return;
      }
    }

    if (!userText.trim()) return;

    console.log(`[Instagram] Received from ${senderId}: "${userText}"`);

    // ── Handle quick reply payloads ────────────────────────────────────────
    const payloadReplies = {
      NEW_ARRIVALS: "🆕 *New Arrivals at FashionHub!*\n\n• Floral Summer Dress — Rs 3,999\n• Navy Blue Kurta — Rs 2,499\n• Black Embroidered Maxi — Rs 4,999\n\nType any product name to learn more or order! 🛍️",
      WOMENS: "👗 *Women's Collection:*\n\n• Black Embroidered Maxi — Rs 4,999\n• Black Chiffon Dress — Rs 5,499\n• Beige Lawn Suit — Rs 3,499\n• Floral Summer Dress — Rs 3,999\n\nWhich one interests you?",
      MENS: "👔 *Men's Collection:*\n\n• White Casual Shirt — Rs 1,999\n• Navy Blue Kurta — Rs 2,499\n• Black Slim Jeans — Rs 2,999\n\nWhich one interests you?",
      TRACK_ORDER: "📦 Please share your *Order ID* to track your package.\n\nFormat: ORD-XXXXXX",
      DELIVERY: "🚚 *Delivery Info:*\n• Standard: 3-5 working days\n• Express: 1-2 working days\n• Charges: Rs 150 (city) / Rs 200 (other cities)\n• FREE delivery on orders above Rs 5,000!",
    };

    if (payloadReplies[userText]) {
      await sendMessage(senderId, payloadReplies[userText]);
      return;
    }

    // ── Greeting — send welcome menu ───────────────────────────────────────
    if (/^(hi|hello|hey|salam|helo|hii)$/i.test(userText.trim())) {
      await sendWelcomeMenu(senderId);
      return;
    }

    // ── Maintain conversation history ──────────────────────────────────────
    if (!conversationHistory[senderId]) conversationHistory[senderId] = [];
    conversationHistory[senderId].push({ role: "user", content: userText });

    // ── Generate AI reply ──────────────────────────────────────────────────
    const { reply, intent } = await generateReply(userText, conversationHistory[senderId]);

    // Save assistant reply to history
    conversationHistory[senderId].push({ role: "assistant", content: reply });

    // Keep history lean
    if (conversationHistory[senderId].length > 10) {
      conversationHistory[senderId] = conversationHistory[senderId].slice(-10);
    }

    await sendMessage(senderId, reply);

    // ── Auto upsell ────────────────────────────────────────────────────────
    if (intent === "product_search") {
      const selectedProduct = PRODUCTS.find((p) =>
        userText.toLowerCase().includes(p.name.toLowerCase().split(" ")[0])
      );
      const upsell = getUpsell(selectedProduct);
      if (upsell) {
        setTimeout(async () => {
          await sendMessage(senderId, upsell);
        }, 1500);
      }
    }

  } catch (error) {
    console.error("[Instagram] Webhook error:", error.message);
  }
});

module.exports = router;
