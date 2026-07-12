import CustomerRow from "./CustomerRow";

export default function CustomerTable({

    customers,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="p-4 text-left">Name</th>

                        <th className="p-4 text-left">Phone</th>

                        <th className="p-4 text-left">Instagram</th>

                        <th className="p-4 text-left">City</th>

                        <th className="p-4 text-left">Orders</th>

                        <th className="p-4 text-left">Status</th>

                        <th className="p-4 text-center">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {customers.length > 0 ? (

                        customers.map((customer) => (

                            <CustomerRow

                                key={customer.id}

                                customer={customer}

                                onView={onView}

                                onEdit={onEdit}

                                onDelete={onDelete}

                            />

                        ))

                    ) : (

                        <tr>

                            <td

                                colSpan="7"

                                className="text-center py-8 text-gray-500"

                            >

                                No customers found.

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    );

}