
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
    </div>
  );
}
