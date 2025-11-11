import React, { useEffect, useState } from "react";
import { Package, User, CreditCard, Download } from "lucide-react";

export default function MonthlyReport() {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMonthRange = (offset) => {
    const now = new Date();
    now.setMonth(now.getMonth() - offset);
    return [now.getMonth() + 1, now.getFullYear()]; // month (1-12), year
  };

  const fetchData = async () => {
    setLoading(true);
    const [month, year] = getMonthRange(monthOffset);

    try {
      const [bookingsRes, usersRes, paymentsRes] = await Promise.all([
        fetch(`http://localhost/backend/get-bookings.php?month=${month}&year=${year}`),
        fetch(`http://localhost/backend/get-users.php?month=${month}&year=${year}`),
        fetch(`http://localhost/backend/get-payments.php?month=${month}&year=${year}`)
      ]);

      const bookingsData = await bookingsRes.json();
      const usersData = await usersRes.json();
      const paymentsData = await paymentsRes.json();

      setBookings(bookingsData.bookings || []);
      setUsers(usersData.users || []);
      setPayments(paymentsData.payments || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [monthOffset]);

  const handlePrevMonth = () => setMonthOffset((prev) => prev + 1);
  const handleNextMonth = () => setMonthOffset((prev) => Math.max(prev - 1, 0));

  const formatMonth = (offset) => {
    const now = new Date();
    now.setMonth(now.getMonth() - offset);
    return now.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Server-side export
  const exportReport = (type) => {
    const [month, year] = getMonthRange(monthOffset);
    window.open(`http://localhost/backend/export-report.php?month=${month}&year=${year}&type=${type}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Monthly Activity Report
          </h2>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {/* <button
              onClick={() => exportReport('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
            >
              <Download className="w-5 h-5" />
              Excel
            </button> */}
            <button
              onClick={() => exportReport('word')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
            >
              <Download className="w-5 h-5" />
              Word
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Previous Month
          </button>
          <span className="text-lg font-semibold text-gray-800 my-2 sm:my-0">
            {formatMonth(monthOffset)}
          </span>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            disabled={monthOffset === 0}
          >
            Next Month
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-lg animate-pulse">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <Package className="w-6 h-6 text-blue-600" />
                Bookings ({bookings.length})
              </h3>
              {bookings.length > 0 ? bookings.map(b => (
                <div key={b.id} className="p-3 mb-3 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200">
                  <p className="font-medium text-gray-800">{b.customerName}</p>
                  <p className="text-sm text-gray-500">{new Date(b.date).toLocaleString()}</p>
                </div>
              )) : <p className="text-gray-500 text-sm">No bookings this month</p>}
            </div>

            {/* Users */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 transition-all duration-300 hover:shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <User className="w-6 h-6 text-green-600" />
                New Users ({users.length})
              </h3>
              {users.length > 0 ? users.map(u => (
                <div key={u.id} className="p-3 mb-3 border border-green-100 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200">
                  <p className="font-medium text-gray-800">{u.firstName} {u.lastName}</p>
                  <p className="text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              )) : <p className="text-gray-500 text-sm">No new users this month</p>}
            </div>

            {/* Payments */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transition-all duration-300 hover:shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <CreditCard className="w-6 h-6 text-purple-600" />
                Payments ({payments.length})
              </h3>
              {payments.length > 0 ? payments.map(p => (
                <div key={p.id} className="p-3 mb-3 border border-purple-100 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all duration-200">
                  <p className="font-medium text-gray-800">₦{parseFloat(p.amount).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{new Date(p.date).toLocaleString()}</p>
                </div>
              )) : <p className="text-gray-500 text-sm">No payments this month</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
