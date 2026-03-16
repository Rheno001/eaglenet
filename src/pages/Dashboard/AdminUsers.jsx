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
  Eye,
  Filter,
  Trash2,
  X,
  MapPin,
  TrendingUp,
  CreditCard,
  Package,
  Activity,
  History,
  Phone,
  LayoutDashboard,
  DollarSign,
  Copy,
  Check,
  FileSpreadsheet
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

export default function Users() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'ID copied'
      });
    });
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/users${searchTerm ? `?search=${searchTerm}` : ""}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();

      if (result.status === "success") {
        const filteredUsers = (result.data || []).filter(
          (u) => u.role !== "admin" && u.role !== "superadmin"
        );
        setUsers(filteredUsers);
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

  const fetchUserDetail = async (id) => {
    setLoadingDetail(true);
    setShowModal(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.status === "success") {
        setSelectedUser(result.data);
      }
    } catch (err) {
      console.error("Detail Fetch error:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      Swal.fire('Restricted', 'Only Super Admins can perform account deletions through the Master Console.', 'info');
    }
  };

  const exportToExcel = () => {
    if (users.length === 0) {
      Swal.fire('No Data', 'There are no customers to export.', 'info');
      return;
    }

    const exportData = users.map(user => ({
      'Customer ID': user.id,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Phone': user.phoneNumber || 'N/A',
      'Role': user.role,
      'Joined Date': new Date(user.createdAt).toLocaleDateString(),
      'Status': user.isActive ? 'Active' : 'Inactive'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // ID
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 10 }, // Role
      { wch: 15 }, // Joined Date
      { wch: 10 }, // Status
    ];

    XLSX.writeFile(wb, `Eaglenet_Customers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
              <UsersIcon className="text-white" size={28} />
            </div>
            Customers
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Manage all registered customer accounts.</p>
        </div>

        {/*{currentUser?.role === 'superadmin' && (
          <Link
            to="/dashboard/superadmin/promote"
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm"
          >
            <UserPlus size={18} />
            Add Admin
          </Link>
        )}*/}
      </header>

      {/* Global Stats bar - Subtle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <UsersIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customers</p>
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
      </div>

      {/* Search & Action Console */}
      <section className="bg-white p-3 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-300"
              title="Search"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              <span className="md:hidden lg:inline">Search</span>
            </button>
          </form>
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            <FileSpreadsheet size={18} />
            <span>Export to Excel</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-slate-900 mb-4" size={48} />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Customers...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-sm group-hover:from-slate-800 group-hover:to-slate-900 group-hover:text-white transition-all duration-500">
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
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        <p className="text-sm font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchUserDetail(user.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                        >
                          <Eye size={18} />
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
                  Showing <span className="text-slate-900">{indexOfFirstUser + 1}</span> to <span className="text-slate-900">{Math.min(indexOfLastUser, users.length)}</span> of {users.length} customers
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
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
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
            <p className="text-slate-600 font-bold text-lg">No customers found</p>
            <p className="text-slate-400 font-medium">Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      {/* User Intelligence Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <History size={28} className="text-slate-900" />
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                }}
                className="p-3 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={28} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
              {loadingDetail ? (
                <div className="py-24 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-slate-900 mb-6" size={56} />
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading...</p>
                </div>
              ) : selectedUser ? (
                <>
                  {/* Identity & Core Metrics */}
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-1/3 space-y-6">
                      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                        <div className="z-10 relative space-y-6">
                          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-3xl font-black">
                            {selectedUser.firstName?.[0]}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black tracking-tight">{selectedUser.firstName} {selectedUser.lastName}</h3>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">{selectedUser.role}</p>
                          </div>
                          <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3 text-slate-400">
                              <Mail size={16} />
                              <p className="text-xs font-bold">{selectedUser.email}</p>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                              <Activity size={16} />
                              <p className="text-xs font-bold uppercase tracking-tighter">Status: {selectedUser.isActive ? 'OPERATIONAL' : 'OFFLINE'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                        <div className="p-4 bg-white rounded-2xl w-fit shadow-sm mb-6">
                          <TrendingUp className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Paid</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tight">₦{parseFloat(selectedUser.stats?.totalSpent || 0).toLocaleString()}</p>
                          <div className="mt-4 flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full w-fit">
                            <ShieldCheck size={12} />
                            <span>Audit Clear</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Shipment', value: selectedUser.stats?.totalBookings || 0, icon: Package, color: 'blue', desc: 'Total shipments requested' },
                        { label: 'Registration Date', value: new Date(selectedUser.createdAt).toLocaleDateString(), icon: Calendar, color: 'emerald', desc: 'Acquisition date' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-fit">
                          <div className={`p-4 bg-slate-50 text-slate-900 rounded-3xl w-fit mb-4`}>
                            <stat.icon size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 mt-1">{stat.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deep Activity Intelligence */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
                    {/* Logistic Streams */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-indigo-500 pl-4 flex items-center justify-between">
                        Shipments
                        <span className="text-[10px] font-bold text-slate-400">{selectedUser.recentShipments?.length || 0} RECENT</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedUser.recentShipments?.length > 0 ? (
                          selectedUser.recentShipments.map((ship, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:bg-slate-900 transition-all duration-300">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-2xl group-hover:bg-white/10 transition-colors">
                                  <Package size={20} className="text-indigo-600 group-hover:text-white" />
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 group-hover:bg-white/10 group-hover:text-white">
                                  {ship.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="font-bold text-slate-900 group-hover:text-white text-lg">{ship.trackingId}</p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(ship.trackingId);
                                  }}
                                  className="p-1.5 bg-white/50 group-hover:bg-white/20 rounded-lg transition-colors text-slate-400 group-hover:text-white/60 hover:text-slate-900 group-hover:hover:text-white"
                                  title="Copy Tracking ID"
                                >
                                  {copiedId === ship.trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest mt-1">
                                <MapPin size={10} />
                                <span>{ship.origin} → {ship.destination}</span>
                              </div>
                              <div className="mt-4 pt-4 border-t border-slate-200 group-hover:border-white/10 flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-500 group-hover:text-slate-400">{new Date(ship.createdAt).toLocaleDateString()}</p>
                                <p className="font-black text-slate-900 group-hover:text-white">₦{parseFloat(ship.amount).toLocaleString()}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center bg-slate-50 rounded-3xl text-slate-400">
                            <Activity className="mx-auto mb-4 opacity-10" />
                            <p className="text-xs font-bold uppercase tracking-widest">No logistics records found</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Financial Registry */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-amber-500 pl-4 flex items-center justify-between">
                        Payments
                        <span className="text-[10px] font-bold text-slate-400">{selectedUser.recentPayments?.length || 0} TOTAL</span>
                      </h3>
                      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                          {selectedUser.recentPayments?.length > 0 ? (
                            selectedUser.recentPayments.map((pay, idx) => (
                              <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                    <CreditCard size={18} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">₦{parseFloat(pay.amount).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.reference || 'REF N/A'}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-black tracking-widest uppercase mb-1">
                                    {pay.status}
                                  </span>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(pay.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-20 text-center text-slate-300">
                              <Activity size={32} className="mx-auto mb-4 opacity-10" />
                              <p className="text-xs font-bold uppercase tracking-widest">No financial entries</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-24 text-center text-slate-400">
                  <History size={64} className="mx-auto mb-6 opacity-10" />
                  <p className="text-xl font-bold">Failed to load</p>
                  <p className="text-sm font-medium">Customer information could not be retrieved.</p>
                </div>
              )}
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4 text-slate-400">
                {/* <History size={16} /> */}
                {/* <span className="text-[10px] font-black uppercase tracking-widest">Master Clearance Required for Edits</span> */}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-10 py-4 bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-300 transition-all active:scale-95"
                >
                  Close
                </button>
                {currentUser?.role === 'superadmin' && (
                  <button className="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
                    Modify Privileges
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
