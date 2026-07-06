const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../config/env");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ─── Product Catalog (mock — backend team will replace with DB calls) ─────────
const PRODUCTS = [
  { name: "Black Embroidered Maxi", category: "women", color: "black", price: 4999, sizes: ["S", "M", "L", "XL"], stock: true },
  { name: "Black Chiffon Dress", category: "women", color: "black", price: 5499, sizes: ["S", "M", "L"], stock: true },
  { name: "Red Formal Suit", category: "women", color: "red", price: 6999, sizes: ["M", "L", "XL"], stock: true },
  { name: "White Casual Shirt", category: "men", color: "white", price: 1999, sizes: ["S", "M", "L", "XL", "XXL"], stock: true },
  { name: "Navy Blue Kurta", category: "men", color: "blue", price: 2499, sizes: ["M", "L", "XL"], stock: true },
  { name: "Beige Lawn Suit", category: "women", color: "beige", price: 3499, sizes: ["S", "M", "L"], stock: true },
  { name: "Black Slim Jeans", category: "men", color: "black", price: 2999, sizes: ["30", "32", "34", "36"], stock: true },
  { name: "Leather Belt", category: "accessories", color: "brown", price: 999, sizes: ["Free Size"], stock: true },
  { name: "White Sneakers", category: "shoes", color: "white", price: 2799, sizes: ["39", "40", "41", "42", "43"], stock: true },
  { name: "Floral Summer Dress", category: "women", color: "multi", price: 3999, sizes: ["S", "M", "L"], stock: true },
];

// ─── Size Chart ───────────────────────────────────────────────────────────────
const SIZE_CHART = `
📏 *Size Chart - FashionHub*

*Women's Clothing:*
S  → Chest 34", Waist 28"
M  → Chest 36", Waist 30"
L  → Chest 38", Waist 32"
XL → Chest 40", Waist 34"

*Men's Clothing:*
S  → Chest 36", Waist 30"
M  → Chest 38", Waist 32"
L  → Chest 40", Waist 34"
XL → Chest 42", Waist 36"
XXL→ Chest 44", Waist 38"

💡 Tip: If you're between sizes, we recommend going one size up.
`;

// ─── Intent Detection ─────────────────────────────────────────────────────────
function detectIntent(message) {
  const msg = message.toLowerCase();

  if (/^(hi|hello|hey|salam|assalam|helo|hii|hiii)/.test(msg)) return "greeting";
  if (/track|parcel|where.*order|order status|tracking id/.test(msg)) return "order_tracking";
  if (/place.*order|buy|order karna|purchase|add to cart/.test(msg)) return "order_placement";
  if (/delivery|ship|dispatch|courier|days|charges|same day|islamabad|lahore|karachi/.test(msg)) return "delivery_inquiry";
  if (/return|exchange|refund|damaged|broken|wrong item/.test(msg)) return "return_exchange";
  if (/discount|sale|offer|promo|coupon|cheap/.test(msg)) return "discount_inquiry";
  if (/size|chart|xl|medium|small|large|fit/.test(msg)) return "size_inquiry";
  if (/color|colour|black|white|red|blue|beige|green|pink/.test(msg)) return "color_inquiry";
  if (/price|cost|rate|kitna|how much|under \d+|products under|under rs/.test(msg)) return "price_inquiry";
  if (/complain|problem|issue|bad|worst|terrible|angry/.test(msg)) return "complaint";
  if (/show|find|looking|need|want|recommend|suggest|collection|dress|shirt|jeans|kurta|suit|handbag|shoes|outfit/.test(msg)) return "product_search";

  return "general";
}

// ─── Sentiment Analysis ───────────────────────────────────────────────────────
function detectSentiment(message) {
  const msg = message.toLowerCase();

  if (/love|amazing|great|awesome|perfect|thank|happy|excellent|wonderful/.test(msg)) return "happy";
  if (/angry|worst|terrible|useless|fraud|cheat|rubbish|pathetic/.test(msg)) return "angry";
  if (/disappointed|frustrated|still waiting|no reply|waste|not happy/.test(msg)) return "frustrated";
  if (/interested|tell me more|want to buy|how to order|send me|can i get/.test(msg)) return "interested";

  return "neutral";
}

// ─── Product Search Helper ────────────────────────────────────────────────────
function searchProducts({ color, category, maxPrice, keyword }) {
  return PRODUCTS.filter((p) => {
    if (color && !p.color.includes(color.toLowerCase())) return false;
    if (category && !p.category.includes(category.toLowerCase())) return false;
    if (maxPrice && p.price > maxPrice) return false;
    if (keyword && !p.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    return p.stock;
  });
}

function formatProducts(products) {
  if (!products.length) return "😔 Sorry, no matching products found right now. Please check back soon or type *New Arrivals* to see latest items.";

  return products
    .slice(0, 3)
    .map(
      (p) =>
        `🛍️ *${p.name}*\n💰 Price: Rs ${p.price.toLocaleString()}\n📦 Sizes: ${p.sizes.join(", ")}\n🎨 Color: ${p.color}`
    )
    .join("\n\n");
}

// ─── Upsell suggestions ───────────────────────────────────────────────────────
function getUpsell(selectedProduct) {
  const upsellMap = {
    women: ["Leather Belt", "White Sneakers"],
    men: ["Black Slim Jeans", "Leather Belt", "White Sneakers"],
    shoes: ["Black Slim Jeans", "White Casual Shirt"],
    accessories: ["White Casual Shirt", "Navy Blue Kurta"],
  };

  const suggestions = upsellMap[selectedProduct?.category] || [];
  const items = PRODUCTS.filter((p) => suggestions.includes(p.name));

  if (!items.length) return null;

  const list = items.map((p) => `• ${p.name} — Rs ${p.price.toLocaleString()}`).join("\n");
  return `🔥 *Customers also bought:*\n${list}\n\nWould you like to add any of these items? 😊`;
}

// ─── Static Rule-Based Replies ────────────────────────────────────────────────
function getRuleBasedReply(intent, sentiment, message) {
  const msg = message.toLowerCase();

  // Sentiment-aware prefix
  let prefix = "";
  if (sentiment === "angry") prefix = "😔 We sincerely apologize for any inconvenience. ";
  if (sentiment === "frustrated") prefix = "We understand your concern and are here to help. ";
  if (sentiment === "happy") prefix = "😊 So glad you're happy! ";

  switch (intent) {
    case "greeting":
      return `Welcome to FashionHub ❤️\n\nThank you for contacting us!\nHow may I help you today?\n\n1️⃣ New Arrivals\n2️⃣ Women's Collection\n3️⃣ Men's Collection\n4️⃣ Order Tracking\n5️⃣ Delivery Information\n6️⃣ Exchange & Returns`;

    case "delivery_inquiry":
      if (/charges/.test(msg)) return `${prefix}🚚 *Delivery Charges:*\n• Within city: Rs 150\n• Other cities: Rs 200\n• Free delivery on orders above Rs 5,000!`;
      if (/same day/.test(msg)) return `${prefix}⚡ Same-day delivery is available in Karachi, Lahore & Islamabad for orders placed before 12 PM.`;
      if (/islamabad/.test(msg)) return `${prefix}✅ Yes, we deliver to Islamabad! Delivery time: 2-3 working days.`;
      if (/lahore/.test(msg)) return `${prefix}✅ Yes, we deliver to Lahore! Delivery time: 1-2 working days.`;
      return `${prefix}🚚 *Delivery Information:*\n• Standard: 3-5 working days\n• Express: 1-2 working days\n• Same-day available in major cities\n\nWhich city are you ordering to?`;

    case "return_exchange":
      if (/refund/.test(msg)) return `${prefix}💸 *Refund Policy:*\nRefunds are processed within 5-7 working days to your original payment method. Please contact us with your Order ID to initiate.`;
      if (/damaged/.test(msg)) return `${prefix}😔 We're sorry to hear that! Please send us a photo of the damaged item and your Order ID. We'll replace it immediately at no extra cost.`;
      return `${prefix}🔄 *Exchange Policy:*\n• Exchange within 7 days of delivery\n• Item must be unused and with original tags\n• Size exchanges are FREE\n\nPlease share your Order ID to proceed.`;

    case "size_inquiry":
      if (/chart/.test(msg)) return SIZE_CHART;
      if (/which size/.test(msg)) return `📏 To recommend the right size, please share:\n• Your chest measurement (inches)\n• Your waist measurement (inches)\n\nOr type *size chart* to see our full guide.`;
      return `${prefix}📦 We have sizes: *S, M, L, XL, XXL* for most items.\nType *size chart* for measurements, or tell me which product you're interested in!`;

    case "order_tracking":
      return `${prefix}📦 *Order Tracking:*\nPlease share your *Order ID* or *Tracking Number* and I'll check the status for you right away!\n\nFormat: ORD-XXXX`;

    case "order_placement":
      return `${prefix}🛒 *How to Place an Order:*\n\n1️⃣ Tell me which product you want\n2️⃣ Select your size & color\n3️⃣ Share your delivery address\n4️⃣ Choose payment method (COD / Bank Transfer)\n5️⃣ Order confirmed! ✅\n\nWhat would you like to order today?`;

    case "discount_inquiry":
      return `${prefix}🎉 *Current Offers:*\n• 10% OFF on orders above Rs 3,000 — Use code: *FASHION10*\n• Free delivery on orders above Rs 5,000\n• Seasonal Sale: Up to 30% OFF on selected items!\n\nType *Sale* to see discounted products 🔥`;

    case "price_inquiry": {
      const underMatch = msg.match(/under\s+rs?\s*(\d+)/i);
      if (underMatch) {
        const limit = parseInt(underMatch[1]);
        const affordable = searchProducts({ maxPrice: limit });
        return `${prefix}Here are products under Rs ${limit.toLocaleString()}:\n\n${formatProducts(affordable)}`;
      }
      return `${prefix}💰 Our prices range from *Rs 999* to *Rs 9,999*.\nTell me which category you're looking for and I'll share exact prices!`;
    }

    case "complaint":
      return `${prefix}😔 We're really sorry to hear about your experience. Your feedback matters to us.\n\nPlease share:\n• Your Order ID\n• Description of the issue\n\nOur team will resolve this within *24 hours*. 🙏`;

    default:
      return null; // fall through to OpenAI
  }
}

// ─── Main Reply Generator (Rule-based → OpenAI fallback) ─────────────────────
async function generateReply(message, conversationHistory = []) {
  const intent = detectIntent(message);
  const sentiment = detectSentiment(message);

  // ── Product search — handle locally
  if (intent === "product_search" || intent === "color_inquiry") {
    const msg = message.toLowerCase();

    // Extract color
    const colorMatch = msg.match(/\b(black|white|red|blue|green|pink|beige|brown|navy)\b/);
    const color = colorMatch ? colorMatch[1] : null;

    // Extract category
    let category = null;
    if (/women|woman|girl|ladies/.test(msg)) category = "women";
    else if (/men|man|gents|male/.test(msg)) category = "men";
    else if (/shoe|sneaker|footwear/.test(msg)) category = "shoes";
    else if (/bag|handbag|purse/.test(msg)) category = "accessories";

    // Extract budget
    const budgetMatch = msg.match(/under\s+rs?\s*(\d+)/i);
    const maxPrice = budgetMatch ? parseInt(budgetMatch[1]) : null;

    const products = searchProducts({ color, category, maxPrice });
    const reply = `🛍️ I found these options for you:\n\n${formatProducts(products)}\n\nWould you like to see pictures or place an order? 📸`;
    return { reply, intent, sentiment };
  }

  // Try rule-based first
  const ruleReply = getRuleBasedReply(intent, sentiment, message);
  if (ruleReply) return { reply: ruleReply, intent, sentiment };

  // Fallback to OpenAI for nuanced/complex queries
  try {
    const systemPrompt = `You are a professional AI Sales Assistant for FashionHub, a premium clothing brand in Pakistan.
Your job is to help customers with product recommendations, orders, delivery info, and after-sales support.
Always be warm, friendly, and professional. Use emojis appropriately.
Reply in the same language the customer uses (English or Urdu/Roman Urdu).
Keep responses concise and actionable.
Prices are in Pakistani Rupees (Rs).
Never make up product details — if unsure, ask the customer for more info.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content.trim();
    return { reply, intent, sentiment };
  } catch (error) {
    console.error("OpenAI error:", error.message);

    // Smart local fallback — never leave customer with a bad reply
    const fallbackReply = getSmartFallback(message);
    return { reply: fallbackReply, intent, sentiment };
  }
}

// ─── Smart Fallback (when OpenAI quota runs out) ───────────────────────────────
function getSmartFallback(message) {
  const msg = message.toLowerCase();

  if (/summer|winter|eid|formal|casual|party|wedding/.test(msg)) {
    const products = searchProducts({});
    return `Here are some popular picks for you:\n\n${formatProducts(products)}\n\nType a product name to order or ask for more options! 😊`;
  }

  if (/men|gents|male|shirt|kurta|pant/.test(msg)) {
    const products = searchProducts({ category: "men" });
    return `👔 *Men's Collection:*\n\n${formatProducts(products)}\n\nInterested in any of these?`;
  }

  if (/women|ladies|girl|dress|suit|lawn/.test(msg)) {
    const products = searchProducts({ category: "women" });
    return `👗 *Women's Collection:*\n\n${formatProducts(products)}\n\nWould you like to place an order?`;
  }

  if (/shoe|sneaker|belt|bag|accessory/.test(msg)) {
    const products = searchProducts({ category: "shoes" });
    return `👟 *Accessories & Shoes:*\n\n${formatProducts(products)}\n\nWant to order?`;
  }

  return (
    `Thank you for your message! 😊\n\n` +
    `I can help you with:\n` +
    `🛍️ Product recommendations\n` +
    `💰 Prices & discounts\n` +
    `🚚 Delivery information\n` +
    `🔄 Exchange & returns\n` +
    `📦 Order tracking\n\n` +
    `What are you looking for today?`
  );
}

module.exports = { generateReply, detectIntent, detectSentiment, getUpsell, PRODUCTS };
