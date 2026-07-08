const express = require("express");
const axios = require("axios");
const router = express.Router();
const { INSTAGRAM_VERIFY_TOKEN, N8N_WEBHOOK_URL } = require("../config/env");

// ─── Webhook Verification (GET) ───────────────────────────────────────────────
// Instagram calls this once to verify the webhook endpoint is valid
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

// ─── Incoming Messages (POST) → Forward to n8n ────────────────────────────────
// Meta sends DMs here; we immediately ACK with 200, then forward to n8n
router.post("/webhook/instagram", async (req, res) => {
  // ACK immediately — Meta requires a 200 within 20 seconds or it retries
  res.sendStatus(200);

  try {
    const body = req.body;

    // Basic sanity check before forwarding
    if (body.object !== "instagram") return;

    const entry = body.entry?.[0];
    const messagingEvent = entry?.messaging?.[0];

    if (!messagingEvent) return;
    if (messagingEvent.message?.is_echo) return; // ignore own messages

    const senderId = messagingEvent.sender?.id;
    if (!senderId) return;

    const hasText = messagingEvent.message?.text || messagingEvent.postback?.payload;
    if (!hasText) return;

    console.log(`[Instagram] Forwarding message from ${senderId} → n8n`);

    // Forward the full original payload to n8n
    await axios.post(
      `${N8N_WEBHOOK_URL}/webhook/instagram`,
      { body },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

  } catch (error) {
    // Log but never crash — 200 was already sent to Meta
    if (error.code === "ECONNREFUSED") {
      console.error("[Instagram] ❌ n8n is not running. Start n8n and import the workflow.");
    } else {
      console.error("[Instagram] Forward to n8n error:", error.message);
    }
  }
});

module.exports = router;
