import { useState, useEffect } from "react";
import { CreditCard, Search, ArrowUpDown } from "lucide-react";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  // Fetch payments from backend
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost/backend/get-payments.php");
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments || []);
        setFilteredPayments(data.payments || []);
      } else {
        setError("Failed to fetch payments");
      }
    } catch (err) {
      setError("Error fetching payments: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = payments.filter(
      (payment) =>
        payment.trackingId?.toLowerCase().includes(term) ||
        payment.id?.toString().includes(term) ||
        payment.amount?.toString().includes(term) ||
        payment.status?.toLowerCase().includes(term)
    );
    setFilteredPayments(filtered);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredPayments].sort((a, b) => {
      if (key === "amount") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      if (key === "date") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      const valA = a[key]?.toString().toLowerCase() || "";
      const valB = b[key]?.toString().toLowerCase() || "";
      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
    setFilteredPayments(sorted);
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUpDown className="w-4 h-4 inline ml-1" />
      ) : (
        <ArrowUpDown className="w-4 h-4 inline ml-1 rotate-180" />
      );
    }
    return <ArrowUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#1e3a8a]" />
            Payment Details
          </h2>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tracking ID, ID, Amount, or Status"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-64"
              aria-label="Search payments"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <p className="text-gray-600 text-lg animate-pulse">Loading payments...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-xl p-6 text-center shadow-sm border border-red-200">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">No payments found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1e3a8a] text-white">
                <tr>
                  {["id", "trackingId", "amount", "date", "status"].map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      {renderSortIcon(key)}
                    </th>
                  ))}
                  {/* Add additional dynamic columns if needed */}
                  {Object.keys(filteredPayments[0] || {})
                    .filter((key) => !["id", "trackingId", "amount", "date", "status"].includes(key))
                    .map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        {renderSortIcon(key)}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-teal-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.trackingId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{parseFloat(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.status}</td>
                    {/* Render additional dynamic columns */}
                    {Object.keys(payment)
                      .filter((key) => !["id", "trackingId", "amount", "date", "status"].includes(key))
                      .map((key) => (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment[key]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}