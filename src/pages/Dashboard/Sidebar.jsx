import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROLES } from "../../utils/roles";
import {
  LayoutDashboard,
  Package,
  Users,
  Bell,
  LogOut,
  Truck,
  ClipboardList,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useContext(AuthContext);

  const links = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Booking", path: "/dashboard/Booking", icon: <Users size={18} /> },
    { name: "Shipments", path: "/dashboard/shipments", icon: <Truck size={18} /> },
    { name: "Track Shipment", path: "/dashboard/track", icon: <ClipboardList size={18} /> },

    ...(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN
      ? [{ name: "Requests", path: "/dashboard/requests", icon: <Package size={18} /> }]
      : []),

    ...(role === ROLES.SUPER_ADMIN
      ? [{ name: "Manage Admins", path: "/dashboard/manage-admins", icon: <Users size={18} /> }]
      : []),
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col justify-between transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* ✅ TOP SECTION - matches first code */}
        <div>
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold">EagleNet</h1>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-300 hover:text-white"
              >
                <Bell size={20} />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-200">
                    {notifications.map((note, i) => (
                      <li key={i} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              className="md:hidden text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* ✅ NAVIGATION SECTION - styled like first sidebar */}
          <nav className="p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ✅ BOTTOM LOGOUT SECTION - same position & layout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 text-gray-300 hover:text-red-500 transition cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

      </aside>
    </>
  );
}
