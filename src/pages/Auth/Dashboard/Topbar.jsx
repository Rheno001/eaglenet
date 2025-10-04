import React from "react";

export default function Topbar({ user }) {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Welcome, {user?.fullName || "User"} 👋</h1>
      <span className="text-sm text-gray-500">
        Role: <b className="capitalize">{user?.role}</b>
      </span>
    </header>
  );
}
