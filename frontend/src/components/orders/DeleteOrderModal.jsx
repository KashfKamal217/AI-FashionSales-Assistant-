export default function DeleteOrderModal({
  isOpen,
  onClose,
  onConfirm,
  order,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[450px] p-6 shadow-xl">

        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Order
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this order?
        </p>

        {order && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>

            <p>
              <strong>Customer:</strong> {order.customer}
            </p>

            <p>
              <strong>Product:</strong> {order.product}
            </p>

            <p>
              <strong>Total:</strong> Rs {order.total}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}