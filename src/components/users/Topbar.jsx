import React, { useContext } from "react";
import { Menu } from "lucide-react";
import PropTypes from 'prop-types';
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ className = "" }) {
  const { user } = useContext(AuthContext);

  return (
    <header 
      className={`
        bg-white shadow-md px-6 py-4 
        flex justify-between items-center 
        sticky top-0 z-30
        ${className}
      `}
    >
      {/* Left - Toggle for mobile + Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Right - User info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-gray-800">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
          {user?.firstName?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  className: PropTypes.string,
};