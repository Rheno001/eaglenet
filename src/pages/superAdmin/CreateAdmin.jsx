import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ShieldCheck, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN',
    departmentId: '',
    roleId: ''
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
        
        const [deptRes, rolesRes] = await Promise.all([
          fetch(`${baseUrl}/api/departments`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/roles`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        const [depts, rs] = await Promise.all([deptRes.json(), rolesRes.json()]);
        if (depts.status === "success") setDepartments(depts.data || []);
        if (rs.status === "success") setRoles(rs.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://eaglenet-backend.onrender.com/api/users/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === "success") {
        const newUserId = result.data.id;
        
        // If department and role are selected, link them immediately
        if (formData.departmentId && formData.roleId) {
          const assignRes = await fetch(`${baseUrl}/api/users/${newUserId}/departments/${formData.departmentId}/roles/${formData.roleId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          await assignRes.json();
        }

        await Swal.fire({
          icon: 'success',
          title: 'Staff Provisioned',
          text: result.message || 'New administrative account has been fully integrated into the security registry.',
          timer: 2000,
          showConfirmButton: false
        });
        navigate("/admin-dashboard/admins");
      } else {
        Swal.fire('Identity Registry Alert', result.message || 'Failed to create admin profile.', 'error');
      }
    } catch (error) {
      console.error("Create Admin error:", error);
      Swal.fire('Registry Connection Error', 'Could not sync with the identity server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link 
            to="/admin-dashboard/admins"
            className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
           >
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 Provision Admin
              </h1>
              <p className="text-slate-500 font-medium tracking-tight">Register a new staff account with administrative clearance.</p>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-2xl border border-purple-100 text-[10px] font-black uppercase tracking-widest">
           <Shield size={16} />
           Master Clearance Active
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
           <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        type="text" 
                        placeholder="John"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Doe"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      placeholder="john.doe@eaglenet.com"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Department</label>
                    <div className="relative">
                       <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <select 
                        required
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900 appearance-none outline-none"
                       >
                          <option value="">Select Department</option>
                          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                       </select>
                       <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Functional Security Role</label>
                    <div className="relative">
                       <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <select 
                        required
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900 appearance-none outline-none"
                       >
                          <option value="">Select Security Role</option>
                          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                       </select>
                       <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900"
                    />
                 </div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-2 ml-1">
                    Password must be at least 8 characters with symbolic complexity.
                 </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                Provision Administrator
              </button>
           </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <h3 className="text-lg font-black uppercase tracking-tight mb-4">Privilege Protocol</h3>
              <ul className="space-y-4">
                 {[
                    'Full Order Oversight',
                    'Identity Registry Access',
                    'Financial Report Generation',
                    'Staff Notification Control'
                 ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                       <CheckCircle2 className="text-teal-400 shrink-0" size={18} />
                       <span className="text-xs font-bold text-slate-300">{item}</span>
                    </li>
                 ))}
              </ul>
           </div>

           <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex flex-col gap-4">
              <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                 <AlertCircle className="text-amber-600" size={24} />
              </div>
              <p className="text-xs font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                 Identity profiles created via this module are final. Ensure the email address is verified and the staff member handles the temporary password securely.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
