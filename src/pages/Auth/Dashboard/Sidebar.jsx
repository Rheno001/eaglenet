import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "../../utils/roles";
import { LogOut } from "lucide-react";

export default function Sidebar({ role = "user", onLogout }) {
  const location = useLocation();
  const items = MENU_ITEMS[role] || [];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">EagleNet Admin</h2>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center space-x-2 text-sm hover:text-red-400 transition"
      >
        <LogOut size={18} /> <span>Logout</span>
      </button>
    </aside>
  );
}
