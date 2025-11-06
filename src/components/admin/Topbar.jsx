import { Bell } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Left: Page title or search */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell size={20} className="text-gray-600 hover:text-blue-600 transition" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span className="text-gray-700 font-medium">{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
