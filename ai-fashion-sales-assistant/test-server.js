/**
 * Server Test — sends fake WhatsApp & Instagram messages to your running server
 * Run in a NEW terminal while "npm run dev" is running:
 *   node test-server.js
 */

const http = require("http");

const GREEN = "\x1b[32m";
const CYAN  = "\x1b[36m";
const BOLD  = "\x1b[1m";
const RESET = "\x1b[0m";
const GRAY  = "\x1b[90m";

// Test messages to send
const whatsappMessages = [
  "Hi",
  "Show me black dresses",
  "Delivery charges?",
  "Any discount?",
  "Can I exchange it?",
  "Track my order",
  "Products under Rs 3000",
  "How can I place an order?",
];

const instagramMessages = [
  "Hello",
  "What sizes do you have?",
  "Delivery to Islamabad?",
  "Price?",
];

function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: "localhost",
      port: 3000,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: raw }));
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function buildWhatsAppPayload(text) {
  return {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: "251921607708",       // Aman's WhatsApp number
            id: "msg_" + Date.now(),
            type: "text",
            text: { body: text },
          }],
        },
      }],
    }],
  };
}

function buildInstagramPayload(text) {
  return {
    object: "instagram",
    entry: [{
      messaging: [{
        sender: { id: "emoni9114" },    // Aman's Instagram username
        message: { mid: "mid_" + Date.now(), text },
      }],
    }],
  };
}

async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runTests() {
  console.log(BOLD + "\n" + "=".repeat(55) + RESET);
  console.log(BOLD + "   🧪 FashionHub — Live Server Test" + RESET);
  console.log(BOLD + "=".repeat(55) + "\n" + RESET);

  // ── WhatsApp Tests ───────────────────────────────────────
  console.log(BOLD + CYAN + "📱 WhatsApp Messages:\n" + RESET);

  for (const msg of whatsappMessages) {
    process.stdout.write(CYAN + `Customer: "${msg}" ` + RESET);
    const res = await postJSON("/webhook/whatsapp", buildWhatsAppPayload(msg));
    console.log(res.status === 200 ? GREEN + "→ 200 OK ✅" + RESET : `→ ${res.status} ❌`);
    await delay(300);
  }

  // ── Instagram Tests ──────────────────────────────────────
  console.log(BOLD + CYAN + "\n📸 Instagram DM Messages:\n" + RESET);

  for (const msg of instagramMessages) {
    process.stdout.write(CYAN + `Customer: "${msg}" ` + RESET);
    const res = await postJSON("/webhook/instagram", buildInstagramPayload(msg));
    console.log(res.status === 200 ? GREEN + "→ 200 OK ✅" + RESET : `→ ${res.status} ❌`);
    await delay(300);
  }

  console.log(BOLD + "\n" + "=".repeat(55) + RESET);
  console.log(BOLD + GREEN + "   ✅ All messages sent! Check the other terminal" + RESET);
  console.log(BOLD + "   (where npm run dev is running) to see AI replies." + RESET);
  console.log(BOLD + "=".repeat(55) + "\n" + RESET);
}

runTests().catch((err) => {
  console.error("\n❌ Could not connect to server. Is 'npm run dev' running?\n", err.message);
});
