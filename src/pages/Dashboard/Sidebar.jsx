import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROLES } from "../../utils/roles";
import { LayoutDashboard, Package, Users } from "lucide-react";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const location = useLocation();

  const links = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    ...(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN
      ? [{ name: "Requests", path: "/dashboard/requests", icon: <Package size={18} /> }]
      : []),
    ...(role === ROLES.SUPER_ADMIN
      ? [{ name: "Manage Admins", path: "/dashboard/manage-admins", icon: <Users size={18} /> }]
      : []),
  ];

  return (
    <>
      {/* Overlay for mobile */}
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
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
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
