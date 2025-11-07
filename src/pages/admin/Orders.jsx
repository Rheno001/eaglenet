import React, { useState } from "react";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Dummy data — will be replaced with API later
  const [orders, setOrders] = useState([
    { id: 2341, customer: "John Doe", status: "Delivered", date: "Nov 15, 2025" },
    { id: 2339, customer: "Blessing Paul", status: "In Transit", date: "Nov 14, 2025" },
    { id: 2332, customer: "Uche O.", status: "Delayed", date: "Nov 13, 2025" },
    { id: 2325, customer: "Kelechi", status: "Delivered", date: "Nov 12, 2025" },
    { id: 2362, customer: "Mr Bate", status: "Pending", date: "Nov 11, 2025" },
    { id: 2312, customer: "Nicki Minaj", status: "Pending", date: "Nov 11, 2025" },
    { id: 2352, customer: "Grace A.", status: "Pending", date: "Nov 11, 2025" },
    { id: 2322, customer: "jack Hoff", status: "Pending", date: "Nov 11, 2025" },
    { id: 2422, customer: "Mary Jane.", status: "Pending", date: "Nov 11, 2025" },
    { id: 2325, customer: "John Bellion.", status: "Pending", date: "Nov 11, 2025" },
    { id: 2302, customer: "Mike Oxlong", status: "Pending", date: "Nov 11, 2025" },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id).includes(search);

    const matchStatus =
      filterStatus === "All" || order.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-yellow-100 text-yellow-700";
      case "Delayed":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const saveStatus = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? selectedOrder : o
      )
    );

    // Close modal
    setShowModal(false);

    // Later: Add API call here to update status in backend
    // axios.post('/update_order_status.php', { id: selectedOrder.id, status: selectedOrder.status })
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Delivered</option>
          <option>In Transit</option>
          <option>Delayed</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3">#{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3 text-center">
                      <button
                        className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Order #{selectedOrder.id}</h3>

            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>

            <label className="block mt-4 text-sm font-medium">Update Status</label>
            <select
              value={selectedOrder.status}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, status: e.target.value })
              }
              className="border w-full p-2 rounded mt-1"
            >
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delayed</option>
              <option>Delivered</option>
            </select>

            <div className="flex justify-end mt-5 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>

              <button
                onClick={saveStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
