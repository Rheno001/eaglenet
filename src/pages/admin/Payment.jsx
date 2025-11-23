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
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost/backend/get-all-payments.php");
      const data = await res.json();
      if (data.payments) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportPayments = (type) => {
    window.open(`http://localhost/backend/export-payments.php?type=${type}`, "_blank");
  };

  // Filter & Search
  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
      case "completed":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Success</span>;
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case "failed":
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold"><AlertCircle className="w-3 h-3" /> Unknown</span>;
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === "success" || p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-4">
                <CreditCard className="w-12 h-12 text-indigo-600" />
                Payments Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Manage and track all customer payments
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => exportPayments('word')}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                <Download className="w-5 h-5" />
                Export to Word
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
            <DollarSign className="w-10 h-10 mb-3 opacity-90" />
            <p className="text-green-100 text-sm font-medium">Total Revenue</p>
            <p className="text-4xl font-extrabold mt-2">₦{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Successful</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {payments.filter(p => p.status === "success" || p.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">
                  {payments.filter(p => p.status === "pending").length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Failed</p>
                <p className="text-4xl font-bold text-red-600 mt-2">
                  {payments.filter(p => p.status === "failed").length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 text-gray-800"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 font-medium"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payments...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-semibold">Reference</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold">Customer</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedPayments.length > 0 ? (
                      paginatedPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-5 font-mono text-indigo-600 font-bold">
                            {p.reference || p.id}
                          </td>
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-gray-900">{p.customerName || "N/A"}</p>
                              <p className="text-sm text-gray-500">{p.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-bold text-gray-900">
                            ₦{parseFloat(p.amount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-5 text-gray-600">
                            {new Date(p.date).toLocaleDateString()} <br />
                            <span className="text-xs text-gray-500">
                              {new Date(p.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            {getStatusBadge(p.status)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg">No payments found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-5 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}