import { useState, useEffect } from "react";

export default function OrderModal({

    isOpen,

    onClose,

    onSave,

    editingOrder

}) {

    const [formData, setFormData] = useState({

        orderId: "",

        customer: "",

        product: "",

        quantity: "",

        total: "",

        payment: "Paid",

        status: "Pending",

        tracking: ""

    });

    // Fill form when editing
    useEffect(() => {

        if (editingOrder) {

            setFormData(editingOrder);

        } else {

            setFormData({

                orderId: "",

                customer: "",

                product: "",

                quantity: "",

                total: "",

                payment: "Paid",

                status: "Pending",

                tracking: ""

            });

        }

    }, [editingOrder, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (

            !formData.customer ||

            !formData.product ||

            !formData.quantity ||

            !formData.total

        ) {

            alert("Please fill all required fields.");

            return;

        }

        onSave({

            ...formData,

            id: editingOrder ? editingOrder.id : Date.now(),

            orderId:

                editingOrder

                    ? editingOrder.orderId

                    : `ORD-${Date.now()}`,

            tracking:

                editingOrder

                    ? editingOrder.tracking

                    : `TRK-${Date.now()}`

        });

        onClose();

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[650px] rounded-xl p-8 shadow-xl">

                <h2 className="text-2xl font-bold mb-6">

                    {editingOrder ? "Edit Order" : "Add Order"}

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

                    <input

                        type="text"

                        name="product"

                        placeholder="Product"

                        value={formData.product}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        required

                    />

                    <input

                        type="number"

                        name="quantity"

                        placeholder="Quantity"

                        value={formData.quantity}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        required

                    />

                    <input

                        type="number"

                        name="total"

                        placeholder="Total"

                        value={formData.total}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        required

                    />

                    <select

                        name="payment"

                        value={formData.payment}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option>Paid</option>

                        <option>Pending</option>

                        <option>Refunded</option>

                    </select>

                    <select

                        name="status"

                        value={formData.status}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option>Pending</option>

                        <option>Shipped</option>

                        <option>Delivered</option>

                        <option>Cancelled</option>

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

                            {editingOrder ? "Update Order" : "Save Order"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}