import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from products import PRODUCTS

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7
)

def detect_intent(message):
    prompt = PromptTemplate(input_variables=["message"], template="""
You are an AI for a Pakistani clothing brand called FashionHub.
Classify this customer message into ONE intent:
- Greeting
- ProductSearch
- OrderPlacement
- DeliveryInquiry
- Complaint
- ReturnRequest
- DiscountInquiry
- SizeQuery
- ColorQuery
- TrackingQuery
Customer message: {message}
Reply with ONLY the intent name, nothing else.
""")
    chain = prompt | llm
    result = chain.invoke({"message": message})
    return result.content.strip()

def analyze_sentiment(message):
    prompt = PromptTemplate(input_variables=["message"], template="""
You are an AI for a Pakistani clothing brand called FashionHub.
Analyze the sentiment of this customer message:
Customer message: {message}
Classify into ONE of these:
- Happy
- Angry
- Frustrated
- Interested
- Neutral
Reply with ONLY the sentiment name, nothing else.
""")
    chain = prompt | llm
    result = chain.invoke({"message": message})
    return result.content.strip()

def recommend_products(message):
    products_str = ""
    for p in PRODUCTS:
        products_str += f"- {p['name']} | Rs {p['price']} | Colors: {p['colors']} | Sizes: {p['sizes']} | Tags: {p['tags']}\n"

    prompt = PromptTemplate(input_variables=["message", "products"], template="""
You are a product recommendation AI for FashionHub, a Pakistani clothing brand.
Customer message: {message}
Available products:
{products}
Recommend most relevant products. Consider: color, category, price, gender, tags.
Reply in this format ONLY:
1. Product Name - Rs Price
2. Product Name - Rs Price
Maximum 3 products. If no match found, reply: "No matching products found"
""")
    chain = prompt | llm
    result = chain.invoke({"message": message, "products": products_str})
    return result.content.strip()

def generate_reply(message, intent, sentiment, recommendations):
    prompt = PromptTemplate(input_variables=["message", "intent", "sentiment", "recommendations"], template="""
You are a friendly sales representative for FashionHub, a Pakistani clothing brand.
Customer message: {message}
Customer intent: {intent}
Customer sentiment: {sentiment}
Recommended products: {recommendations}
Rules:
- If sentiment is Angry or Frustrated, first apologize politely
- If sentiment is Happy or Interested, be enthusiastic
- If intent is ProductSearch, show recommendations
- If intent is DeliveryInquiry, mention: Rs 150 delivery, free above Rs 5000, 3-5 working days
- If intent is DiscountInquiry, mention: 10% off first order, code WELCOME10
- If intent is ReturnRequest, mention: 7 days exchange, unused items only
- If intent is Greeting, welcome them warmly
- Reply in simple Urdu/English mix
- Keep reply short and helpful
- End with a helpful question
Reply:
""")
    chain = prompt | llm
    result = chain.invoke({"message": message, "intent": intent, "sentiment": sentiment, "recommendations": recommendations})
    return result.content.strip()

def main(message):
    print(f"\nCustomer: {message}")
    print("-" * 40)
    intent = detect_intent(message)
    print(f"Intent: {intent}")
    sentiment = analyze_sentiment(message)
    print(f"Sentiment: {sentiment}")
    recommendations = recommend_products(message)
    print(f"Recommendations:\n{recommendations}")
    reply = generate_reply(message, intent, sentiment, recommendations)
    print(f"\nAI Reply:\n{reply}")
    return {"intent": intent, "sentiment": sentiment, "recommendations": recommendations, "reply": reply}

if __name__ == "__main__":
    print("=" * 40)
    print("  Welcome to FashionHub AI 🛍️")
    print("=" * 40)
    
    EXIT_WORDS = ["bye", "allah hafiz", "khuda hafiz", "exit", "quit", 
                  "band karo", "ok bye", "ok thanks", "shukriya bye",
                  "thank you bye", "thanks bye"]
    
    while True:
        message = input("\nCustomer: ").strip()
        
        if not message:
            continue
            
        # Check karo kya customer ja raha hai
        if any(word in message.lower() for word in EXIT_WORDS):
            print("\nAI: Allah Hafiz! Shukriya FashionHub choose karne ka! 🙏❤️")
            break
            
        main(message)