import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
  Search,
  Eye,
  Loader,
  AlertCircle,
  CheckCircle,
  Package,
  MapPin,
  Clock,
  Truck,
  User,
  X,
  ChevronRight,
  Activity,
  Warehouse,
  Box,
  Home,
  ShieldCheck,
  TrendingUp,
  XCircle,
  Copy,
  Check
} from "lucide-react";
const MILESTONES = [
  { key: 'ORDER_PLACED', label: 'Order Placed', icon: Clock, desc: 'Your booking has been received and registered.' },
  { key: 'PENDING_CONFIRMATION', label: 'Pending Confirmation', icon: Activity, desc: 'Our agents are reviewing shipment details.' },
  { key: 'WAITING_TO_BE_SHIPPED', label: 'Waiting Shipping', icon: Box, desc: 'Package is being processed and documented.' },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck, desc: 'Consignment is in transit to destination.' },
  { key: 'AVAILABLE_FOR_PICKUP', label: 'At Terminal', icon: Warehouse, desc: 'Arrived at destination and ready for pickup.' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle, desc: 'Successfully collected or delivered.' },
];

const MilestoneTracker = ({ currentStatus }) => {
  const currentIndex = MILESTONES.findIndex(m => m.key === currentStatus);

  return (
    <div className="py-8 px-4">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100 lg:left-0 lg:top-[19px] lg:bottom-auto lg:right-0 lg:w-full lg:h-0.5" />

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-4 relative">
          {MILESTONES.map((step, index) => {
            const isCompleted = index < currentIndex || currentStatus === 'DELIVERED';
            const isCurrent = index === currentIndex && currentStatus !== 'DELIVERED';
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex lg:flex-col lg:items-center gap-4 lg:text-center w-full group">
                <div className="relative z-10 flex items-center justify-center">
                  <div className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg
                    ${isCompleted ? 'bg-green-600 text-white scale-110' :
                      isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-125 animate-pulse' :
                        'bg-white text-gray-300 border-2 border-gray-100 group-hover:border-gray-300'}
                  `}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="flex flex-col lg:items-center">
                  <h4 className={`text-xs font-black uppercase tracking-widest mb-1 transition-colors ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight max-w-[120px] lg:mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Shipment() {
  const { user } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [paying, setPaying] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [copiedId, setCopiedId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

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

  // 1. Fetch shipments from backend
  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setShipments([]);
        setLoading(false);
        return;
      }
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      const shipmentData = result.data || [];
      setShipments(shipmentData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load shipment data. Please try again.");
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Verify payment callback
  const verifyPayment = useCallback(async (reference) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/payments/verify/${reference}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Payment Confirmed',
          html: `
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Tracking ID</p>
              <p class="text-lg font-black text-slate-900 font-mono mb-4">${result.data?.shipment?.trackingId || 'Verified'}</p>
              <div class="h-px bg-slate-200 mb-4"></div>
              <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Amount Paid</p>
              <p class="text-2xl font-black text-emerald-600">₦${parseFloat(result.data?.amount || 0).toLocaleString()}</p>
              <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-2">Transaction successfully verified</p>
            </div>
          `,
          confirmButtonText: 'Great',
          customClass: { confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold' }
        });
        fetchShipments(); // Refresh list
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: result.message || 'We could not verify this transaction at the moment.',
          customClass: { confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold' }
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
  }, [fetchShipments]);

  // 3. Apply filters callback
  const applyFilters = useCallback(() => {
    let filtered = [...shipments];
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fullName?.toLowerCase().includes(search) ||
          item.email?.toLowerCase().includes(search) ||
          item.phoneNumber?.includes(search) ||
          item.trackingId?.toLowerCase().includes(search)
      );
    }
    if (filterCity !== "all") {
      filtered = filtered.filter((item) => item.destinationCity === filterCity);
    }
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.preferredPickupDate || a.createdAt || 0);
        const dateB = new Date(b.preferredPickupDate || b.createdAt || 0);
        return dateB - dateA;
      } else if (sortBy === "name") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      }
      return 0;
    });
    setFilteredShipments(filtered);
  }, [shipments, searchTerm, filterCity, sortBy]);

  // 4. Effects
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      verifyPayment(reference);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("reference");
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams, verifyPayment]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // 4. Auto-verify if reference is in URL
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trtref');
    if (reference) {
      verifyPayment(reference);
      // Clean up URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, verifyPayment, setSearchParams]);

  // 5. Details fetch
  const fetchShipmentDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      if (result.status === "success" && result.data) {
        setSelectedShipment(result.data);
      }
    } catch (err) {
      console.error("Error fetching shipment details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const isPaid = (item) => {
    if (!item) return false;
    // Check for direct status flags if available
    if (item.paymentStatus === "PAID" || item.isPaid === true || item.paid === true) return true;
    // Fallback to checking the payments array
    if (item.payments && Array.isArray(item.payments)) {
      return item.payments.some(p => p?.status?.toUpperCase() === "SUCCESS" || p?.status?.toUpperCase() === "COMPLETED");
    }
    return false;
  };

  const handlePay = async (item) => {
    const { value: amount } = await Swal.fire({
      title: 'Authorize Payment',
      html: `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
          <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Tracking ID</p>
          <p class="text-lg font-black text-slate-900 font-mono mb-4">${item.trackingId}</p>
          <div class="h-px bg-slate-200 mb-4"></div>
          <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Enter Amount (₦)</p>
          <input 
            type="number" 
            id="swal-input-amount" 
            class="swal2-input w-full m-0 rounded-xl border-slate-200 font-black" 
            placeholder="0.00"
            value="${item.amount || ""}"
          >
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Continue Payment',
      cancelButtonText: 'Abort',
      customClass: {
        confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold',
        cancelButton: 'bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold'
      },
      preConfirm: () => {
        const inputAmount = document.getElementById('swal-input-amount').value;
        if (!inputAmount || parseFloat(inputAmount) <= 0) {
          Swal.showValidationMessage('Please enter a valid amount');
          return false;
        }
        return inputAmount;
      }
    });

    if (!amount) return;

    try {
      setPaying(true);
      Swal.fire({
        title: 'Initializing Secure Link',
        text: 'Syncing with logistics settlement hub...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const token = localStorage.getItem("jwt");
      const payload = {
        shipmentId: item.id || item._id,
        trackingId: item.trackingId,
        amount: Number(amount),
        email: user?.email || item.email,
        callbackUrl: `${window.location.origin}/customer-dashboard/shipments`
      };

      console.log("💳 [Payment Protocol] Initializing with payload:", payload);

      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.status === "success" && result.data?.authorizationUrl) {
        window.location.href = result.data.authorizationUrl;
      } else {
        setPaying(false);
        Swal.fire({
          icon: 'error',
          title: 'Authorization Failed',
          text: result.message || "The settlement gateway declined the request."
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaying(false);
      Swal.fire({
        icon: 'error',
        title: 'Communication Error',
        text: "Could not establish a secure link with the logistics hub."
      });
    }
  };

  const getCities = () => {
    const cities = new Set(
      shipments.map((s) => s.destinationCity).filter(Boolean)
    );
    return Array.from(cities).sort();
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";
    const s = typeof status === 'string' ? status.toUpperCase() : '';

    switch (s) {
      case "ORDER_PLACED":
        return (
          <span className={`${base} bg-slate-100 text-slate-700 uppercase font-black text-[10px]`}>
            <Clock className="w-3 h-3" /> Order Placed
          </span>
        );
      case "PENDING_CONFIRMATION":
        return (
          <span className={`${base} bg-amber-100 text-amber-700 uppercase font-black text-[10px]`}>
            <Activity className="w-3 h-3" /> Confirmation Pending
          </span>
        );
      case "WAITING_TO_BE_SHIPPED":
        return (
          <span className={`${base} bg-indigo-100 text-indigo-700 uppercase font-black text-[10px]`}>
            <Package className="w-3 h-3" /> Processing
          </span>
        );
      case "SHIPPED":
        return (
          <span className={`${base} bg-blue-100 text-blue-700 uppercase font-black text-[10px]`}>
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case "AVAILABLE_FOR_PICKUP":
        return (
          <span className={`${base} bg-teal-100 text-teal-700 uppercase font-black text-[10px]`}>
            <Warehouse className="w-3 h-3" /> At Terminal
          </span>
        );
      case "DELIVERED":
        return (
          <span className={`${base} bg-green-100 text-green-700 uppercase font-black text-[10px]`}>
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case "CANCELLED":
        return (
          <span className={`${base} bg-red-100 text-red-700 uppercase font-black text-[10px]`}>
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>
            {status || "Unknown"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-12 h-12 text-gray-900 animate-spin" />
          <p className="text-gray-700 font-semibold">
            Loading shipment records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shipment
          </h1>
          <p className="text-gray-600">
            Monitor and oversee your active shipments
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Find Consignment
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or tracking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination City
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="all">All Cities</option>
                {getCities().map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="date">Latest First</option>
                <option value="name">Customer Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredShipments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Tracking ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Settlement
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((item) => (
                    <tr key={item.trackingId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.trackingId}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.trackingId);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-900"
                            title="Copy Tracking ID"
                          >
                            {copiedId === item.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell">
                        {item.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        <MapPin className="w-4 h-4 text-gray-400 inline mr-1" />
                        {item.pickupCity} → {item.destinationCity}
                      </td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">₦{parseFloat(item.amount || 0).toLocaleString()}</span>
                          {isPaid(item) ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-tighter">
                              <CheckCircle className="w-2.5 h-2.5" /> Settled
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 uppercase tracking-tighter">
                              <Clock className="w-2.5 h-2.5" /> Unpaid
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-start gap-3">
                          <button
                            onClick={() => {
                              if (selectedShipment?.id === item.id) {
                                setSelectedShipment(null);
                              } else {
                                setSelectedShipment(item);
                                fetchShipmentDetails(item.id);
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition font-medium border border-gray-200 whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">{selectedShipment?.id === item.id ? "Hide" : "View"}</span>
                          </button>

                          {!isPaid(item) && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePay(item); }}
                              disabled={paying}
                              className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-slate-200 whitespace-nowrap"
                            >
                              {paying ? (
                                <Loader size={12} className="animate-spin text-teal-400" />
                              ) : (
                                <div className="w-4 h-4 bg-white/10 rounded flex items-center justify-center text-[8px] font-black text-teal-400">₦</div>
                              )}
                              <span>{paying ? "Redirecting..." : "Pay Now"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              No shipment records found
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedShipment && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal content */}
              <div className="sticky top-0 bg-gray-900 text-white px-6 py-4 md:px-8 md:py-5 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 md:w-7 md:h-7 text-gray-300" />
                  <h2 id="modal-title" className="text-xl md:text-2xl font-bold">
                    Consignment Manifest
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-500" /> Tracking ID
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg text-gray-900 font-semibold">{selectedShipment.trackingId}</p>
                      <button
                        onClick={() => copyToClipboard(selectedShipment.trackingId)}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-900"
                        title="Copy Tracking ID"
                      >
                        {copiedId === selectedShipment.trackingId ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-500" /> Status
                    </p>
                    <div className="mt-2">{getStatusBadge(selectedShipment.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" /> Customer
                    </p>
                    <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.fullName}</p>
                  </div>
                </div>

                {/* Milestone Tracker */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 p-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4 mb-4">
                    Live Progress Tracker
                  </h3>
                  <MilestoneTracker currentStatus={selectedShipment.status} />
                </div>

                {/* Sender Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <User className="w-6 h-6 text-gray-500" /> Sender Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Email</p>
                      <p className="text-lg text-gray-900 font-semibold mt-2 break-all">{selectedShipment.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Phone</p>
                      <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-gray-500" /> Route Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pickup From</p>
                      <p className="text-lg text-gray-900 font-bold">{selectedShipment.pickupCity}</p>
                      <p className="text-gray-600 text-sm mt-1">{selectedShipment.pickupAddress}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Destination To</p>
                      <p className="text-lg text-gray-900 font-bold">{selectedShipment.destinationCity}</p>
                      <p className="text-gray-600 text-sm mt-1">{selectedShipment.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Timing Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-gray-500" /> Schedule Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Scheduled Date</p>
                        <p className="text-lg text-gray-900 font-bold">{selectedShipment.preferredPickupDate?.split('T')[0] || selectedShipment.preferredPickupDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Preferred Time</p>
                        <p className="text-lg text-gray-900 font-bold">{selectedShipment.preferredPickupTime || "Flexible"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <Package className="w-6 h-6 text-gray-500" /> Package Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-600 font-medium">Package Type</p>
                      <p className="text-lg text-gray-900 font-bold mt-1">{selectedShipment.packageType || "General"}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 font-medium">Package Details</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-inner">
                        <p className="text-gray-700 leading-relaxed italic">
                          {selectedShipment.packageDetails || "No specific details provided."}
                        </p>
                      </div>
                    </div>
                    {selectedShipment.specialRequirements && (
                      <div className="lg:col-span-2">
                        <p className="text-sm text-gray-600 font-medium mb-2">Special Requirements</p>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800">
                          <p className="font-medium">{selectedShipment.specialRequirements}</p>
                        </div>
                      </div>
                    )}

                    {/* Additional Details from API */}
                    {selectedShipment.arrivalDate && (
                      <div className="lg:col-span-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-bold uppercase mb-1">Estimated Arrival</p>
                        <p className="text-lg text-blue-900 font-bold">
                          {isNaN(Date.parse(selectedShipment.arrivalDate)) ? "To be confirmed" : new Date(selectedShipment.arrivalDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {selectedShipment.origin && (
                      <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Official Origin</p>
                        <p className="text-gray-900 font-bold">{selectedShipment.origin}</p>
                      </div>
                    )}

                    <div className="lg:col-span-2 border-t border-gray-100 pt-6 mt-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Settlement Status</p>
                          <p className={`text-lg font-bold ${isPaid(selectedShipment) ? 'text-green-600' : 'text-gray-900'}`}>{isPaid(selectedShipment) ? 'Settled (PAID)' : 'Outstanding'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium text-right">Freight Charges</p>
                          <p className="text-2xl font-black text-blue-600 text-right">₦{parseFloat(selectedShipment.amount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      {!isPaid(selectedShipment) && selectedShipment.amount > 0 && (
                        <button
                          onClick={() => handlePay(selectedShipment)}
                          disabled={paying}
                          className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                        >
                          {paying ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                              <span className="text-[10px] font-black">₦</span>
                            </div>
                          )}
                          {paying ? 'Redirecting to Checkout...' : 'Authorize Freight Payment'}
                        </button>
                      )}
                      {!isPaid(selectedShipment) && (!selectedShipment.amount || selectedShipment.amount <= 0) && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <p className="text-sm font-medium text-amber-700">Our logistics experts are finalizing your freight rates.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {loadingDetails && (
                <div className="absolute inset-x-0 bottom-32 flex justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-200 px-4 py-2 rounded-full flex items-center gap-3">
                    <Loader className="w-4 h-4 text-gray-900 animate-spin" />
                    <span className="text-xs font-bold text-gray-900">Loading...</span>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 p-6 md:p-8 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold shadow-sm"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
