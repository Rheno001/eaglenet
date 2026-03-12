import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  User,
  Package,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  Activity,
  Receipt,
  Eye,
  X,
  ShieldCheck,
  Mail,
  MapPin,
  Truck
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    successful: 0,
    pending: 0,
    failed: 0
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Detail View State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, filterStatus]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const url = new URL("https://eaglenet-eb9x.onrender.com/api/payments");
      url.searchParams.append("page", currentPage);
      url.searchParams.append("limit", 10);
      if (filterStatus !== "all") url.searchParams.append("status", filterStatus);
      if (searchTerm) url.searchParams.append("search", searchTerm);

      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await res.json();
      
      if (result.status === "success") {
        setPayments(result.data || []);
        setSummary(result.summary || {
          totalRevenue: 0,
          successful: 0,
          pending: 0,
          failed: 0
        });
        setMeta(result.meta || {
          total: (result.data || []).length,
          page: 1,
          limit: 10,
          totalPages: 1
        });
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetail = async (id) => {
    setLoadingDetail(true);
    setShowModal(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/payments/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.status === "success") {
        setSelectedPayment(result.data);
      }
    } catch (err) {
      console.error("Error fetching payment detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPayments();
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Success
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-amber-100">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-rose-100">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-slate-100">
            <AlertCircle className="w-3 h-3" /> {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
                <CreditCard className="text-white" size={28} />
             </div>
             Payment
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Audit and manage all transactions.</p>
        </div>

        <div className="flex items-center gap-3">
           <button className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
             <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
             Export Audit
           </button>
        </div>
      </header>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl w-fit mb-6">
               <DollarSign size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">₦{parseFloat(summary.totalRevenue || 0).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
               <TrendingUp size={14} />
               <span>Gross Volume</span>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl w-fit mb-6">
               <CheckCircle size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Successful</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{summary.successful}</p>
            <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-tighter">Cleared Transactions</p>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl w-fit mb-6">
               <Clock size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{summary.pending}</p>
            <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-tighter">Awaiting Settlement</p>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl w-fit mb-6">
               <XCircle size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Failed</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{summary.failed}</p>
            <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-tighter">Refunded/Rejected</p>
         </div>
      </div>

      {/* Control Panel */}
      <section className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by reference, user ID, or tracking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border-none rounded-2xl px-6 py-5 font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none"
            >
              <option value="all">All Channels</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button 
              type="submit"
              className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Filter size={20} />
              Refine
            </button>
          </div>
        </form>
      </section>

      {/* Transaction Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-32">
             <Loader2 className="animate-spin text-slate-900 mb-4" size={48} />
             <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Querying Ledger...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account & Route</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <Receipt size={16} />
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate uppercase tracking-tighter text-sm">{p.paymentId || p.id.substring(0, 12)}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter flex items-center gap-1">
                               REF: <span className="truncate max-w-[100px]">{p.reference || 'N/A'}</span>
                            </p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                             {p.user?.firstName?.[0] || 'U'}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{p.user?.firstName} {p.user?.lastName}</p>
                             <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-tighter mt-0.5">
                                <Package size={10} />
                                <span>TRK: {p.shipment?.trackingId || 'PENDING'}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div>
                          <p className="text-lg font-black text-slate-900 tracking-tight">₦{parseFloat(p.amount || 0).toLocaleString()}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Paystack Global</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} className="text-slate-300" />
                          <div>
                             <p className="text-sm font-bold">{new Date(p.createdAt).toLocaleDateString()}</p>
                             <p className="text-[10px] font-bold text-slate-400 tracking-tighter">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       {getStatusBadge(p.status)}
                    </td>
                    <td className="px-8 py-6">
                       <button 
                        onClick={() => fetchPaymentDetail(p.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm"
                       >
                          <Eye size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-32 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity size={32} className="text-slate-300" />
             </div>
             <p className="text-slate-600 font-bold text-lg">Empty Ledger</p>
             <p className="text-slate-400 font-medium">No transactions match your current search parameters.</p>
          </div>
        )}

        {/* Dynamic Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Ledger Page <span className="text-slate-900">{meta.page}</span> of {meta.totalPages} (Total: {meta.total})
             </p>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-90 shadow-sm"
                >
                   <ChevronLeft size={20} className="text-slate-900" />
                </button>
                <div className="flex items-center gap-1">
                   {[...Array(meta.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-11 h-11 rounded-2xl font-black text-xs transition-all ${
                          currentPage === i + 1 
                            ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                            : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                   ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage === meta.totalPages}
                  className="p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-90 shadow-sm"
                >
                   <ChevronRight size={20} className="text-slate-900" />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Receipt size={24} className="text-slate-900" />
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Transaction Dossier</h2>
                 </div>
                 <button 
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPayment(null);
                  }}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                 >
                    <X size={24} className="text-slate-500" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                 {loadingDetail ? (
                   <div className="py-20 flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-slate-900 mb-4" size={48} />
                      <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Querying Secure Database...</p>
                   </div>
                 ) : selectedPayment ? (
                   <>
                      {/* Status & ID Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                         <div className="space-y-4">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Reference</p>
                               <p className="text-2xl font-black text-slate-900 tracking-tighter">{selectedPayment.reference}</p>
                               <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-widest">Global ID: {selectedPayment.paymentId}</p>
                            </div>
                            <div className="flex items-center gap-8">
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Status</p>
                                  {getStatusBadge(selectedPayment.status)}
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                                  <p className="text-sm font-bold text-slate-900">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                               </div>
                            </div>
                         </div>
                         <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount Paid</p>
                            <p className="text-4xl font-black tracking-tight">₦{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                            <div className="mt-4 flex items-center gap-2">
                               <ShieldCheck size={14} className="text-emerald-400" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Paystack Verified</span>
                            </div>
                            <Activity size={80} className="absolute -right-4 -bottom-4 text-white/5" />
                         </div>
                      </div>

                      {/* User & Shipment Intelligence */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* User Info */}
                         <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-indigo-500 pl-4">Account Profile</h3>
                            <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl">
                                     {selectedPayment.user?.firstName?.[0]}
                                  </div>
                                  <div>
                                     <p className="font-bold text-slate-900 text-lg">{selectedPayment.user?.firstName} {selectedPayment.user?.lastName}</p>
                                     <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-black tracking-widest uppercase">
                                       {selectedPayment.user?.role}
                                     </span>
                                  </div>
                               </div>
                               <div className="space-y-2 pt-2">
                                  <div className="flex items-center gap-3 text-slate-500">
                                     <Mail size={14} className="text-slate-300" />
                                     <p className="text-xs font-bold">{selectedPayment.user?.email}</p>
                                  </div>
                                  <div className="flex items-center gap-3 text-slate-500">
                                     <User size={14} className="text-slate-300" />
                                     <p className="text-xs font-bold uppercase tracking-tighter">UID: {selectedPayment.userId}</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Shipment Info */}
                         <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">Logistics Link</h3>
                            <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white">
                                     <Package size={28} />
                                  </div>
                                  <div>
                                     <p className="font-bold text-slate-900 text-lg">{selectedPayment.shipment?.trackingId}</p>
                                     <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{selectedPayment.shipment?.status}</p>
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 gap-4 pt-2">
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                                     <div className="flex items-center gap-2 text-slate-700">
                                        <MapPin size={12} className="text-slate-300" />
                                        <p className="text-xs font-bold">{selectedPayment.shipment?.origin}</p>
                                     </div>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                     <div className="flex items-center gap-2 text-slate-700">
                                        <MapPin size={12} className="text-slate-300" />
                                        <p className="text-xs font-bold">{selectedPayment.shipment?.destination}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="pt-2">
                                  <div className="flex items-center gap-3 text-slate-500">
                                     <Truck size={14} className="text-slate-300" />
                                     <p className="text-xs font-bold uppercase tracking-tighter">Logistics ID: {selectedPayment.shipment?.shippingId}</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Post-Settlement Details */}
                      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                         <div className="flex items-center gap-3 mb-4">
                            <Receipt size={18} className="text-indigo-600" />
                            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Gateway Intelligence</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Paystack Access Code</p>
                               <p className="text-sm font-black text-slate-900 font-mono bg-white px-3 py-1.5 rounded-lg border border-indigo-100">{selectedPayment.paystackAccessCode}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Paystack Registry Link</p>
                               <a 
                                href={selectedPayment.paystackAuthUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs font-black text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 truncate"
                               >
                                 Open Tracking Link <ArrowUpRight size={14} />
                               </a>
                            </div>
                         </div>
                      </div>
                   </>
                 ) : (
                   <div className="py-20 text-center text-slate-400">
                      <AlertCircle size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="font-bold">Entry not found or corrupted</p>
                   </div>
                 )}
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button 
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-300 transition-all active:scale-95"
                 >
                    Dismiss
                 </button>
                 {selectedPayment?.status?.toLowerCase() === 'success' && (
                    <button className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
                       Download Receipt
                    </button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Audit Note */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Security Audit Protocol</h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
               All financial data shown here is processed through secure Paystack settlement channels. 
               Admins are reminded that monetary records represent legal tenders. Unauthorized modification 
               or data extraction is strictly prohibited and logged by the central nervous system.
            </p>
            <div className="inline-flex items-center gap-4 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />)}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Monitored by Security Staff</span>
            </div>
         </div>
         <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}