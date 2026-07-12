export default function CustomerHeader({ openModal }) {

    return (

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-4xl font-bold">
                    Customers
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage all registered customers
                </p>

            </div>

            <button

                onClick={openModal}

                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold shadow"

            >

                + New Customer

            </button>

        </div>

    );

}