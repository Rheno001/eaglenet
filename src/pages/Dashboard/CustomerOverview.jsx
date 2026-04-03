import React, { useState, useEffect, useContext } from "react";
import {
    Package,
    Box,
    RotateCcw,
    CheckCircle,
    Clock,
    PlusCircle,
    Copy,
    Check,
    Truck,
    MapPin,
    Eye,
    Activity,
    Warehouse,
    XCircle,
    X,
    User
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import Swal from "sweetalert2";

const MILESTONES = [
    { key: 'ORDER_PLACED', label: 'Order Placed', icon: Clock, desc: 'Your booking has been received and registered.' },
    { key: 'PENDING_CONFIRMATION', label: 'Confirmed', icon: Activity, desc: 'Our agents are reviewing shipment details.' },
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

export default function CustomerOverview() {
    const { user: authUser } = useContext(AuthContext);
    const [copiedId, setCopiedId] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [paying, setPaying] = useState(false);
    const [services, setServices] = useState([]);

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id).then(() => {
            setCopiedId(id);
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
                title: 'Tracking ID copied to clipboard'
            });
        });
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
                        <Activity className="w-3 h-3" /> Confirmed
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

    const isPaid = (item) => {
        if (!item) return false;
        if (item.paymentStatus === "PAID" || item.isPaid === true || item.paid === true) return true;
        if (item.payments && Array.isArray(item.payments)) {
            return item.payments.some(p => p?.status?.toUpperCase() === "SUCCESS" || p?.status?.toUpperCase() === "COMPLETED");
        }
        return false;
    };

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

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/services`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.status === "success") {
                setServices(result.data);
            }
        } catch (err) {
            console.error("Service fetch error:", err);
        }
    };

    const getServiceName = (serviceId) => {
        if (!serviceId) return "Standard Logistics";
        const service = services.find(s => String(s.id) === String(serviceId));
        return service ? service.serviceName : "Standard Logistics";
    };

    const handlePay = async (item) => {
        try {
            const amount = item.amount;
            if (!amount || amount <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Awaiting Assessment',
                    text: 'Our logistics experts are currently calculating the freight charges for this shipment. Please check back shortly.'
                });
                return;
            }

            setPaying(true);
            Swal.fire({
                title: 'Initializing Secure Link',
                text: 'Processing...',
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
                email: authUser?.email || item.email,
                callbackUrl: `${window.location.origin}/customer-dashboard`
            };

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
    const [stats, setStats] = useState({
        pending: 0,
        processing: 0,
        inTransit: 0,
        delivered: 0,
        delayed: 0,
        totalBookings: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const headers = { Authorization: `Bearer ${token}` };
                const baseUrl = "https://eaglenet-backend.onrender.com";

                // Fetch Dashboard Stats
                const statsRes = await fetch(`${baseUrl}/api/users/me/dashboard`, { headers });
                const statsResult = await statsRes.json();
                if (statsResult.status === "success") {
                    setStats({
                        pending: statsResult.data.pending || 0,
                        processing: statsResult.data.processing || 0,
                        inTransit: statsResult.data.inTransit || 0,
                        delivered: statsResult.data.delivered || 0,
                        delayed: statsResult.data.delayed || 0,
                        totalBookings: statsResult.data.totalBookings || 0
                    });
                }

                // Fetch User Shipments
                const response = await fetch(`${baseUrl}/api/shipments/mine`, { headers });
                const result = await response.json();

                if (result.status === "success") {
                    const shipments = result.data || [];
                    setRecentOrders(shipments.slice(0, 10));
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        fetchServices();
    }, []);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Dashboard...</p>
        </div>
    );

    const dashboardStatsData = [
        { label: "Pending Shipments", value: stats.pending, icon: Clock, bgColor: "bg-orange-50", textColor: "text-orange-600" },
        { label: "Shipments In Transit", value: stats.inTransit, icon: Box, bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
        { label: "Total Delivered", value: stats.delivered, icon: CheckCircle, bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Welcome, {authUser?.firstName || authUser?.name || "Customer"}
                    </h1>
                    <p className="text-slate-500 mt-1">Here's a quick look at your delivery status and account.</p>
                </div>
                <Link
                    to="/customer-dashboard/booking"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95 group"
                >
                    <PlusCircle size={20} />
                    <span>Send Package</span>
                </Link>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={dashboardStatsData} />

            {/* Recent Shipments Table (Same format as Shipments.jsx) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Recent Shipments</h2>
                    <Link to="/customer-dashboard/shipments" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">View All →</Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tracking ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Service</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Settlement</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((item) => (
                                        <tr key={item.trackingId} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{item.trackingId}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(item.trackingId);
                                                        }}
                                                        className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-900"
                                                        title="Copy Tracking ID"
                                                    >
                                                        {copiedId === item.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                    {getServiceName(item.serviceId)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(item.status)}
                                            </td>
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
                                                <button
                                                    onClick={() => {
                                                        setSelectedShipment(item);
                                                        fetchShipmentDetails(item.id || item._id);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition font-medium border border-slate-200 whitespace-nowrap w-fit"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>View Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <RotateCcw size={32} className="animate-spin-slow" />
                                                <p className="font-bold text-xs uppercase tracking-widest">No recent shipments found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Shipment Details Modal */}
            {selectedShipment && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
                    role="dialog"
                    aria-labelledby="modal-title"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-900 text-white px-6 py-4 md:px-8 md:py-5 flex items-center justify-between border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 md:w-7 md:h-7 text-slate-300" />
                                <h2 id="modal-title" className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                                    Shipment Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedShipment(null)}
                                className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 space-y-8 relative min-h-[400px]">
                            {loadingDetails && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                                    <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Syncing Details...</p>
                                </div>
                            )}
                            {/* Overview */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-100">
                                <div>
                                    <p className="text-slate-600 flex items-center gap-2 uppercase tracking-widest text-[10px] font-black">
                                        <Truck className="w-4 h-4 text-slate-500" /> Tracking ID
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-lg text-slate-900 font-black font-mono">{selectedShipment.trackingId}</p>
                                        <button
                                            onClick={() => copyToClipboard(selectedShipment.trackingId)}
                                            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-900"
                                            title="Copy Tracking ID"
                                        >
                                            {copiedId === selectedShipment.trackingId ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-600 flex items-center gap-2 uppercase tracking-widest text-[10px] font-black">
                                        <CheckCircle className="w-4 h-4 text-slate-500" /> Status
                                    </p>
                                    <div className="mt-2">{getStatusBadge(selectedShipment.status)}</div>
                                </div>
                                <div>
                                    <p className="text-slate-600 flex items-center gap-2 uppercase tracking-widest text-[10px] font-black">
                                        <User className="w-4 h-4 text-slate-500" /> Destination
                                    </p>
                                    <p className="text-lg text-slate-900 font-black mt-2">{selectedShipment.destinationCity || "Processing"}</p>
                                </div>
                            </div>

                            {/* Milestone Tracker */}
                            <div className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 p-4">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4 mb-4">
                                    Live Progress Tracker
                                </h3>
                                <MilestoneTracker currentStatus={selectedShipment.status} />
                            </div>

                            {/* Route Info */}
                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-slate-500" /> Route Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Pickup From</p>
                                        <p className="text-lg text-slate-900 font-black">{selectedShipment.pickupCity || "Central"}</p>
                                        <p className="text-slate-600 text-sm mt-1">{selectedShipment.pickupAddress || "Origin Point"}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Destination To</p>
                                        <p className="text-lg text-slate-900 font-black">{selectedShipment.destinationCity || "Terminal"}</p>
                                        <p className="text-slate-600 text-sm mt-1">{selectedShipment.deliveryAddress || "Destination Point"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Package Info */}
                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <Package className="w-6 h-6 text-slate-500" /> Package Information
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Service Type</p>
                                        <p className="text-lg font-black mt-1 text-blue-600">{getServiceName(selectedShipment.serviceId)}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Package Category</p>
                                        <p className="text-lg text-slate-900 font-black mt-1 uppercase tracking-tighter">{selectedShipment.packageType || "General"}</p>
                                    </div>
                                    <div className="lg:col-span-2 border-t border-slate-100 pt-6 mt-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Settlement Status</p>
                                                <p className={`text-lg font-black uppercase tracking-tighter ${isPaid(selectedShipment) ? 'text-emerald-600' : 'text-slate-900'}`}>{isPaid(selectedShipment) ? 'Settled (PAID)' : 'Outstanding'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px] text-right">Freight Charges</p>
                                                <p className="text-2xl font-black text-blue-600 text-right">₦{parseFloat(selectedShipment.amount || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {!isPaid(selectedShipment) && selectedShipment.amount > 0 && (
                                            <button
                                                onClick={() => handlePay(selectedShipment)}
                                                disabled={paying}
                                                className="w-full mt-4 py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-black rounded-xl shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 p-6 md:p-8 flex justify-end gap-4">
                            <button
                                onClick={() => setSelectedShipment(null)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-bold uppercase tracking-widest text-xs shadow-xl shadow-slate-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

