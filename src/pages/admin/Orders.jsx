import React, { useEffect, useState } from "react";
import { 
  Package, Search, CheckCircle, Clock, AlertCircle, Truck, Calendar, User, MapPin, Download, Eye 
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/backend/get-bookings.php");
      const data = await response.json();
      if (data && data.bookings) {
        setOrders(data.bookings);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(search) ||
        order.trackingId?.toLowerCase().includes(search) ||
        order.email?.toLowerCase().includes(search)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  };

  const confirmDelivered = async (trackingId) => {
    try {
      const response = await fetch("http://localhost/backend/update-booking-status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, status: "Delivered" }),
      });
      const result = await response.json();
      if (result.success) fetchBookings();
    } catch (err) {
      console.error("Error updating delivery:", err);
      setOrders(prev =>
        prev.map(o => o.trackingId === trackingId ? { ...o, status: "Delivered" } : o)
      );
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch("http://localhost/backend/update-booking-status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId: selectedOrder.trackingId, status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setOrders(prev =>
          prev.map(o => o.trackingId === selectedOrder.trackingId ? { ...o, status: newStatus } : o)
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setOrders(prev =>
        prev.map(o => o.trackingId === selectedOrder.trackingId ? { ...o, status: newStatus } : o)
      );
    } finally {
      setShowModal(false);
    }
  };

  const statusConfig = {
    Delivered: { color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle },
    "In Transit": { color: "bg-blue-100 text-blue-700 border-blue-300", icon: Truck },
    Delayed: { color: "bg-red-100 text-red-700 border-red-300", icon: AlertCircle },
    Pending: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: Clock },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-gray-900">Order Management</h2>
        <p className="text-gray-600 mb-6">Manage and track all shipment orders</p>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, tracking ID, email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tracking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => {
                const StatusIcon = statusConfig[order.status]?.icon || Clock;
                return (
                  <tr key={order.trackingId} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-blue-600 font-mono font-semibold">{order.trackingId}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-gray-500 text-xs">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.pickupCity} → {order.destinationCity}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusConfig[order.status]?.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-sm flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 text-gray-700"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      {order.status !== "Delivered" && (
                        <button
                          onClick={() => confirmDelivered(order.trackingId)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Deliver
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b">
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200 text-2xl font-bold">✕</button>
              </div>

              <div className="p-6 space-y-6">
                {/* Tracking Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tracking ID</p>
                    <p className="text-xl font-bold text-blue-600">{selectedOrder.trackingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="text-gray-900 font-semibold">{selectedOrder.date}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><User className="w-5 h-5 text-blue-600"/> Customer Information</h3>
                  <p className="text-gray-600">Name</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.customerName || "—"}</p>
                  <p className="text-gray-600 mt-1">Email</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.email || "—"}</p>
                  <p className="text-gray-600 mt-1">Phone</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.phone || "—"}</p>
                </div>

                {/* Shipment Route */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600"/> Shipment Route</h3>
                  <p className="text-gray-600">Pickup</p>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.pickupAddress || "—"}, {selectedOrder.pickupCity || "—"}
                  </p>
                  <p className="text-gray-600 mt-1">Destination</p>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.destination || "—"}, {selectedOrder.destinationCity || "—"}
                  </p>
                </div>

                {/* Package Info */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600"/> Package Information</h3>
                  <p className="text-gray-600">Type</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.packageType || "—"}</p>
                  <p className="text-gray-600 mt-1">Weight</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.packageWeight || "—"}</p>
                  {selectedOrder.packageDetails && (
                    <>
                      <p className="text-gray-600 mt-1">Details</p>
                      <p className="text-gray-900 font-medium">{selectedOrder.packageDetails}</p>
                    </>
                  )}
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Close */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
