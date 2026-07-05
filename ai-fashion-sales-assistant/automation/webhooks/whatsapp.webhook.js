const express = require("express");
const router = express.Router();
const { WHATSAPP_VERIFY_TOKEN } = require("../config/env");
const { generateReply, getUpsell, PRODUCTS } = require("../services/openai.service");
const {
  sendMessage,
  sendProductCatalog,
  sendOrderConfirmation,
  markAsRead,
} = require("../services/whatsapp.service");

// In-memory conversation history (replace with DB in production)
const conversationHistory = {};

// In-memory order sessions (replace with DB)
const orderSessions = {};

// ─── Webhook Verification (GET) ───────────────────────────────────────────────
router.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verified ✅");
    return res.status(200).send(challenge);
  }

  console.warn("[WhatsApp] Webhook verification failed ❌");
  res.sendStatus(403);
});

// ─── Incoming Messages (POST) ─────────────────────────────────────────────────
router.post("/webhook/whatsapp", async (req, res) => {
  // Always respond 200 immediately to avoid WhatsApp retry
  res.sendStatus(200);

  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") return;

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length) return;

    const message = value.messages[0];
    const from = message.from; // customer's phone number
    const messageId = message.id;

    // Mark message as read
    await markAsRead(messageId);

    let userText = "";

    // Handle different message types
    if (message.type === "text") {
      userText = message.text.body;
    } else if (message.type === "interactive") {
      // Button reply or list reply
      userText =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        "";
    } else if (message.type === "image" || message.type === "audio") {
      await sendMessage(from, "Thank you for the media! 😊 Could you please describe what you're looking for in text? I'll be happy to help!");
      return;
    } else {
      return; // unsupported message type
    }

    if (!userText.trim()) return;

    console.log(`[WhatsApp] Received from ${from}: "${userText}"`);

    // ── Special commands ───────────────────────────────────────────────────
    if (/^catalog$/i.test(userText.trim())) {
      await sendProductCatalog(from);
      return;
    }

    // ── Order collection flow ──────────────────────────────────────────────
    const session = orderSessions[from];

    if (session) {
      const result = await handleOrderFlow(from, userText, session);
      if (result === "done") delete orderSessions[from];
      return;
    }

    // Trigger order flow when user confirms they want to buy
    if (/^(place order|buy now|order now|i want to order|order karna hai)$/i.test(userText.trim())) {
      orderSessions[from] = { step: "ask_product" };
      await sendMessage(from, "Great! Let's place your order 🛒\n\nPlease tell me which product you'd like to order:");
      return;
    }

    // ── Maintain conversation history ──────────────────────────────────────
    if (!conversationHistory[from]) conversationHistory[from] = [];
    conversationHistory[from].push({ role: "user", content: userText });

    // ── Generate AI reply ──────────────────────────────────────────────────
    const { reply, intent } = await generateReply(userText, conversationHistory[from]);

    // Save assistant reply to history
    conversationHistory[from].push({ role: "assistant", content: reply });

    // Keep history at max 10 messages
    if (conversationHistory[from].length > 10) {
      conversationHistory[from] = conversationHistory[from].slice(-10);
    }

    await sendMessage(from, reply);

    // ── Auto upsell after product search ──────────────────────────────────
    if (intent === "product_search") {
      const selectedProduct = PRODUCTS.find((p) =>
        userText.toLowerCase().includes(p.name.toLowerCase().split(" ")[0])
      );
      const upsell = getUpsell(selectedProduct);
      if (upsell) {
        setTimeout(async () => {
          await sendMessage(from, upsell);
        }, 1500);
      }
    }

  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error.message);
  }
});

// ─── Order Collection Flow ────────────────────────────────────────────────────
async function handleOrderFlow(from, userText, session) {
  switch (session.step) {
    case "ask_product":
      session.product = userText;
      session.step = "ask_size";
      await sendMessage(from, `Got it! 📦 *${userText}*\n\nWhat size would you like?\n(S / M / L / XL / XXL)`);
      break;

    case "ask_size":
      session.size = userText.toUpperCase();
      session.step = "ask_name";
      await sendMessage(from, `Size *${session.size}* selected! ✅\n\nPlease share your *full name*:`);
      break;

    case "ask_name":
      session.customerName = userText;
      session.step = "ask_address";
      await sendMessage(from, `Thank you, *${userText}*! 😊\n\nPlease share your *complete delivery address* (City, Street, House No.):`);
      break;

    case "ask_address":
      session.address = userText;
      session.step = "ask_payment";
      await sendMessage(
        from,
        `📍 Address saved!\n\nHow would you like to pay?\n\n1️⃣ Cash on Delivery (COD)\n2️⃣ Bank Transfer\n3️⃣ EasyPaisa / JazzCash\n\nReply with 1, 2, or 3:`
      );
      break;

    case "ask_payment": {
      const paymentOptions = { "1": "Cash on Delivery", "2": "Bank Transfer", "3": "EasyPaisa/JazzCash" };
      session.paymentMethod = paymentOptions[userText] || userText;
      session.step = "confirm";

      // Mock product price lookup
      const product = PRODUCTS.find((p) =>
        p.name.toLowerCase().includes(session.product.toLowerCase())
      ) || { price: 0 };

      session.total = product.price || 0;
      const orderId = "ORD-" + Date.now().toString().slice(-6);
      session.orderId = orderId;

      // Send confirmation
      await sendOrderConfirmation(from, {
        orderId,
        customerName: session.customerName,
        products: [{ name: session.product, size: session.size, qty: 1, price: session.total }],
        total: session.total,
        address: session.address,
        paymentMethod: session.paymentMethod,
      });

      return "done";
    }

    default:
      delete orderSessions[from];
      return "done";
  }

  orderSessions[from] = session;
  return "continue";
}

module.exports = router;
