import React, { useState, useEffect, useContext } from "react";
import {
    Package,
    Box,
    RotateCcw,
    CheckCircle,
    Clock,
    TrendingUp,
    PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import RecentOperations from "../../components/Dashboard/RecentOperations";

export default function CustomerOverview() {
    const { user: authUser } = useContext(AuthContext);
    const [stats, setStats] = useState({
        pending: 0,
        processing: 0,
        inTransit: 0,
        delivered: 0,
        delayed: 0,
        totalBookings: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch Dashboard Stats (Specific endpoint for customer)
                const statsRes = await fetch("https://eaglenet-eb9x.onrender.com/api/users/me/dashboard", { headers });
                const statsResult = await statsRes.json();
                if (statsResult.status === "success") {
                    // Mapping customer stats to the cards
                    setStats({
                        pending: statsResult.data.pending || 0,
                        processing: statsResult.data.processing || 0,
                        inTransit: statsResult.data.inTransit || 0,
                        delivered: statsResult.data.delivered || 0,
                        delayed: statsResult.data.delayed || 0,
                        totalBookings: statsResult.data.totalBookings || 0
                    });
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
                        parcelQty: order.packageType || "1",
                        status: order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase().replace(/_/g, ' ')
                    })));
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Dashboard...</p>
        </div>
    );

    const dashboardStatsData = [
        { label: "Pending Shipments", value: stats.pending, icon: Clock, bgColor: "bg-orange-50", textColor: "text-orange-600" },
        { label: "Shipments In Transit", value: stats.inTransit, icon: Box, bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
        { label: "Total Delivered", value: stats.delivered, icon: CheckCircle, bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Welcome, {authUser?.firstName || authUser?.name || "Customer"}
                    </h1>
                    <p className="text-slate-500 mt-1">Here's a quick look at your delivery status and account.</p>
                </div>
                <Link
                    to="/customer-dashboard/booking"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95 group"
                >
                    <PlusCircle size={20} />
                    <span>Send Package</span>
                </Link>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={dashboardStatsData} />

            {/* Recent Operations */}
            <RecentOperations data={recentOrders} title="Your Recent Shipments" />
        </div>
    );
}

