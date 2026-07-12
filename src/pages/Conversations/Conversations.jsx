import { useState } from "react";

import conversationsData from "../../ data/conversations";

import ConversationHeader from "../../components/conversations/ConversationHeader";
import ConversationTable from "../../components/conversations/ConversationTable";
import ConversationModal from "../../components/conversations/ConversationModal";
import DeleteConversationModal from "../../components/conversations/DeleteConversationModal";

export default function Conversations() {

    const [conversations, setConversations] = useState(conversationsData);

    const [showModal, setShowModal] = useState(false);

    const [editingConversation, setEditingConversation] = useState(null);

    const [deleteConversation, setDeleteConversation] = useState(null);

    // ==========================
    // ADD CONVERSATION
    // ==========================

    const addConversation = (newConversation) => {

        setConversations((prev) => [

            ...prev,

            {

                id: Date.now(),

                ...newConversation

            }

        ]);

    };

    // ==========================
    // UPDATE CONVERSATION
    // ==========================

    const updateConversation = (updatedConversation) => {

        setConversations((prev) =>

            prev.map((conversation) =>

                conversation.id === updatedConversation.id

                    ? updatedConversation

                    : conversation

            )

        );

    };

    // ==========================
    // SAVE
    // ==========================

    const handleSave = (conversation) => {

        if (editingConversation) {

            updateConversation(conversation);

        }

        else {

            addConversation(conversation);

        }

        setEditingConversation(null);

        setShowModal(false);

    };

    // ==========================
    // EDIT
    // ==========================

    const handleEdit = (conversation) => {

        setEditingConversation(conversation);

        setShowModal(true);

    };

    // ==========================
    // DELETE MODAL
    // ==========================

    const openDeleteModal = (conversation) => {

        setDeleteConversation(conversation);

    };

    // ==========================
    // DELETE
    // ==========================

    const handleDelete = () => {

        setConversations((prev) =>

            prev.filter(

                (conversation) =>

                    conversation.id !== deleteConversation.id

            )

        );

        setDeleteConversation(null);

    };

    // ==========================
    // VIEW
    // ==========================

    const handleView = (conversation) => {

        alert(

`Customer : ${conversation.customer}

Platform : ${conversation.platform}

Message :

${conversation.message}

Status : ${conversation.status}

Date : ${conversation.date}`

        );

    };

    return (

        <div>

            <ConversationHeader

                openModal={() => {

                    setEditingConversation(null);

                    setShowModal(true);

                }}

            />

            <ConversationTable

                conversations={conversations}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={openDeleteModal}

            />

            <ConversationModal

                isOpen={showModal}

                editingConversation={editingConversation}

                onSave={handleSave}

                onClose={() => {

                    setShowModal(false);

                    setEditingConversation(null);

                }}

            />

            <DeleteConversationModal

                isOpen={deleteConversation !== null}

                conversation={deleteConversation}

                onClose={() => setDeleteConversation(null)}

                onConfirm={handleDelete}

            />

        </div>

    );

}