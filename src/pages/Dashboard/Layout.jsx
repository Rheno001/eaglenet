import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/users/Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);        // mobile open/close
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse

  const toggleSidebar = () => {
    setIsOpen(true); 
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1 p-6 transition-all duration-300
          ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}
        `}
      >
        <Outlet />
      </main>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
