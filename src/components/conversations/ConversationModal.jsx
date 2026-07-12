import { useState, useEffect } from "react";

export default function ConversationModal({

    isOpen,

    onClose,

    onSave,

    editingConversation

}) {

    const [formData, setFormData] = useState({

        customer: "",

        platform: "Instagram",

        message: "",

        status: "Open",

        date: new Date().toLocaleDateString()

    });

    useEffect(() => {

        if (editingConversation) {

            setFormData(editingConversation);

        } else {

            setFormData({

                customer: "",

                platform: "Instagram",

                message: "",

                status: "Open",

                date: new Date().toLocaleDateString()

            });

        }

    }, [editingConversation, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({

            ...formData,

            id: editingConversation

                ? editingConversation.id

                : Date.now()

        });

        onClose();

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl w-[650px] p-8 shadow-xl">

                <h2 className="text-2xl font-bold mb-6">

                    {

                        editingConversation

                            ? "Edit Conversation"

                            : "New Conversation"

                    }

                </h2>

                <form

                    onSubmit={handleSubmit}

                    className="space-y-4"

                >

                    <input

                        type="text"

                        name="customer"

                        placeholder="Customer Name"

                        value={formData.customer}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        required

                    />

                    <select

                        name="platform"

                        value={formData.platform}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option>Instagram</option>

                        <option>WhatsApp</option>

                    </select>

                    <textarea

                        rows="4"

                        name="message"

                        placeholder="Customer Message"

                        value={formData.message}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        required

                    />

                    <select

                        name="status"

                        value={formData.status}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option>Open</option>

                        <option>Pending</option>

                        <option>Replied</option>

                        <option>Closed</option>

                    </select>

                    <div className="flex justify-end gap-4">

                        <button

                            type="button"

                            onClick={onClose}

                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

                        >

                            {

                                editingConversation

                                    ? "Update Conversation"

                                    : "Save Conversation"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}