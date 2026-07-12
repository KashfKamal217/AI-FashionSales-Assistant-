import {

    FaEye,

    FaEdit,

    FaTrash

} from "react-icons/fa";

export default function CustomerRow({

    customer,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <tr className="border-b hover:bg-gray-50 transition">

            <td className="p-4 font-semibold">

                {customer.name}

            </td>

            <td className="p-4">

                {customer.phone}

            </td>

            <td className="p-4">

                {customer.instagram}

            </td>

            <td className="p-4">

                {customer.city}

            </td>

            <td className="p-4">

                {customer.orders}

            </td>

            <td className="p-4">

                <span

                    className={`px-3 py-1 rounded-full text-sm font-semibold

                    ${

                        customer.status === "Active"

                            ? "bg-green-100 text-green-700"

                            : "bg-red-100 text-red-700"

                    }`}

                >

                    {customer.status}

                </span>

            </td>

            <td className="p-4">

                <div className="flex justify-center gap-2">

                    <button

                        onClick={() => onView(customer)}

                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"

                    >

                        <FaEye />

                    </button>

                    <button

                        onClick={() => onEdit(customer)}

                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"

                    >

                        <FaEdit />

                    </button>

                    <button

                        onClick={() => onDelete(customer)}

                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"

                    >

                        <FaTrash />

                    </button>

                </div>

            </td>

        </tr>

    );

}