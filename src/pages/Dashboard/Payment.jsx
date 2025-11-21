import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Package,
  ArrowRight,
  Receipt,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // You can change this

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setPayments([
        { id: 1, amount: 18400, status: "success", date: "2025-04-18T10:30:00", reference: "EGL-PAY-20250418-001", trackingId: "EGL-2025-089" },
        { id: 2, amount: 9200, status: "success", date: "2025-04-15T14:22:00", reference: "EGL-PAY-20250415-003", trackingId: "EGL-2025-077" },
        { id: 3, amount: 15600, status: "pending", date: "2025-04-20T09:15:00", reference: "EGL-PAY-20250420-007", trackingId: "EGL-2025-104" },
        { id: 4, amount: 22100, status: "success", date: "2025-04-10T11:45:00", reference: "EGL-PAY-20250410-012", trackingId: "EGL-2025-065" },
        { id: 5, amount: 8900, status: "failed", date: "2025-04-08T16:20:00", reference: "EGL-PAY-20250408-019", trackingId: null },
        { id: 6, amount: 32000, status: "success", date: "2025-04-05T08:12:00", reference: "EGL-PAY-20250405-021", trackingId: "EGL-2025-058" },
        { id: 7, amount: 12900, status: "success", date: "2025-03-30T19:45:00", reference: "EGL-PAY-20250330-015", trackingId: "EGL-2025-042" },
        { id: 8, amount: 17500, status: "pending", date: "2025-03-28T11:10:00", reference: "EGL-PAY-20250328-009", trackingId: "EGL-2025-037" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter payments
  const filteredPayments = payments.filter(p =>
    p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = payments
    .filter(p => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "success":
        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
      case "pending":
        return { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
      case "failed":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
      default:
        return { icon: Clock, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                <p className="text-sm text-gray-500">All your EagleNet transactions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
              <p className="text-3xl font-bold text-gray-900">₦{totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference or tracking ID"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading transactions...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-16 text-center">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No transactions found</p>
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Try a different search term" : "Your payment history will appear here"}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {currentPayments.map((payment) => {
                  const StatusIcon = getStatusConfig(payment.status).icon;
                  const { color, bg, border } = getStatusConfig(payment.status);

                  return (
                    <div key={payment.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full ${bg} ${border} border-2 flex items-center justify-center flex-shrink-0`}>
                            <StatusIcon className={`w-6 h-6 ${color}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-lg font-semibold text-gray-900">
                                ₦{payment.amount.toLocaleString()}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${color}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                              {payment.trackingId && (
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-gray-400" />
                                  <span className="font-mono font-medium">{payment.trackingId}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{formatDate(payment.date)}</span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-2 font-mono">
                              Ref: {payment.reference}
                            </p>
                          </div>
                        </div>

                        <button className="ml-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm whitespace-nowrap">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} transactions
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            currentPage === i + 1
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Payments are processed securely via EagleNet SecurePay • 256-bit encryption</p>
        </div>
      </div>
    </div>
  );
}