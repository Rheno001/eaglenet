import React, { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  CreditCard,
} from "lucide-react";

export default function Overview() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/backend/Shipments.php");

      if (!response.ok) throw new Error("Failed to fetch shipments");

      const data = await response.json();
      const shipmentData = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];

      setShipments(shipmentData);
    } catch (err) {
      setError("Could not load data.");
      setShipments([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const latestShipments = [...shipments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  const countByStatus = (status) =>
    shipments.filter(
      (s) => s.status?.toLowerCase() === status.toLowerCase()
    ).length;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 p-4 border-l-4 border-red-500 rounded-lg mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-gray-700 font-medium">Loading data...</p>
        )}

        {/* ---------------- QUICK STATS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Shipments"
            value={shipments.length}
            icon={<Package className="w-6 h-6 text-blue-500" />}
          />
          <StatCard
            title="Delivered"
            value={countByStatus("Delivered")}
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          />
          <StatCard
            title="In Transit"
            value={countByStatus("In Transit")}
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
          />
          <StatCard
            title="Pending"
            value={countByStatus("Pending")}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
          />
        </div>

        {/* ---------------- RECENT SHIPMENTS ---------------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Shipments</h2>

          {latestShipments.length === 0 ? (
            <p className="text-gray-600">No recent shipments.</p>
          ) : (
            <div className="space-y-4">
              {latestShipments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.trackingId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.pickupCity} → {item.destinationCity}
                    </p>
                  </div>

                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- PAYMENT SUMMARY ---------------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800 font-medium">Last Payment</p>
              <p className="text-gray-600 text-sm">₦48,500 • 27 Jan 2025</p>
            </div>
            <CreditCard className="w-7 h-7 text-blue-600" />
          </div>

          <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-teal-600">
            View Payment History
          </button>
        </div>

        {/* ---------------- ALERTS ---------------- */}
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg mb-10">
          <h3 className="font-semibold text-yellow-800 mb-1">Alerts</h3>
          <p className="text-yellow-700 text-sm">
            One of your shipments may experience a slight delay due to weather conditions.
          </p>
        </div>

        {/* ---------------- CONTACT CUSTOMER REP ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact our customer support representatives for quick assistance.
          </p>

          <button className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-gray-900">
            <Phone className="w-5 h-5" />
            Call Customer Representative
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-600 font-medium">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
