import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bell,
  LogOut,
  Truck,
  ClipboardList,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useContext(AuthContext);

  // ✅ USER-ONLY LINKS (no admin/superadmin)
  const links = [
    { 
      name: "Overview", 
      path: "/dashboard", 
      icon: <LayoutDashboard size={18} /> 
    },
    { 
      name: "Booking", 
      path: "/dashboard/booking", 
      icon: <Users size={18} /> 
    },
    { 
      name: "Shipments", 
      path: "/dashboard/shipments", 
      icon: <Truck size={18} /> 
    },
    { 
      name: "Track Shipment", 
      path: "/dashboard/track", 
      icon: <ClipboardList size={18} /> 
    },
  ];

  const notifications = [
    "Shipment #234 is out for delivery",
    "Promo: 10% discount on bulk delivery",
    "Payment pending for Order #101",
    "New delivery alert: Order #445",
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      {/* ✅ MOBILE OVERLAY - only shows when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`
          fixed md:static
          z-50 
          top-0 left-0 
          h-full w-64 
          bg-gray-900 text-white 
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ✅ TOP SECTION */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold">EagleNet</h1>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-300 hover:text-white transition"
                aria-label="Toggle notifications"
              >
                <Bell size={20} />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-200">
                    {notifications.map((note, i) => (
                      <li 
                        key={i} 
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Close Button - Mobile Only */}
            <button
              className="md:hidden text-gray-300 hover:text-white transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* ✅ NAVIGATION LINKS */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}// Close sidebar on mobile after click
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg 
                    transition-all duration-200
                    ${isActive
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ✅ BOTTOM LOGOUT SECTION */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}