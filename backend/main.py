from ai_brain import detect_intent, analyze_sentiment, recommend_products, generate_reply

def main(message):
    print(f"\nCustomer: {message}")
    print("-" * 40)
    
    # Step 1 - Intent detect karo
    intent = detect_intent(message)
    print(f"Intent: {intent}")
    
    # Step 2 - Sentiment detect karo
    sentiment = analyze_sentiment(message)
    print(f"Sentiment: {sentiment}")
    
    # Step 3 - Products recommend karo
    recommendations = recommend_products(message)
    print(f"Recommendations:\n{recommendations}")
    
    # Step 4 - Smart reply banao
    reply = generate_reply(message, intent, sentiment, recommendations)
    print(f"\nAI Reply: {reply}")
    
    return {
        "intent": intent,
        "sentiment": sentiment,
        "recommendations": recommendations,
        "reply": reply
    }

# Test karo
if __name__ == "__main__":
    main("mujhe eid ke liye black dress chahiye")