import React, { useState, useEffect, useCallback, useContext } from "react";
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
   TrendingUp,
   Activity,
   Receipt,
   Eye,
   X,
   ShieldCheck,
   Package,
   ArrowUpRight,
   Loader2,
   Copy,
   Check
} from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

export default function CustomerPayments() {
   // eslint-disable-next-line no-unused-vars
   const { user } = useContext(AuthContext);
   const [payments, setPayments] = useState([]);
   const [summary, setSummary] = useState({ totalPaid: 0 });
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
   const [copiedId, setCopiedId] = useState(null);

   // Detail View State
   const [selectedPayment, setSelectedPayment] = useState(null);
   // eslint-disable-next-line no-unused-vars
   const [loadingDetail, setLoadingDetail] = useState(false);
   const [showModal, setShowModal] = useState(false);

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
            title: 'ID copied'
         });
      });
   };

   const fetchPayments = useCallback(async () => {
      setLoading(true);
      try {
         const token = localStorage.getItem("jwt");
         const url = new URL("https://eaglenet-backend.onrender.com/api/payments/mine");
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
            setPayments(Array.isArray(result.data) ? result.data : []);
            setSummary(result.summary || { totalPaid: 0 });
            setMeta(result.meta || {
               total: (result.data || []).length,
               page: 1,
               limit: 10,
               totalPages: 1
            });
         }
      } catch (err) {
         console.error("Error fetching payments history:", err);
      } finally {
         setLoading(false);
      }
   }, [currentPage, filterStatus, searchTerm]);

   useEffect(() => {
      fetchPayments();
   }, [fetchPayments]);

   const fetchPaymentDetail = (payment) => {
      setSelectedPayment(payment);
      setShowModal(true);
   };

   const statusMap = {
      SUCCESS: { color: "text-emerald-500 bg-emerald-50", icon: CheckCircle, label: "Settled" },
      PENDING: { color: "text-amber-500 bg-amber-50", icon: Clock, label: "Processing" },
      FAILED: { color: "text-rose-500 bg-rose-50", icon: XCircle, label: "Declined" },
   };

   const getStatusBadge = (status) => {
      const cfg = statusMap[status?.toUpperCase()] || { color: "text-slate-400 bg-slate-50", icon: AlertCircle, label: status };
      const Icon = cfg.icon;
      return (
         <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
            <Icon size={12} />
            {cfg.label}
         </span>
      );
   };

   return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
         {/* HEADER & SUMMARY */}
         <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                  <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
                     <CreditCard className="text-white" size={32} />
                  </div>
                  Payments
               </h1>
               <p className="text-slate-500 font-medium mt-1">View your payment history and receipts.</p>
            </div>

            <div className="flex items-center gap-4">
               <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                     <TrendingUp size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
                     <h3 className="text-2xl font-black text-slate-900">₦{parseFloat(summary.totalPaid || 0).toLocaleString()}</h3>
                  </div>
               </div>
            </div>
         </header>

         {/* SEARCH & FILTERS */}
         <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input
                  type="text"
                  placeholder="Search by Payment ID or Reference..."
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative w-full md:w-48">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                     className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900 appearance-none shadow-inner"
                     value={filterStatus}
                     onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                     }}
                  >
                     <option value="all">All Status</option>
                     <option value="success">Settled</option>
                     <option value="pending">Processing</option>
                     <option value="failed">Declined</option>
                  </select>
               </div>
               <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
                  <Download size={20} />
               </button>
            </div>
         </div>

         {/* PAYMENTS TABLE */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
               <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-[3px] border-slate-900 border-t-teal-500 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">Syncing Payment Registry...</p>
               </div>
            ) : payments.length === 0 ? (
               <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-4xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                     <Receipt size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Transactions Found</h3>
                  <p className="text-slate-400 font-medium">Your settlement registry is currently empty.</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                           <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment ID</th>
                           <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                           <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment</th>
                           <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                           <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {payments.map((payment) => (
                           <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                       <span className="text-xs font-black text-slate-900 font-mono">{payment.paymentId}</span>
                                       <button onClick={() => copyToClipboard(payment.paymentId)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded text-slate-400">
                                          {copiedId === payment.paymentId ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                       </button>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">REF: {payment.reference}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex flex-col">
                                    <span className="text-lg font-black text-slate-900 tracking-tighter">₦{parseFloat(payment.amount).toLocaleString()}</span>
                                    {getStatusBadge(payment.status)}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                       <Package size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{payment.shipment?.trackingId || "LOG-DYN"}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold">{new Date(payment.createdAt).toLocaleDateString()}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex justify-end">
                                    <button
                                       onClick={() => fetchPaymentDetail(payment)}
                                       className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-90"
                                    >
                                       <Eye size={18} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* PAGINATION */}
            {meta.totalPages > 1 && (
               <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                     Showing Page {meta.page} of {meta.totalPages}
                  </p>
                  <div className="flex items-center gap-3">
                     <button
                        disabled={meta.page === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                     >
                        <ChevronLeft size={20} />
                     </button>
                     <button
                        disabled={meta.page === meta.totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                     >
                        <ChevronRight size={20} />
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* DETAIL MODAL */}
         {showModal && selectedPayment && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-100 animate-in fade-in duration-300">
               <div className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                  {/* Modal Header */}
                  <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                           <ShieldCheck className="text-teal-400" size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-1">Payment Receipt</h3>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Payment</p>
                        </div>
                     </div>
                     <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
                        <X size={20} />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-10 space-y-10">
                     {/* Amount Highlight */}
                     <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount Paid</p>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">₦{parseFloat(selectedPayment.amount).toLocaleString()}</h2>
                        {getStatusBadge(selectedPayment.status)}
                     </div>

                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment ID</p>
                              <p className="text-sm font-black font-mono text-slate-900">{selectedPayment.paymentId}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                              <p className="text-sm font-black font-mono text-slate-900">{selectedPayment.reference}</p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipment ID</p>
                              <p className="text-sm font-black text-slate-900">{selectedPayment.shipment?.trackingId || "GENERIC_HUB"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Date</p>
                              <p className="text-sm font-black text-slate-900">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                           </div>
                        </div>
                     </div>

                     {/* Shipment Summary */}
                     <div className="p-6 bg-slate-900 rounded-4xl text-white overflow-hidden relative group">
                        <div className="relative z-10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                 <Package className="text-teal-400" size={24} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consignment</p>
                                 <p className="font-black tracking-tight">{selectedPayment.shipment?.fullName || "Unspecified User"}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route</p>
                              <p className="font-black tracking-tight">{selectedPayment.shipment?.origin || "Central"} → {selectedPayment.shipment?.destination || "Terminal"}</p>
                           </div>
                        </div>
                        <ArrowUpRight className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                     </div>

                     <button
                        onClick={() => window.print()}
                        className="w-full py-5 bg-slate-100 text-slate-900 rounded-4xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
                     >
                        <Receipt size={18} />
                        Print Receipt
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
