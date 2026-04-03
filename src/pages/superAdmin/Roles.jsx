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
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/permissions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setPermissions(result.data || []);
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

  const handleTogglePermission = (id) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim() || selectedPermissions.length === 0) {
      return Swal.fire('Incomplete Data', 'Please provide a role name and select at least one permission.', 'warning');
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
          title: 'Role Created',
          text: `Role '${roleName}' has been successfully provisioned.`,
          timer: 2000,
          showConfirmButton: false
        });
        setRoleName('');
        setSelectedPermissions([]);
        fetchRoles();
      } else {
        Swal.fire('Creation Failed', result.message || 'Error occurred', 'error');
      }
    } catch (err) {
      console.error("Role creation error:", err);
      Swal.fire('Error', 'Communication failed with the registry.', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin-dashboard"
            className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Role Architect
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Define and provision system administrative roles.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Creation Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Create New Role</h3>
            <form onSubmit={handleCreateRole} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Identity</label>
                <input 
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  type="text" 
                  placeholder="e.g. Logistics Dispatcher"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Privileges</label>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    {selectedPermissions.length} selected
                  </span>
                </div>

                <div className="relative mb-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    type="text" 
                    placeholder="Filter permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900 outline-none"
                  />
                </div>
                
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {permissions
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((perm) => (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() => handleTogglePermission(perm.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                        selectedPermissions.includes(perm.id)
                          ? "bg-indigo-50 border-indigo-200"
                          : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`text-[11px] font-black tracking-tight ${
                          selectedPermissions.includes(perm.id) ? "text-indigo-900" : "text-slate-700"
                        }`}>
                          {perm.name.replace(/_/g, ' ').toUpperCase()}
                        </p>
                      </div>
                      <div className={`shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        selectedPermissions.includes(perm.id)
                          ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200"
                          : "border-slate-200"
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
                className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                Provision Role
              </button>
            </form>
          </div>
        </div>

        {/* Roles List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-full">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-2">
              Active Roles Registry
              <span className="text-xs font-bold text-slate-400">({roles.length})</span>
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Role Registry...</p>
              </div>
            ) : roles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="group bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all duration-500 shadow-xs hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                        <Lock size={20} />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 text-slate-500 rounded-full text-[10px] font-black tracking-widest uppercase">
                        {role.permissions?.length || 0} Privileges
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 mb-2 truncate uppercase tracking-tight">
                      {role.name}
                    </h4>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(role.permissions || []).slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="text-[9px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100 uppercase tracking-tighter">
                          {perm.name?.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {(role.permissions?.length > 3) && (
                        <span className="text-[9px] font-black text-indigo-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">+ {role.permissions.length - 3} More</span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Live Status
                      </div>
                      <button className="text-slate-300 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-rose-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/50 border border-slate-100 border-dashed rounded-[2rem]">
                <Shield className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-bold">No Roles Defined</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Provision your first administrative role above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="text-indigo-400" size={24} />
          Role Architecture Best Practices
        </h3>
        <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
          Roles define hierarchical access across the EagleNet infrastructure. Ensure you specify minimal essential privileges for operational roles to maintain high security standards. 
          Permissions with "all" scope grant platform-wide access, while scoped permissions are locked to specific operational resources.
        </p>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      </div>
    </div>
  );
}
