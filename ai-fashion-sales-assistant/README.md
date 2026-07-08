# FashionHub — AI Fashion Sales Assistant

An AI-powered sales assistant for clothing brands that automatically handles customer messages on **Instagram DMs** and **WhatsApp**, recommends products, and collects orders — powered by **n8n** as the automation engine.

---

## Architecture

```
Customer Message (Instagram / WhatsApp)
        │
        ▼
   Meta Platform
        │  POST webhook
        ▼
   Express Server  (port 3000)
   ├── Verifies webhook token with Meta
   ├── ACKs Meta with 200 immediately
   └── Forwards payload → n8n
        │
        ▼
   n8n Automation  (port 5678)
   ├── Extracts message & sender
   ├── Greeting? → Welcome reply
   └── Else → OpenAI GPT-3.5-turbo
        │
        ▼
   Meta Graph API
   ├── Instagram: sends DM reply
   └── WhatsApp:  sends message reply
```

---

## Project Structure

```
ai-fashion-sales-assistant/
├── server.js                            # Express entry point — forwards to n8n
├── Dockerfile                           # Container for Express server
├── docker-compose.yml                   # Runs n8n + Express together
├── .env                                 # Environment variables (never commit)
├── package.json
├── automation/
│   ├── config/
│   │   └── env.js                       # Centralized config (reads .env)
│   ├── services/
│   │   ├── openai.service.js            # AI logic (used for local testing)
│   │   ├── instagram.service.js         # Instagram Graph API helpers
│   │   └── whatsapp.service.js          # WhatsApp Business API helpers
│   ├── webhooks/
│   │   ├── instagram.webhook.js         # Verify + forward to n8n
│   │   └── whatsapp.webhook.js          # Verify + forward to n8n
│   └── workflows/                       # ← Import these into n8n
│       ├── instagram-flow.json          # Instagram DM AI flow
│       ├── whatsapp-flow.json           # WhatsApp message AI flow
│       └── order-confirmation-flow.json # Order confirmation (both channels)
└── docs/
    ├── api-flow.md                      # Full API & flow documentation
    └── workflow-diagram.png             # Visual architecture diagram
```

---

## Team Roles

| Role | Responsibility |
|------|---------------|
| **Automation & Integration Engineer** | Instagram & WhatsApp webhooks, n8n workflows, order confirmation ✅ |
| AI/ML Engineer | OpenAI fine-tuning, advanced NLP, training data |
| Backend Developer | MongoDB models, REST APIs, admin routes |
| Frontend Developer | React admin dashboard, Tailwind UI |

---

## Features (Automation Layer)

- ✅ Instagram DM webhook — receive & forward to n8n
- ✅ WhatsApp webhook — receive & forward to n8n
- ✅ n8n handles all AI logic and API calls (visual, no-code editable)
- ✅ Greeting detection → welcome menu reply
- ✅ OpenAI GPT-3.5-turbo for all other queries
- ✅ Product catalog embedded in AI system prompt
- ✅ Mark WhatsApp messages as read
- ✅ Order confirmation flow (WhatsApp + Instagram)
- ✅ Urdu + English support
- ✅ Docker support for one-command startup

---

## Setup & Installation

### Option A — Docker (Recommended)

Runs n8n and the Express server together:

```bash
# Copy and fill in your keys
cp .env.example .env   # edit .env with your API keys

docker-compose up -d
```

- Express server: `http://localhost:3000`
- n8n UI: `http://localhost:5678` (login: `admin` / `fashionhub2024`)

---

### Option B — Manual

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment variables**

Edit `.env`:
```env
OPENAI_API_KEY=your_key_here

INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_VERIFY_TOKEN=any_secret_string
INSTAGRAM_PAGE_ID=your_page_id

WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_VERIFY_TOKEN=any_secret_string
WHATSAPP_PHONE_NUMBER_ID=your_phone_id

MONGODB_URI=mongodb://localhost:27017/fashionhub
PORT=3000

N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

**3. Start n8n**
```bash
npx n8n
# Opens at http://localhost:5678
```

**4. Import n8n workflows**

In the n8n UI → **Workflows** → **Import from File** — import all 3 files:
- `automation/workflows/instagram-flow.json`
- `automation/workflows/whatsapp-flow.json`
- `automation/workflows/order-confirmation-flow.json`

**5. Set environment variables in n8n**

n8n UI → **Settings** → **Variables** — add these:

| Variable | Value |
|----------|-------|
| OPENAI_API_KEY | your OpenAI key |
| INSTAGRAM_ACCESS_TOKEN | your Instagram token |
| INSTAGRAM_PAGE_ID | your page ID |
| WHATSAPP_ACCESS_TOKEN | your WhatsApp token |
| WHATSAPP_PHONE_NUMBER_ID | your phone number ID |

**6. Activate all 3 workflows** (toggle switch in n8n)

**7. Start the Express server**
```bash
npm run dev    # development (auto-restart)
npm start      # production
```

### Instagram
1. [Meta Developer Console](https://developers.facebook.com) → Your App → Webhooks → Instagram
2. Callback URL: `https://your-ngrok-url/webhook/instagram`
3. Verify Token: value of `INSTAGRAM_VERIFY_TOKEN` in `.env`
4. Subscribe to: `messages`, `messaging_postbacks`

### WhatsApp
1. Meta Developer Console → WhatsApp → Configuration
2. Webhook URL: `https://your-ngrok-url/webhook/whatsapp`
3. Verify Token: value of `WHATSAPP_VERIFY_TOKEN` in `.env`
4. Subscribe to: `messages`

---

## API Endpoints (Express Server)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check + n8n status |
| GET | `/webhook/instagram` | Meta webhook verification |
| POST | `/webhook/instagram` | Receive Instagram DMs → forward to n8n |
| GET | `/webhook/whatsapp` | Meta webhook verification |
| POST | `/webhook/whatsapp` | Receive WhatsApp messages → forward to n8n |

## n8n Internal Webhooks

| Method | Path | Workflow |
|--------|------|----------|
| POST | `/webhook/webhook/instagram` | Instagram DM AI Flow |
| POST | `/webhook/webhook/whatsapp` | WhatsApp AI Flow |
| POST | `/webhook/internal/order-confirm` | Order Confirmation Flow |

---

## Trigger Order Confirmation from Backend

When a new order is saved in MongoDB, call n8n directly:

```js
const axios = require("axios");

await axios.post(`${process.env.N8N_WEBHOOK_URL}/internal/order-confirm`, {
  orderId: "ORD-123456",
  customerName: "Sara Ahmed",
  products: [{ name: "Black Embroidered Maxi", size: "M", qty: 1, price: 4999 }],
  total: 4999,
  address: "House 12, Block B, Lahore",
  paymentMethod: "Cash on Delivery",
  phone: "923001234567",       // optional — for WhatsApp confirmation
  instagramId: "123456789"     // optional — for Instagram confirmation
});
```

---

## Technologies Used

| Technology | Role |
|-----------|------|
| **n8n** | Core automation engine — all AI + API logic |
| **Node.js + Express** | Webhook receiver & forwarder to n8n |
| **OpenAI GPT-3.5-turbo** | AI reply generation (called by n8n) |
| **Instagram Graph API** | DM automation |
| **WhatsApp Business API** | Message automation |
| **Docker + docker-compose** | Container orchestration |
| **MongoDB** | Database (backend team) |
| **React + Tailwind** | Admin dashboard (frontend team) |
