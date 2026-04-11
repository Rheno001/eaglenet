import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, UserPlus, Trash2, Loader2, ArrowDownCircle, Mail, Calendar, User as UserIcon, ShieldCheck, Building2, Check, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      
      const response = await fetch(`${baseUrl}/api/users?role=ADMIN`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setAdmins(result.data || []);
      }
    } catch {
      console.error("Error loading admins");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDowngrade = async (admin) => {
    const result = await Swal.fire({
      title: 'Remove Admin Rights?',
      text: `Are you sure you want to change ${admin.firstName} back to a regular customer?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change',
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg px-6 py-2.5',
        cancelButton: 'rounded-lg px-6 py-2.5'
      }
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Updating User...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false
        });

        const token = localStorage.getItem("jwt");
        const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
        const response = await fetch(`${baseUrl}/api/users/${admin.id}/downgrade`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.status === "success") {
          await Swal.fire({
            icon: 'success',
            title: 'Changed!',
            text: data.message || 'User is now a regular customer.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchAdmins();
        } else {
          Swal.fire('Error', data.message || 'Update failed', 'error');
        }
      } catch {
        Swal.fire('Error', 'Connection error occurred', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Admins</h1>
        <Link 
          to="/admin-dashboard/create-admin"
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all font-bold shadow-xl shadow-slate-200 active:scale-95 text-sm"
        >
          <UserPlus size={18} /> Add New Admin
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roles</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-24 text-center">
                  <Loader2 className="w-12 h-12 text-slate-900 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Admins...</p>
                </td>
              </tr>
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-black text-sm group-hover:from-slate-800 group-hover:to-slate-900 group-hover:text-white transition-all duration-500">
                        {admin.firstName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{admin.firstName} {admin.lastName}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">#{admin.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Mail size={14} className="text-slate-300" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {admin.userRoles && admin.userRoles.length > 0 ? (
                        admin.userRoles.map((ur, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-1.5 w-fit">
                              <ShieldCheck size={10} /> {ur.role?.name || "Admin"}
                            </span>
                            {ur.department && (
                              <span className="text-[8px] font-bold text-slate-400 flex items-center gap-1 ml-1 uppercase tracking-tighter">
                                <Building2 size={8} /> {ur.department.name}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 italic">
                          No Roles
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDowngrade(admin)}
                        title="Remove Admin Status"
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all active:scale-90"
                      >
                        <ArrowDownCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-32 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-bold text-lg">No Admins Found</p>
                  <p className="text-slate-400 font-medium">There are currently no additional admins in the list.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
