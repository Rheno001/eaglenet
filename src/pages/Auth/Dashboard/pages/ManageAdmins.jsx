import React from "react";

export default function ManageAdmins() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      <p className="text-gray-600 mb-6">
        Only Super Admins can create or remove other admins.
      </p>

      <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
        + Create New Admin
      </button>
    </div>
  );
}
