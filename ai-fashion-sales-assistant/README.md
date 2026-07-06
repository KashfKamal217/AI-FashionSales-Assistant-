# FashionHub — AI Fashion Sales Assistant

An AI-powered sales assistant for clothing brands that automatically handles customer messages on **Instagram DMs** and **WhatsApp**, recommends products, and collects orders.

---

## Project Structure

```
ai-fashion-sales-assistant/
├── server.js                          # Express server entry point
├── .env                               # Environment variables
├── package.json
├── automation/
│   ├── config/
│   │   └── env.js                     # Centralized config
│   ├── services/
│   │   ├── openai.service.js          # AI reply engine (intent + sentiment + GPT)
│   │   ├── instagram.service.js       # Instagram Graph API calls
│   │   └── whatsapp.service.js        # WhatsApp Business API calls
│   ├── webhooks/
│   │   ├── instagram.webhook.js       # Instagram DM webhook handler
│   │   └── whatsapp.webhook.js        # WhatsApp webhook + order flow
│   └── workflows/
│       ├── instagram-flow.json        # n8n workflow for Instagram
│       ├── whatsapp-flow.json         # n8n workflow for WhatsApp
│       └── order-confirmation-flow.json # n8n order confirmation
└── docs/
    └── api-flow.md                    # Full API & flow documentation
```

---

## Team Roles

| Role | Responsibility |
|------|---------------|
| **Automation & Integration Engineer** | Instagram & WhatsApp APIs, n8n workflows, webhooks, order confirmation ✅ |
| AI/ML Engineer | OpenAI fine-tuning, advanced NLP, training data |
| Backend Developer | MongoDB models, REST APIs, admin routes |
| Frontend Developer | React admin dashboard, Tailwind UI |

---

## Features (Automation Layer)

- ✅ Instagram DM webhook — receive & auto-reply
- ✅ WhatsApp webhook — receive & auto-reply
- ✅ Intent detection (greeting, product search, delivery, order, complaint, etc.)
- ✅ Sentiment analysis (happy, angry, frustrated, interested)
- ✅ AI product recommendations (color, category, budget)
- ✅ Auto upselling ("Customers also bought...")
- ✅ Multi-step order collection via WhatsApp
- ✅ Order confirmation messages (WhatsApp + Instagram)
- ✅ Product catalog sharing
- ✅ Size chart & size guidance
- ✅ OpenAI GPT-3.5 fallback for complex queries
- ✅ Urdu + English support
- ✅ n8n workflow JSONs (importable)

---

## Setup & Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Edit `.env` and fill in your API keys:
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
```

### 3. Run the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

### 4. Expose to internet (for webhook testing)
Use [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 3000
```
Copy the HTTPS URL (e.g. `https://abc123.ngrok.io`)

---

## Webhook Configuration

### Instagram
1. Go to [Meta Developer Console](https://developers.facebook.com)
2. Your App → Webhooks → Instagram → Subscribe
3. Callback URL: `https://your-domain.com/webhook/instagram`
4. Verify Token: same as `INSTAGRAM_VERIFY_TOKEN` in `.env`
5. Subscribe to: `messages`, `messaging_postbacks`

### WhatsApp
1. Go to Meta Developer Console → WhatsApp → Configuration
2. Webhook URL: `https://your-domain.com/webhook/whatsapp`
3. Verify Token: same as `WHATSAPP_VERIFY_TOKEN` in `.env`
4. Subscribe to: `messages`

---

## n8n Workflow Setup

1. Install n8n: `npx n8n`
2. Open `http://localhost:5678`
3. Go to **Workflows** → **Import from File**
4. Import each file from `automation/workflows/`
5. Set your API credentials in n8n
6. Activate workflows

---

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/`                   | Health check             |
| GET    | `/webhook/instagram`  | Webhook verification     |
| POST   | `/webhook/instagram`  | Receive Instagram DMs    |
| GET    | `/webhook/whatsapp`   | Webhook verification     |
| POST   | `/webhook/whatsapp`   | Receive WhatsApp messages|

---

## Technologies Used

- **Node.js + Express** — Server & webhooks
- **OpenAI API (GPT-3.5)** — AI reply generation
- **Instagram Graph API** — DM automation
- **WhatsApp Business API** — Message automation
- **n8n** — Visual workflow automation
- **MongoDB** — Database (backend team)
- **React + Tailwind** — Admin dashboard (frontend team)
