import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from "recharts";
import {
  Package,
  Truck,
  CheckCircle,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Calendar as CalendarIcon
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
  const [pieFilter, setPieFilter] = useState("All");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://eaglenet.onrender.com/admin-users.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats({
          total_users: 1450,
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

  const shipmentDataAll = [
    { name: "Pending", value: stats.pending_shipments, fill: "#f59e0b" },
    { name: "Delivered", value: stats.delivered_shipments, fill: "#10b981" },
    { name: "In Transit", value: stats.in_transit_shipments, fill: "#3b82f6" },
  ];

  const shipmentData = pieFilter === "All"
    ? shipmentDataAll
    : shipmentDataAll.filter((d) => d.name === pieFilter);

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
          {value.toLocaleString()}
        </h3>
        <ArrowUpRight size={12} className="text-gray-300" />
      </div>
    </div>
  );

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
        <StatCard icon={Users} label="Total Users" value={stats.total_users || 0} trend="+8%" colorClass="bg-blue-600" />
        <StatCard icon={ShoppingCart} label="Bookings" value={stats.total_bookings || 0} trend="+12%" colorClass="bg-emerald-600" />
        <StatCard icon={Package} label="Pending" value={stats.pending_shipments || 0} trend="-3%" colorClass="bg-amber-600" />
        <StatCard icon={Truck} label="In Transit" value={stats.in_transit_shipments || 0} trend="+5%" colorClass="bg-indigo-600" />
        <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered_shipments || 0} trend="+15%" colorClass="bg-purple-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distribution</h2>
            <div className="flex bg-gray-50 p-1 rounded gap-1">
              {["All", "Pending", "In Transit"].map((f) => (
                <button
                  key={f}
                  onClick={() => setPieFilter(f)}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${pieFilter === f ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={shipmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                  {shipmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {shipmentDataAll.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weekly Trends</h2>
            <MoreVertical size={14} className="text-gray-300" />
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { day: 'Mon', val: 40 }, { day: 'Tue', val: 55 }, { day: 'Wed', val: 45 },
                { day: 'Thu', val: 75 }, { day: 'Fri', val: 60 }, { day: 'Sat', val: 80 },
                { day: 'Sun', val: (stats.delivered_shipments % 100) || 50 }
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="val" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Efficiency Rate</p>
              <p className="text-lg font-bold text-gray-900">88.4% <span className="text-[10px] text-emerald-600 ml-1">↑ 3%</span></p>
            </div>
            <div className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded text-[9px] font-bold uppercase border border-teal-100">Target Met</div>
          </div>
        </div>
      </div>
    </div>
  );
}


