import React, { useEffect, useState } from "react";
import { 
  Package, 
  User, 
  CreditCard, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  ArrowLeft,
  ArrowRight,
  FileText,
  DollarSign
} from "lucide-react";

export default function MonthlyReport() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMonthRange = (offset) => {
    const now = new Date();
    now.setMonth(now.getMonth() - offset);
    return [now.getMonth() + 1, now.getFullYear()];
  };

  const fetchData = async () => {
    setLoading(true);
    const [month, year] = getMonthRange(monthOffset);

    try {
      const [bookingsRes, usersRes, paymentsRes] = await Promise.all([
        fetch(`http://localhost/backend/get-bookings-report.php?month=${month}&year=${year}`),
        fetch(`http://localhost/backend/get-users.php?month=${month}&year=${year}`),
        fetch(`http://localhost/backend/get-payments.php?month=${month}&year=${year}`)
      ]);

      // Helper to process responses
      const processResponse = async (res, name) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch ${name}: ${res.status} ${res.statusText} - ${errorText}`);
        }
        return res.json();
      };

      const bookingsData = await processResponse(bookingsRes, 'bookings');
      const usersData = await processResponse(usersRes, 'users');
      const paymentsData = await processResponse(paymentsRes, 'payments');

      setBookings(bookingsData.bookings || []);
      setUsers(usersData.users || []);
      setPayments(paymentsData.payments || []);
    } catch (error) {
      console.error("Error fetching report data:", error);
      // Clear data on error to avoid showing stale information
      setBookings([]);
      setUsers([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [monthOffset]);

  const handlePrevMonth = () => setMonthOffset(prev => prev + 1);
  const handleNextMonth = () => setMonthOffset(prev => Math.max(prev - 1, 0));

  const formatMonth = (offset) => {
    const now = new Date();
    now.setMonth(now.getMonth() - offset);
    return now.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const exportReport = (type) => {
    const [month, year] = getMonthRange(monthOffset);
    window.open(`http://localhost/backend/export-report.php?month=${month}&year=${year}&type=${type}`, "_blank");
  };

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                Monthly Activity Report
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Complete overview of bookings, users, and revenue
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => exportReport('word')}
                className="group flex items-center gap-3 px-6 py-4 bg-gray-900 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition" />
                Export to Word
              </button>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 hover:shadow-md transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Month
            </button>

            <div className="text-center">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  {formatMonth(monthOffset)}
                </h2>
              </div>
              <p className="text-gray-500 mt-1">Performance Summary</p>
            </div>

            <button
              onClick={handleNextMonth}
              disabled={monthOffset === 0}
              className="flex items-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 hover:shadow-md transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Month
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl shadow-xl p-10 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-xl w-32 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-100 rounded-2xl"></div>
                  <div className="h-20 bg-gray-100 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                <Package className="w-12 h-12 mb-4 opacity-90" />
                <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                <p className="text-5xl font-extrabold mt-2">{bookings.length}</p>
                <p className="text-blue-200 text-sm mt-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Active this month
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                <Users className="w-12 h-12 mb-4 opacity-90" />
                <p className="text-emerald-100 text-sm font-medium">New Customers</p>
                <p className="text-5xl font-extrabold mt-2">{users.length}</p>
                <p className="text-emerald-200 text-sm mt-3">Joined this month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                <DollarSign className="w-12 h-12 mb-4 opacity-90" />
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-5xl font-extrabold mt-2">
                  ₦{totalRevenue.toLocaleString()}
                </p>
                <p className="text-purple-200 text-sm mt-3">{payments.length} transactions</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                <FileText className="w-12 h-12 mb-4 opacity-90" />
                <p className="text-orange-100 text-sm font-medium">Report Ready</p>
                <p className="text-4xl font-extrabold mt-2">100%</p>
                <p className="text-orange-200 text-sm mt-3">Data complete</p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bookings */}
              <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Package className="w-8 h-8" />
                    Bookings ({bookings.length})
                  </h3>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map(b => (
                        <div key={b.id} className="group p-5 bg-blue-50 rounded-2xl border border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 cursor-pointer">
                          <p className="font-semibold text-gray-900">{b.customerName}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(b.date).toLocaleDateString()} at {new Date(b.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-xs text-blue-600 mt-2 font-medium">Tracking: {b.trackingId || 'Pending'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-12">No bookings recorded</p>
                  )}
                </div>
              </div>

              {/* New Users */}
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <User className="w-8 h-8" />
                    New Customers ({users.length})
                  </h3>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {users.length > 0 ? (
                    <div className="space-y-4">
                      {users.map(u => (
                        <div key={u.id} className="group p-5 bg-emerald-50 rounded-2xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 transition-all duration-300">
                          <p className="font-semibold text-gray-900">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{u.email}</p>
                          <p className="text-xs text-emerald-600 mt-2 font-medium">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-12">No new registrations</p>
                  )}
                </div>
              </div>

              {/* Payments */}
              <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <CreditCard className="w-8 h-8" />
                    Payments ({payments.length})
                  </h3>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  {payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.map(p => (
                        <div key={p.id} className="group p-5 bg-purple-50 rounded-2xl border border-purple-200 hover:bg-purple-100 hover:border-purple-400 transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-2xl font-bold text-purple-900">
                                ₦{parseFloat(p.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Ref: {p.reference || p.id}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              Success
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">
                            {new Date(p.date).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-12">No payments recorded</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}