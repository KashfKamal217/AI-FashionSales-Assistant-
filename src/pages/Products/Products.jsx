import { useState } from "react";

import productsData from "../../ data/products";

import ProductHeader from "../../components/products/ProductHeader";
import ProductTable from "../../components/products/ProductTable";
import ProductModal from "../../components/products/ ProductModal";
import DeleteModal from "../../components/products/DeleteModal";

export default function Products() {

    const [products, setProducts] = useState(productsData);

    const [showModal, setShowModal] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [deleteProduct, setDeleteProduct] = useState(null);

    // Add Product
    const addProduct = (product) => {

        setProducts((prev) => [
            ...prev,
            {
                id: Date.now(),
                ...product,
            },
        ]);

    };

    // Update Product
    const updateProduct = (updatedProduct) => {

        setProducts((prev) =>
            prev.map((item) =>
                item.id === updatedProduct.id
                    ? updatedProduct
                    : item
            )
        );

    };

    // Save Product
    const handleSave = (product) => {

        if (editingProduct) {

            updateProduct(product);

        } else {

            addProduct(product);

        }

        setEditingProduct(null);

        setShowModal(false);

    };

    // Edit Product
    const handleEdit = (product) => {

        setEditingProduct(product);

        setShowModal(true);

    };

    // Open Delete Modal
    const openDeleteModal = (product) => {

        setDeleteProduct(product);

    };

    // Delete Product
    const handleDelete = () => {

        setProducts((prev) =>
            prev.filter((item) => item.id !== deleteProduct.id)
        );

        setDeleteProduct(null);

    };

    return (

        <div>

            <ProductHeader
                openModal={() => {

                    setEditingProduct(null);

                    setShowModal(true);

                }}
            />

            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={openDeleteModal}
            />

            <ProductModal
                isOpen={showModal}
                onClose={() => {

                    setShowModal(false);

                    setEditingProduct(null);

                }}
                onSave={handleSave}
                editingProduct={editingProduct}
            />

            <DeleteModal
                isOpen={deleteProduct !== null}
                product={deleteProduct}
                onClose={() => setDeleteProduct(null)}
                onConfirm={handleDelete}
            />

        </div>

    );

}