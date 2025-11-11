import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function Overview() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_bookings: 0,
    pending_shipments: 0,
    delivered_shipments: 0,
    in_transit_shipments: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost/backend/admin-users.php", { withCredentials: true })
      .then((response) => {
        if (response.data.success) setStats(response.data);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // ======== PIE CHART (Shipment Status Breakdown) ========
  const pieData = {
    labels: ["Pending", "Delivered", "In Transit"],
    datasets: [
      {
        label: "Shipments",
        data: [
          stats.pending_shipments,
          stats.delivered_shipments,
          stats.in_transit_shipments,
        ],
        backgroundColor: ["#facc15", "#22c55e", "#3b82f6"], // yellow, green, blue
      },
    ],
  };

  // ======== BAR CHART (Shipment Status Comparison) ========
  const barData = {
    labels: ["Pending", "Delivered", "In Transit"],
    datasets: [
      {
        label: "Number of Shipments",
        data: [
          stats.pending_shipments,
          stats.delivered_shipments,
          stats.in_transit_shipments,
        ],
        backgroundColor: ["#facc15", "#22c55e", "#3b82f6"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* ====== STAT CARDS ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-1">
            {stats.total_users}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h3 className="text-3xl font-bold text-green-600 mt-1">
            {stats.total_bookings}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Pending Shipments</p>
          <h3 className="text-3xl font-bold text-yellow-600 mt-1">
            {stats.pending_shipments}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h3 className="text-3xl font-bold text-purple-600 mt-1">₦2.4M</h3>
        </div>
      </div>

      {/* ====== CHARTS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border h-[65vh]">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Shipment Status (Pie Chart)
          </h3>
          <Pie data={pieData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow border h-[65vh]">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Shipment Status Comparison (Bar Chart)
          </h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
