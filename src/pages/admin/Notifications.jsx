import React, { useEffect, useState } from "react";
import { Package, User } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(6); // Adjustable

  // ✅ Fetch notifications
  const fetchNotifications = () => {
    fetch("http://localhost/backend/get-notifications.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setNotifications(data.notifications);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Auto-refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  // Pagination
  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  // Notification type icons
  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "user":
        return <User className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      {notifications.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentNotifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col
                           transition transform hover:-translate-y-1 hover:shadow-xl hover:bg-gray-50
                           duration-300 ease-in-out"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(notif.type)}
                  <h3 className="font-bold text-gray-900">{notif.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{notif.message}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(notif.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition duration-300 ease-in-out`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">No notifications found</p>
      )}
    </div>
  );
}
