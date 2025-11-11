import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, Package, Bell, BarChart2, Settings, Menu, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { logout } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-teal-500 text-white shadow-md"
        : "text-gray-200 hover:bg-teal-600 hover:text-white"
    } ${isCollapsed ? "justify-center px-2" : ""}`;

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-[#1e3a8a] text-white flex flex-col justify-between min-h-screen transition-all duration-300 shadow-lg`}
    >
      <div>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-orange-400">🦅</span> EagleNet
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-teal-600 text-white transition-all duration-200"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavLink
            to="/eaglenet/auth/admin"
            end
            className={linkClass}
            aria-label="Overview"
          >
            <LayoutDashboard size={18} />
            {!isCollapsed && <span>Overview</span>}
          </NavLink>
          <NavLink
            to="/eaglenet/auth/admin/orders"
            className={linkClass}
            aria-label="Orders"
          >
            <Package size={18} />
            {!isCollapsed && <span>Orders</span>}
          </NavLink>
          <NavLink
            to="/eaglenet/auth/admin/users"
            className={linkClass}
            aria-label="Users"
          >
            <Users size={18} />
            {!isCollapsed && <span>Users</span>}
          </NavLink>
          <NavLink
            to="/eaglenet/auth/admin/reports"
            className={linkClass}
            aria-label="Reports"
          >
            <BarChart2 size={18} />
            {!isCollapsed && <span>Reports</span>}
          </NavLink>
          <NavLink
            to="/eaglenet/auth/admin/payment"
            className={linkClass}
            aria-label="Payment"
          >
            <BarChart2 size={18} />
            {!isCollapsed && <span>Payment</span>}
          </NavLink>
          <NavLink
            to="/eaglenet/auth/admin/notifications"
            className={linkClass}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {!isCollapsed && <span>Notifications</span>}
          </NavLink>
          {/*
          <NavLink
            to="/eaglenet/auth/admin/settings"
            className={linkClass}
            aria-label="Settings"
          >
            <Settings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
          */}
          <button
            onClick={logout}
            className={`flex ${
              isCollapsed ? "justify-center" : "items-center"
            } w-full gap-3 px-4 py-3 text-sm font-medium text-gray-200 hover:text-red-400 hover:bg-red-800/20 rounded-xl transition-all duration-200`}
            aria-label="Logout"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700"></div>
    </aside>
  );
}
