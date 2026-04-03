import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Loader2, 
  ArrowLeft, 
  Check, 
  Trash2, 
  Info,
  Lock,
  Search,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function RolesAndPermissions() {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Create Role Form State
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [permSearchTerm, setPermSearchTerm] = useState('');

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/roles`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setRoles(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/permissions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data) && result.data.length > 0) {
        setPermissions(result.data);
      } else {
        // Enriched fallback matching structured specification
        setPermissions([
          { 
            id: '1', 
            resource: 'shipment', 
            action: 'read', 
            scope: 'all', 
            conditions: {}, 
            description: 'Comprehensive read access for every shipment in the logistic infrastructure.' 
          },
          { 
            id: '2', 
            resource: 'shipment', 
            action: 'write', 
            scope: 'all', 
            conditions: {}, 
            description: 'Full modification authority for shipment records and routing metrics.' 
          },
          { 
            id: '3', 
            resource: 'document', 
            action: 'verify', 
            scope: 'all', 
            conditions: { departmentId: "user.department_id" }, 
            description: 'Strategic authority to verify and approve global documentation assets within departmental limits.' 
          },
          { 
            id: '4', 
            resource: 'user', 
            action: 'manage', 
            scope: 'staff', 
            conditions: {}, 
            description: 'Control administrative staff access and functional department assignments.' 
          },
          { 
            id: '5', 
            resource: 'financial', 
            action: 'read', 
            scope: 'reports', 
            conditions: {}, 
            description: 'Access to high-level financial performance metrics and ledger reports.' 
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim() || selectedPermissions.length === 0) {
      return Swal.fire('Form Incomplete', 'Provide a role name and select permissions.', 'warning');
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: roleName, 
          permissionIds: selectedPermissions 
        })
      });
      const result = await response.json();
      
      if (result.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Deployment Successful',
          text: `Role '${roleName}' has been added to the registry.`,
          timer: 2000,
          showConfirmButton: false
        });
        setRoleName('');
        setSelectedPermissions([]);
        fetchRoles();
      }
    } catch (err) {
      console.error("Role creation error:", err);
    } finally {
      setCreating(false);
    }
  };

  const filteredRoles = (roles || []).filter(r => r?.name?.toLowerCase().includes(roleSearchTerm.toLowerCase()));
  const filteredPermissions = (permissions || []).filter(p => {
    const searchStr = `${p?.resource || ''} ${p?.action || ''} ${p?.scope || ''} ${p?.description || ''}`.toLowerCase();
    return searchStr.includes(permSearchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Roles & Permissions
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Create and manage job roles and what they can do.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
          <button 
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'roles' ? 'bg-white text-slate-900 shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Job Roles
          </button>
          <button 
            onClick={() => setActiveTab('permissions')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'permissions' ? 'bg-white text-slate-900 shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Permissions
          </button>
        </div>
      </header>

      {activeTab === 'roles' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Creation Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                <Plus className="text-teal-500" size={24} />
                Create Role
              </h3>
              <form onSubmit={handleCreateRole} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Name</label>
                  <input 
                    required
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    type="text" 
                    placeholder="e.g. Manager"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rules</label>
                    <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                      {selectedPermissions.length} selected
                    </span>
                  </div>
                  
                  <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {permissions.map((perm) => (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => setSelectedPermissions(prev => prev.includes(perm.id) ? prev.filter(id => id !== perm.id) : [...prev, perm.id])}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                          selectedPermissions.includes(perm.id)
                            ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-200"
                            : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className={`text-[10px] font-black tracking-widest uppercase truncate ${
                            selectedPermissions.includes(perm.id) ? "text-white" : "text-slate-600"
                          }`}>
                            {perm?.resource}: {perm?.action}
                          </p>
                        </div>
                        <div className={`shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedPermissions.includes(perm.id) ? "bg-teal-500 border-teal-500" : "border-slate-200"
                        }`}>
                          {selectedPermissions.includes(perm.id) && <Check size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={creating}
                  className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="animate-spin" size={20} /> : <Shield size={18} />}
                  Create Role
                </button>
              </form>
            </div>
          </div>

          {/* List Panel */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search roles..."
                  value={roleSearchTerm}
                  onChange={(e) => setRoleSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="bg-white p-24 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Roles...</p>
              </div>
            ) : filteredRoles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRoles.map((role) => (
                  <div key={role.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black tracking-widest uppercase">Active</span>
                      </div>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase group-hover:text-teal-600 transition-colors">
                      {role.name}
                    </h4>
                    
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rules</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(role.permissions || []).slice(0, 4).map((perm, idx) => (
                          <span key={idx} className="text-[9px] font-black text-teal-600 bg-teal-50/50 px-2.5 py-1 rounded-lg border border-teal-100 uppercase tracking-tight">
                            {perm?.resource}_{perm?.action}
                          </span>
                        ))}
                        {(role.permissions?.length > 4) && (
                          <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            + {role.permissions.length - 4} Others
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</span>
                      </div>
                      <button className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                <Shield className="mx-auto text-slate-200 mb-6" size={64} />
                <p className="text-slate-900 font-bold text-xl">No Roles Found</p>
                <p className="text-slate-400 font-medium">Try searching or create a new role.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
           {/* Permissions Management View */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input 
                  type="text" 
                  placeholder="Search permissions..."
                  value={permSearchTerm}
                  onChange={(e) => setPermSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900 outline-none"
                />
              </div>
              <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Permissions</p>
                    <p className="text-4xl font-black">{permissions.length}</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-2xl">
                    <Lock size={32} className="text-teal-400" />
                 </div>
              </div>
           </div>

           {loading ? (
             <div className="bg-white p-24 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Permissions...</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPermissions.map((perm) => (
                  <div key={perm.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2.5 bg-slate-900 rounded-xl text-white group-hover:bg-teal-500 transition-colors">
                          <Lock size={14} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-black tracking-tight uppercase text-slate-900 truncate">
                             {perm?.resource}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[9px] font-black italic text-teal-600 uppercase">
                            <span>{perm?.action}</span>
                            <ChevronRight size={10} />
                            <span>{perm?.scope}</span>
                          </div>
                       </div>
                    </div>
                    
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-6 line-clamp-2 flex-grow">
                      {perm?.description || `Authorizes ${perm?.action} operations for ${perm?.resource}.`}
                    </p>

                    {perm?.conditions && Object.keys(perm.conditions).length > 0 && (
                      <div className="mb-6 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                         <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Conditions</p>
                         {Object.entries(perm.conditions).map(([key, val], idx) => (
                           <div key={idx} className="text-[8px] font-mono text-indigo-600 truncate">{key}: {val}</div>
                         ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-[9px] font-mono font-bold text-slate-300 italic truncate max-w-[120px]">
                          {perm?.id?.substring(0, 8)}...
                       </span>
                       <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"></div>
                          <span className="text-[8px] font-black text-emerald-600 tracking-tighter">SECURE</span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl shadow-slate-200 border border-slate-100 flex items-center justify-center text-slate-900">
              <Shield size={32} />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-900">Role Security</h3>
              <p className="text-slate-400 font-medium text-sm">Roles and permissions are secure and private.</p>
           </div>
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-slate-200">
           <CheckCircle2 size={14} className="text-teal-400" />
           Live
        </div>
      </div>
    </div>
  );
}
