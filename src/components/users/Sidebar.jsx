import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  Bell,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-teal-500 text-white shadow-md"
        : "text-gray-200 hover:bg-teal-600 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md shadow-md"
      >
        {!isOpen ? <Menu size={22} /> : <X size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 bg-gray-900 text-white flex flex-col justify-between min-h-screen 
        transition-transform duration-300 shadow-lg fixed lg:static top-0 left-0 z-40`}
      >
        <div>
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-orange-400">🦅</span> EagleNet
            </h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-teal-600 text-white transition-all duration-200"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={linkClass}
              aria-label="Overview"
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/dashboard/booking"
              className={linkClass}
              aria-label="Booking"
            >
              <Package size={18} />
              <span>Booking</span>
            </NavLink>

            <NavLink
              to="/dashboard/shipments"
              className={linkClass}
              aria-label="Shipments"
            >
              <Users size={18} />
              <span>Shipments</span>
            </NavLink>

            <NavLink
              to="/dashboard/payment"
              className={linkClass}
              aria-label="Payment"
            >
              <BarChart2 size={18} />
              <span>Payment</span>
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-gray-200 
              hover:text-red-400 hover:bg-red-800/20 rounded-xl transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}