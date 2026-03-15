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
  XCircle
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const MILESTONES = [
  { key: 'ORDER_PLACED', label: 'Order Placed', icon: Clock, desc: 'Booking received.' },
  { key: 'PENDING_CONFIRMATION', label: 'Confirmation Pending', icon: Activity, desc: 'Reviewing details.' },
  { key: 'WAITING_TO_BE_SHIPPED', label: 'Processing', icon: Box, desc: 'Being documented.' },
  { key: 'SHIPPED', label: 'In Transit', icon: Truck, desc: 'Moving to destination.' },
  { key: 'AVAILABLE_FOR_PICKUP', label: 'At Terminal', icon: Warehouse, desc: 'Ready for collection.' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Success.' },
];

const MilestoneTracker = ({ currentStatus }) => {
  const currentIndex = MILESTONES.findIndex(m => m.key === currentStatus);
  
  return (
    <div className="py-8 px-4 overflow-x-auto">
      <div className="min-w-[600px] lg:min-w-0 relative">
        {/* Background Line */}
        <div className="absolute left-0 top-[19px] right-0 h-0.5 bg-gray-100" />
        
        <div className="flex justify-between gap-4 relative">
          {MILESTONES.map((step, index) => {
            const isCompleted = index < currentIndex || currentStatus === 'DELIVERED';
            const isCurrent = index === currentIndex && currentStatus !== 'DELIVERED';
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex flex-col items-center text-center w-full group">
                <div className="relative z-10 flex items-center justify-center mb-4">
                  <div className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg
                    ${isCompleted ? 'bg-emerald-600 text-white scale-110' : 
                      isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-125 animate-pulse' : 
                      'bg-white text-gray-300 border-2 border-gray-100 group-hover:border-gray-300'}
                  `}>
                    <Icon size={20} />
                  </div>
                </div>
                
                <h4 className={`text-[9px] font-black uppercase tracking-widest mb-1 transition-colors leading-tight ${
                  isCompleted ? 'text-emerald-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
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
        setError(result.message || "Shipment not found. Please check your tracking ID.");
        setShipment(null);
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setError("Network error. Please try again later.");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlTrackingId) {
      fetchTrackingDetails(urlTrackingId);
    }
  }, [urlTrackingId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      const basePath = isDashboard ? "/customer-dashboard/track" : "/track";
      navigate(`${basePath}/${trackingId.trim()}`);
      fetchTrackingDetails(trackingId.trim());
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ORDER_PLACED": return "text-slate-600 bg-slate-50 border-slate-200";
      case "PENDING_CONFIRMATION": return "text-amber-600 bg-amber-50 border-amber-200";
      case "WAITING_TO_BE_SHIPPED": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-200";
      case "AVAILABLE_FOR_PICKUP": return "text-teal-600 bg-teal-50 border-teal-200";
      case "DELIVERED": return "text-green-600 bg-green-50 border-green-200";
      case "CANCELLED": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "ORDER_PLACED": return <Clock className="w-5 h-5" />;
      case "PENDING_CONFIRMATION": return <Activity className="w-5 h-5" />;
      case "WAITING_TO_BE_SHIPPED": return <Package className="w-5 h-5" />;
      case "SHIPPED": return <Truck className="w-5 h-5" />;
      case "AVAILABLE_FOR_PICKUP": return <Warehouse className="w-5 h-5" />;
      case "DELIVERED": return <CheckCircle2 className="w-5 h-5" />;
      case "CANCELLED": return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const isDashboard = window.location.pathname.includes("dashboard");

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 px-4 ${isDashboard ? "pt-6" : "pt-24"}`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(isDashboard ? "/customer-dashboard" : "/")}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-8 group bg-white/50 w-fit px-4 py-2 rounded-xl border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {isDashboard ? "Back to Dashboard" : "Back to Home"}
        </button>

        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 lg:p-10 mb-10 border border-gray-100">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
            <p className="text-gray-600">Enter your tracking ID to get real-time updates on your package location and delivery status.</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 ring-gray-900/5 transition-all">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Enter Tracking ID (e.g. EGLN...)"
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 py-3"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Track"}
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex items-center gap-4"
            >
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {shipment && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* status summary header */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 p-6 lg:p-8 text-white">
                  <div className="flex flex-wrap justify-between items-center gap-6">
                    <div>
                      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Tracking ID</p>
                      <h2 className="text-2xl lg:text-3xl font-bold font-mono">{shipment.trackingId}</h2>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(shipment.status)}`}>
                         {getStatusIcon(shipment.status)}
                         {shipment.status}
                       </span>
                       <p className="text-gray-400 text-xs mt-2 uppercase tracking-wide">Shipment ID: {shipment.shippingId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   <div className="space-y-1">
                     <p className="text-gray-500 text-xs font-bold uppercase">Service Type</p>
                     <div className="flex items-center gap-2 text-gray-900 font-bold">
                       <Zap className="w-4 h-4 text-blue-500" />
                       {shipment.service?.serviceName || "Standard Shipping"}
                     </div>
                   </div>
                   <div className="space-y-1">
                     <p className="text-gray-500 text-xs font-bold uppercase">Estimated Arrival</p>
                     <div className="flex items-center gap-2 text-gray-900 font-bold">
                       <Calendar className="w-4 h-4 text-orange-500" />
                       {shipment.arrivalDate ? new Date(shipment.arrivalDate).toLocaleDateString() : "TBD"}
                     </div>
                   </div>
                   <div className="space-y-1">
                     <p className="text-gray-500 text-xs font-bold uppercase">Origin</p>
                     <div className="flex items-center gap-2 text-gray-900 font-bold">
                       <MapPin className="w-4 h-4 text-green-500" />
                       {shipment.origin || shipment.pickupCity}
                     </div>
                   </div>
                   <div className="space-y-1">
                     <p className="text-gray-500 text-xs font-bold uppercase">Destination</p>
                     <div className="flex items-center gap-2 text-gray-900 font-bold">
                       <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                         <div className="w-2 h-2 rounded-full bg-red-500" />
                       </div>
                       {shipment.destination || shipment.destinationCity}
                     </div>
                   </div>
                </div>

                <div className="border-t border-gray-100 p-6 lg:p-8 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Milestone Progress</h3>
                  <MilestoneTracker currentStatus={shipment.status} />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                       <Truck className="w-6 h-6 text-gray-400" />
                       Tracking History
                    </h3>
                    
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-gray-100" />
                      
                      <div className="space-y-10 relative">
                        {shipment.trackingUpdates?.length > 0 ? (
                          shipment.trackingUpdates.map((update, index) => (
                            <div key={update.id} className="flex gap-6">
                              <div className={`z-10 w-6 h-6 rounded-full border-4 border-white shadow-sm flex-shrink-0 mt-1 ${index === 0 ? "bg-gray-900 scale-125 ring-4 ring-gray-100" : "bg-gray-300"}`} />
                              <div className="flex-1">
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                                  <h4 className={`font-bold ${index === 0 ? "text-gray-900 text-lg" : "text-gray-600"}`}>
                                    {update.checkpoint}
                                  </h4>
                                  <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">
                                    {new Date(update.date).toLocaleDateString()} · {new Date(update.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-gray-500 flex items-center gap-1 text-sm">
                                  <MapPin className="w-3 h-3" />
                                  {update.location}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex gap-6">
                            <div className="z-10 w-6 h-6 rounded-full border-4 border-white shadow-sm bg-gray-900 scale-125 ring-4 ring-gray-100 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg">Order Processed</h4>
                              <p className="text-gray-500 flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3" />
                                {shipment.pickupCity}
                              </p>
                              <span className="text-xs font-bold text-gray-400 uppercase mt-2 block">
                                {new Date(shipment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipment Details Sidebar */}
                <div className="space-y-8">
                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                       <User className="w-5 h-5 text-gray-400" />
                       Receiver Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">Full Name</p>
                          <p className="text-gray-900 font-bold">{shipment.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">Phone Number</p>
                          <p className="text-gray-900 font-bold">{shipment.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">Email</p>
                          <p className="text-gray-900 font-bold break-all">{shipment.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                       <Building className="w-5 h-5 text-gray-400" />
                       Delivery Route
                    </h3>
                    <div className="space-y-6">
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1 bottom-0 w-0.5 bg-gray-100" />
                        <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <p className="text-xs text-gray-400 font-bold uppercase">Pickup</p>
                        <p className="text-gray-900 font-bold text-sm leading-tight mt-1">{shipment.pickupAddress}, {shipment.pickupCity}</p>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                        <p className="text-xs text-gray-400 font-bold uppercase">Destination</p>
                        <p className="text-gray-900 font-bold text-sm leading-tight mt-1">{shipment.deliveryAddress}, {shipment.destinationCity}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-gray-900/20">
                    <ShieldCheck className="w-10 h-10 text-blue-400 mb-4" />
                    <h4 className="text-lg font-bold mb-2">Secure Shipping</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">Your shipment is protected by our global security network and insurance policy.</p>
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 text-sm font-bold transition-all border border-white/10">
                      View Protection Policy
                    </button>
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
