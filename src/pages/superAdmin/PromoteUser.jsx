import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function PromoteUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem("jwt");
      // Search for users - using the available user searching pattern
      // If there's a specific search endpoint we use that, otherwise we filter all users
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/users?search=${searchTerm}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.status === "success") {
        // Filter out those who are already admins if the API doesn't
        setUsers(result.data.filter(u => u.role !== 'admin' && u.role !== 'superadmin'));
      } else {
        setUsers([]);
        setError(result.message || 'No users found matched your search.');
      }
    } catch {
      console.error("Search error");
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (user) => {
    const confirmation = await Swal.fire({
      title: 'Promote to Admin?',
      text: `Grant administrative privileges to ${user.firstName} ${user.lastName} (${user.email})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Promote User'
    });

    if (confirmation.isConfirmed) {
      try {
        Swal.fire({
          title: 'Upgrading User...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false
        });

        const token = localStorage.getItem("jwt");
        const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ role: "ADMIN" }),
        });

        const result = await response.json();

        if (result.status === "success") {
          await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: result.message || 'User has been upgraded to Admin role.',
            timer: 2000,
            showConfirmButton: false
          });
          // Remove from list
          setUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
          Swal.fire('Error', result.message || 'Failed to upgrade user', 'error');
        }
      } catch {
        Swal.fire('Error', 'A network error occurred. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Promotion</h1>
          <p className="text-gray-500 mt-1 font-medium">Search for customers and grant them administrative access.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 text-sm font-bold">
           <Shield size={18} />
           <span>Super Admin Privileges Active</span>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-900"
            />
          </div>
          <button 
            onClick={searchUsers}
            disabled={loading}
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            Search Residents
          </button>
        </div>
      </section>

      {/* Results Section */}
      <div className="space-y-4">
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 text-amber-800">
             <AlertCircle className="shrink-0 mt-1" />
             <div>
                <p className="font-bold">Attention</p>
                <p className="text-sm font-medium">{error}</p>
             </div>
          </div>
        )}

        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <UserCheck size={40} className="text-emerald-500" />
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-black text-xl">
                    {user.firstName?.[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500">
                       <Mail size={12} />
                       <p className="text-xs font-semibold truncate uppercase tracking-tighter">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                      <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black">CUSTOMER</span>
                   </div>
                   <button 
                    onClick={() => handleUpgrade(user)}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                   >
                     Make Admin
                     <ArrowUpRight size={14} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && searchTerm && !error ? (
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
             </div>
             <p className="text-slate-400 font-bold">No results found for "{searchTerm}"</p>
             <p className="text-sm text-slate-300 font-medium">Verify the email address and try again.</p>
          </div>
        ) : null}
      </div>

      {/* Info Card */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
         <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Granting Administrative access</h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
               Promoting a user to Admin grants them full access to manage orders, view user data, and generate reports. 
               This action should only be performed for trusted staff members. All administrative actions are logged in the system.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold">Full Dashboard Access</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold">Report Management</span>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
}
