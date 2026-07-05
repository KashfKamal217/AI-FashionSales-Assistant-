const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { PORT } = require("./automation/config/env");

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
    version: "1.0.0",
    endpoints: {
      instagram_verify: "GET  /webhook/instagram",
      instagram_messages: "POST /webhook/instagram",
      whatsapp_verify: "GET  /webhook/whatsapp",
      whatsapp_messages: "POST /webhook/whatsapp",
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

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 FashionHub AI Assistant running on port ${PORT}`);
  console.log(`📱 Instagram webhook: http://localhost:${PORT}/webhook/instagram`);
  console.log(`💬 WhatsApp webhook:  http://localhost:${PORT}/webhook/whatsapp`);
});

module.exports = app;
