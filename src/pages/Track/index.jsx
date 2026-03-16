import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  ChevronRight,
  ShieldCheck,
  Zap,
  Warehouse,
  Box,
  Activity,
  XCircle,
  ArrowUpLeft,
  ArrowDownRight
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const MILESTONES = [
  { key: 'ORDER_PLACED', label: 'Order Received', icon: Clock, desc: 'Booking received.' },
  { key: 'PENDING_CONFIRMATION', label: 'Confirmed', icon: Activity, desc: 'Reviewing details.' },
  { key: 'WAITING_TO_BE_SHIPPED', label: 'Processing', icon: Box, desc: 'Being documented.' },
  { key: 'SHIPPED', label: 'In Transit', icon: Truck, desc: 'Moving to destination.' },
  { key: 'AVAILABLE_FOR_PICKUP', label: 'At Terminal', icon: Warehouse, desc: 'Ready for collection.' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Success.' },
];

const MilestoneTracker = ({ currentStatus }) => {
  const currentIndex = MILESTONES.findIndex(m => m.key === currentStatus);

  return (
    <div className="py-12 px-4 overflow-x-auto">
      <div className="min-w-[800px] lg:min-w-0 relative">
        {/* Background Line */}
        <div className="absolute left-0 top-[24px] right-0 h-[2px] bg-gray-100" />

        <div className="flex justify-between gap-4 relative">
          {MILESTONES.map((step, index) => {
            const isCompleted = index < currentIndex || currentStatus === 'DELIVERED';
            const isCurrent = index === currentIndex && currentStatus !== 'DELIVERED';
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center w-full group">
                <div className="relative z-10 flex items-center justify-center mb-6">
                  <div className={`
                    w-12 h-12 flex items-center justify-center transition-all duration-500
                    ${isCompleted ? 'bg-[#3B1350] text-white' :
                      isCurrent ? 'bg-black text-white ring-8 ring-gray-50 scale-110' :
                        'bg-white text-gray-300 border border-gray-100 group-hover:border-gray-900'}
                  `}>
                    <Icon size={24} />
                  </div>
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                </div>

                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 transition-colors leading-tight ${isCompleted ? 'text-black' : isCurrent ? 'text-[#3B1350]' : 'text-gray-400'
                  }`}>
                  {step.label}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function TrackShipment() {
  const { trackingId: urlTrackingId } = useParams();
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(urlTrackingId || "");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrackingDetails = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/shipments/track/${id}`);
      const result = await response.json();
      if (result.status === "success" && result.data) {
        setShipment(result.data);
      } else {
        setError(result.message || "Shipment not found. Check ID.");
        setShipment(null);
      }
    } catch (_err) {
      setError("Network error. Try again.");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlTrackingId) fetchTrackingDetails(urlTrackingId);
  }, [urlTrackingId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      const basePath = isDashboard ? "/customer-dashboard/track" : "/track";
      navigate(`${basePath}/${trackingId.trim()}`);
      fetchTrackingDetails(trackingId.trim());
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ORDER_PLACED": return "bg-gray-100 text-gray-900";
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-[#3B1350] text-white";
    }
  };

  const isDashboard = window.location.pathname.includes("dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation & Contextual Header */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isDashboard ? "pt-10" : "pt-8"}`}>
        <button
          onClick={() => navigate(isDashboard ? "/customer-dashboard" : "/")}
          className="flex items-center gap-3 text-black hover:text-[#3B1350] transition-all group mb-8"
        >
          <div className="w-10 h-10 border border-gray-100 flex items-center justify-center group-hover:border-black transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {isDashboard ? "Return to Dashboard" : "Back to Home"}
          </span>
        </button>
      </div>

      {!isDashboard && (
        <section className="relative pb-20 overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Real-Time Tracking</span>
              </div>
              <h1 className="text-6xl lg:text-[8vw] font-black font-heading text-black uppercase tracking-tighter leading-none">
                Track <br className="lg:hidden" /> Shipment
              </h1>
              <p className="max-w-xl text-lg text-gray-500 font-medium leading-relaxed">
                Stay updated on your package journey with our advanced tracking system. Enter your ID below for instant status.
              </p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="relative group">
                <div className="flex flex-col sm:flex-row bg-white border border-gray-200 focus-within:border-black transition-all">
                  <div className="flex-1 flex items-center px-6 py-6">
                    <Search className="w-6 h-6 text-gray-400 mr-4" />
                    <input
                      type="text"
                      placeholder="ENTER TRACKING ID (E.G. EGLN...)"
                      className="w-full bg-transparent border-none focus:ring-0 text-black font-black uppercase tracking-widest placeholder-gray-300 text-sm"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#3B1350] text-white px-12 py-6 font-black uppercase tracking-widest text-sm hover:bg-[#4B1D66] transition-all disabled:opacity-50 flex items-center justify-center min-w-[180px]"
                  >
                    {loading ? "..." : "Track Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Search Section (Compact) */}
      {isDashboard && !shipment && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">Consignment Tracker</h2>
            <p className="text-gray-500 font-medium mb-12">Monitor your high-fidelity logistics movements across our secure network.</p>

            <form onSubmit={handleSearch} className="relative group">
              <div className="flex flex-col sm:flex-row bg-white border border-gray-100 focus-within:border-black transition-all">
                <div className="flex-1 flex items-center px-6 py-5">
                  <Search className="w-5 h-5 text-gray-400 mr-4 shrink-0" />
                  <input
                    type="text"
                    placeholder="ENTER YOUR TRACKING ID (E.G. EGLN...)"
                    className="w-full bg-transparent border-none focus:ring-0 text-black font-black uppercase tracking-widest placeholder-gray-300 text-sm"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-10 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {loading ? "..." : "Retrieve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${isDashboard ? "pt-10" : ""}`}>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-black text-white p-8 border-l-8 border-red-500 flex items-center gap-6"
            >
              <AlertCircle size={32} />
              <p className="font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          {shipment && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-20"
            >
              {/* Main Summary */}
              <div className="grid lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 bg-white border border-gray-100 p-8 lg:p-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-12 border-b border-gray-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tracking ID</p>
                      <h2 className="text-4xl lg:text-5xl font-black text-black tracking-tighter uppercase">{shipment.trackingId}</h2>
                    </div>
                    <div className={`px-6 py-2 font-black uppercase tracking-widest text-xs ${getStatusStyle(shipment.status)}`}>
                      {shipment.status}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-12 mb-12">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Service</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                          <Zap size={18} className="text-[#3B1350]" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-black">{shipment.service?.serviceName || "Standard"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Origin</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                          <MapPin size={18} className="text-gray-900" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-black">{shipment.pickupCity}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Destination</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                          <div className="w-3 h-3 bg-[#3B1350]" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-black">{shipment.destinationCity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 lg:p-10">
                    <MilestoneTracker currentStatus={shipment.status} />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-12">
                  <div className="bg-white border border-gray-100 p-8 lg:p-10">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-8 border-b border-gray-100 pb-4">Receiver Info</h3>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">FullName</p>
                        <p className="font-black uppercase tracking-tighter text-black text-lg">{shipment.fullName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</p>
                        <p className="font-black uppercase tracking-tighter text-black">{shipment.phoneNumber}</p>
                        <p className="text-sm font-medium text-gray-500 break-all">{shipment.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black p-8 lg:p-10 text-white group cursor-pointer">
                    <ShieldCheck className="w-12 h-12 text-[#3B1350] mb-6" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Secure Logistics</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">Your Goods Are Protected By Our Global Security Network And Comprehensive Insurance Policy.</p>
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpLeft className="rotate-45" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-white border-t border-gray-100 pt-20">
                <div className="flex items-center gap-4 mb-16">
                  <div className="w-10 h-1 bg-[#3B1350]"></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-black">Tracking History</h3>
                </div>

                <div className="relative max-w-4xl">
                  <div className="absolute left-[31px] top-4 bottom-0 w-px bg-gray-100" />

                  <div className="space-y-16 relative">
                    {(shipment.trackingUpdates?.length > 0 ? shipment.trackingUpdates : [{ id: 'init', checkpoint: 'Order Processed', location: shipment.pickupCity, date: shipment.createdAt }]).map((update, idx) => (
                      <div key={update.id} className="flex gap-12">
                        <div className={`z-10 w-16 h-16 flex items-center justify-center shrink-0 ${idx === 0 ? "bg-black text-white" : "bg-gray-50 text-gray-300"}`}>
                          <Package size={20} />
                        </div>
                        <div className="pt-2">
                          <div className="flex flex-wrap items-center gap-4 mb-2">
                            <h4 className={`text-2xl font-black uppercase tracking-tighter ${idx === 0 ? "text-black" : "text-gray-400"}`}>
                              {update.checkpoint}
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 text-gray-400">
                              {new Date(update.date).toLocaleDateString()} · {new Date(update.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-500 font-medium flex items-center gap-2">
                            <MapPin size={14} />
                            {update.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
