import {

    FaEye,

    FaEdit,

    FaTrash

} from "react-icons/fa";

export default function ConversationRow({

    conversation,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <tr className="border-b hover:bg-gray-50 transition">

            <td className="p-4 font-semibold">

                {conversation.customer}

            </td>

            <td className="p-4">

                {conversation.platform}

            </td>

            <td className="p-4 max-w-xs truncate">

                {conversation.message}

            </td>

            <td className="p-4">

                <span

                    className={`px-3 py-1 rounded-full text-sm font-semibold

                    ${

                        conversation.status === "Open"

                            ? "bg-green-100 text-green-700"

                        : conversation.status === "Pending"

                            ? "bg-yellow-100 text-yellow-700"

                        : conversation.status === "Replied"

                            ? "bg-blue-100 text-blue-700"

                            : "bg-gray-200 text-gray-700"

                    }`}

                >

                    {conversation.status}

                </span>

            </td>

            <td className="p-4">

                {conversation.date}

            </td>

            <td className="p-4">

                <div className="flex justify-center gap-2">

                    <button

                        onClick={() => onView(conversation)}

                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"

                    >

                        <FaEye />

                    </button>

                    <button

                        onClick={() => onEdit(conversation)}

                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"

                    >

                        <FaEdit />

                    </button>

                    <button

                        onClick={() => onDelete(conversation)}

                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"

                    >

                        <FaTrash />

                    </button>

                </div>

            </td>

        </tr>

    );

}