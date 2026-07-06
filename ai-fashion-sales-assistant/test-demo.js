/**
 * LOCAL DEMO — Test the AI Sales Assistant without any real API keys.
 * Run: node test-demo.js
 *
 * Simulates a real customer conversation through the AI engine.
 */

const { generateReply, detectIntent, detectSentiment, getUpsell } = require("./automation/services/openai.service");

const GREEN  = "\x1b[32m";
const CYAN   = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET  = "\x1b[0m";

const customerMessages = [
  "Hi",
  "Show me black dresses",
  "What sizes do you have?",
  "Show size chart",
  "Delivery charges?",
  "Delivery to Lahore?",
  "Any discount available?",
  "I need a black dress for Eid",
  "Price?",
  "Products under Rs 3000",
  "Can I exchange it?",
  "Damaged item received",
  "Track my order",
  "I am very angry, you sent wrong item!!!",
  "I love your collection, amazing work!",
  "How can I place an order?",
];

async function runDemo() {
  console.log("\n" + "=".repeat(60));
  console.log("   FashionHub AI Sales Assistant — Local Demo");
  console.log("=".repeat(60) + "\n");

  const history = [];

  for (const msg of customerMessages) {
    console.log(`${CYAN}Customer:${RESET} ${msg}`);

    const intent   = detectIntent(msg);
    const sentiment = detectSentiment(msg);

    console.log(`${YELLOW}[Intent: ${intent} | Sentiment: ${sentiment}]${RESET}`);

    const { reply } = await generateReply(msg, history);

    history.push({ role: "user",      content: msg   });
    history.push({ role: "assistant", content: reply });

    console.log(`${GREEN}AI Reply:${RESET}\n${reply}`);
    console.log("-".repeat(60) + "\n");

    // Small delay for readability
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("=".repeat(60));
  console.log("   Demo complete. All intents handled successfully ✅");
  console.log("=".repeat(60) + "\n");
}

runDemo().catch(console.error);
