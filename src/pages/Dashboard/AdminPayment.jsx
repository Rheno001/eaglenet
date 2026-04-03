import React, { useState, useEffect, useCallback } from "react";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType } from "docx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
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
   Truck,
   Copy,
   Check
} from "lucide-react";
import Swal from "sweetalert2";

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
            title: 'ID copied'
         });
      });
   };

   // Detail View State
   const [selectedPayment, setSelectedPayment] = useState(null);
   const [loadingDetail, setLoadingDetail] = useState(false);
   const [showModal, setShowModal] = useState(false);

   const fetchPayments = useCallback(async () => {
      setLoading(true);
      try {
         const token = localStorage.getItem("jwt");
         const url = new URL("https://eaglenet-backend.onrender.com/api/payments");
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
   }, [currentPage, filterStatus, searchTerm]);

   useEffect(() => {
      fetchPayments();
   }, [fetchPayments]);

   const fetchPaymentDetail = async (id) => {
      if (!id) return;
      setLoadingDetail(true);
      setShowModal(true);
      try {
         const token = localStorage.getItem("jwt");
         const response = await fetch(`https://eaglenet-backend.onrender.com/api/payments/${id}`, {
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
      const s = String(status || '').toLowerCase();
      switch (s) {
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

   const getShipmentStatusLabel = (status) => {
      const s = String(status || '').toUpperCase();
      switch (s) {
         case "ORDER_PLACED": return "Order Placed";
         case "PENDING_CONFIRMATION": return "Confirmed";
         case "WAITING_TO_BE_SHIPPED": return "Processing";
         case "SHIPPED": return "In Transit";
         case "AVAILABLE_FOR_PICKUP": return "At Terminal";
         case "DELIVERED": return "Delivered";
         case "CANCELLED": return "Cancelled";
         default: return status || "N/A";
      }
   };

   const formatCurrency = (val) => {
      const n = Number(val);
      return isNaN(n) ? "0" : n.toLocaleString();
   };

   const formatDate = (dateStr) => {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
   };

   const formatTime = (dateStr) => {
      if (!dateStr) return "--:--";
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "--:--" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   };

   const handleExportExcel = () => {
      const wsData = payments.map(p => ({
         "Payment ID": p.paymentId || (p.id ? String(p.id).substring(0, 12) : "UNIDENTIFIED"),
         "Reference": p.reference || "N/A",
         "User": `${p.user?.firstName || "Unknown"} ${p.user?.lastName || ""}`.trim(),
         "Email": p.user?.email || "N/A",
         "Tracking ID": p.shipment?.trackingId || "PENDING",
         "Amount (₦)": p.amount || 0,
         "Origin": p.shipment?.origin || "TBD",
         "Destination": p.shipment?.destination || "TBD",
         "Status": p.status || "Unknown",
         "Gateway": "Paystack",
         "Date": formatDate(p.createdAt),
         "Time": formatTime(p.createdAt)
      }));

      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      XLSX.writeFile(wb, "Payments_Audit_Report.xlsx");
   };

   const handleExportWord = async () => {
      const tableRows = [
         new TableRow({
            children: [
               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Payment ID", bold: true })] })] }),
               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "User", bold: true })] })] }),
               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Amount (₦)", bold: true })] })] }),
               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })] }),
            ],
         }),
         ...payments.map(
            (p) =>
               new TableRow({
                  children: [
                     new TableCell({ children: [new Paragraph(p.paymentId || (p.id ? String(p.id).substring(0, 12) : "UNIDENTIFIED"))] }),
                     new TableCell({ children: [new Paragraph(`${p.user?.firstName || "Unknown"} ${p.user?.lastName || ""}`.trim())] }),
                     new TableCell({ children: [new Paragraph(formatCurrency(p.amount))] }),
                     new TableCell({ children: [new Paragraph(p.status || "Unknown")] }),
                     new TableCell({ children: [new Paragraph(formatDate(p.createdAt))] }),
                  ],
               })
         ),
      ];

      const doc = new Document({
         sections: [
            {
               properties: {},
               children: [
                  new Paragraph({
                     text: "Payments Audit Report",
                     heading: HeadingLevel.HEADING_1,
                  }),
                  new Paragraph({
                     text: `Generated on: ${new Date().toLocaleString()}`,
                     spacing: { after: 400 },
                  }),
                  new Table({
                     width: { size: 100, type: WidthType.PERCENTAGE },
                     rows: tableRows,
                  }),
               ],
            },
         ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "Payments_Audit_Report.docx");
   };

   return (
      <div className="space-y-8 animate-in fade-in duration-700">
         {/* Premium Header */}
         <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
               <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
                     <CreditCard className="text-white" size={28} />
                  </div>
                  Payment
               </h2>
               <p className="text-gray-500 mt-2 font-medium">Audit and manage all transactions.</p>
            </div>

            <div className="flex items-center gap-3">
               <button
                  onClick={handleExportWord}
                  className="group flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-sm"
               >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
                  Word
               </button>
               <button
                  onClick={handleExportExcel}
                  className="group flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 text-sm"
               >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
                  Excel
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
               <p className="text-3xl font-black text-slate-900 tracking-tight">₦{formatCurrency(summary.totalRevenue)}</p>
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
               <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-tighter">Failed Transactions</p>
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
                     <option value="all">Status</option>
                     <option value="success">Successful</option>
                     <option value="pending">Pending</option>
                     <option value="failed">Failed</option>
                  </select>
                  <button
                     type="submit"
                     className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                  >
                     <Filter size={20} />
                     Search
                  </button>
               </div>
            </form>
         </section>

         {/* Transaction Table */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            {loading ? (
               <div className="flex-1 flex flex-col items-center justify-center p-32">
                  <Loader2 className="animate-spin text-slate-900 mb-4" size={48} />
                  <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Loading...</p>
               </div>
            ) : payments.length > 0 ? (
               <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-slate-50">
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment ID</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User </th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Record Info</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {payments.map((p) => (
                           <tr key={p.id || Math.random()} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                                       <Receipt size={16} />
                                    </div>
                                    <div className="min-w-0">
                                       <p className="font-bold text-slate-900 truncate uppercase tracking-tighter text-sm">
                                          {p.paymentId || (p.id && typeof p.id === 'string' ? p.id.substring(0, 12) : "UNIDENTIFIED")}
                                       </p>
                                       <div className="flex items-center gap-1 mt-0.5">
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                             REF: <span className="truncate max-w-[100px]">{p.reference || 'N/A'}</span>
                                          </p>
                                          {p.reference && (
                                             <button
                                                onClick={() => copyToClipboard(p.reference)}
                                                className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400"
                                                title="Copy Reference"
                                             >
                                                {copiedId === p.reference ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                             </button>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                                       {p.user?.firstName?.[0] || 'U'}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-900">{p.user?.firstName || "Unknown"} {p.user?.lastName || "User"}</p>
                                       <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-tighter mt-0.5">
                                          <Package size={10} />
                                          <span>TRK: {p.shipment?.trackingId || 'PENDING'}</span>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">₦{formatCurrency(p.amount)}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Paystack Global</p>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={14} className="text-slate-300" />
                                    <div>
                                       <p className="text-sm font-bold">{formatDate(p.createdAt)}</p>
                                       <p className="text-[10px] font-bold text-slate-400 tracking-tighter">{formatTime(p.createdAt)}</p>
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
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-90 shadow-sm"
                     >
                        <ChevronLeft size={20} className="text-slate-900" />
                     </button>
                     <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(meta.totalPages, 100) }).map((_, i) => (
                           <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`w-11 h-11 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1
                                 ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                 : "bg-white text-slate-500 hover:bg-slate-50"
                                 }`}
                           >
                              {i + 1}
                           </button>
                        ))}
                     </div>
                     <button
                        onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
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
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Transaction Summary</h2>
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
                           <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Loading...</p>
                        </div>
                     ) : selectedPayment ? (
                        <>
                           {/* Status & ID Summary */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                              <div className="space-y-4">
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Reference</p>
                                    <div className="flex items-center gap-2">
                                       <p className="text-2xl font-black text-slate-900 tracking-tighter">{selectedPayment.reference || "N/A"}</p>
                                       {selectedPayment.reference && (
                                          <button
                                             onClick={() => copyToClipboard(selectedPayment.reference)}
                                             className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                                             title="Copy Reference"
                                          >
                                             {copiedId === selectedPayment.reference ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                          </button>
                                       )}
                                    </div>
                                    <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-widest">System Reference: {selectedPayment.paymentId || "N/A"}</p>
                                 </div>
                                 <div className="flex items-center gap-8">
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Status</p>
                                       {getStatusBadge(selectedPayment.status)}
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                                       <p className="text-sm font-bold text-slate-900">{formatDate(selectedPayment.createdAt)} {formatTime(selectedPayment.createdAt)}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden flex flex-col justify-center">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount Paid</p>
                                 <p className="text-4xl font-black tracking-tight">₦{formatCurrency(selectedPayment.amount)}</p>
                                 <div className="mt-4 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Paystack Verified</span>
                                 </div>
                                 <Activity size={80} className="absolute -right-4 -bottom-4 text-white/5" />
                              </div>
                           </div>

                           {/* Account & Shipment Details */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* User Info */}
                              <div className="space-y-6">
                                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-indigo-500 pl-4">Account Profile</h3>
                                 <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                                    <div className="flex items-center gap-4">
                                       <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl">
                                          {selectedPayment.user?.firstName?.[0] || 'U'}
                                       </div>
                                       <div>
                                          <p className="font-bold text-slate-900 text-lg">{selectedPayment.user?.firstName || "Unknown"} {selectedPayment.user?.lastName || "Admin"}</p>
                                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-black tracking-widest uppercase">
                                             {selectedPayment.user?.role || "USER"}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                       <div className="flex items-center gap-3 text-slate-500">
                                          <Mail size={14} className="text-slate-300" />
                                          <p className="text-xs font-bold">{selectedPayment.user?.email || "No Email"}</p>
                                       </div>
                                       <div className="flex items-center gap-3 text-slate-500">
                                          <User size={14} className="text-slate-300" />
                                          <p className="text-xs font-bold uppercase tracking-tighter">UID: {selectedPayment.userId || "N/A"}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Shipment Info */}
                              <div className="space-y-6">
                                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">Shipment Details</h3>
                                 <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                                    <div className="flex items-center gap-4">
                                       <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white">
                                          <Package size={28} />
                                       </div>
                                       <div>
                                          <div className="flex items-center gap-2">
                                             <p className="font-bold text-slate-900 text-lg">{selectedPayment.shipment?.trackingId || "PENDING"}</p>
                                             {selectedPayment.shipment?.trackingId && (
                                                <button
                                                   onClick={() => copyToClipboard(selectedPayment.shipment?.trackingId)}
                                                   className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                                                   title="Copy Tracking ID"
                                                >
                                                   {copiedId === selectedPayment.shipment?.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                </button>
                                             )}
                                          </div>
                                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                             {getShipmentStatusLabel(selectedPayment.shipment?.status)}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                       <div className="space-y-1">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                                          <div className="flex items-center gap-2 text-slate-700">
                                             <MapPin size={12} className="text-slate-300" />
                                             <p className="text-xs font-bold">{selectedPayment.shipment?.origin || "TBD"}</p>
                                          </div>
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                          <div className="flex items-center gap-2 text-slate-700">
                                             <MapPin size={12} className="text-slate-300" />
                                             <p className="text-xs font-bold">{selectedPayment.shipment?.destination || "TBD"}</p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="pt-2">
                                       <div className="flex items-center gap-3 text-slate-500">
                                          <Truck size={14} className="text-slate-300" />
                                          <p className="text-xs font-bold uppercase tracking-tighter">Logistics ID: {selectedPayment.shipment?.shippingId || "N/A"}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Post-Settlement Details */}
                           <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                              <div className="flex items-center gap-3 mb-4">
                                 <Receipt size={18} className="text-indigo-600" />
                                 <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Payment Metadata</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Gateway Intelligence</p>
                                    <p className="text-sm font-black text-slate-900 font-mono bg-white px-3 py-1.5 rounded-lg border border-indigo-100">{selectedPayment.paystackAccessCode || "N/A"}</p>
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Registry Link</p>
                                    <a
                                       href={selectedPayment.paystackAuthUrl || "#"}
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
                     {String(selectedPayment?.status || '').toLowerCase() === 'success' && (
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audited by System Intelligence</p>
               </div>
            </div>
            <ShieldCheck size={300} className="absolute -right-20 -bottom-20 text-white/5" />
         </div>
      </div>
   );
}