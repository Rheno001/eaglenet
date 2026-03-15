import React, { useState, useEffect, useContext } from "react";
import {
    Package,
    TrendingUp,
    PlusCircle,
    Wallet,
    ShieldCheck,
    ArrowRight,
    CheckCircle as CheckCircleIcon,
    Search,
    Box
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function CustomerOverview() {
    const { user: authUser } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch("https://eaglenet-eb9x.onrender.com/api/users/me/dashboard", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.status === "success") {
                    setDashboardData(result.data);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Dashboard...</p>
        </div>
    );

    const stats = dashboardData || {
        totalBookings: 0,
        totalPaid: 0,
        outstandingBalance: 0,
        user: authUser
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* SIMPLE WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Welcome, {stats.user?.firstName}
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

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Package size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Total Shipments</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900">{stats.totalBookings}</h3>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Wallet size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Total Payments</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">₦{parseFloat(stats.totalPaid || 0).toLocaleString()}</h3>
                </div>

                <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/10 text-white rounded-2xl">
                                <Search size={24} />
                            </div>
                            <span className="text-sm font-bold text-slate-300">Track Package</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">Monitor your movements in real-time.</p>
                        <Link
                            to="/customer-dashboard/track"
                            className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all"
                        >
                            Access Tracker <ArrowRight size={16} />
                        </Link>
                    </div>
                    <Box className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            {/* ACCOUNT & INFO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-50 text-slate-900 rounded-xl">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Account Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-slate-500 text-sm font-medium">Customer ID</span>
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{stats.user?.id?.substring(0, 12)}...</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-slate-500 text-sm font-medium">Verification Status</span>
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                                <CheckCircleIcon size={14} /> Verified
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-500 text-sm font-medium">Joined</span>
                            <span className="font-bold text-slate-900 text-sm">{new Date(stats.user?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col justify-center border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Need Help?</h3>
                    <p className="text-slate-500 mb-6">Our support team is available 24/7 to assist with your shipments and account queries.</p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
