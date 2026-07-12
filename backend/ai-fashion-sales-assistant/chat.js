/**
 * FashionHub AI — Interactive Chat
 * Run: node chat.js
 *
 * Type messages and see AI replies in real time.
 * Simulates a real WhatsApp/Instagram customer conversation.
 * No API keys needed.
 */

const readline = require("readline");
const { generateReply, detectIntent, detectSentiment } = require("./automation/services/openai.service");

const GREEN  = "\x1b[32m";
const CYAN   = "\x1b[36m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";
const RESET  = "\x1b[0m";
const GRAY   = "\x1b[90m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const conversationHistory = [];

function printBanner() {
  console.clear();
  console.log(BOLD + "=".repeat(55) + RESET);
  console.log(BOLD + "   💬 FashionHub AI Sales Assistant — Live Chat" + RESET);
  console.log(BOLD + "=".repeat(55) + RESET);
  console.log(GRAY + "   Type your message and press Enter." + RESET);
  console.log(GRAY + "   Type 'exit' to quit.\n" + RESET);
}

async function chat() {
  printBanner();

  const ask = () => {
    rl.question(CYAN + "You: " + RESET, async (input) => {
      const msg = input.trim();

      if (!msg) return ask();
      if (msg.toLowerCase() === "exit") {
        console.log(GRAY + "\nGoodbye! 👋\n" + RESET);
        rl.close();
        return;
      }

      const intent   = detectIntent(msg);
      const sentiment = detectSentiment(msg);

      console.log(GRAY + `[intent: ${intent} | sentiment: ${sentiment}]` + RESET);

      try {
        const { reply } = await generateReply(msg, conversationHistory);

        conversationHistory.push({ role: "user",      content: msg   });
        conversationHistory.push({ role: "assistant", content: reply });

        // Keep history lean
        if (conversationHistory.length > 10) {
          conversationHistory.splice(0, 2);
        }

        console.log(GREEN + BOLD + "\nFashionHub AI:" + RESET);
        console.log(reply);
        console.log();
      } catch (err) {
        console.log(YELLOW + "AI error: " + err.message + RESET);
      }

      ask();
    });
  };

  ask();
}

chat();
