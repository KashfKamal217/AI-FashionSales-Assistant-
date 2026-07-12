const express = require("express");
const axios = require("axios");
const router = express.Router();
const { WHATSAPP_VERIFY_TOKEN, N8N_WEBHOOK_URL } = require("../config/env");

// ─── Webhook Verification (GET) ───────────────────────────────────────────────
// Meta calls this once to verify the endpoint
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

// ─── Incoming Messages (POST) → Forward to n8n ────────────────────────────────
// Meta sends messages here; we ACK immediately then forward to n8n for processing
router.post("/webhook/whatsapp", async (req, res) => {
  // ACK immediately — Meta requires 200 within 20 seconds
  res.sendStatus(200);

  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") return;

    const entry = body.entry?.[0];
    const value = entry?.changes?.[0]?.value;

    // Only forward if there's an actual message (ignore status updates)
    if (!value?.messages?.length) return;

    const message = value.messages[0];
    const from = message.from;

    // Only handle text and interactive messages
    if (!["text", "interactive"].includes(message.type)) return;

    console.log(`[WhatsApp] Forwarding message from ${from} → n8n`);

    // Forward the full original payload to n8n
    await axios.post(
      `${N8N_WEBHOOK_URL}/webhook/whatsapp`,
      { body },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

  } catch (error) {
    // Log but never crash — 200 was already sent to Meta
    if (error.code === "ECONNREFUSED") {
      console.error("[WhatsApp] ❌ n8n is not running. Start n8n and import the workflow.");
    } else {
      console.error("[WhatsApp] Forward to n8n error:", error.message);
    }
  }
});

module.exports = router;
