<<<<<<< HEAD
import React, { useState } from "react";

export default function Users() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Dummy user data (replace with API later)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      orders: [
        { id: 2341, item: "Laptop", status: "Delivered" },
        { id: 2339, item: "Shoes", status: "In Transit" },
      ],
    },
    {
      id: 2,
      name: "Blessing Paul",
      email: "bless@example.com",
      role: "User",
      orders: [
        { id: 2322, item: "Phone", status: "Pending" }
      ],
    },
    {
      id: 3,
      name: "Admin Manager",
      email: "admin@example.com",
      role: "Admin",
      orders: [],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = filterRole === "All" || user.role === filterRole;

    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Users</h2>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>User</option>
          <option>Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Orders</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 text-center">{user.orders.length}</td>
                    <td className="p-3 text-center">
                      <button
                        className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">{selectedUser.name}</h3>

            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>

            <h4 className="mt-4 font-medium">Orders:</h4>

            {selectedUser.orders.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {selectedUser.orders.map((o) => (
                  <li key={o.id} className="border p-2 rounded text-sm">
                    <strong>#{o.id}</strong> — {o.item} ({o.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No orders yet.</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
=======
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost/backend/users.php", 
        email ? { email } : {}, 
        { withCredentials: true }
      );

      if (response.data.success) {
        if (email) {
          setUsers([response.data.user]); // Wrap single user in array
        } else {
          setUsers(response.data.users);
        }
      } else {
        setUsers([]);
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users on first render
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Users Information</h2>

      {/* Search Form */}
      <div className="bg-white p-4 rounded-xl shadow border mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="email"
          placeholder="Enter email to search..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch User(s)"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white p-6 rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <p className="text-gray-600 text-center">Fetching data...</p>
        ) : users.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">S/N</th>
                <th className="p-3">First Name</th>
                <th className="p-3">Last Name</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.firstName}</td>
                  <td className="p-3">{user.lastName}</td>
                  <td className="p-3">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No users found.</p>
        )}
      </div>
>>>>>>> e6f0a7fc6bbeab5389fec682218ce7a3b11b9f2a
    </div>
  );
}
