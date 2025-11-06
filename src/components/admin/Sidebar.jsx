import { NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, Package, Bell, BarChart2, Settings } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-gray-900 text-white shadow"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h1 className="text-2xl font-bold text-center py-5 border-b text-gray-900">
          EagleNet Admin
        </h1>
        <nav className="p-4 space-y-2">
          <NavLink to="/eaglenet/auth/admin" end className={linkClass}>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink to="/eaglenet/auth/admin/orders" className={linkClass}>
            <Package size={18} /> Orders
          </NavLink>
          <NavLink to="/eaglenet/auth/admin/users" className={linkClass}>
            <Users size={18} /> Users
          </NavLink>
          <NavLink to="/eaglenet/auth/admin/reports" className={linkClass}>
            <BarChart2 size={18} /> Reports
          </NavLink>
          <NavLink to="/eaglenet/auth/admin/notifications" className={linkClass}>
            <Bell size={18} /> Notifications
          </NavLink>
          <NavLink to="/eaglenet/auth/admin/settings" className={linkClass}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full gap-3 text-gray-600 hover:text-red-600 hover:cursor-pointer transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
