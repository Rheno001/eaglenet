import React from "react";
import { Search, Bell, User, MessageSquare, Sun, Menu, Search as SearchIcon } from "lucide-react";

export default function Navbar({ user, toggleSidebar }) {
    return (
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
                {/* Left: Menu Toggle & Search Bar */}
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="relative w-full group hidden md:block">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium outline-none"
                        />
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors hidden sm:block">
                            <MessageSquare size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden lg:block">
                            <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || "Admin"}</p>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase mt-1">Super Admin</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-600/20">
                            {user?.name?.[0] || <User size={16} />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

