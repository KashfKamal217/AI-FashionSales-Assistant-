# API Flow — FashionHub AI Sales Assistant

## Overview

```
Customer Message (Instagram DM / WhatsApp)
        │
        ▼
   Webhook Received (Express Server)
        │
        ▼
   Extract Message & Sender ID
        │
        ▼
   Intent Detection (openai.service.js)
   ├── greeting        → Welcome Menu
   ├── product_search  → Search Products + Upsell
   ├── delivery_inquiry→ Delivery Info
   ├── order_placement → Order Collection Flow
   ├── return_exchange → Exchange Policy
   ├── size_inquiry    → Size Chart / Guide
   ├── order_tracking  → Request Order ID
   ├── discount_inquiry→ Current Offers
   ├── complaint       → Escalation Response
   └── general         → OpenAI GPT-3.5 Fallback
        │
        ▼
   Sentiment Analysis
   ├── happy      → Standard reply
   ├── angry      → Apologetic prefix
   ├── frustrated → Empathetic prefix
   └── interested → Enthusiastic + CTA
        │
        ▼
   Generate Reply (Rule-based OR OpenAI)
        │
        ▼
   Send Reply via API
   ├── Instagram Graph API  → POST /PAGE_ID/messages
   └── WhatsApp Business API→ POST /PHONE_ID/messages
```

---

## Webhook Endpoints

| Method | Endpoint              | Purpose                        |
|--------|-----------------------|--------------------------------|
| GET    | /webhook/instagram    | Instagram webhook verification |
| POST   | /webhook/instagram    | Receive Instagram DMs          |
| GET    | /webhook/whatsapp     | WhatsApp webhook verification  |
| POST   | /webhook/whatsapp     | Receive WhatsApp messages      |
| GET    | /                     | Health check                   |

---

## Instagram Graph API

**Base URL:** `https://graph.facebook.com/v19.0`

### Send DM
```
POST /{PAGE_ID}/messages?access_token={TOKEN}
{
  "recipient": { "id": "{SENDER_ID}" },
  "message": { "text": "Your reply here" },
  "messaging_type": "RESPONSE"
}
```

### Webhook Verification
```
GET /webhook/instagram
  ?hub.mode=subscribe
  &hub.verify_token={YOUR_VERIFY_TOKEN}
  &hub.challenge={CHALLENGE_STRING}
→ Respond with challenge string
```

---

## WhatsApp Business API

**Base URL:** `https://graph.facebook.com/v19.0`

### Send Text Message
```
POST /{PHONE_NUMBER_ID}/messages
Authorization: Bearer {ACCESS_TOKEN}
{
  "messaging_product": "whatsapp",
  "to": "{CUSTOMER_PHONE}",
  "type": "text",
  "text": { "body": "Your reply here" }
}
```

### Send Interactive Buttons (max 3)
```
POST /{PHONE_NUMBER_ID}/messages
{
  "messaging_product": "whatsapp",
  "to": "{CUSTOMER_PHONE}",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "How can I help?" },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "btn_1", "title": "Women's Collection" } }
      ]
    }
  }
}
```

### Mark Message as Read
```
POST /{PHONE_NUMBER_ID}/messages
{
  "messaging_product": "whatsapp",
  "status": "read",
  "message_id": "{MESSAGE_ID}"
}
```

---

## WhatsApp Order Collection Flow

```
User: "place order"
  → Bot: "Which product?"
    → User: "Black Embroidered Maxi"
      → Bot: "Which size? (S/M/L/XL)"
        → User: "M"
          → Bot: "Your full name?"
            → User: "Sara Ahmed"
              → Bot: "Delivery address?"
                → User: "House 12, Block B, Lahore"
                  → Bot: "Payment method? (1=COD, 2=Bank, 3=EasyPaisa)"
                    → User: "1"
                      → Bot: ✅ Order Confirmation sent
```

---

## n8n Workflows

| Workflow File                  | Purpose                                      |
|-------------------------------|----------------------------------------------|
| whatsapp-flow.json            | Receive → AI reply → Send WhatsApp message   |
| instagram-flow.json           | Receive → AI reply → Send Instagram DM       |
| order-confirmation-flow.json  | Build & send order confirmation on both channels |

### Import into n8n
1. Open n8n → **Workflows** → **Import from File**
2. Select the JSON file from `automation/workflows/`
3. Set environment variables in n8n (Settings → Variables)
4. Activate the workflow

---

## Environment Variables

| Variable                  | Description                         |
|--------------------------|-------------------------------------|
| OPENAI_API_KEY           | OpenAI API key                      |
| INSTAGRAM_ACCESS_TOKEN   | Instagram Graph API access token    |
| INSTAGRAM_VERIFY_TOKEN   | Custom token for webhook verification|
| INSTAGRAM_PAGE_ID        | Instagram Business Page ID          |
| WHATSAPP_ACCESS_TOKEN    | WhatsApp Cloud API access token     |
| WHATSAPP_VERIFY_TOKEN    | Custom token for webhook verification|
| WHATSAPP_PHONE_NUMBER_ID | WhatsApp phone number ID            |
| MONGODB_URI              | MongoDB connection string           |
| PORT                     | Server port (default: 3000)         |
