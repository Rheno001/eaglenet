import React from "react";
import { Menu } from "lucide-react";
import PropTypes from 'prop-types';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ toggleSidebar, className }) {
  const { user} = useContext(AuthContext);

  return (
    <header className={`bg-white shadow-sm px-6 py-4 flex justify-between items-center ${className}`}>
      {/* Left - Toggle for mobile */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-800" onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right - User info */}
      <div className="flex items-center gap-4">
         <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>
        <span className="text-gray-700 font-medium">
          {user?.firstName.toUpperCase() || "User"}
        </span>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  className: PropTypes.string,
};