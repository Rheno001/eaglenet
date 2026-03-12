import React, { useState, useEffect, useContext } from "react";
import { 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight,
  Layout,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function UserOverview() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    activeShipments: 0,
    deliveredShipments: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("https://eaglenet-eb9x.onrender.com/api/shipments/mine", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.status === "success" && result.data) {
          const shipments = result.data;
          setStats({
            activeShipments: shipments.filter(s => s.status === "TRANSIT" || s.status === "PROCESSING").length,
            deliveredShipments: shipments.filter(s => s.status === "DELIVERED").length,
            pendingBookings: shipments.filter(s => s.status === "PENDING").length,
          });
        }
      } catch (err) {
        console.error("Error fetching user stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} className="text-white" />
        </div>
        <ArrowUpRight size={20} className="text-gray-300" />
      </div>
      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  );

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your shipments today.</p>
        </div>
        <Link 
          to="/dashboard/booking" 
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <PlusCircle size={20} />
          <span>New Shipment</span>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Truck} 
          label="Active Shipments" 
          value={stats.activeShipments} 
          colorClass="bg-blue-600" 
        />
        <StatCard 
          icon={Package} 
          label="Pending Bookings" 
          value={stats.pendingBookings} 
          colorClass="bg-amber-500" 
        />
        <StatCard 
          icon={Layout} 
          label="Delivered" 
          value={stats.deliveredShipments} 
          colorClass="bg-emerald-600" 
        />
      </div>

      <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-orange-400">Need to track a shipment?</h2>
          <p className="text-gray-300 mb-6 font-medium">Get real-time updates on your shipment location and estimated delivery time with our advanced shipment tracking system.</p>
          <Link 
            to="/dashboard/track" 
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl"
          >
            Track Shipment
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}
