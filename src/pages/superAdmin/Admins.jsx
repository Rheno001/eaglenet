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
          to="/dashboard/superadmin/promote"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <UserPlus size={18} /> Add New Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 font-medium tracking-wide">Fetching system administrators...</p>
                </td>
              </tr>
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{admin.firstName} {admin.lastName}</p>
                        <p className="text-xs text-gray-500">ID: {admin.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                      <ShieldCheck size={12} />
                      ADMIN
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleDowngrade(admin)}
                        title="Downgrade to Customer"
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <ArrowDownCircle size={20} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-bold">No Administrators Found</p>
                  <p className="text-gray-500 text-sm mt-1">There are currently no additional admins in the system.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
