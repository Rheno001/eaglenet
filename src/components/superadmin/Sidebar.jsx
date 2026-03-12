import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  BarChart2,
  CreditCard,
  ShieldAlert,
  Settings
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function SuperAdminSidebar({ isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { path: "/eaglenet/auth/superadmin", icon: LayoutDashboard, label: "Overview" },
    { path: "/eaglenet/auth/superadmin/orders", icon: Package, label: "System Orders" },
    { path: "/eaglenet/auth/superadmin/users", icon: Users, label: "All Users" },
    { path: "/eaglenet/auth/superadmin/admins", icon: ShieldAlert, label: "Manage Admins" },
    { path: "/eaglenet/auth/superadmin/reports", icon: BarChart2, label: "Full Reports" },
    { path: "/eaglenet/auth/superadmin/payment", icon: CreditCard, label: "All Payments" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 
     text-sm font-medium whitespace-nowrap
     ${isActive
      ? "bg-purple-600 text-white shadow-sm"
      : "text-slate-400 hover:bg-slate-800 hover:text-white"}
     ${isCollapsed ? "justify-center px-2" : ""}`;

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  const mobileTranslate = isMobile && !isOpen ? "-translate-x-full" : "translate-x-0";

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-slate-900 text-white shadow-xl z-50
          flex flex-col transition-all duration-300
          ${sidebarWidth}
          ${mobileTranslate}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center shrink-0">
              <ShieldAlert size={20} className="text-white" />
            </div>
            {!isCollapsed && <h1 className="text-lg font-bold tracking-tight">Super Admin</h1>}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/eaglenet/auth/superadmin"}
              className={linkClass}
              onClick={() => isMobile && toggleSidebar()}
            >
              <item.icon size={18} className="shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER / USER */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold uppercase transition-all">
                {user?.name?.[0] || user?.firstName?.[0] || 'S'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate leading-none">{user?.name || user?.firstName || 'Super Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate mt-1">{user?.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-4 py-2 rounded-lg 
              text-xs font-medium text-slate-400 hover:text-white 
              hover:bg-red-600/10 hover:text-red-400 transition-all 
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
