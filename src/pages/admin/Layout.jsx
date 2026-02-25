import { useState, useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => !prev);
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        <Navbar user={user} toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
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
