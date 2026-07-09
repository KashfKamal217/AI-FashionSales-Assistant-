import { useState, useEffect } from "react";

export default function ProductModal({
    isOpen,
    onClose,
    onSave,
    editingProduct,
}) {

    const emptyForm = {
        image: "",
        name: "",
        category: "",
        price: "",
        stock: "",
        rating: "",
        discount: "",
        status: "In Stock",
    };

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {

        if (editingProduct) {

            setFormData(editingProduct);

        } else {

            setFormData(emptyForm);

        }

    }, [editingProduct, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave(

            editingProduct
                ? formData
                : {
                      id: Date.now(),
                      ...formData,
                  }

        );

        onClose();

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

            <div className="bg-white w-[650px] p-8 rounded-xl">

                <h2 className="text-2xl font-bold mb-6">

                    {editingProduct ? "Edit Product" : "Add Product"}

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        name="image"
                        placeholder="Image URL"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="stock"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="rating"
                        placeholder="Rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="discount"
                        placeholder="Discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    >
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>

                    <div className="flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded"
                        >
                            {editingProduct ? "Update Product" : "Save Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}