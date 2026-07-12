import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages }) {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6 space-y-4">

            {messages.map((message) => (

                <MessageBubble
                    key={message.id}
                    message={message}
                />

            ))}

        </div>
    );
}