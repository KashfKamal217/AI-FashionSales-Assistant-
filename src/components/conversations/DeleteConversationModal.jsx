export default function DeleteConversationModal({

    isOpen,

    conversation,

    onClose,

    onConfirm

}) {

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl w-[450px] p-8 shadow-xl">

                <h2 className="text-2xl font-bold mb-4">

                    Delete Conversation

                </h2>

                <p className="text-gray-600 mb-8">

                    Are you sure you want to delete the conversation with

                    <span className="font-bold">

                        {" "}
                        {conversation?.customer}
                        {" "}

                    </span>

                    ?

                </p>

                <div className="flex justify-end gap-4">

                    <button

                        onClick={onClose}

                        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={onConfirm}

                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"

                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}