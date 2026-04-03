import React, { useState, useEffect } from 'react';
import { Building2, Loader2, Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Departments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState([]);
  const [fetching, setFetching] = useState(true);

  const fetchDepartments = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/departments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setDepartments(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log("Backend response body:", result);

      if (result.status === "success") {
        await Swal.fire({
          icon: 'success',
          title: 'Department Created',
          text: `Department '${result.data.name}' has been successfully created.`,
          timer: 2000,
          showConfirmButton: false
        });
        setName('');
        setDescription('');
        fetchDepartments();
      } else {
        console.error("Creation failed. Message:", result.message, "Full result:", result);
        Swal.fire('Creation Failed', result.message || 'Failed to create department.', 'error');
      }
    } catch (error) {
      console.error("Create Department network/fetch error:", error);
      Swal.fire('Network Error', 'Could not sync with the server. See console details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                 Departments
              </h1>
              <p className="text-slate-500 font-medium tracking-tight">Manage and create departments.</p>
           </div>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Add New Department</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Name</label>
            <div className="relative">
              <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text" 
                placeholder="e.g. Sales"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this department do?"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-slate-900 resize-none h-32"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            Create Department
          </button>
        </form>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Departments</h3>
          <button onClick={fetchDepartments} disabled={fetching} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
            <RefreshCw size={20} className={fetching ? 'animate-spin' : ''} />
          </button>
        </div>
        
        {fetching ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div key={dept.id || dept._id} className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{dept.name}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{dept.description || 'No description.'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium tracking-tight">No departments found. Create your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
