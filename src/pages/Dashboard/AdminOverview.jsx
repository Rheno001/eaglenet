import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Box,
  RotateCcw
} from "lucide-react";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import RecentOperations from "../../components/Dashboard/RecentOperations";

export default function Overview() {
  const { } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    inTransit: 0,
    pending: 0,
    processing: 0,
    arrived: 0,
    delivered: 0,
    delayed: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch Stats
        const statsRes = await fetch("https://eaglenet-eb9x.onrender.com/api/admin/dashboard", { headers });
        const statsResult = await statsRes.json();
        if (statsResult.status === "success") {
          setStats(statsResult.data);
        }

        // Fetch Recent Orders
        const ordersRes = await fetch("https://eaglenet-eb9x.onrender.com/api/shipments?limit=10", { headers });
        const ordersResult = await ordersRes.json();
        if (ordersResult.status === "success") {
          setRecentOrders(ordersResult.data.map(order => ({
            orderId: order.trackingId.slice(-4),
            trackingNumber: order.trackingId,
            pickupDate: order.preferredPickupDate?.split('T')[0] || "—",
            deliveryDate: order.deliveryDate?.split('T')[0] || "TBD",
            parcelQty: order.packageType || "1", // API might not have Qty specifically, using type or default
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase().replace(/_/g, ' ')
          })));
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Activity...</p>
      </div>
    </div>
  );

  const dashboardStatsData = [
    { label: "Total Customers", value: stats.totalUsers || 0, icon: Package, bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Pending Shipments", value: stats.pending || 0, icon: Clock, bgColor: "bg-orange-50", textColor: "text-orange-600" },
    { label: "Shipments In Transit", value: stats.inTransit || 0, icon: Box, bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
    { label: "Total Delivered", value: stats.delivered || 0, icon: CheckCircle, bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Monitor your logistics and operations in real-time.</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={dashboardStatsData} />

      {/* Recent Operations */}
      <RecentOperations data={recentOrders} title="Recent Operations" />
    </div>
  );
}


