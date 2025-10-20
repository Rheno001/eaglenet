import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROLES } from "../../utils/roles";
import {
  LayoutDashboard,
  Package,
  Users,
  Bell,
  Truck,
  CreditCard,
  Settings,
  ClipboardList,
  UserCog,
  FileText,
} from "lucide-react";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const links = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Booking", path: "/dashboard/Booking", icon: <Users size={18} /> },
    { name: "Shipments", path: "/dashboard/shipments", icon: <Truck size={18} /> },
    { name: "Track Shipment", path: "/dashboard/track", icon: <ClipboardList size={18} /> },
    { name: "Payments", path: "/dashboard/payments", icon: <CreditCard size={18} /> },
    
    // { name: "Reports", path: "/dashboard/reports", icon: <FileText size={18} /> },

    ...(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN
      ? [{ name: "Requests", path: "/dashboard/requests", icon: <Package size={18} /> }]
      : []),

    // { name: "Fleet Management", path: "/dashboard/fleet", icon: <Truck size={18} /> },
    // { name: "Drivers", path: "/dashboard/drivers", icon: <UserCog size={18} /> },

    ...(role === ROLES.SUPER_ADMIN
      ? [{ name: "Manage Admins", path: "/dashboard/manage-admins", icon: <Users size={18} /> }]
      : []),

    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  const notifications = [
    "Shipment #234 is out for delivery",
    "Promo: 10% discount on bulk delivery",
    "Payment pending for Order #101",
    "New delivery alert: Order #445",
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold">EagleNet</h1>
          <div className="flex items-center gap-4">
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
                    {notifications.map((note, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      >
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
        </div>

        <nav className="flex flex-col mt-6 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all rounded-md ${
                location.pathname === link.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
