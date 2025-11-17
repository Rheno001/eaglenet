import { Bell, Search, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Simulate fetching notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = () => {
      // In a real app, you would fetch this from your backend API
      const demoNotifications = [
        { id: 1, message: "New shipment #12345 has been created." },
        { id: 2, message: "Shipment #67890 is now in transit." },
        { id: 3, message: "A user has registered." },
      ];
      setNotifications(demoNotifications);
    };
    fetchNotifications();
  }, []);

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (
    <header className="bg-gray-200 text-gray-800 shadow-md px-4 md:px-6 py-4 flex items-center justify-between relative z-10">
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm"
            aria-label="Search dashboard"
          />
        </div>
      </div>

      {/* Right: Notifications and User Info */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-full hover:bg-teal-100 transition-all duration-200"
          aria-label={`Notifications (${notifications.length} new)`}
        >
          <Bell size={20} className="text-gray-600 hover:text-teal-600" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>

        {/* User Info */}
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-purple-100 transition-all duration-200"
            aria-label="User profile"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-base shadow-md">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-800">
              {user?.name || "Admin"}
            </span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-20">
              <div className="p-4 border-b border-gray-200">
                <p className="text-gray-900 font-semibold text-sm">
                  {user?.name || "Admin"}
                </p>
                <p className="text-gray-500 text-xs">{user?.email || "admin@eaglenet.com"}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => alert("Profile settings not implemented")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-md flex items-center gap-2 transition-all duration-200"
                >
                  <User size={16} />
                  Profile Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md flex items-center gap-2 transition-all duration-200"
                >
                  <Bell size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}