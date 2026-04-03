import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, UserPlus, Trash2, Loader2, ArrowDownCircle, Mail, Calendar, User as UserIcon, ShieldCheck, Building2, Check, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
      console.error("Error fetching roles", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/departments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setDepartments(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      // Load all admin users
      const response = await fetch("https://eaglenet-backend.onrender.com/api/users?role=ADMIN", {
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
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleAssignAccess = async (userId, departmentId, roleId) => {
    if (!departmentId || !roleId) {
      return Swal.fire({
        icon: 'info',
        title: 'Selection Incomplete',
        text: 'Please choose both a Department and a Job Role.',
        timer: 3000,
        showConfirmButton: false
      });
    }

    try {
      Swal.fire({
        title: 'Saving Changes...',
        text: 'Updating department and job role.',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false
      });

      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      
      const role = roles.find(r => r.id === roleId);
      if (!role) {
        return Swal.fire('Error', 'Role not found.', 'error');
      }

      const payload = {
        name: role.name,
        permissionIds: (role.permissions || []).map(p => 
          typeof p === 'string' ? p : (p.id || p._id)
        )
      };

      const response = await fetch(`${baseUrl}/api/users/${userId}/departments/${departmentId}/roles/${roleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.status === "success") {
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'The user access has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchAdmins();
      } else {
        Swal.fire('Update Failed', data.message || 'Error occurred', 'error');
      }
    } catch {
      Swal.fire('Internet Error', 'Could not connect to the server.', 'error');
    }
  };

  const handleUpdateRole = (adminId, newRoleId, currentDeptId) => {
    if (!newRoleId) return;
    handleAssignAccess(adminId, currentDeptId, newRoleId);
  };

  const handleUpdateDepartment = (adminId, newDeptId, currentRoleId) => {
    if (!newDeptId) return;
    handleAssignAccess(adminId, newDeptId, currentRoleId);
  };

  const handleRevokeAccess = async (userId, departmentId, roleId) => {
    if (!departmentId || !roleId) {
      return Swal.fire({
        icon: 'warning',
        title: 'Nothing to remove',
        text: 'This user has no role or department assigned yet.',
        confirmButtonColor: '#0f172a'
      });
    }

    const result = await Swal.fire({
      title: 'Remove Assignment?',
      text: "This will remove the user's role and department access.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Remove',
      background: '#fff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3',
        cancelButton: 'rounded-xl px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Removing access...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false
        });

        const token = localStorage.getItem("jwt");
        const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
        const role = roles.find(r => r.id === roleId);

        const payload = {
          name: role?.name || "Role",
          permissionIds: role ? (role.permissions || []).map(p => typeof p === 'string' ? p : (p.id || p._id)) : []
        };

        const response = await fetch(`${baseUrl}/api/users/${userId}/departments/${departmentId}/roles/${roleId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.status === "success") {
          await Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: data.message || 'Access successfully removed.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchAdmins();
        } else {
          Swal.fire('Error', data.message || 'Could not remove access.', 'error');
        }
      } catch {
        Swal.fire('Internet Error', 'Could not connect to the server.', 'error');
      }
    }
  };

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
        const response = await fetch(`https://eaglenet-backend.onrender.com/api/users/${admin.id}`, {
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
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Role</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-8 py-24 text-center">
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
                    <div className="relative">
                      <select
                        className="appearance-none bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all w-full md:w-auto"
                        value={admin.departmentId || ""}
                        onChange={(e) => handleUpdateDepartment(admin.id, e.target.value, admin.roleId)}
                      >
                        <option value="">Unassigned</option>
                        {departments.map(dept => (
                          <option key={dept.id || dept._id} value={dept.id || dept._id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative">
                      <select
                        className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full md:w-auto"
                        value={admin.roleId || ""}
                        onChange={(e) => handleUpdateRole(admin.id, e.target.value, admin.departmentId)}
                      >
                        <option value="">No Role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <ShieldCheck size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                    </div>
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
                        title="Remove Admin Status"
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all active:scale-90"
                      >
                        <ArrowDownCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleRevokeAccess(admin.id, admin.departmentId, admin.roleId)}
                        title="Remove Role & Dept"
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                      >
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
