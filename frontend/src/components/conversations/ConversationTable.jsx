import ConversationRow from "./ConversationRow";

export default function ConversationTable({

    conversations,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="p-4 text-left">Customer</th>

                        <th className="p-4 text-left">Platform</th>

                        <th className="p-4 text-left">Message</th>

                        <th className="p-4 text-left">Status</th>

                        <th className="p-4 text-left">Date</th>

                        <th className="p-4 text-center">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        conversations.length > 0 ? (

                            conversations.map((conversation) => (

                                <ConversationRow

                                    key={conversation.id}

                                    conversation={conversation}

                                    onView={onView}

                                    onEdit={onEdit}

                                    onDelete={onDelete}

                                />

                            ))

                        ) : (

                            <tr>

                                <td

                                    colSpan="6"

                                    className="text-center py-8 text-gray-500"

                                >

                                    No conversations found.

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}