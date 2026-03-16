import React from "react";
import { Search, Bell, User, MessageSquare, Sun, Menu, Search as SearchIcon } from "lucide-react";

export default function Navbar({ user, toggleSidebar }) {
    return (
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
                {/* Left: Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>

                        <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all group">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-600/20 overflow-hidden">
                                {user?.photo ? (
                                    <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.firstName?.[0] || user?.name?.[0] || <User size={18} />
                                )}
                            </div>
                            <div className="text-left hidden lg:block pr-1">
                                <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {user?.name || user?.firstName || "Admin"}
                                </p>
                            </div>
                            <Menu size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors hidden sm:block rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

