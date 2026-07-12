import { useState, useEffect } from "react";

import ChatHeader from "../../components/chat/ChatHeader";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";

const API_BASE = "http://localhost:3000/api";

export default function Chat() {

    const conversations = [
        { id: 1, name: "Ali Ahmed", message: "Hi", time: "10:00 AM" },
        { id: 2, name: "Sara Khan", message: "Hi", time: "11:24 AM" },
        { id: 3, name: "Ahmed Raza", message: "Black Dress", time: "Yesterday" },
    ];

    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);

    const getTime = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Jab customer switch ho, backend se uski chat history laao
    useEffect(() => {

        fetch(`${API_BASE}/chat/${encodeURIComponent(selectedConversation.name)}`)
            .then((res) => res.json())
            .then((history) => {
                // agar backend array na de (error object de) to empty array use karo
                const safeHistory = Array.isArray(history) ? history : [];
                setMessages((prev) => [
                    ...prev.filter((m) => m.customer !== selectedConversation.name),
                    ...safeHistory,
                ]);
            })
            .catch((err) => console.error("Failed to load chat history:", err));

    }, [selectedConversation]);

    // Message bhejna -> backend -> Python AI brain -> real reply
    const handleSend = (text) => {

        if (!text || !text.trim() || sending) return;

        setSending(true);

        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            sender: "customer",
            customer: selectedConversation.name,
            name: selectedConversation.name,
            message: text,
            time: getTime(),
        };

        setMessages((prev) => [...prev, optimisticMsg]);

        fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer: selectedConversation.name, message: text }),
        })
            .then((res) => res.json())
            .then((data) => {

                // safe extraction — agar koi field missing ho to crash na ho
                const customerMessage = data?.customerMessage || optimisticMsg;
                const aiMessage = data?.aiMessage || {
                    id: `ai-${Date.now()}`,
                    sender: "ai",
                    customer: selectedConversation.name,
                    name: "AI Assistant",
                    message: data?.error || "Sorry, AI reply nahi mila.",
                    time: getTime(),
                };

                setMessages((prev) => [
                    ...prev.filter((m) => m.id !== optimisticMsg.id),
                    customerMessage,
                    aiMessage,
                ]);

            })
            .catch((err) => {

                console.error("Failed to send message:", err);

                setMessages((prev) => [
                    ...prev,
                    {
                        id: `error-${Date.now()}`,
                        sender: "ai",
                        customer: selectedConversation.name,
                        name: "AI Assistant",
                        message: "Sorry, server se connect nahi ho paya. Dobara koshish karein.",
                        time: getTime(),
                    },
                ]);

            })
            .finally(() => setSending(false));

    };

    const filteredMessages = messages.filter(
        (msg) => msg && msg.customer === selectedConversation.name
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

                <ChatWindow messages={filteredMessages} />

                <ChatInput onSend={handleSend} />

            </div>

        </div>

    );

}