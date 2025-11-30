import React, { useEffect, useState } from "react";
import {
  Package, Search, CheckCircle, Clock, AlertCircle, Truck, Calendar, User, MapPin, Download, Eye, X, ChevronRight
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
    // Store the original state for potential rollback on error
    const originalOrders = [...orders];

    // Optimistically update the UI
    const updatedOrders = orders.map((o) =>
      o.trackingId === trackingId ? { ...o, status: "Delivered" } : o
    );
    setOrders(updatedOrders);

    try {
      const response = await fetch("http://localhost/backend/update-booking-status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, status: "Delivered" }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error("Server failed to update status.");
      }
    } catch (err) {
      console.error("Error updating delivery:", err);
      // If the update fails, revert to the original state
      setOrders(originalOrders);
      // Optionally, you can set an error state here to notify the admin
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
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold">Tracking ID</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold hidden lg:table-cell">Customer</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold hidden lg:table-cell">Route</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold">Status</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold">Date</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => {
                const StatusIcon = statusConfig[order.status]?.icon || Clock;
                return (
                  <tr key={order.trackingId} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-3 md:px-6 md:py-4 text-blue-600 font-mono font-semibold text-xs md:text-base">{order.trackingId}</td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm hidden lg:table-cell">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-gray-500 text-xs">{order.email}</div>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {order.pickupCity} → {order.destinationCity}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm">
                      <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border flex items-center gap-1 w-fit ${statusConfig[order.status]?.color}`}>
                        <StatusIcon className="w-3 h-3 md:w-4 md:h-4" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-600">{order.date}</td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 text-gray-700"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">View</span>
                      </button>
                      {order.status !== "Delivered" && (
                        <button
                          onClick={() => confirmDelivered(order.trackingId)}
                          className="px-2 py-1 md:px-3 md:py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Deliver</span>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
              {/* Modal Header */}
              <div className="bg-white px-4 py-4 md:px-6 md:py-5 flex items-center justify-between border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-500 text-sm mt-1">Tracking ID: <span className="font-mono text-blue-600">{selectedOrder.trackingId}</span></p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Details) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg"><User className="w-6 h-6 text-blue-600" />Customer Details</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-gray-900 font-semibold">{selectedOrder.customerName || "—"}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-gray-900">{selectedOrder.phone || "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-gray-900 break-all">{selectedOrder.email || "—"}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Package Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg"><Package className="w-6 h-6 text-blue-600" />Package Details</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Type</dt>
                        <dd className="mt-1 text-gray-900">{selectedOrder.packageType || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Weight</dt>
                        <dd className="mt-1 text-gray-900">{selectedOrder.packageWeight || "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Details</dt>
                        <dd className="mt-1 text-gray-900">{selectedOrder.packageDetails || "—"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right Column (Status & Route) */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Status Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg"><Truck className="w-6 h-6 text-blue-600" />Status</h3>
                    <div className={`p-3 rounded-lg flex items-center gap-3 ${statusConfig[selectedOrder.status]?.color}`}>
                      {React.createElement(statusConfig[selectedOrder.status]?.icon || Clock, { className: "w-6 h-6" })}
                      <span className="font-bold text-lg">{selectedOrder.status}</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Order Date</p>
                      <p className="text-gray-900 font-semibold">{selectedOrder.date}</p>
                    </div>
                  </div>

                  {/* Shipment Route Timeline */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg"><MapPin className="w-6 h-6 text-blue-600" />Route</h3>
                    <div className="relative border-l-2 border-dashed border-gray-300 ml-3">
                      <div className="mb-8 pl-8 relative">
                        <div className="absolute -left-3.5 top-1 w-6 h-6 bg-white border-2 border-blue-500 rounded-full"></div>
                        <p className="font-semibold text-blue-600">Origin</p>
                        <p className="text-gray-800">{selectedOrder.pickupAddress || "—"}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.pickupCity || "—"}</p>
                      </div>
                      <div className="pl-8 relative">
                        <div className="absolute -left-3.5 top-1 w-6 h-6 bg-white border-2 border-green-500 rounded-full"></div>
                        <p className="font-semibold text-green-600">Destination</p>
                        <p className="text-gray-800">{selectedOrder.destinationAddress || "—"}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.destinationCity || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Update Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Pending", "In Transit", "Delayed", "Delivered"].map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(status)}
                          disabled={selectedOrder.status === status}
                          className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all border-2 ${selectedOrder.status === status
                            ? `${statusConfig[status]?.color} cursor-not-allowed`
                            : "bg-white border-gray-300 hover:border-blue-500 hover:text-blue-600"
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keep animations for modal */}
      <style>{` 
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}