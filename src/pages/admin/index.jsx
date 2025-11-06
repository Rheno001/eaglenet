import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Overview() {
  // ======== BAR CHART (Shipments per Month) ========
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Shipments",
        data: [120, 190, 300, 250, 200, 330],
        backgroundColor: "#3b82f6", // optional
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  // ======== PIE CHART (Order Status) ========
  const pieData = {
    labels: ["Delivered", "In Transit", "Delayed"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"], // optional
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-1">1,240</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h3 className="text-3xl font-bold text-green-600 mt-1">864</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Ongoing Shipments</p>
          <h3 className="text-3xl font-bold text-yellow-600 mt-1">42</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h3 className="text-3xl font-bold text-purple-600 mt-1">₦2.4M</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Monthly Shipments
          </h3>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Order Status Breakdown
          </h3>
          <Pie data={pieData}/>
        </div>
      </div>

      {/* Existing Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">#2341</td>
                <td className="p-3">John Doe</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded bg-green-100 text-green-700 text-xs">Delivered</span>
                </td>
                <td className="p-3">Nov 15, 2025</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">#2339</td>
                <td className="p-3">Blessing Paul</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">In Transit</span>
                </td>
                <td className="p-3">Nov 14, 2025</td>
              </tr>
              <tr>
                <td className="p-3">#2332</td>
                <td className="p-3">Uche O.</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs">Delayed</span>
                </td>
                <td className="p-3">Nov 13, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
