import React, { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Search, MapPin, User, X, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user info from users.php
  const fetchUser = async () => {
    try {
      setLoading(true);
      const storedEmail = localStorage.getItem("userEmail"); // logged-in user email
      const res = await fetch("http://localhost/backend/users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 1, email: storedEmail }),
      });
      const data = await res.json();
      if (data.success && data.users?.length > 0) {
        const u = data.users[0];
        setUser({
          name: u.firstName + " " + u.lastName,
          email: u.email,
          phone: u.phone || "", // ensure phone is displayed
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch shipments from shipments.php
  const fetchShipments = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("userEmail");
      const res = await fetch(`http://localhost/backend/Shipments.php?email=${email}`);
      const data = await res.json();
      if (data.status === "success") {
        setShipments(data.shipments || []);
      } else {
        setShipments([]);
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchShipments();

    // ✅ Example alert
    setAlerts([{ id: 1, message: "Shipment EGL-123 delayed due to weather", type: "warning" }]);
  }, []);

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "delivered":
        return <span className={`${base} bg-green-100 text-green-700`}><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><Package className="w-3 h-3" /> Pending</span>;
      case "in transit":
        return <span className={`${base} bg-blue-100 text-blue-700`}><Truck className="w-3 h-3" /> In Transit</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}>Unknown</span>;
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-[#1e3a8a] text-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-xl">
              {user?.name?.[0]?.toUpperCase() || "J"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user?.name || "Customer"}!</h1>
              <p className="text-teal-200">
                Account Active | Total Shipments: {shipments.length}
              </p>
            </div>
          </div>
        </header>

        {/* Alerts */}
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <p className="text-orange-700 text-sm flex-1">{alert.message}</p>
            <button onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))} aria-label="Dismiss alert">
              <X className="w-5 h-5 text-orange-600" />
            </button>
          </div>
        ))}

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/create-shipment" className="bg-teal-500 text-white p-4 rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-md flex items-center gap-3">
            <Package className="w-6 h-6" /> Create Shipment
          </Link>
          <Link to="/track" className="bg-[#1e3a8a] text-white p-4 rounded-lg hover:bg-[#1e40af] transition-all duration-200 shadow-md flex items-center gap-3">
            <Search className="w-6 h-6" /> Track Shipment
          </Link>
          <Link to="/quote" className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md flex items-center gap-3">
            <MapPin className="w-6 h-6" /> Get Quote
          </Link>
          <Link to="/contact" className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md flex items-center gap-3">
            <User className="w-6 h-6" /> Contact Support
          </Link>
        </section>

        {/* Shipment Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shipment Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-semibold text-teal-600">{shipments.length}</p>
              <p className="text-gray-600 text-sm">Total Shipments</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-semibold text-orange-600">{shipments.filter(s => s.status === "pending").length}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-semibold text-green-600">{shipments.filter(s => s.status === "delivered").length}</p>
              <p className="text-gray-600 text-sm">Delivered</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tracking ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Destination</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <tr key={shipment.trackingId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{shipment.trackingId}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(shipment.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shipment.destinationCity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shipment.date || shipment.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/shipments" className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-medium">
            View All Shipments
          </Link>
        </section>

        {/* Account Information */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Name</p>
              <p className="text-gray-900 font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Email</p>
              <p className="text-gray-900 font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Phone</p>
              <p className="text-gray-900 font-semibold">{user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Billing Status</p>
              <p className="text-gray-900 font-semibold">No outstanding balance</p>
            </div>
          </div>
          <Link to="/profile" className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Edit Profile
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e3a8a] text-white rounded-xl p-6 text-center">
          <p className="text-sm mb-4">&copy; {new Date().getFullYear()} EagleNet Nigeria Logistics. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="/faq" className="text-teal-200 hover:text-teal-300">FAQ</a>
            <a href="/terms" className="text-teal-200 hover:text-teal-300">Terms</a>
            <a href="/contact" className="text-teal-200 hover:text-teal-300">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
