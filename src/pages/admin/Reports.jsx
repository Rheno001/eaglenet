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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Monthly Activity Report
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Complete overview of bookings, users, and revenue
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => exportReport('word')}
                className="group flex items-center gap-3 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl shadow-sm hover:bg-gray-800 transition-all duration-200"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition" />
                Export to Word
              </button>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-3 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Month
            </button>

            <div className="text-center">
              <div className="flex items-center gap-3 justify-center">
                <Calendar className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatMonth(monthOffset)}
                </h2>
              </div>
              <p className="text-gray-500 mt-1">Performance Summary</p>
            </div>

            <button
              onClick={handleNextMonth}
              disabled={monthOffset === 0}
              className="flex items-center gap-3 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Month
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-8 animate-pulse border border-gray-200">
                <div className="h-8 bg-gray-200 rounded-lg w-32 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-100 rounded-xl"></div>
                  <div className="h-20 bg-gray-100 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Active this month
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">New Customers</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                <p className="text-gray-500 text-sm mt-2">Joined this month</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ₦{totalRevenue.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mt-2">{payments.length} transactions</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Report Ready</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-gray-500 text-sm mt-2">Data complete</p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bookings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" />
                    Bookings ({bookings.length})
                  </h3>
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                  {bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.map(b => (
                        <div key={b.id} className="group p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                          <p className="font-semibold text-gray-900">{b.customerName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(b.date).toLocaleDateString()} at {new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    New Customers ({users.length})
                  </h3>
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                  {users.length > 0 ? (
                    <div className="space-y-3">
                      {users.map(u => (
                        <div key={u.id} className="group p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                          <p className="font-semibold text-gray-900">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{u.email}</p>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    Payments ({payments.length})
                  </h3>
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map(p => (
                        <div key={p.id} className="group p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                ₦{parseFloat(p.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Ref: {p.reference || p.id}
                              </p>
                            </div>
                            <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              Success
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-3">
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