import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/eaglenet-logo-removebg-preview.png'
import {
  LogOut,
  LayoutDashboard,
  Package,
  CreditCard,
  Menu,
  X,
  Search,
  Users,
  BarChart2,
  Settings,
  ShieldAlert,
  Bell,
  TrendingUp
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { MENU_ITEMS, ROLES } from "../../utils/roles";

export default function DashboardSidebar({ isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const iconMap = {
    'Home': LayoutDashboard,
    'Shipment': Package,
    'Booking': Package,
    'Track Shipment': Search,
    'Order': Package,
    'User': Users,
    'Services': Settings,
    'Reports': BarChart2,
    'Payment': CreditCard,
    'Global Networks': TrendingUp,
    'Admin Management': ShieldAlert,
    'Notifications': Bell,
    'Settings': Settings
  };

  const menuItems = MENU_ITEMS[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 
     text-xs md:text-sm font-bold tracking-tight whitespace-nowrap
     ${isActive
      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20"
      : "text-slate-400 hover:bg-slate-800 hover:text-white"}
     ${isCollapsed ? "justify-center px-2 md:px-3" : ""}`;

  const sidebarWidth = isCollapsed ? "w-14 md:w-16" : "w-56 md:w-64";
  const mobileTranslate = isMobile && !isOpen ? "-translate-x-full" : "translate-x-0";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-slate-900 text-white shadow-2xl z-50
          flex flex-col justify-between transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${mobileTranslate}
          lg:translate-x-0 lg:relative lg:z-auto
          border-r border-slate-800
        `}
      >
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-3.5 top-6 z-[60] 
            bg-slate-900 border border-slate-700 text-white w-7 h-7 
            rounded-full flex items-center justify-center shadow-xl 
            hover:bg-slate-800 transition-all
          `}
        >
          {isCollapsed ? <Menu size={14} /> : <X size={14} />}
        </button>

        {/* HEADER */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-1.5 rounded-xl shadow-inner">
              <img src={logo} alt="EagleNet" className="w-8 h-8 object-contain" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">EAGLENET</h1>
                <p className="text-[9px] font-bold text-teal-500 uppercase tracking-widest leading-none">{user?.role}</p>
              </div>
            )}
          </div>

          {/* USER INFO */}
          {!isCollapsed && (
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-3 group hover:border-teal-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shrink-0 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-teal-500/20">
                {user?.firstName?.[0]?.toUpperCase() || user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-teal-400 transition-colors">
                  {user?.firstName || user?.name || 'Account'}
                </p>
                <p className="text-[10px] text-slate-500 truncate font-semibold uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* NAV LINKS */}
        <nav className="p-3 md:p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = iconMap[item.name] || Package;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/customer-dashboard" || item.path === "/admin-dashboard"}
                className={linkClass}
                onClick={() => isMobile && toggleSidebar()}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl 
              text-sm font-bold text-slate-400 hover:text-red-400 
              hover:bg-red-500/10 transition-all duration-200
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Logout Session</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
