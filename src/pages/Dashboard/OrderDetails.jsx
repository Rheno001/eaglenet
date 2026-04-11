import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Package, User, MapPin, Clock, ArrowLeft, CheckCircle, Activity, 
  Warehouse, Shield, TrendingUp, Loader, Check, Copy, X, Truck
} from "lucide-react";
import Swal from "sweetalert2";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/shipments/${orderId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrder(result.data);
      } else {
        Swal.fire('Error', 'Shipment not found', 'error');
        navigate('/admin-dashboard/orders');
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      Swal.fire('Error', 'Connection failed', 'error');
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

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

  const fetchDepartments = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/departments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setDepartments(result.data);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, []);

  const fetchWorkflow = useCallback(async () => {
    setLoadingWorkflow(true);
    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/workflows/${orderId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setWorkflowSteps(result.data);
      }
    } catch (err) {
      console.error("Error fetching workflow:", err);
    } finally {
      setLoadingWorkflow(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    fetchServices();
    fetchDepartments();
    fetchWorkflow();
  }, [fetchOrder, fetchServices, fetchDepartments, fetchWorkflow]);

  const getServiceName = (serviceId) => {
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

  const isPaid = (item) => {
    if (!item) return false;
    if (item.paymentStatus === "PAID" || item.isPaid === true || item.paid === true) return true;
    if (item.payments && Array.isArray(item.payments)) {
      return item.payments.some(p => p?.status?.toUpperCase() === "SUCCESS" || p?.status?.toUpperCase() === "COMPLETED");
    }
    return false;
  };

  const updateStatus = async (newStatus) => {
    if (!order.amount || parseFloat(order.amount) <= 0) {
      Swal.fire('Pricing Required', 'Set price before advancing status.', 'warning');
      return;
    }
    if (!isPaid(order)) {
      Swal.fire('Payment Required', 'Payment must be confirmed first.', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/shipments/${order.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrder(prev => ({ ...prev, status: newStatus }));
        Swal.fire({ icon: 'success', title: 'Status Updated', toast: true, position: 'top-end', timer: 3000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updatePrice = async (amount) => {
    const details = order.packageDetails || order.packagedetails;
    if (!details || details.trim() === "") {
      Swal.fire('Details Required', 'Provide package details first.', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/shipments/${order.id}/price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrder(prev => ({ ...prev, amount: parseFloat(amount) }));
        Swal.fire({ icon: 'success', title: 'Price Updated', toast: true, position: 'top-end', timer: 3000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updatePackageDetails = async (details) => {
    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/shipments/${order.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: order.status === "PENDING" ? "ORDER_PLACED" : order.status,
          packageDetails: details
        }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrder(prev => ({ ...prev, packageDetails: details, packagedetails: details }));
        Swal.fire({ icon: 'success', title: 'Details Saved', toast: true, position: 'top-end', timer: 3000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const advanceWorkflow = async (departmentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/workflows/${orderId}/attach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ departmentId }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setWorkflowSteps(result.data);
        Swal.fire({ icon: 'success', title: 'Workflow Advanced', toast: true, position: 'top-end', timer: 3000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmPaymentManually = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirm Payment',
      text: "Mark this shipment as PAID?",
      icon: 'question',
      showCancelButton: true
    });

    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("jwt");
      const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/shipments/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: order.id, paymentStatus: "PAID" }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setOrder(prev => ({ ...prev, paymentStatus: "PAID" }));
        Swal.fire({ icon: 'success', title: 'Payment Confirmed', toast: true, position: 'top-end', timer: 3000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusConfig = {
    ORDER_PLACED: { color: "bg-slate-100 text-slate-700", icon: Clock, label: "Order Placed" },
    PENDING_CONFIRMATION: { color: "bg-amber-100 text-amber-700", icon: Activity, label: "Confirmed" },
    WAITING_TO_BE_SHIPPED: { color: "bg-indigo-100 text-indigo-700", icon: Package, label: "Processing" },
    SHIPPED: { color: "bg-blue-100 text-blue-700", icon: Truck, label: "In Transit" },
    AVAILABLE_FOR_PICKUP: { color: "bg-teal-100 text-teal-700", icon: Warehouse, label: "At Terminal" },
    DELIVERED: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Delivered" },
    CANCELLED: { color: "bg-red-100 text-red-700", icon: X, label: "Cancelled" },
    PENDING: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
  };

  const getStatusInfo = (status) => {
    const s = status?.toUpperCase() || "PENDING";
    return statusConfig[s] || { color: "bg-gray-100 text-gray-700", icon: Clock, label: status };
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:shadow-lg group-hover:scale-110 transition-all">
                <ArrowLeft size={16} />
              </div>
              Back to Orders
            </button>
            <div className="flex items-center gap-4">
               <div className="p-4 bg-slate-900 rounded-[1.5rem] shadow-2xl shadow-slate-200">
                  <Package className="text-white" size={28} />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Shipment Details
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm">Tracking ID: <span className="font-mono text-blue-600 font-bold">{order.trackingId}</span></p>
                    <button onClick={() => copyToClipboard(order.trackingId)} className="text-slate-300 hover:text-slate-900 transition-colors">
                      {copiedId === order.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <span className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusInfo(order.status).color}`}>
                {React.createElement(getStatusInfo(order.status).icon, { size: 14 })}
                {getStatusInfo(order.status).label}
             </span>
             {isPaid(order) ? (
               <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                 <CheckCircle size={14} /> Paid
               </span>
             ) : (
               <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                 <Clock size={14} /> Unpaid
               </span>
             )}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Customer & Package Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 mb-6">Customer Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="font-bold text-slate-900 truncate">{order.fullName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-slate-900 truncate">{order.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Phone Number</p>
                    <p className="font-bold text-slate-900">{order.phoneNumber || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 mb-6">Shipment Service</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Service Type</p>
                    <p className="font-bold text-slate-900">{getServiceName(order.serviceId)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Package Type</p>
                    <p className="font-bold text-slate-900">{order.packageType || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Date Created</p>
                    <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Manifest & Details</h3>
                <button 
                  onClick={() => updatePackageDetails(document.getElementById('packageDetailsText').value)}
                  className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Save Changes
                </button>
              </div>
              <textarea
                id="packageDetailsText"
                defaultValue={order.packageDetails || order.packagedetails || ""}
                rows="5"
                className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                placeholder="Describe contents, weight, dimensions, and special instructions..."
              />
            </div>

            {/* Route & Journey Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 mb-8">Logistic Journey</h3>
              <div className="relative pl-8 border-l-2 border-dashed border-slate-100 ml-2 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-slate-900 shadow-xl shadow-slate-200"></div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Origin Address</p>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">{order.pickupAddress || order.pickupCity}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-slate-300 shadow-xl shadow-slate-200"></div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Destination Address</p>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">{order.deliveryAddress || order.destinationCity}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Financial Card */}
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
              <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Shipment Cost</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="costInput"
                    defaultValue={order.amount || 0}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                  <button 
                    onClick={() => updatePrice(document.getElementById('costInput').value)}
                    className="bg-teal-500 text-slate-900 p-3 rounded-xl hover:bg-teal-400 transition-all active:scale-90"
                  >
                    <TrendingUp size={24} />
                  </button>
                </div>
              </div>

              {!isPaid(order) && order.amount > 0 && (
                <button 
                  onClick={confirmPaymentManually}
                  className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl shadow-black/20"
                >
                  Confirm Payment
                </button>
              )}

              <div className="pt-8 border-t border-white/10">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Internal Clearance</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Secure Operational Stream</span>
                </div>
              </div>
            </div>

            {/* Workflow Progress */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">Progress Workflow</h3>
                {loadingWorkflow && <Loader size={16} className="animate-spin text-slate-300" />}
              </div>

              <div className="space-y-4">
                {workflowSteps.map((step, idx) => {
                  const isCompleted = step.status === "COMPLETED";
                  const isNext = !isCompleted && (idx === 0 || workflowSteps[idx - 1].status === "COMPLETED");

                  return (
                    <div key={step.id} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-100 last:border-0 ml-1">
                      <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2 bg-white transition-all ${isCompleted ? 'border-emerald-500 bg-emerald-50' : isNext ? 'border-blue-600 animate-pulse' : 'border-slate-100'}`}></div>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className={`text-[11px] font-bold ${isCompleted ? 'text-slate-400' : 'text-slate-900'}`}>{step.name}</p>
                          <p className="text-[8px] font-black text-slate-300 uppercase">{isCompleted ? 'Finished' : 'Waiting'}</p>
                        </div>
                        {isNext && (
                          <select 
                            onChange={(e) => advanceWorkflow(e.target.value)}
                            className="bg-slate-50 border-none rounded-lg text-[9px] font-black px-2 py-1 outline-none focus:ring-1 focus:ring-slate-900"
                            defaultValue=""
                          >
                            <option value="" disabled>Assign</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        )}
                        {step.departmentId && !isNext && (
                          <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                            {departments.find(d => d.id === step.departmentId)?.name || 'Admin'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Update Status Actions */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 mb-6">Change Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "ORDER_PLACED", label: "Ordered" },
                  { key: "PENDING_CONFIRMATION", label: "Confirmed" },
                  { key: "WAITING_TO_BE_SHIPPED", label: "Processing" },
                  { key: "SHIPPED", label: "Shipped" },
                  { key: "AVAILABLE_FOR_PICKUP", label: "At Terminal" },
                  { key: "DELIVERED", label: "Delivered" }
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => updateStatus(s.key)}
                    className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${order.status === s.key ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
