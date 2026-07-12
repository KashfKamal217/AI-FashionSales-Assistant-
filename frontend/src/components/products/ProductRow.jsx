import { FaEdit, FaTrash } from "react-icons/fa";

export default function ProductRow({
    product,
    onEdit,
    onDelete,
}) {

    return (

        <tr className="border-b">

            <td className="p-4">

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                />

            </td>

            <td>{product.name}</td>

            <td>{product.category}</td>

            <td>Rs {product.price}</td>

            <td>{product.stock}</td>

            <td> {product.rating}</td>

            <td>{product.discount}</td>

            <td>{product.status}</td>

            <td>

                <div className="flex gap-2 justify-center">

                    <button
                        onClick={() => onEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                        <FaEdit />
                    </button>

                    <button
                        onClick={() => onDelete(product)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    >
                        <FaTrash />
                    </button>

                </div>

            </td>

        </tr>

    );

}