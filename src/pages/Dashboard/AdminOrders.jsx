import React, { useEffect, useState } from "react";
import {
  Package, Search, CheckCircle, Clock, AlertCircle, Truck, Calendar, User, MapPin, Download, Eye, X, ChevronRight, ChevronLeft, Loader, Activity, Warehouse, TrendingUp, Copy, Check, Shield
} from "lucide-react";
import Swal from "sweetalert2";

import { useCallback } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Tracking ID copied'
      });
    });
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");

      const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filterStatus !== "all") params.append("status", filterStatus.toLowerCase());

      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result && result.status === "success") {
        setOrders(result.data);
        setTotalPages(result.meta?.totalPages || 1);
        setTotal(result.meta?.total || 0);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const confirmDelivered = async (order) => {
    // Store the original state for potential rollback on error
    const originalOrders = [...orders];

    // Optimistically update the UI
    const updatedOrders = orders.map((o) =>
      o.id === order.id ? { ...o, status: "DELIVERED" } : o
    );
    setOrders(updatedOrders);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "DELIVERED" }),
      });

      const result = await response.json();
      if (result.status !== "success") {
        throw new Error("Server failed to update status.");
      }
    } catch (err) {
      console.error("Error updating delivery:", err);
      // If the update fails, revert to the original state
      setOrders(originalOrders);
    }
  };

  const isPaid = (item) => {
    if (!item) return false;
    if (item.paymentStatus === "PAID" || item.isPaid === true || item.paid === true) return true;
    if (item.payments && Array.isArray(item.payments)) {
      return item.payments.some(p => p?.status?.toUpperCase() === "SUCCESS" || p?.status?.toUpperCase() === "COMPLETED");
    }
    return false;
  };

  const updateStatus = async (newStatus) => {
    // 1. Check if price is set
    if (!selectedOrder.amount || parseFloat(selectedOrder.amount) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Pricing Required',
        text: 'You must set a shipment price before advancing the status.',
        customClass: { confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold' }
      });
      return;
    }

    // 2. Check if payment is confirmed
    if (!isPaid(selectedOrder)) {
      Swal.fire({
        icon: 'warning',
        title: 'Payment Required',
        text: 'This shipment cannot be moved to the next status until payment is confirmed.',
        customClass: { confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold' }
      });
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/${selectedOrder.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrders(prev =>
          prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o)
        );
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));

        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Shipment status changed to ${newStatus}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire('Update Failed', result.message || 'Error occurred', 'error');
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setShowModal(false);
    }
  };

  const updatePrice = async (amount) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/${selectedOrder.id}/price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrders(prev =>
          prev.map(o => o.id === selectedOrder.id ? { ...o, amount: parseFloat(amount) } : o)
        );
        setSelectedOrder(prev => ({ ...prev, amount: parseFloat(amount) }));
        Swal.fire({
          icon: 'success',
          title: 'Price Updated',
          text: 'Shipment price has been successfully set.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Error updating price:", err);
      Swal.fire('Update Failed', 'Failed to update shipment price', 'error');
    }
  };

  const confirmPaymentManually = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: 'Confirm Payment',
        text: "Are you sure you want to manually mark this shipment as PAID?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Confirm',
        cancelButtonText: 'No',
        customClass: {
          confirmButton: 'bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold',
          cancelButton: 'bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold'
        }
      });

      if (!isConfirmed) return;

      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/${selectedOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: "PAID" }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrders(prev =>
          prev.map(o => o.id === selectedOrder.id ? { ...o, paymentStatus: "PAID" } : o)
        );
        setSelectedOrder(prev => ({ ...prev, paymentStatus: "PAID" }));
        Swal.fire({
          icon: 'success',
          title: 'Payment Confirmed',
          text: 'Shipment has been marked as PAID.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire('Error', result.message || 'Failed to update payment status', 'error');
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      Swal.fire('Error', 'Connection failed', 'error');
    }
  };

  const statusConfig = {
    ORDER_PLACED: { color: "bg-slate-100 text-slate-700 border-slate-300", icon: Clock, label: "Order Placed" },
    PENDING_CONFIRMATION: { color: "bg-amber-100 text-amber-700 border-amber-300", icon: Activity, label: "Confirmed" },
    WAITING_TO_BE_SHIPPED: { color: "bg-indigo-100 text-indigo-700 border-indigo-300", icon: Package, label: "Processing" },
    SHIPPED: { color: "bg-blue-100 text-blue-700 border-blue-300", icon: Truck, label: "In Transit" },
    AVAILABLE_FOR_PICKUP: { color: "bg-teal-100 text-teal-700 border-teal-300", icon: Warehouse, label: "At Terminal" },
    DELIVERED: { color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle, label: "Delivered" },
    CANCELLED: { color: "bg-red-100 text-red-700 border-red-300", icon: X, label: "Cancelled" },
    PENDING: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: Clock, label: "Pending" },
  };

  const getStatusInfo = (status) => {
    const s = status?.toUpperCase() || "PENDING";
    return statusConfig[s] || { color: "bg-gray-100 text-gray-700 border-gray-300", icon: Clock, label: status };
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
        <h2 className="text-4xl font-bold mb-2 text-gray-900">Order</h2>
        <p className="text-gray-600 mb-6">Manage and monitor all shipment orders</p>

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
                <option value="PENDING">Pending</option>
                <option value="TRANSIT">In Transit</option>
                <option value="ARRIVED">Arrived</option>
                <option value="DELIVERED">Delivered</option>
                <option value="DELAY">Delayed</option>
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
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold">Amount</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold">Date</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => {
                return (
                  <tr key={order.trackingId} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-3 md:px-6 md:py-4 text-blue-600 font-mono font-semibold text-xs md:text-base">
                      <div className="flex items-center gap-2">
                        <span>{order.trackingId}</span>
                        <button
                          onClick={() => copyToClipboard(order.trackingId)}
                          className="p-1 hover:bg-blue-50 rounded transition-colors text-blue-400"
                          title="Copy Tracking ID"
                        >
                          {copiedId === order.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm hidden lg:table-cell">
                      <div className="font-medium text-gray-900">{order.fullName}</div>
                      <div className="text-gray-500 text-xs">{order.email}</div>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {order.pickupCity} → {order.destinationCity}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm">
                      <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border flex items-center gap-1 w-fit ${getStatusInfo(order.status).color}`}>
                        {React.createElement(getStatusInfo(order.status).icon, { className: "w-3 h-3 md:w-4 md:h-4" })}
                        {getStatusInfo(order.status).label}
                      </span>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-900 font-bold">
                      {order.amount ? `₦${parseFloat(order.amount).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-600">{order.preferredPickupDate?.split('T')[0] || order.createdAt?.split('T')[0]}</td>
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
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination UI */}
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900 font-bold">{Math.min((currentPage - 1) * limit + 1, total)}</span> to <span className="text-gray-900 font-bold">{Math.min(currentPage * limit, total)}</span> of <span className="text-gray-900 font-bold">{total}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-sm font-bold rounded-lg transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
              {/* Modal Header */}
              <div className="bg-white px-4 py-4 md:px-6 md:py-5 flex items-center justify-between border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm">Tracking ID: <span className="font-mono text-blue-600">{selectedOrder.trackingId}</span></p>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.trackingId)}
                      className="p-1 hover:bg-blue-50 rounded transition-colors text-blue-400"
                      title="Copy Tracking ID"
                    >
                      {copiedId === selectedOrder.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Combined Details */}
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <User className="text-blue-600" size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Customer Protocols</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Entity Name</p>
                          <p className="font-bold text-gray-900">{selectedOrder.fullName || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Line</p>
                          <p className="font-bold text-gray-900">{selectedOrder.phoneNumber || "—"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital Identity</p>
                          <p className="font-bold text-gray-900 truncate">{selectedOrder.email || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipment Info */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Package className="text-blue-600" size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Consignment Data</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Service Logistics</p>
                          <p className="font-bold text-gray-900">{selectedOrder.serviceName || selectedOrder.Service?.serviceName || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Package Type</p>
                          <p className="font-bold text-gray-900">{selectedOrder.packageType || "—"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Manifest Description</p>
                          <div className="bg-slate-50 p-4 rounded-xl text-xs font-medium text-gray-600 italic">
                            {selectedOrder.packageDetails || "No specific instructions registered."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Route & Financials */}
                  <div className="space-y-6">
                    {/* Financial & Status Header */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Financial Valuation</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue={selectedOrder.amount || 0}
                              id="priceUpdateInput"
                              className="w-24 bg-slate-50 border-none rounded-lg text-sm font-black text-blue-600 focus:ring-1 focus:ring-blue-500 py-1"
                            />
                            <button
                              onClick={() => updatePrice(document.getElementById('priceUpdateInput').value)}
                              className="text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            >
                              Set
                            </button>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusInfo(selectedOrder.status).color}`}>
                              {getStatusInfo(selectedOrder.status).label}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Financial Status</p>
                            {isPaid(selectedOrder) ? (
                              <span className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1 justify-center">
                                <CheckCircle size={10} /> Paid
                              </span>
                            ) : (
                              <div className="flex flex-col gap-1 items-end">
                                <span className="px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1 justify-center w-fit">
                                  <Clock size={10} /> Unpaid
                                </span>
                                {selectedOrder.amount > 0 && (
                                  <button
                                    onClick={confirmPaymentManually}
                                    className="text-[8px] font-black uppercase text-blue-600 hover:underline"
                                  >
                                    Confirm Manually
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Route Map */}
                      <div className="relative pl-6 border-l border-dashed border-gray-200 ml-2 space-y-10">
                        <div className="relative">
                          <div className="absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-blue-500 bg-white shadow-sm shadow-blue-500/20"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Origin Node</p>
                          <p className="text-xs font-bold text-gray-900">{selectedOrder.pickupAddress || selectedOrder.pickupCity}</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white shadow-sm shadow-emerald-500/20"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Destination Hub</p>
                          <p className="text-xs font-bold text-gray-900">{selectedOrder.deliveryAddress || selectedOrder.destinationCity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                      <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-all" />
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2">Encryption Signature</h4>
                      <p className="text-slate-400 text-[10px] font-medium leading-relaxed mb-4">Tracking code EGLN{selectedOrder.trackingId.slice(-4)} is verified and protected </p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Secure Connection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Protocol - Redesigned to be more spacious */}
              <div className="p-6 md:p-8 bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-px flex-1 bg-gray-50"></div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-black-300">Update Shipment Status</label>
                    <div className="h-px flex-1 bg-gray-50"></div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                      { key: "ORDER_PLACED", label: "ORDERED" },
                      { key: "PENDING_CONFIRMATION", label: "CONFIRMED" },
                      { key: "WAITING_TO_BE_SHIPPED", label: "PROCESSING" },
                      { key: "SHIPPED", label: "SHIPPED" },
                      { key: "AVAILABLE_FOR_PICKUP", label: "READY FOR PICKUP" },
                      { key: "DELIVERED", label: "DELIVERED" }
                    ].map((status, index, array) => {
                      const sequence = array.map(a => a.key);
                      let currentIdx = sequence.indexOf(selectedOrder.status);

                      // If status is PENDING, treat it as ORDER_PLACED (index 0)
                      if (selectedOrder.status === "PENDING") currentIdx = 0;

                      const effectiveIdx = currentIdx >= 0 ? currentIdx : -1;

                      const isCurrent = index === effectiveIdx;
                      const isPast = index < effectiveIdx;
                      const isNext = index === effectiveIdx + 1;
                      const disabled = !isNext;

                      return (
                        <button
                          key={status.key}
                          onClick={() => updateStatus(status.key)}
                          disabled={disabled}
                          className={`flex-1 min-w-[100px] py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border ${isCurrent
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                            : isPast
                              ? "bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed"
                              : isNext
                                ? "bg-white border-blue-600 text-blue-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm"
                                : "bg-gray-50/50 border-gray-50 text-gray-100 cursor-not-allowed"
                            }`}
                        >
                          {status.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 bg-white border border-gray-200 hover:bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
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