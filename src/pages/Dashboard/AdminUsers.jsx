import React, { useEffect, useState, useContext } from "react";
import { 
  Search, 
  Users as UsersIcon, 
  Loader2, 
  Mail, 
  User, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck,
  UserPlus,
  ExternalLink,
  Filter,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function Users() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      // Using the dynamic API endpoint
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/users${searchTerm ? `?search=${searchTerm}` : ""}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();

      if (result.status === "success") {
        setUsers(result.data || []);
      } else {
        setUsers([]);
        setError(result.message || "No users matched your criteria.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to sync with the secure server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleDeleteUser = async (user) => {
    const confirmation = await Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to permanently remove ${user.firstName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete account'
    });

    if (confirmation.isConfirmed) {
      // API call for deletion would go here
      Swal.fire('Restricted', 'Only Super Admins can perform account deletions through the Master Console.', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                <UsersIcon className="text-white" size={28} />
             </div>
             Resident Directory
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and monitor all registered accounts in the Eaglenet ecosystem.</p>
        </div>
        
        {currentUser?.role === 'superadmin' && (
          <Link 
            to="/dashboard/superadmin/promote"
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm"
          >
            <UserPlus size={18} />
            Promote to Staff
          </Link>
        )}
      </header>

      {/* Global Stats bar - Subtle */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
               <UsersIcon size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Population</p>
               <p className="text-xl font-bold text-slate-900">{users.length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
               <ShieldCheck size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Accounts</p>
               <p className="text-xl font-bold text-slate-900">100%</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
               <Filter size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Filters</p>
               <p className="text-xl font-bold text-slate-900">{searchTerm ? 'Search Active' : 'None'}</p>
            </div>
         </div>
      </div>

      {/* Search Console */}
      <section className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Filter size={20} />}
            Refine View
          </button>
        </form>
      </section>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
             <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Directory...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Intel</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Permission Level</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentUsers.map((user, idx) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-sm group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500">
                          {user.firstName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">#{user.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600">
                           <Mail size={14} className="text-slate-300" />
                           <p className="text-sm font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                         user.role === 'superadmin' 
                           ? 'bg-purple-50 text-purple-700 border-purple-100' 
                           : user.role === 'admin' 
                             ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                             : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                       }`}>
                         {user.role}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} />
                          <p className="text-sm font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90">
                             <ExternalLink size={18} />
                          </button>
                          {currentUser?.role === 'superadmin' && (
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                            >
                               <Trash2 size={18} />
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-8 py-6 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
                <p className="text-sm font-bold text-slate-400">
                  Showing <span className="text-slate-900">{indexOfFirstUser + 1}</span> to <span className="text-slate-900">{Math.min(indexOfLastUser, users.length)}</span> of {users.length} residents
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          currentPage === i + 1 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                            : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-32 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon size={32} className="text-slate-300" />
             </div>
             <p className="text-slate-600 font-bold text-lg">Empty Directory</p>
             <p className="text-slate-400 font-medium">No accounts were found matching your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
