import { useState, useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../../components/users/Sidebar";
import Topbar from "../../components/users/Topbar";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useContext(AuthContext);

  // ✅ Auto-open sidebar on desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Show loading state while verifying auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-700 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ✅ Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* ✅ Main Content */}
      <div className="flex flex-col flex-1 w-[50%]">
        <Topbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}