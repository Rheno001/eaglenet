import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Package, Search, CheckCircle, Clock, Truck, Calendar, User, Eye, X, ChevronRight, ChevronLeft, Loader, Activity, Warehouse, TrendingUp, Copy, Check, Shield
} from "lucide-react";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [services, setServices] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/shipments/services`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setServices(result.data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  }, []);

  const getServiceName = (serviceId) => {
    if (!serviceId) return "—";
    const service = services.find(s => String(s.id) === String(serviceId));
    return service ? service.serviceName : "Standard Logistics";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        icon: 'success',
        title: 'ID copied'
      });
    });
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const MOCK_ORDERS = [
    { id: "1", trackingId: "TRK-AF1023-2026", fullName: "Ambassador Michael Chen", email: "m.chen@embassy.gov", pickupCity: "Washington DC", destinationCity: "Beijing", status: "SHIPPED", createdAt: "2026-04-10T10:00:00Z" },
    { id: "2", trackingId: "TRK-GL9928-2026", fullName: "Sophia Rodriguez", email: "sophia.rod@techcorp.com", pickupCity: "Berlin", destinationCity: "Tokyo", status: "WAITING_TO_BE_SHIPPED", createdAt: "2026-04-12T14:30:00Z" },
    { id: "3", trackingId: "TRK-UK4412-2026", fullName: "James Wilson", email: "j.wilson@logistics.uk", pickupCity: "London", destinationCity: "New York", status: "DELIVERED", createdAt: "2026-04-05T09:15:00Z" },
    { id: "4", trackingId: "TRK-CA5567-2026", fullName: "Emma Thompson", email: "emma.t@global.ca", pickupCity: "Toronto", destinationCity: "Paris", status: "ORDER_PLACED", createdAt: "2026-04-15T11:45:00Z" },
    { id: "5", trackingId: "TRK-SG8821-2026", fullName: "Li Wei", email: "li.wei@asia.sg", pickupCity: "Singapore", destinationCity: "Sydney", status: "SHIPPED", createdAt: "2026-04-11T16:20:00Z" },
  ];

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    // Simulating API delay
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setTotal(MOCK_ORDERS.length);
      setTotalPages(1);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, [fetchBookings, fetchServices]);

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
            <Package className="text-white" size={28} />
          </div>
          Packages
        </h1>
        <p className="text-slate-500 font-medium mt-3 text-lg">View and manage all customer packages.</p>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest text-[10px]">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, tracking ID, email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest text-[10px]">Status Filter</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">All</option>
                <option value="PENDING">Pending</option>
                <option value="TRANSIT">In Transit</option>
                <option value="ARRIVED">Arrived</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tracking ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 hidden lg:table-cell">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 hidden lg:table-cell">Route</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.trackingId} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-blue-600 font-mono font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <span>{order.trackingId}</span>
                        <button onClick={() => copyToClipboard(order.trackingId)} className="text-slate-300 hover:text-slate-900">
                          {copiedId === order.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm hidden lg:table-cell">
                      <div className="font-bold text-slate-900">{order.fullName}</div>
                      <div className="text-slate-400 text-xs">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell">
                      {order.pickupCity} → {order.destinationCity}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 w-fit ${getStatusInfo(order.status).color}`}>
                        {React.createElement(getStatusInfo(order.status).icon, { size: 12 })}
                        {getStatusInfo(order.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin-dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                      >
                        <Eye size={14} /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Showing {Math.min((currentPage - 1) * limit + 1, total)} - {Math.min(currentPage * limit, total)} of {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-black text-slate-900 mx-2">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}