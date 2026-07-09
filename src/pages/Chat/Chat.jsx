import { useState } from "react";

import chatData from "../../ data/chatData";

import ChatHeader from "../../components/chat/ChatHeader";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";

export default function Chat() {

    const conversations = [
        {
            id: 1,
            name: "Ali Ahmed",
            message: "Hi",
            time: "10:00 AM",
        },
        {
            id: 2,
            name: "Sara Khan",
            message: "Hi",
            time: "11:24 AM",
        },
        {
            id: 3,
            name: "Ahmed Raza",
            message: "Black Dress",
            time: "Yesterday",
        },
    ];

    const [selectedConversation, setSelectedConversation] =
        useState(conversations[0]);

    const [messages, setMessages] = useState(chatData);

    const getCurrentTime = () => {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    };

    // ===========================================
    // AI RESPONSE ENGINE (Frontend Demo)
    // ===========================================

    const generateReply = (text) => {

        const msg = text.toLowerCase();

        if (msg.includes("hi") || msg.includes("hello")) {

            return `👋 Welcome to FashionHub ❤️

How may I help you today?

1. New Arrivals
2. Women's Collection
3. Men's Collection
4. Order Tracking
5. Delivery Information`;

        }

        if (
            msg.includes("black") &&
            msg.includes("dress")
        ) {

            return `I found these options for you 👗

• Black Embroidered Maxi
Price: Rs 4,999

• Black Chiffon Dress
Price: Rs 5,499

Would you like to see pictures?`;

        }

        if (
            msg.includes("price")
        ) {

            return `Please tell me the product name.

Example:

• Black Maxi
• Casual Shirt
• Leather Handbag

I'll show you the latest price.`;

        }

        if (
            msg.includes("available")
        ) {

            return `Yes 😊

The product is currently available.

Would you like to know the sizes or place an order?`;

        }

        if (
            msg.includes("size")
        ) {

            return `Available Sizes

XS
S
M
L
XL

Which size do you need?`;

        }

        if (
            msg.includes("color")
        ) {

            return `Available Colors

🖤 Black
❤️ Red
🤍 White
💙 Blue
💚 Green`;

        }

        if (
            msg.includes("delivery")
        ) {

            return `Delivery Charges

Islamabad : Rs 200
Lahore : Rs 250
Karachi : Rs 300

Delivery Time
2 - 4 Working Days`;

        }

        if (
            msg.includes("order")
        ) {

            return `Please provide:

• Product Name
• Size
• Color
• Quantity
• Address

We'll confirm your order immediately.`;

        }

        if (
            msg.includes("discount")
            ||
            msg.includes("sale")
        ) {

            return `🎉 Great News!

Summer Sale is Live.

Up to 30% OFF on selected products.`;

        }

        return `Thank you for your message 😊

Our AI Fashion Assistant is reviewing your request.

We'll reply shortly.`;

    };

    // ===========================================
    // SEND MESSAGE
    // ===========================================

    const handleSend = (text) => {

        const customerMessage = {

            id: Date.now(),

            sender: "customer",

            customer: selectedConversation.name,

            name: selectedConversation.name,

            message: text,

            time: getCurrentTime(),

        };

        setMessages((prev) => [

            ...prev,

            customerMessage,

        ]);

        setTimeout(() => {

            const aiMessage = {

                id: Date.now() + 1,

                sender: "ai",

                customer: selectedConversation.name,

                name: "AI Assistant",

                message: generateReply(text),

                time: getCurrentTime(),

            };

            setMessages((prev) => [

                ...prev,

                aiMessage,

            ]);

        }, 700);

    };

    // ===========================================
    // SHOW ONLY SELECTED CUSTOMER CHAT
    // ===========================================

    const filteredMessages = messages.filter(

        (msg) =>
            msg.customer === selectedConversation.name

    );

    return (

        <div className="bg-white rounded-xl shadow-lg h-[82vh] flex">

            <ChatSidebar

                conversations={conversations}

                selectedConversation={selectedConversation}

                setSelectedConversation={setSelectedConversation}

            />

            <div className="flex flex-col flex-1">

                <ChatHeader />

                <ChatWindow
                    messages={filteredMessages}
                />

                <ChatInput
                    onSend={handleSend}
                />

            </div>

        </div>

    );

}