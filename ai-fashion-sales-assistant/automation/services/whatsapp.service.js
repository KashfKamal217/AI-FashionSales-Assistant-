const axios = require("axios");
const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = require("../config/env");

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

// ─── Send a plain text message ────────────────────────────────────────────────
async function sendMessage(to, text) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[WhatsApp] Message sent to ${to}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("[WhatsApp] sendMessage error:", error.response?.data || error.message);
    throw error;
  }
}

// ─── Send an interactive button message ──────────────────────────────────────
async function sendButtonMessage(to, bodyText, buttons) {
  // buttons: [{ id: "btn_1", title: "Women's Collection" }, ...]  (max 3)
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: bodyText },
          action: {
            buttons: buttons.map((btn) => ({
              type: "reply",
              reply: { id: btn.id, title: btn.title },
            })),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[WhatsApp] Button message sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error("[WhatsApp] sendButtonMessage error:", error.response?.data || error.message);
    // Fallback to plain text if interactive fails
    return sendMessage(to, bodyText);
  }
}

// ─── Send a list message ──────────────────────────────────────────────────────
async function sendListMessage(to, headerText, bodyText, buttonText, sections) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: headerText },
          body: { text: bodyText },
          action: {
            button: buttonText,
            sections,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[WhatsApp] List message sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error("[WhatsApp] sendListMessage error:", error.response?.data || error.message);
    return sendMessage(to, bodyText);
  }
}

// ─── Send order confirmation message ─────────────────────────────────────────
async function sendOrderConfirmation(to, order) {
  const { orderId, customerName, products, total, address, paymentMethod } = order;

  const productList = products
    .map((p) => `• ${p.name} (${p.size}) x${p.qty} — Rs ${(p.price * p.qty).toLocaleString()}`)
    .join("\n");

  const confirmationText =
    `✅ *Order Confirmed!*\n\n` +
    `📋 Order ID: *${orderId}*\n` +
    `👤 Name: ${customerName}\n\n` +
    `🛍️ *Items:*\n${productList}\n\n` +
    `💰 Total: *Rs ${total.toLocaleString()}*\n` +
    `💳 Payment: ${paymentMethod}\n` +
    `📍 Deliver to: ${address}\n\n` +
    `🚚 Expected delivery: 2-5 working days\n\n` +
    `Thank you for shopping with *FashionHub* ❤️\n` +
    `Track your order by replying: *Track ${orderId}*`;

  return sendMessage(to, confirmationText);
}

// ─── Send product catalog ─────────────────────────────────────────────────────
async function sendProductCatalog(to) {
  const catalogText =
    `🛍️ *FashionHub Product Catalog*\n\n` +
    `👗 *Women's Collection*\n` +
    `• Black Embroidered Maxi — Rs 4,999\n` +
    `• Black Chiffon Dress — Rs 5,499\n` +
    `• Beige Lawn Suit — Rs 3,499\n` +
    `• Floral Summer Dress — Rs 3,999\n\n` +
    `👔 *Men's Collection*\n` +
    `• White Casual Shirt — Rs 1,999\n` +
    `• Navy Blue Kurta — Rs 2,499\n` +
    `• Black Slim Jeans — Rs 2,999\n\n` +
    `👟 *Accessories & Shoes*\n` +
    `• White Sneakers — Rs 2,799\n` +
    `• Leather Belt — Rs 999\n\n` +
    `💬 Reply with any product name to order, or ask me anything!`;

  return sendMessage(to, catalogText);
}

// ─── Mark message as read ─────────────────────────────────────────────────────
async function markAsRead(messageId) {
  try {
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[WhatsApp] markAsRead error:", error.message);
  }
}

module.exports = {
  sendMessage,
  sendButtonMessage,
  sendListMessage,
  sendOrderConfirmation,
  sendProductCatalog,
  markAsRead,
};
