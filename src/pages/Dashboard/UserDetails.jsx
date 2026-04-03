import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  ArrowLeft,
  Package,
  CreditCard,
  TrendingUp,
  History,
  Copy,
  Check,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.status === "success") {
        setUserData(result.data);
      } else {
        Swal.fire('Error', result.message || 'Failed to fetch user details', 'error');
        navigate('/admin-dashboard/users');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire('Error', 'Connection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, [userId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">Loading User info...</p>
      </div>
    </div>
  );

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:shadow-lg group-hover:scale-110 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Customers
          </button>
          <div className="flex items-center gap-4">
             <div className="p-4 bg-slate-900 rounded-[1.5rem] shadow-2xl shadow-slate-200">
                <User className="text-white" size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {userData.firstName} {userData.lastName}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                   <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-teal-100">
                     {userData.role}
                   </span>
                   <span className="text-slate-300">|</span>
                   <p className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-2">
                     #{userData.id}
                     <button onClick={() => copyToClipboard(userData.id)} className="hover:text-slate-900 transition-colors">
                        {copiedId === userData.id ? <Check size={12} className="text-teal-500" /> : <Copy size={12} />}
                     </button>
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${userData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <div className={`w-2 h-2 rounded-full ${userData.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
           {userData.isActive ? 'Active' : 'Offline'}
           </div>
           {currentUser?.role === 'superadmin' && (
              <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                Remove Access
              </button>
           )}
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Detailed Info Card */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Activity size={14} className="text-teal-500" /> User Info
            </h3>
            
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email Address', value: userData.email },
                { icon: Phone, label: 'Phone Number', value: userData.phoneNumber || 'Not available' },
                { icon: Calendar, label: 'Join Date', value: new Date(userData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 break-all">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-100">
               <div className="bg-slate-50 p-6 rounded-[2rem] relative overflow-hidden group">
                  <TrendingUp className="absolute -right-2 -bottom-2 w-20 h-20 text-slate-200 group-hover:text-teal-500/10 transition-all" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Balance</p>
                  <p className="text-2xl font-black text-slate-900">₦{parseFloat(userData.outstandingBalance || 0).toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-rose-500 mt-1 uppercase tracking-tighter">Money Owed</p>
               </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
                <Package size={20} className="text-teal-400 mb-4" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Packages</p>
                <p className="text-2xl font-black">{userData.stats?.totalBookings || 0}</p>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                <TrendingUp size={20} className="text-indigo-600 mb-4" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
                <p className="text-2xl font-black text-slate-900">₦{(userData.stats?.totalSpent || 0).toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* Intelligence Stream (Main Content) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Shipments Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-slate-900 pl-4">
                 Package History
               </h3>
               <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                 {userData.recentShipments?.length || 0} RECENT
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {userData.recentShipments?.length > 0 ? (
                 userData.recentShipments.map((ship, idx) => (
                   <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 group">
                      <div className="flex items-center justify-between mb-6">
                         <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <Package size={20} />
                         </div>
                         <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-widest">
                               {ship.status}
                            </span>
                            <p className="text-[8px] font-bold text-slate-300 uppercase">{new Date(ship.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                         <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Tracking ID</p>
                            <p className="font-mono text-sm font-bold text-slate-900 tracking-tight">{ship.trackingId}</p>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                               <div className="w-px h-4 bg-slate-200 my-1"></div>
                               <div className="w-1.5 h-1.5 rounded-full border border-slate-900"></div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[10px] font-bold text-slate-600 leading-none">{ship.origin || 'From'}</p>
                               <p className="text-[10px] font-bold text-slate-600 leading-none">{ship.destination || 'To'}</p>
                            </div>
                         </div>

                         <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Cleared</p>
                            <p className="font-black text-slate-900">₦{parseFloat(ship.amount || 0).toLocaleString()}</p>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="col-span-2 p-16 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center">
                    <History size={48} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Zero Logistic Records Found</p>
                 </div>
               )}
            </div>
          </div>

          {/* Payments Section */}
          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-slate-900 pl-4">
                  Payment History
                </h3>
             </div>

             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                         <tr>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {userData.recentPayments?.length > 0 ? (
                           userData.recentPayments.map((pay, idx) => (
                             <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-6">
                                   <div className="flex items-center gap-3">
                                      <Clock size={16} className="text-slate-300" />
                                      <p className="text-sm font-bold text-slate-600">{new Date(pay.createdAt).toLocaleDateString()}</p>
                                   </div>
                                </td>
                                <td className="px-10 py-6">
                                   <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">{pay.reference || 'REF_UNDEF'}</p>
                                </td>
                                <td className="px-10 py-6">
                                   <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-[0.2em]">
                                      {pay.status}
                                   </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                   <p className="font-black text-slate-900">₦{parseFloat(pay.amount || 0).toLocaleString()}</p>
                                </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                              <td colSpan="4" className="px-10 py-20 text-center">
                                 <p className="text-slate-300 font-black text-xs uppercase tracking-[0.2em]">No Financial Transactions Logged</p>
                              </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
