import {

    FaEye,

    FaEdit,

    FaTrash

} from "react-icons/fa";

export default function OrderRow({

    order,

    onView,

    onEdit,

    onDelete

}) {

    const statusColor = () => {

        switch (order.status) {

            case "Pending":

                return "bg-yellow-100 text-yellow-700";

            case "Shipped":

                return "bg-blue-100 text-blue-700";

            case "Delivered":

                return "bg-green-100 text-green-700";

            case "Cancelled":

                return "bg-red-100 text-red-700";

            default:

                return "bg-gray-100 text-gray-700";

        }

    };

    const paymentColor = () => {

        switch (order.payment) {

            case "Paid":

                return "bg-green-100 text-green-700";

            case "Pending":

                return "bg-yellow-100 text-yellow-700";

            case "Refunded":

                return "bg-red-100 text-red-700";

            default:

                return "bg-gray-100 text-gray-700";

        }

    };

    return (

        <tr className="border-b hover:bg-gray-50">

            <td className="p-4 font-semibold">

                {order.orderId}

            </td>

            <td className="p-4">

                {order.customer}

            </td>

            <td className="p-4">

                {order.product}

            </td>

            <td className="p-4">

                {order.quantity}

            </td>

            <td className="p-4">

                Rs {order.total}

            </td>

            <td className="p-4">

                <span

                    className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor()}`}

                >

                    {order.status}

                </span>

            </td>

            <td className="p-4">

                <span

                    className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentColor()}`}

                >

                    {order.payment}

                </span>

            </td>

            <td className="p-4">

                <div className="flex justify-center gap-2">

                    <button

                        onClick={() => onView(order)}

                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"

                    >

                        <FaEye />

                    </button>

                    <button

                        onClick={() => onEdit(order)}

                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"

                    >

                        <FaEdit />

                    </button>

                    <button

                        onClick={() => onDelete(order)}

                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"

                    >

                        <FaTrash />

                    </button>

                </div>

            </td>

        </tr>

    );

}