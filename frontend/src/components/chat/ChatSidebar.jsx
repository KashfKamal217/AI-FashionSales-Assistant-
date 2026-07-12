export default function ChatSidebar({

    conversations,

    selectedConversation,

    setSelectedConversation

}) {

    return (

        <div className="w-80 bg-white border-r overflow-y-auto">

            <div className="p-5 border-b">

                <h2 className="text-xl font-bold">

                    Customers

                </h2>

            </div>

            {

                conversations.map((chat) => (

                    <div

                        key={chat.id}

                        onClick={() => setSelectedConversation(chat)}

                        className={`

                        p-4

                        cursor-pointer

                        border-b

                        hover:bg-gray-100

                        ${selectedConversation?.id === chat.id

                            ? "bg-blue-100"

                            : ""}

                        `}

                    >

                        <div className="flex justify-between">

                            <h3 className="font-semibold">

                                {chat.name}

                            </h3>

                            <span className="text-xs text-gray-500">

                                {chat.time}

                            </span>

                        </div>

                        <p className="text-gray-500 text-sm truncate mt-1">

                            {chat.message}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}