
import sys
import json


def rule_based_fallback(message: str):
    from products import PRODUCTS

    msg = message.lower()
    matches = [
        p for p in PRODUCTS
        if any(tag in msg for tag in p.get("tags", []))
        or p["category"] in msg
        or any(c in msg for c in p.get("colors", []))
    ]
    if not matches:
        matches = PRODUCTS[:2]

    reply_lines = ["Here are some options for you:"]
    for p in matches[:3]:
        reply_lines.append(f"- {p['name']} | Rs {p['price']} | Sizes: {', '.join(p['sizes'])}")

    return {
        "intent": "ProductSearch",
        "sentiment": "Neutral",
        "recommendations": matches[:3],
        "reply": "\n".join(reply_lines),
        "engine": "fallback-rule-based",
    }


def main():
    message = sys.argv[1] if len(sys.argv) > 1 else ""
    if not message.strip():
        print(json.dumps({"error": "empty message"}))
        return

    try:
        from ai_brain import detect_intent, analyze_sentiment, recommend_products, generate_reply

        intent = detect_intent(message)
        sentiment = analyze_sentiment(message)
        recommendations = recommend_products(message)
        reply = generate_reply(message, intent, sentiment, recommendations)

        print(json.dumps({
            "intent": intent,
            "sentiment": sentiment,
            "recommendations": recommendations,
            "reply": reply,
            "engine": "groq-llama-3.3-70b",
        }))
    except Exception as exc:
        result = rule_based_fallback(message)
        result["warning"] = f"LLM unavailable, used fallback ({exc.__class__.__name__})"
        print(json.dumps(result))


if __name__ == "__main__":
    main()