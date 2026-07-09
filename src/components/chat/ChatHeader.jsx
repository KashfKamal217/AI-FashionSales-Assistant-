export default function ChatHeader() {
    return (

        <div className="flex justify-between items-center border-b bg-white px-6 py-4">

            <div>

                <h2 className="text-2xl font-bold">
                    AI Fashion Sales Assistant
                </h2>

                <p className="text-gray-500">
                    Customer Support Chat
                </p>

            </div>

            <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-green-500"></span>

                <span className="font-semibold text-green-600">
                    Online
                </span>

            </div>

        </div>

    );
}