import React, { useEffect, useState } from "react";
import { 
  Package, 
  User, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const notificationsPerPage = 6;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost/backend/get-notifications.php");
      const data = await res.json();
      if (data.status === "success") {
        const sorted = data.notifications.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setNotifications(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Pagination
  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const getIconAndColor = (type) => {
    switch (type) {
      case "booking":
        return { icon: <Package className="w-6 h-6" />, color: "bg-blue-100 text-blue-600", ring: "ring-blue-200" };
      case "user":
        return { icon: <User className="w-6 h-6" />, color: "bg-emerald-100 text-emerald-600", ring: "ring-emerald-200" };
      case "payment":
        return { icon: <CheckCircle className="w-6 h-6" />, color: "bg-green-100 text-green-600", ring: "ring-green-200" };
      case "system":
        return { icon: <AlertCircle className="w-6 h-6" />, color: "bg-purple-100 text-purple-600", ring: "ring-purple-200" };
      default:
        return { icon: <Bell className="w-6 h-6" />, color: "bg-gray-100 text-gray-600", ring: "ring-gray-200" };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-12 h-12 text-indigo-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">Notifications</h1>
                <p className="text-lg text-gray-600 mt-1">Stay updated with real-time alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-xl border border-gray-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live • Auto-refresh</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur rounded-2xl p-6 animate-pulse border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-gray-500">No notifications yet</p>
            <p className="text-gray-400 mt-2">You're all caught up!</p>
          </div>
        ) : (
          <>
            {/* Notification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNotifications.map((notif, index) => {
                const { icon, color, ring } = getIconAndColor(notif.type);
                const isNew = index < 3;

                return (
                  <div
                    key={notif.id}
                    className={`group relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 
                               shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 
                               ${isNew ? 'ring-2 ring-offset-4 ' + ring : ''}`}
                  >
                    {isNew && (
                      <span className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                        NEW
                      </span>
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition">
                          {notif.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500 font-medium">
                            {formatTime(notif.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fixed Pagination – No Errors */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}  // Fixed: was corrupted
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300
                        ${currentPage === i + 1
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}