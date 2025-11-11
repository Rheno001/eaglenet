import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Truck,
  CheckCircle,
  Users,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_bookings: 0,
    pending_shipments: 0,
    delivered_shipments: 0,
    in_transit_shipments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Pie Chart filter
  const [pieFilter, setPieFilter] = useState("All");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost/backend/admin-users.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setStats(data);
        } else {
          setError("Failed to fetch statistics");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Error loading data. Using demo data.");
        // Demo data
        setStats({
          total_users: 1250,
          total_bookings: 3480,
          pending_shipments: 245,
          delivered_shipments: 2890,
          in_transit_shipments: 345,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // All shipment data
  const shipmentDataAll = [
    { name: "Pending", value: stats.pending_shipments, fill: "#facc15" },
    { name: "Delivered", value: stats.delivered_shipments, fill: "#22c55e" },
    { name: "In Transit", value: stats.in_transit_shipments, fill: "#3b82f6" },
  ];

  // Filter Pie Chart data based on selected status
  const shipmentData =
    pieFilter === "All"
      ? shipmentDataAll
      : shipmentDataAll.filter((d) => d.name === pieFilter);

  const barChartData = [
    { status: "Pending", shipments: stats.pending_shipments },
    { status: "Delivered", shipments: stats.delivered_shipments },
    { status: "In Transit", shipments: stats.in_transit_shipments },
  ];

  const StatCard = ({ icon: Icon, label, value, bgColor, textColor }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <h3 className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</h3>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Optional: Function to update a booking status
  const updateBookingStatus = async (trackingId, status) => {
    try {
      const res = await fetch("http://localhost/backend/update-booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, status }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Booking ${trackingId} updated to ${status}`);
        // Optionally refresh stats after update
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.total_users}
          bgColor="bg-blue-500"
          textColor="text-blue-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.total_bookings}
          bgColor="bg-green-500"
          textColor="text-green-600"
        />
        <StatCard
          icon={Package}
          label="Pending"
          value={stats.pending_shipments}
          bgColor="bg-yellow-500"
          textColor="text-yellow-600"
        />
        <StatCard
          icon={Truck}
          label="In Transit"
          value={stats.in_transit_shipments}
          bgColor="bg-blue-500"
          textColor="text-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Delivered"
          value={stats.delivered_shipments}
          bgColor="bg-green-500"
          textColor="text-green-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipment Distribution
          </h2>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-4">
            {["All", "Pending", "Delivered", "In Transit"].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  pieFilter === status
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setPieFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={shipmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {shipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Shipment Status Comparison (Bar Chart)
          </h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
