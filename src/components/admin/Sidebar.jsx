import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { path: "/eaglenet/auth/admin", icon: LayoutDashboard, label: "Overview" },
    { path: "/eaglenet/auth/admin/orders", icon: Package, label: "Orders" },
    { path: "/eaglenet/auth/admin/users", icon: Users, label: "Users" },
    { path: "/eaglenet/auth/admin/reports", icon: BarChart2, label: "Reports" },
    { path: "/eaglenet/auth/admin/payment", icon: BarChart2, label: "Payment" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 
     text-xs md:text-sm font-medium whitespace-nowrap
     ${isActive ? "bg-teal-500 text-white shadow-md" : "text-gray-300 hover:bg-teal-600/50 hover:text-white"}
     ${isCollapsed ? "justify-center px-2 md:px-3" : ""}`;

  const sidebarWidth = isCollapsed ? "w-14 md:w-16" : "w-56 md:w-64";
  const mobileTranslate = isMobile && !isOpen ? "-translate-x-full" : "translate-x-0";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-2xl z-50
          flex flex-col justify-between transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${mobileTranslate}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-3.5 md:-right-4 top-4 md:top-6 z-[60] 
            bg-gray-900 border border-gray-700 text-white w-7 h-7 md:w-8 md:h-8 
            rounded-full flex items-center justify-center shadow-lg 
            hover:bg-gray-800 transition-all
          `}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={16} className="md:w-5 md:h-5" /> : <X size={16} className="md:w-5 md:h-5" />}
        </button>

        {/* HEADER */}
        <div className="p-3 md:p-6 border-b border-gray-700 space-y-3 md:space-y-4">
          {/* App Name */}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xl md:text-2xl">🦅</span>
            {!isCollapsed && <h1 className="text-lg md:text-xl font-bold hidden md:block">EagleNet</h1>}
          </div>

          {/* USER INFO */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 md:gap-3 px-1">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                {user?.name?.[0] || user?.email?.[0]}
              </div>
              <div className="min-w-0 md:block">
                <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* NAV LINKS */}
        <nav className="p-2 md:p-4 space-y-0.5 md:space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/eaglenet/auth/admin"}
              className={linkClass}
              onClick={() => isMobile && toggleSidebar()}
            >
              <item.icon size={16} className="md:w-4.5 md:h-4.5 shrink-0" />
              {!isCollapsed && <span className="md:inline">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-2 md:p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl 
              text-xs md:text-sm font-medium text-gray-300 hover:text-red-400 
              hover:bg-red-800/20 transition-all duration-200
              ${isCollapsed ? "justify-center px-2 md:px-3" : ""}
            `}
            aria-label="Logout"
          >
            <LogOut size={16} className="md:w-4.5 md:h-4.5 flex-shrink-0" />
            {!isCollapsed && <span className="md:inline">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}