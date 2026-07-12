import { useState } from "react";

import ordersData from "../../ data/orders";

import OrderHeader from "../../components/orders/OrderHeader";
import OrderTable from "../../components/orders/OrderTable";
import OrderModal from "../../components/orders/OrderModal";
import DeleteOrderModal from "../../components/orders/DeleteOrderModal";

export default function Orders() {

    const [orders, setOrders] = useState(ordersData);

    const [showModal, setShowModal] = useState(false);

    const [editingOrder, setEditingOrder] = useState(null);

    const [deleteOrder, setDeleteOrder] = useState(null);

    // =========================
    // ADD ORDER
    // =========================

    const addOrder = (newOrder) => {

        setOrders((prevOrders) => [

            ...prevOrders,

            {
                id: Date.now(),
                ...newOrder,
            }

        ]);

    };

    // =========================
    // UPDATE ORDER
    // =========================

    const updateOrder = (updatedOrder) => {

        setOrders((prevOrders) =>

            prevOrders.map((order) =>

                order.id === updatedOrder.id

                    ? updatedOrder

                    : order

            )

        );

    };

    // =========================
    // SAVE (ADD / UPDATE)
    // =========================

    const handleSave = (order) => {

        if (editingOrder) {

            updateOrder(order);

        } else {

            addOrder(order);

        }

        setEditingOrder(null);

        setShowModal(false);

    };

    // =========================
    // OPEN EDIT MODAL
    // =========================

    const handleEdit = (order) => {

        setEditingOrder(order);

        setShowModal(true);

    };

    // =========================
    // OPEN DELETE MODAL
    // =========================

    const openDeleteModal = (order) => {

        setDeleteOrder(order);

    };

    // =========================
    // DELETE ORDER
    // =========================

    const handleDelete = () => {

        setOrders((prevOrders) =>

            prevOrders.filter(

                (order) => order.id !== deleteOrder.id

            )

        );

        setDeleteOrder(null);

    };

    // =========================
    // VIEW ORDER
    // =========================

    const handleView = (order) => {

        alert(

`Order ID : ${order.orderId}

Customer : ${order.customer}

Product : ${order.product}

Quantity : ${order.quantity}

Total : Rs ${order.total}

Status : ${order.status}

Payment : ${order.payment}

Tracking : ${order.tracking}`

        );

    };

    return (

        <div>

            <OrderHeader

                openModal={() => {

                    setEditingOrder(null);

                    setShowModal(true);

                }}

            />

            <OrderTable

                orders={orders}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={openDeleteModal}

            />

            <OrderModal

                isOpen={showModal}

                editingOrder={editingOrder}

                onSave={handleSave}

                onClose={() => {

                    setShowModal(false);

                    setEditingOrder(null);

                }}

            />

            <DeleteOrderModal

                isOpen={deleteOrder !== null}

                order={deleteOrder}

                onClose={() => setDeleteOrder(null)}

                onConfirm={handleDelete}

            />

        </div>

    );

}