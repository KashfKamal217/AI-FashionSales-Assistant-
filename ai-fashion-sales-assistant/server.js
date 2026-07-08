const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const axios = require("axios");
const { PORT, N8N_BASE_URL } = require("./automation/config/env");

const instagramWebhook = require("./automation/webhooks/instagram.webhook");
const whatsappWebhook = require("./automation/webhooks/whatsapp.webhook");

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "✅ FashionHub AI Sales Assistant is running",
    version: "2.0.0",
    architecture: "Express → n8n → OpenAI → Meta API",
    n8n_url: N8N_BASE_URL,
    endpoints: {
      instagram_verify:  "GET  /webhook/instagram",
      instagram_messages: "POST /webhook/instagram  → forwards to n8n",
      whatsapp_verify:   "GET  /webhook/whatsapp",
      whatsapp_messages: "POST /webhook/whatsapp   → forwards to n8n",
    },
  });
});

// ─── Webhook Routes ────────────────────────────────────────────────────────────
app.use("/", instagramWebhook);
app.use("/", whatsappWebhook);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ─── n8n Connectivity Check ───────────────────────────────────────────────────
async function checkN8nConnection() {
  try {
    await axios.get(`${N8N_BASE_URL}/healthz`, { timeout: 3000 });
    console.log(`✅ n8n is running at ${N8N_BASE_URL}`);
  } catch {
    console.warn(`⚠️  n8n not reachable at ${N8N_BASE_URL}`);
    console.warn("   → Start n8n: npx n8n  OR  docker-compose up -d");
    console.warn("   → Then import workflows from automation/workflows/");
    console.warn("   → Webhooks will queue and retry once n8n is up.");
  }
}

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 FashionHub AI Assistant running on port ${PORT}`);
  console.log(`📱 Instagram webhook: http://localhost:${PORT}/webhook/instagram`);
  console.log(`💬 WhatsApp webhook:  http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`⚙️  Architecture:     Express → n8n → OpenAI → Meta API\n`);
  await checkN8nConnection();
});

module.exports = app;
