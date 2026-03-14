import React, { useState, useEffect } from 'react';
import {
  Shield,
  Settings,
  Package,
  Activity,
  Loader2,
  AlertCircle,
  Search,
  CheckCircle2,
  Box,
  Truck,
  Wind,
  Anchor,
  Globe,
  Plus
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-eb9x.onrender.com";
      const response = await fetch(`${baseUrl}/api/shipments/services`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        setServices(result.data);
      } else {
        setError(result.message || 'Failed to sync with service registry.');
      }
    } catch (err) {
      console.error("Registry fetch error:", err);
      setError('Connection with logistics hub interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    const { value: serviceName } = await Swal.fire({
      title: 'Initialize New Service',
      input: 'text',
      inputLabel: 'Service Designation',
      inputPlaceholder: 'e.g. Express Air Logistic',
      showCancelButton: true,
      confirmButtonText: 'Register Service',
      confirmButtonColor: '#0f172a',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[2rem]',
        input: 'rounded-xl font-bold py-4 px-6 border-slate-100 bg-slate-50',
        confirmButton: 'rounded-xl px-8 py-4 font-black uppercase tracking-widest text-[10px]',
        cancelButton: 'rounded-xl px-8 py-4 font-black uppercase tracking-widest text-[10px]'
      },
      inputValidator: (value) => {
        if (!value) return 'Designation is required for registry inclusion.';
      }
    });

    if (serviceName) {
      try {
        Swal.fire({
          title: 'Syncing with Hub...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false
        });

        const token = localStorage.getItem("jwt");
        const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-eb9x.onrender.com";

        const response = await fetch(`${baseUrl}/api/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ serviceName }),
        });

        const result = await response.json();

        if (result.status === "success") {
          Swal.fire({
            icon: 'success',
            title: 'Service Registered',
            text: `${serviceName} is now active in the global catalog.`,
            timer: 3000,
            showConfirmButton: false
          });
          fetchServices();
        } else {
          Swal.fire('Registry Error', result.message || 'Failed to create service', 'error');
        }
      } catch (err) {
        Swal.fire('Hub Timeout', 'Could not broadcast new service to the network.', 'error');
      }
    }
  };

  const filteredServices = services.filter(s =>
    s.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('air')) return <Wind className="text-sky-500" />;
    if (n.includes('ocean') || n.includes('sea')) return <Anchor className="text-blue-500" />;
    if (n.includes('haulage') || n.includes('truck') || n.includes('distribution')) return <Truck className="text-amber-500" />;
    if (n.includes('warehousing') || n.includes('storage')) return <Box className="text-indigo-500" />;
    if (n.includes('customs') || n.includes('clearing')) return <Shield className="text-emerald-500" />;
    if (n.includes('removal') || n.includes('relocation') || n.includes('household')) return <Package className="text-rose-500" />;
    return <Package className="text-slate-400" />;
  };

  const getServiceDescription = (name) => {
    const n = name.toLowerCase();
    if (n.includes('removal') || n.includes('relocation') || n.includes('household'))
      return "Efficient household and office relocation services, handling, transportation, and delivery solutions.";
    if (n.includes('air freight'))
      return "Fast, reliable global shipping with secure handling and tailored solutions for urgent needs.";
    if (n.includes('ocean freight'))
      return "Reliable ocean freight with flexible schedules and cost-effective solutions for global transport.";
    if (n.includes('haulage'))
      return "Timely transportation of goods nationwide using a modern fleet and skilled drivers.";
    if (n.includes('customs'))
      return "Fast customs clearing with accurate documentation, duty processing, and compliance.";
    if (n.includes('warehousing'))
      return "Secure, organized warehousing with inventory management and efficient distribution.";
    return "Comprehensive logistics infrastructure to power your business growth across global markets.";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-2xl">
              <Settings className="text-white" size={24} />
            </div>
            Services
          </h1>
          <p className="text-slate-500 font-medium mt-1">Advanced Logistics Solutions for household and commercial needs.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={handleCreateService}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 text-[10px] uppercase tracking-widest"
          >
            <Plus size={20} /> Register Service
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            <Activity size={16} />
            System Registry Live
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <section className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search service registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
          />
        </div>
        <button
          onClick={fetchServices}
          className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          Refresh Registry
        </button>
      </section>

      {/* Grid View */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Catalog...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 flex items-center gap-6 text-rose-900">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <AlertCircle size={32} />
            </div>
            <div>
              <p className="font-black uppercase tracking-tight">Sync Failure</p>
              <p className="text-sm font-medium opacity-70">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                    {getServiceIcon(service.serviceName)}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <div className="flex items-center gap-1.5 mt-1 text-teal-600">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-black uppercase">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{service.serviceName}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed h-12 overflow-hidden line-clamp-2">
                      {getServiceDescription(service.serviceName)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-3">Registry ID: {service.id.substring(0, 8)}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* <Globe size={14} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Global Coverage</span> */}
                    </div>
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-90">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Package size={80} />
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic">No matching services found in the local registry.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Intelligence Card */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight mb-6 uppercase">Registry Protocol</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
            The service catalog defines the operational boundaries of the EAGLENET logistics system. Each service listed is synchronized with real-time clearance protocols and provides the infrastructure for shipment initialization. Administrative edits to these services affect global booking eligibility.
          </p>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"></div>
              <span className="text-xs font-black uppercase tracking-widest">Air/Sea Neutrality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"></div>
              <span className="text-xs font-black uppercase tracking-widest">Verified Customs Hub</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"></div>
              <span className="text-xs font-black uppercase tracking-widest">End-to-End Encryption</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
}
