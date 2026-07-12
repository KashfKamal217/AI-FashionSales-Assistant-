# API Flow — FashionHub AI Sales Assistant

## Architecture Overview

```
Customer Message (Instagram DM / WhatsApp)
        │
        ▼
   Meta Platform (Facebook/Instagram)
        │  POST webhook
        ▼
   Express Server (port 3000)
   ├── Verifies webhook token
   ├── Responds 200 immediately to Meta
   └── Forwards full payload to n8n
        │
        ▼
   n8n Automation (port 5678)
   ├── Extracts message & sender
   ├── Checks if greeting → Welcome reply
   └── Else → OpenAI GPT-3.5-turbo
        │
        ▼
   OpenAI API
   (generates context-aware reply)
        │
        ▼
   Meta Graph API
   ├── Instagram: POST /{PAGE_ID}/messages
   └── WhatsApp:  POST /{PHONE_ID}/messages
        │
        ▼
   Customer receives reply 💬
```

---

## Why n8n?

n8n is the core automation engine. All AI logic, message routing, and API calls
live inside n8n workflows — making them visual, editable without code changes,
and independently testable via the n8n UI.

The Express server is a thin forwarder only:
- Handles Meta webhook verification (GET)
- ACKs Meta with 200 immediately (prevents retries)
- Forwards the payload to n8n via HTTP POST

---

## Express Server Endpoints

| Method | Endpoint              | Purpose                                   |
|--------|-----------------------|-------------------------------------------|
| GET    | /webhook/instagram    | Instagram webhook verification (Meta)     |
| POST   | /webhook/instagram    | Receive DMs → forward to n8n              |
| GET    | /webhook/whatsapp     | WhatsApp webhook verification (Meta)      |
| POST   | /webhook/whatsapp     | Receive messages → forward to n8n         |
| GET    | /                     | Health check                              |

---

## n8n Webhook Endpoints (internal)

| Method | n8n Path                      | Purpose                              |
|--------|-------------------------------|--------------------------------------|
| POST   | /webhook/instagram            | Instagram DM AI flow                 |
| POST   | /webhook/whatsapp             | WhatsApp message AI flow             |
| POST   | /webhook/internal/order-confirm| Order confirmation (both channels)  |

---

## n8n Workflows

| File                          | Workflow Name                        | Purpose                                     |
|-------------------------------|--------------------------------------|---------------------------------------------|
| instagram-flow.json           | FashionHub - Instagram DM AI Flow    | Receive DM → GPT reply → send via Graph API |
| whatsapp-flow.json            | FashionHub - WhatsApp AI Flow        | Receive msg → GPT reply → send via WA API   |
| order-confirmation-flow.json  | FashionHub - Order Confirmation Flow | Build & send order confirmation on both channels |

---

## Setup Instructions

### Option A — Docker (Recommended)

```bash
cd ai-fashion-sales-assistant
docker-compose up -d
```

This starts:
- n8n at http://localhost:5678 (admin / fashionhub2024)
- Express server at http://localhost:3000

### Option B — Manual

**1. Start n8n**
```bash
# Install n8n globally
npm install -g n8n

# Set your env vars, then start
n8n start
# n8n opens at http://localhost:5678
```

**2. Import workflows into n8n**

For each file in `automation/workflows/`:
1. Open n8n → **Workflows** → **Import from File**
2. Select the `.json` file
3. Click **Activate** (toggle in top right)

**3. Set n8n Environment Variables**

In n8n → **Settings** → **Variables**, add:

| Variable                  | Value (from .env)                        |
|--------------------------|------------------------------------------|
| OPENAI_API_KEY           | Your OpenAI API key                      |
| INSTAGRAM_ACCESS_TOKEN   | Instagram Graph API access token         |
| INSTAGRAM_PAGE_ID        | Instagram Business Page ID               |
| WHATSAPP_ACCESS_TOKEN    | WhatsApp Cloud API access token          |
| WHATSAPP_PHONE_NUMBER_ID | WhatsApp phone number ID                 |

**4. Start the Express server**
```bash
npm start
```

**5. Expose with ngrok (for Meta webhook registration)**
```bash
ngrok http 3000
# Copy the https URL → register in Meta Developer Console
```

Update `N8N_WEBHOOK_URL` in `.env` if n8n is on a different host.

---

## Data Flow Detail

### Instagram DM Flow (instagram-flow.json)

```
POST /webhook/instagram (n8n)
  → Extract sender ID + message text
  → Is Greeting? (regex: hi|hello|hey|salam)
      YES → Return welcome menu text
      NO  → POST https://api.openai.com/v1/chat/completions
               → Parse reply text
  → POST https://graph.facebook.com/v19.0/{PAGE_ID}/messages
```

### WhatsApp Flow (whatsapp-flow.json)

```
POST /webhook/whatsapp (n8n)
  → Extract phone number + message text (text or interactive reply)
  → Mark message as read
  → POST https://api.openai.com/v1/chat/completions
       → Parse reply text
  → POST https://graph.facebook.com/v19.0/{PHONE_ID}/messages
```

### Order Confirmation Flow (order-confirmation-flow.json)

```
POST /webhook/internal/order-confirm (n8n)
  Payload: { orderId, customerName, products[], total, address, paymentMethod, phone?, instagramId? }
  → Build formatted confirmation message
  → Has phone?   YES → Send WhatsApp confirmation
  → Has instagramId? YES → Send Instagram confirmation
  → Return { success: true, orderId }
```

Trigger from Node.js:
```js
await axios.post(`${N8N_WEBHOOK_URL}/internal/order-confirm`, orderData);
```

---

## Environment Variables

| Variable                  | Description                                         |
|--------------------------|-----------------------------------------------------|
| PORT                     | Express server port (default: 3000)                 |
| OPENAI_API_KEY           | OpenAI API key                                      |
| INSTAGRAM_ACCESS_TOKEN   | Instagram Graph API access token                    |
| INSTAGRAM_VERIFY_TOKEN   | Custom token for Meta webhook verification          |
| INSTAGRAM_PAGE_ID        | Instagram Business Page ID                          |
| WHATSAPP_ACCESS_TOKEN    | WhatsApp Cloud API access token                     |
| WHATSAPP_VERIFY_TOKEN    | Custom token for Meta webhook verification          |
| WHATSAPP_PHONE_NUMBER_ID | WhatsApp phone number ID                            |
| MONGODB_URI              | MongoDB connection string                           |
| N8N_BASE_URL             | n8n base URL (default: http://localhost:5678)       |
| N8N_WEBHOOK_URL          | n8n webhook base URL (default: http://localhost:5678/webhook) |
