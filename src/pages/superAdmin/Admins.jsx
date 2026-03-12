import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, UserPlus, Trash2, Loader2, ArrowDownCircle, Mail, Calendar, User as UserIcon, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      // Assuming /api/users?role=ADMIN returns admins
      const response = await fetch("https://eaglenet-eb9x.onrender.com/api/users?role=ADMIN", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setAdmins(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDowngrade = async (admin) => {
    const result = await Swal.fire({
      title: 'Downgrade Admin?',
      text: `Are you sure you want to downgrade ${admin.firstName} to a regular customer?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, downgrade!',
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
          title: 'Processing...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false
        });

        const token = localStorage.getItem("jwt");
        const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/users/${admin.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ role: "CUSTOMER" }),
        });

        const data = await response.json();
        
        if (data.status === "success") {
          await Swal.fire({
            icon: 'success',
            title: 'Downgraded!',
            text: data.message || 'Admin successfully changed to customer.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchAdmins();
        } else {
          Swal.fire('Error', data.message || 'Operation failed', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Network error occurred', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Administrators</h1>
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
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Intel</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Level</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-8 py-24 text-center">
                  <Loader2 className="w-12 h-12 text-slate-900 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Staff Registry...</p>
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-indigo-100">
                      <ShieldCheck size={12} />
                      ADMIN
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Calendar size={14} />
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDowngrade(admin)}
                        title="Downgrade to Customer"
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all active:scale-90"
                      >
                        <ArrowDownCircle size={20} />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-32 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-bold text-lg">No Administrators Found</p>
                  <p className="text-slate-400 font-medium">There are currently no additional admins in the system registry.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
