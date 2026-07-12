import OrderRow from "./OrderRow";

export default function OrderTable({

    orders,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            <table className="w-full">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="p-4 text-left">
                            Order ID
                        </th>

                        <th className="p-4 text-left">
                            Customer
                        </th>

                        <th className="p-4 text-left">
                            Product
                        </th>

                        <th className="p-4 text-left">
                            Qty
                        </th>

                        <th className="p-4 text-left">
                            Total
                        </th>

                        <th className="p-4 text-left">
                            Status
                        </th>

                        <th className="p-4 text-left">
                            Payment
                        </th>

                        <th className="p-4 text-center">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        orders.length > 0 ? (

                            orders.map((order) => (

                                <OrderRow

                                    key={order.id}

                                    order={order}

                                    onView={onView}

                                    onEdit={onEdit}

                                    onDelete={onDelete}

                                />

                            ))

                        ) : (

                            <tr>

                                <td

                                    colSpan="8"

                                    className="text-center py-8 text-gray-500"

                                >

                                    No Orders Found

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}