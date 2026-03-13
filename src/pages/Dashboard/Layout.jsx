import { useState, useContext, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../../components/Dashboard/Sidebar";
import Navbar from "../../components/admin/Navbar"; // Shared navbar
import { AuthContext } from "../../context/AuthContext";
import PaymentWatcher from "../../components/Admin/PaymentWatcher";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (loading && !user) return null; // Block only if we have no cached state
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-50/50 overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-900">
      <PaymentWatcher user={user} />
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Navbar user={user} toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6 lg:p-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
