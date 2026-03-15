import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import {
  Package,
  Truck,
  CheckCircle,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  Activity
} from "lucide-react";

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, trend, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
        <Icon size={20} className={`${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
        {trend}
      </div>
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
  </div>
);

export default function Overview() {
  const { user } = useContext(AuthContext);
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
    pieChart: [],
    barChart: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("https://eaglenet-eb9x.onrender.com/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.status === "success") {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border-none">
          <p className="font-bold opacity-70 mb-1">{payload[0].name || payload[0].payload.day}</p>
          <p className="text-sm font-bold">{payload[0].value.toLocaleString()} Units</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Activity...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">System activity summary</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 text-sm font-bold text-slate-700">
          <CalendarIcon size={16} className="text-slate-400" />
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.totalUsers || 0}
          trend="+5%"
          colorClass="bg-blue-600"
        />
        {user?.role === 'SUPER_ADMIN' && (
          <StatCard
            icon={CreditCard}
            label="Total Revenue"
            value={`₦${(stats.totalRevenue || 0).toLocaleString()}`}
            trend="+12%"
            colorClass="bg-emerald-600"
          />
        )}
        <StatCard
          icon={Clock}
          label="Pending Shipments"
          value={stats.pending || 0}
          trend={`${stats.pending > 5 ? "+" : "-"}${Math.abs(stats.pending - 2)}`}
          colorClass="bg-amber-600"
        />
        <StatCard
          icon={Truck}
          label="In Transit"
          value={stats.inTransit || 0}
          trend="+1"
          colorClass="bg-indigo-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Delivered"
          value={stats.delivered || 0}
          trend="+0"
          colorClass="bg-teal-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold text-slate-400 border-l-4 border-slate-900 pl-3 uppercase tracking-widest">Shipment Status</h2>
            <Activity size={18} className="text-slate-200" />
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieChart || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  nameKey="label"
                  stroke="none"
                >
                  {(stats.pieChart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {(stats.pieChart || []).map(d => (
              <div key={d.label} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: d.color }}></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase truncate tracking-tight">{d.label}</p>
                  <p className="text-xs font-bold text-slate-900">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold text-slate-400 border-l-4 border-slate-900 pl-3 uppercase tracking-widest">Daily Volume</h2>
            <TrendingUp size={18} className="text-slate-200" />
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc', radius: 8 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2 px-3 rounded-lg shadow-xl text-[10px] font-bold border-none">
                          {payload[0].value} Shipments
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#0f172a"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group overflow-hidden relative">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Load</p>
                <p className="text-sm font-bold text-slate-900">Normal ({(stats.totalOrders / 20 * 100).toFixed(1)}%)</p>
              </div>
            </div>
            <button className="relative z-10 px-4 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-bold uppercase border border-slate-200 shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95">View Log</button>
            <Activity size={100} className="absolute -right-8 -bottom-8 text-slate-200/20 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}


