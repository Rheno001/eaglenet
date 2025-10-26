import React from "react";
import { Menu } from "lucide-react";
import PropTypes from 'prop-types';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ toggleSidebar, className }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Use AuthContext logout to clear user state and localStorage
    window.location.href = "/login";
  };

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
        <span className="text-gray-700 font-medium">
          {user?.firstName || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  className: PropTypes.string,
};