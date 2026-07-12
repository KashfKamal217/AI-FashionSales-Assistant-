import { useState } from "react";

export default function ChatInput({ onSend }) {

    const [text, setText] = useState("");

    const sendMessage = () => {

        if (!text.trim()) return;

        onSend(text);

        setText("");

    };

    return (

        <div className="border-t bg-white p-4 flex gap-3">

            <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                }}
                className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg font-semibold"
            >
                Send
            </button>

        </div>

    );

}