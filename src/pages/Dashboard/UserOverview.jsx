import React, { useState, useEffect, useContext } from "react";
import {
  Package,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  Wallet,
  CreditCard,
  ShieldCheck,
  User as UserIcon,
  Calendar,
  Activity,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function UserOverview() {
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
      <div className="w-12 h-12 border-[3px] border-slate-900 border-t-teal-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">Loading...</p>
    </div>
  );

  const stats = dashboardData || {
    totalBookings: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    user: authUser
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-slate-200">
              {stats.user?.firstName?.charAt(0)}{stats.user?.lastName?.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              Welcome back, {stats.user?.firstName}!
            </h1>
            {/*  */}
          </div>
        </div>
        <Link
          to="/customer-dashboard/booking"
          className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[11px] uppercase tracking-widest">New Shipment</span>
        </Link>
      </header>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TOTAL BOOKINGS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="relative z-10">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Package size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Shipment</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stats.totalBookings}</h3>
              <span className="text-emerald-500 font-bold text-xs mb-1 flex items-center">
                <TrendingUp size={14} className="mr-1" /> ACTIVE
              </span>
            </div>
          </div>
          <ArrowUpRight className="absolute -right-4 -top-4 w-32 h-32 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* TOTAL PAID */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="relative z-10">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Wallet size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payment</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">₦{parseFloat(stats.totalPaid || 0).toLocaleString()}</h3>
          </div>
          <TrendingUp className="absolute -right-4 -top-4 w-32 h-32 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* DELIVERED SHIPMENTS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="relative z-10">
            <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl w-fit mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
               <CheckCircle size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivered Shipment</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stats.delivered || stats.deliveredCount || 0}</h3>
              <span className="text-emerald-500 font-bold text-xs mb-1 flex items-center">
                 <ShieldCheck size={14} className="mr-1" /> VERIFIED
              </span>
            </div>
          </div>
          <CheckCircle className="absolute -right-4 -top-4 w-32 h-32 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* PROFILE SUMMARY */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-teal-500/20 text-teal-400 rounded-2xl group-hover:bg-teal-500 group-hover:text-slate-900 transition-all duration-500">
                <UserIcon size={28} />
              </div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Customer Profile</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Full Name</span>
                <span className="font-bold text-sm tracking-tight">{stats.user?.firstName} {stats.user?.lastName}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Email Address</span>
                <span className="font-bold text-sm">{stats.user?.email || "—"}</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
        </div>

        {/* QUICK TRACKER */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="p-6 bg-slate-50 text-slate-900 rounded-[2rem] mb-8">
            <TrendingUp size={48} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">REAL-TIME SHIPMENT TRACKING</h3>
          <p className="text-slate-500 font-medium mb-10 max-w-xs">Enter  tracking ID to monitor your Shipment movement</p>
          <Link
            to="/customer-dashboard/track"
            className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-900 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-500 active:scale-95"
          >
            Access Tracker <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

const CheckCircle = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
