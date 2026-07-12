import { useState, useEffect } from "react";

export default function CustomerModal({

    isOpen,

    onClose,

    onSave,

    editingCustomer

}) {

    const [formData, setFormData] = useState({

        name: "",

        phone: "",

        instagram: "",

        city: "",

        address: "",

        orders: "",

        status: "Active"

    });

    useEffect(() => {

        if (editingCustomer) {

            setFormData(editingCustomer);

        }

        else {

            setFormData({

                name: "",

                phone: "",

                instagram: "",

                city: "",

                address: "",

                orders: "",

                status: "Active"

            });

        }

    }, [editingCustomer, isOpen]);

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

            !formData.name ||

            !formData.phone ||

            !formData.city

        ) {

            alert("Please fill all required fields.");

            return;

        }

        onSave({

            ...formData,

            id: editingCustomer

                ? editingCustomer.id

                : Date.now()

        });

        onClose();

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[650px] rounded-xl p-8 shadow-xl">

                <h2 className="text-2xl font-bold mb-6">

                    {

                        editingCustomer

                            ? "Edit Customer"

                            : "Add Customer"

                    }

                </h2>

                <form

                    onSubmit={handleSubmit}

                    className="space-y-4"

                >

                    <input

                        type="text"

                        name="name"

                        placeholder="Customer Name"

                        value={formData.name}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                    <input

                        type="text"

                        name="phone"

                        placeholder="Phone Number"

                        value={formData.phone}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                    <input

                        type="text"

                        name="instagram"

                        placeholder="Instagram ID"

                        value={formData.instagram}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                    <input

                        type="text"

                        name="city"

                        placeholder="City"

                        value={formData.city}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                    <textarea

                        name="address"

                        placeholder="Address"

                        value={formData.address}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                    <input

                        type="number"

                        name="orders"

                        placeholder="Total Orders"

                        value={formData.orders}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                    <select

                        name="status"

                        value={formData.status}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option>Active</option>

                        <option>Blocked</option>

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

                                editingCustomer

                                    ? "Update Customer"

                                    : "Save Customer"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}