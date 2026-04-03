import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Building2, 
  Shield, 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Search,
  Lock,
  User,
  Zap,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AssignAccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Data lists
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  
  // Selection state
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedRoleDetails, setSelectedRoleDetails] = useState(null);

  const fetchRegistryData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch Admins, Departments and Roles
      const [usersRes, deptsRes, rolesRes] = await Promise.all([
        fetch(`${baseUrl}/api/users?role=ADMIN`, { headers }),
        fetch(`${baseUrl}/api/departments`, { headers }),
        fetch(`${baseUrl}/api/roles`, { headers })
      ]);

      const [users, depts, rs] = await Promise.all([
        usersRes.json(),
        deptsRes.json(),
        rolesRes.json()
      ]);

      if (users.status === "success") setAdmins(users.data || []);
      if (depts.status === "success") setDepartments(depts.data || []);
      if (rs.status === "success") setRoles(rs.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Data',
        text: 'We could not load the admin information. Please try again.',
        background: '#fff',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistryData();
  }, []);

  // Update role info when selection changes
  useEffect(() => {
    if (selectedRoleId) {
      const role = roles.find(r => r.id === selectedRoleId);
      setSelectedRoleDetails(role || null);
    } else {
      setSelectedRoleDetails(null);
    }
  }, [selectedRoleId, roles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdminId || !selectedDeptId || !selectedRoleId || !selectedRoleDetails) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Selection',
        text: 'Please select an admin, a department, and a role.',
        confirmButtonColor: '#0f172a'
      });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      
      const payload = {
        name: selectedRoleDetails.name,
        permissionIds: (selectedRoleDetails.permissions || []).map(p => 
          typeof p === 'string' ? p : (p.id || p._id)
        )
      };

      const endpoint = `${baseUrl}/api/users/${selectedAdminId}/departments/${selectedDeptId}/roles/${selectedRoleId}`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "success") {
        await Swal.fire({
          icon: 'success',
          title: 'Role Assigned',
          text: result.message || 'The user has been successfully assigned to the role.',
          timer: 2500,
          showConfirmButton: false,
          position: 'center',
          backdrop: `rgba(15, 23, 42, 0.4) blur(4px)`
        });
        navigate("/admin-dashboard/admins");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: result.message || 'Could not save the role assignment.',
          confirmButtonColor: '#0f172a'
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Could not connect to the cloud. Check your internet.',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900" size={24} />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading Information...</p>
      </div>
    );
  }

  const selectedAdmin = admins.find(a => a.id === selectedAdminId);
  const selectedDept = departments.find(d => d.id === selectedDeptId);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Link to="/admin-dashboard/admins" className="group p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-slate-400 hover:text-slate-900 active:scale-95">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
             </Link>
             <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Admin Access</span>
          </div>
          <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                 Assign User Role
              </h1>
              <p className="text-slate-500 font-medium text-xl leading-relaxed mt-2 max-w-2xl">
                Choose an admin and give them a department and a job role.
              </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 p-2 bg-slate-50 rounded-[2rem] border border-slate-100">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-${200 + i*100} flex items-center justify-center text-white text-[10px] font-black`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
           </div>
           <div className="pr-6">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Team</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">4 Admins Online</p>
           </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Configuration Side */}
         <div className="lg:col-span-7 space-y-10">
            <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="space-y-12 relative z-10">
                  {/* 1. Admin Selection */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                             <UserCheck size={16} />
                           </div>
                           01. Select Admin Member
                        </label>
                        {selectedAdminId && (
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={12} /> Selected
                          </span>
                        )}
                     </div>
                     <div className="relative group">
                        <select 
                          required
                          value={selectedAdminId}
                          onChange={(e) => setSelectedAdminId(e.target.value)}
                          className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 appearance-none outline-none text-lg shadow-inner"
                        >
                           <option value="">Search for an admin...</option>
                           {admins.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName} — {a.email}</option>)}
                        </select>
                        <ChevronRight size={24} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:rotate-90 group-focus-within:text-indigo-500 transition-all" />
                     </div>
                  </div>

                  {/* 2. Department Selection */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                             <Building2 size={16} />
                           </div>
                           02. Choose Department
                        </label>
                        {selectedDeptId && (
                           <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                              <CheckCircle size={12} /> Ready
                           </span>
                        )}
                     </div>
                     <div className="relative group">
                        <select 
                          required
                          value={selectedDeptId}
                          onChange={(e) => setSelectedDeptId(e.target.value)}
                          className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 transition-all font-bold text-slate-900 appearance-none outline-none text-lg shadow-inner"
                        >
                           <option value="">Select a department...</option>
                           {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <ChevronRight size={24} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:rotate-90 group-focus-within:text-amber-500 transition-all" />
                     </div>
                  </div>

                  {/* 3. Role Selection */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                             <Shield size={16} />
                           </div>
                           03. Choose Job Role
                        </label>
                        {selectedRoleId && (
                           <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                              <CheckCircle size={12} /> Ready
                           </span>
                        )}
                     </div>
                     <div className="relative group">
                        <select 
                          required
                          value={selectedRoleId}
                          onChange={(e) => setSelectedRoleId(e.target.value)}
                          className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-purple-500/20 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-slate-900 appearance-none outline-none text-lg shadow-inner"
                        >
                           <option value="">Select a role...</option>
                           {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <ChevronRight size={24} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:rotate-90 group-focus-within:text-purple-500 transition-all" />
                     </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] animate-gradient-x transition-all group-hover:scale-105 duration-500"></div>
                    <div className="relative bg-slate-900 text-white m-0.5 py-6 rounded-[2rem] font-black text-[14px] uppercase tracking-[0.3em] transition-all group-hover:bg-transparent flex items-center justify-center gap-4 disabled:opacity-50">
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <Zap size={20} className="text-amber-400 group-hover:scale-125 transition-transform" />}
                      Save Role Assignment
                    </div>
                  </button>
               </div>
            </section>

            <div className="bg-amber-50/50 p-10 rounded-[3rem] border border-amber-100 flex items-start gap-6 backdrop-blur-sm">
               <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-600 shrink-0">
                  <ShieldAlert size={28} />
               </div>
               <div className="space-y-2">
                  <p className="text-sm font-black text-amber-900 uppercase tracking-widest">Important Note</p>
                  <p className="text-sm font-bold text-amber-900/60 leading-relaxed">
                     Saving this will change the user's access immediately. 
                     They will see their new department and permissions the next time they open their dashboard.
                  </p>
               </div>
            </div>
         </div>

         {/* Overview Side */}
         <div className="lg:col-span-5 space-y-10">
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-10 min-h-[600px] relative overflow-hidden flex flex-col shadow-2xl shadow-slate-900/20 group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 -translate-y-10 translate-x-10">
                  <Globe size={300} />
               </div>
               
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between border-b border-white/10 pb-8">
                     <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                        Summary
                     </h3>
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                  </div>

                  <div className="flex-grow py-12 space-y-10">
                    {/* User Preview */}
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Selected Admin</p>
                       {selectedAdmin ? (
                         <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 animate-in slide-in-from-left-4 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                               {selectedAdmin.firstName?.[0]}
                            </div>
                            <div>
                               <p className="font-black text-white text-lg">{selectedAdmin.firstName} {selectedAdmin.lastName}</p>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{selectedAdmin.email}</p>
                            </div>
                         </div>
                       ) : (
                         <div className="p-6 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 text-center">
                            <User className="mx-auto text-slate-700 mb-2" size={24} />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No admin selected</p>
                         </div>
                       )}
                    </div>

                    {/* Department Context */}
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Selected Department</p>
                       {selectedDept ? (
                         <div className="p-6 bg-white/5 rounded-3xl border border-white/5 animate-in slide-in-from-left-4 delay-75 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                               <Building2 size={16} className="text-amber-400" />
                               <p className="font-black text-white uppercase tracking-tight">{selectedDept.name}</p>
                            </div>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed">The user will be added to this department.</p>
                         </div>
                       ) : (
                         <div className="p-6 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 text-center">
                            <Building2 className="mx-auto text-slate-700 mb-2" size={24} />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No department selected</p>
                         </div>
                       )}
                    </div>

                    {/* Permission Blueprint */}
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Role Rules</p>
                       {selectedRoleDetails ? (
                         <div className="space-y-4 animate-in slide-in-from-left-4 delay-150 transition-all">
                            <div className="flex items-center justify-between">
                               <p className="text-2xl font-black text-indigo-400 uppercase tracking-tighter">{selectedRoleDetails.name}</p>
                               <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black">{(selectedRoleDetails.permissions || []).length} Rules</span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto pr-3 custom-scrollbar">
                               {(selectedRoleDetails.permissions || []).map((perm, idx) => (
                                  <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3 group/item hover:bg-white/10 transition-colors">
                                     <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/item:scale-110 transition-transform">
                                        <Lock size={14} />
                                     </div>
                                     <span className="text-[10px] font-black uppercase tracking-tight text-slate-300">
                                       {typeof perm === 'string' ? perm : (perm.resource + ' • ' + perm.action)}
                                     </span>
                                  </div>
                               ))}
                            </div>
                         </div>
                       ) : (
                         <div className="p-8 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center min-h-[120px]">
                            <Shield className="text-slate-700 mb-3" size={32} />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Select a role to see rules</p>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">System Active</span>
                     </div>
                     <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Ver: 1.0.0</span>
                  </div>
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
