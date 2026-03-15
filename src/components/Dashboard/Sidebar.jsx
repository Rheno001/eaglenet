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
    `flex items-center gap-3 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 
     text-xs md:text-sm font-bold tracking-tight whitespace-nowrap
     ${isCollapsed ? "justify-center px-2 md:px-3" : "px-4 md:px-5"}
     ${isActive
      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20"
      : "text-slate-400 hover:bg-slate-800 hover:text-white"}`;

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
            absolute -right-4 top-10 z-70 
            bg-slate-800 border border-slate-700 text-teal-400 w-8 h-8 
            rounded-full flex items-center justify-center shadow-2xl 
            hover:bg-teal-500 hover:text-white hover:border-teal-400
            transition-all duration-300 group/btn
          `}
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>

        {/* HEADER */}
        <div className={`${isCollapsed ? "p-2 md:p-3" : "p-4 md:p-6"} space-y-4 transition-all duration-300 overflow-x-hidden`}>
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="bg-white p-2 rounded-2xl shadow-inner mb-2 transition-transform hover:scale-110 duration-300">
              <img src={logo} alt="EagleNet" className="w-10 h-10 object-contain" />
            </div>
            {!isCollapsed && (
              <div className="text-center">
                <h1 className="text-xl font-black tracking-[0.2em] bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">EAGLENET</h1>
              </div>
            )}
          </div>

          {/* USER INFO */}
          {!isCollapsed && (
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-3 group hover:border-teal-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 shrink-0 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-teal-500/20">
                {user?.firstName?.[0]?.toUpperCase() || user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-teal-400 transition-colors">
                  {user?.firstName || user?.name || 'Account'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* NAV LINKS */}
        <nav className={`${isCollapsed ? "p-2" : "p-3 md:p-4"} space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300`}>
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
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 overflow-x-hidden">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl 
              text-sm font-bold text-slate-400 hover:text-red-400 
              hover:bg-red-500/10 transition-all duration-200
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
