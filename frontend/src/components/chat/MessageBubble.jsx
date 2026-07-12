export default function MessageBubble({ message }) {

    return (

        <div
            className={`flex ${
                message.sender === "customer"
                    ? "justify-start"
                    : "justify-end"
            }`}
        >

            <div
                className={`max-w-[70%] rounded-xl px-5 py-3 shadow ${
                    message.sender === "customer"
                        ? "bg-white"
                        : "bg-blue-600 text-white"
                }`}
            >

                <h3 className="font-bold mb-1">
                    {message.name}
                </h3>

                <p className="whitespace-pre-line">
                    {message.message}
                </p>

                <p
                    className={`text-xs mt-2 ${
                        message.sender === "customer"
                            ? "text-gray-500"
                            : "text-blue-100"
                    }`}
                >
                    {message.time}
                </p>

            </div>

        </div>

    );

}