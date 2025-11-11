import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Users as UsersIcon, Loader2, Mail, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch users
  const fetchUsers = async (searchEmail = "") => {
    const isSearching = searchEmail.trim() !== "";
    setSearching(isSearching);
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost/backend/users.php",
        isSearching ? { email: searchEmail } : {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
        setCurrentPage(1); // Reset to first page on new fetch
      } else {
        setUsers([]);
        setError(response.data.message || "No users found.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
      setError(err.response?.data?.message || "Failed to fetch data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search
  const handleSearch = () => {
    const trimmedEmail = email.trim();
    if (trimmedEmail || searching) {
      fetchUsers(trimmedEmail);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Pagination helpers
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UsersIcon className="text-blue-600" size={32} />
          </div>
          Users & Bookings Overview
        </h1>
        <p className="text-sm text-gray-500">
          {users.length > 0 ? `${users.length} user${users.length > 1 ? "s" : ""} loaded` : "No users"}
        </p>
      </header>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Search users by email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <section className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && !searching ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto text-blue-600 mb-3" size={32} />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs uppercase font-semibold text-gray-600 tracking-wider">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-200">S/N</th>
                    <th className="px-6 py-4 border-b border-gray-200">Name</th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-center">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Total Bookings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map((user, index) => (
                    <tr key={user.id || `${user.email}-${index}`} className="hover:bg-blue-50/50 transition-colors duration-150 group">
                      <td className="px-6 py-5 text-sm text-gray-500 font-medium">{indexOfFirstUser + index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">{user.email}</td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                            (user.total_bookings || 0) > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.total_bookings || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`px-3 py-1 rounded-lg border ${
                        currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-sm text-gray-500 mt-1">{email ? "Try adjusting your search." : "There are no registered users yet."}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
