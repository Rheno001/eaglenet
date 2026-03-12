import React, { useState, useEffect } from "react";
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

const StatCard = ({ icon: Icon, label, value, trend, colorClass }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded ${colorClass} bg-opacity-10`}>
        <Icon size={16} className={`${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
        <TrendingUp size={10} />
        <span>{trend}</span>
      </div>
    </div>
    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-baseline justify-between">
      <h3 className="text-lg font-bold text-gray-900 leading-none">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <ArrowUpRight size={12} className="text-gray-300" />
    </div>
  </div>
);

export default function Overview() {
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
    
    // Auto-refresh stats every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);





  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-800 text-xs">
          <p className="font-bold opacity-70 mb-1">{payload[0].name || payload[0].payload.day}</p>
          <p className="text-sm font-black">{payload[0].value.toLocaleString()} Units</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 text-sm">Real-time logistics analytics</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-semibold text-gray-700">
          <CalendarIcon size={16} />
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={stats.totalUsers || 0} 
          trend="+5%" 
          colorClass="bg-blue-600" 
        />
        <StatCard 
          icon={CreditCard} 
          label="Total Revenue" 
          value={`₦${(stats.totalRevenue || 0).toLocaleString()}`} 
          trend="+12%" 
          colorClass="bg-emerald-600" 
        />
        <StatCard 
          icon={Clock} 
          label="Pending" 
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
          colorClass="bg-purple-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Status Distribution</h2>
            <Activity size={14} className="text-gray-300" />
          </div>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.pieChart || []} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={5} 
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
          <div className="grid grid-cols-3 gap-2 mt-4">
            {(stats.pieChart || []).map(d => (
              <div key={d.label} className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded border border-gray-100">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-gray-400 uppercase truncate">{d.label}</p>
                  <p className="text-xs font-bold text-gray-900">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Volume Analysis</h2>
            <TrendingUp size={14} className="text-gray-300" />
          </div>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 text-white p-2 rounded shadow-lg text-[10px] font-bold">
                          {payload[0].value} {payload[0].payload.label}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">System Capacity</p>
                <p className="text-sm font-bold text-indigo-900">Optimal ({(stats.totalOrders / 20 * 100).toFixed(1)}%)</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-[10px] font-black uppercase border border-indigo-200 shadow-sm hover:shadow-md transition-all">View Log</button>
          </div>
        </div>
      </div>
    </div>
  );
}


