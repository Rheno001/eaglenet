import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Loader2, 
  ArrowLeft, 
  Lock, 
  Info, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/permissions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.status === "success" && Array.isArray(result.data)) {
        setPermissions(result.data);
      } else {
        // Fallback for demo/development if endpoint isn't fully ready
        setPermissions([
          { id: 1, name: 'view_orders', description: 'Can view all shipment orders' },
          { id: 2, name: 'edit_orders', description: 'Can modify order details and status' },
          { id: 3, name: 'manage_users', description: 'Can create and modify user accounts' },
          { id: 4, name: 'view_reports', description: 'Can access financial and operational reports' },
          { id: 5, name: 'manage_departments', description: 'Can create and configure departments' },
          { id: 6, name: 'process_payments', description: 'Can verify and manage payment transactions' },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      setError("Could not establish a secure connection to the permission registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const filteredPermissions = permissions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin-dashboard"
            className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              System Permissions
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Access Control Registry & Privilege Definitions.</p>
          </div>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-xl shadow-slate-200">
           <ShieldCheck size={18} className="text-teal-400" />
           <span>Superadmin Authority Active</span>
        </div>
      </header>

      {/* Global Status & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search permission by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-900 outline-none"
          />
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Permissions</p>
            <p className="text-3xl font-black text-slate-900">{permissions.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Lock size={24} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4 text-rose-800">
          <AlertCircle className="shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="font-bold">System Connection Error</p>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-24 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Core Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPermissions.length > 0 ? (
            filteredPermissions.map((perm) => (
              <div 
                key={perm.id} 
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative Icon Background */}
                <div className="absolute -top-6 -right-6 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <ShieldCheck size={120} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
                      <Lock size={20} />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                      <CheckCircle2 size={12} />
                      Active
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 truncate uppercase tracking-tight">
                      {perm.name.replace(/_/g, ' ')}
                    </h3>
                    <div className="flex items-start gap-2 text-slate-500">
                      <Info size={14} className="shrink-0 mt-1" />
                      <p className="text-sm font-medium leading-relaxed italic">
                        {perm.description || `Grants the authority to perform ${perm.name.replace(/_/g, ' ')} operations within the platform.`}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Identifier</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      {perm.name.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3 bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-900 font-bold text-xl">No Permissions Found</p>
              <p className="text-slate-400 font-medium">Try adjusting your search criteria to find specific privileges.</p>
            </div>
          )}
        </div>
      )}

      {/* Security Disclaimer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Security Protocol Information</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed">
            The permissions listed above are core system components. These definitions dictate what actions different roles and departments can perform. 
            Modifying permission logic requires advanced system access and will be recorded in the security audit logs.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-700 group-hover:bg-teal-500/20"></div>
      </div>
    </div>
  );
}
