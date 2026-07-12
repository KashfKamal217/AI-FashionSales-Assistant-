const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const { readAll, writeAll, nextId } = require("../utils/jsonStore");

const router = express.Router();
const BRIDGE_PATH = path.join(__dirname, "..", "..", "chat_bridge.py");

router.get("/:customer", (req, res) => {
  const all = readAll("chatData");
  const history = all.filter(
    (m) => m.customer.toLowerCase() === req.params.customer.toLowerCase()
  );
  res.json(history);
});

router.post("/", (req, res) => {
  const { customer, message } = req.body;
  if (!customer || !message) {
    return res.status(400).json({ error: "customer and message are required" });
  }

  const all = readAll("chatData");
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const customerMsg = {
    id: nextId(all),
    customer,
    sender: "customer",
    name: customer,
    message,
    time: now,
  };
  all.push(customerMsg);
  writeAll("chatData", all);

  const py = spawn("python", [BRIDGE_PATH, message]);
  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (d) => (stdout += d.toString()));
  py.stderr.on("data", (d) => (stderr += d.toString()));

  py.on("close", () => {
    let aiResult;
    try {
      aiResult = JSON.parse(stdout.trim());
    } catch {
      aiResult = { reply: "Sorry, AI is unavailable right now.", error: stderr };
    }

    const records = readAll("chatData");
    const aiMsg = {
      id: nextId(records),
      customer,
      sender: "ai",
      name: "AI Assistant",
      message: aiResult.reply || "Sorry, I couldn't generate a reply.",
      time: now,
      meta: {
        intent: aiResult.intent,
        sentiment: aiResult.sentiment,
        recommendations: aiResult.recommendations,
        engine: aiResult.engine,
      },
    };
    records.push(aiMsg);
    writeAll("chatData", records);

    res.json({ customerMessage: customerMsg, aiMessage: aiMsg });
  });
});

module.exports = router;