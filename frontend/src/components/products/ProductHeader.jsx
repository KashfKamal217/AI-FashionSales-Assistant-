const ProductHeader = ({ openModal }) => {

    return (

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-4xl font-bold">
                    Products
                </h1>

                <p className="text-gray-500">
                    Manage your fashion products
                </p>

            </div>

            <button

                onClick={openModal}

                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

            >

                + Add Product

            </button>

        </div>

    );

};

export default ProductHeader;