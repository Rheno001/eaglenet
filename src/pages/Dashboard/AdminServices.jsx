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

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-eb9x.onrender.com";
      const response = await fetch(`${baseUrl}/api/services`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        setServices(result.data);
      } else {
        setError(result.message || 'Failed to fetch services.');
      }
    } catch {
      console.error("Fetch error");
      setError('Connection interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    const { value: serviceName } = await Swal.fire({
      title: 'Add New Service',
      input: 'text',
      inputLabel: 'Service Name',
      inputPlaceholder: 'e.g. Express Air Logistic',
      showCancelButton: true,
      confirmButtonText: 'Save Service',
      confirmButtonColor: '#0f172a',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-3xl',
        input: 'rounded-xl font-bold py-4 px-6 border-slate-100 bg-slate-50',
        confirmButton: 'rounded-xl px-8 py-4 font-bold uppercase tracking-widest text-[10px]',
        cancelButton: 'rounded-xl px-8 py-4 font-bold uppercase tracking-widest text-[10px]'
      },
      inputValidator: (value) => {
        if (!value) return 'Service name is required.';
      }
    });

    if (serviceName) {
      try {
        Swal.fire({
          title: 'Creating Service..',
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
            title: 'Service Saved',
            text: `${serviceName} is now active in the catalog.`,
            timer: 3000,
            showConfirmButton: false
          });
          fetchServices();
        } else {
          Swal.fire('Error', result.message || 'Failed to create service', 'error');
        }
      } catch {
        Swal.fire('Connection Error', 'Could not save new service.', 'error');
      }
    }
  };

  const filteredServices = services.filter(s =>
    s.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceIcon = (name, size = 20) => {
    const n = name.toLowerCase();
    if (n.includes('air')) return <Wind className="text-sky-500" size={size} />;
    if (n.includes('ocean') || n.includes('sea')) return <Anchor className="text-blue-500" size={size} />;
    if (n.includes('haulage') || n.includes('truck') || n.includes('distribution')) return <Truck className="text-amber-500" size={size} />;
    if (n.includes('warehousing') || n.includes('storage')) return <Box className="text-indigo-500" size={size} />;
    if (n.includes('customs') || n.includes('clearing')) return <Shield className="text-emerald-500" size={size} />;
    if (n.includes('removal') || n.includes('relocation') || n.includes('household')) return <Package className="text-rose-500" size={size} />;
    return <Package className="text-slate-400" size={size} />;
  };


  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
              <Settings className="text-white" size={28} />
            </div>
            Services
          </h1>
          <p className="text-slate-500 font-medium mt-3">Manage delivery types and logistics options.</p>
        </div>
        <button
          onClick={handleCreateService}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 text-xs uppercase tracking-widest"
        >
          <Plus size={20} /> Add Service
        </button>
      </header>

      {/* Control Bar */}
      <section className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
          />
        </div>
        <button
          onClick={fetchServices}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all text-sm"
        >
          Refresh List
        </button>
      </section>

      {/* Grid View */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Services...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex items-center gap-6 text-rose-900">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <AlertCircle size={32} />
            </div>
            <div>
              <p className="font-bold uppercase tracking-tight">Sync Failure</p>
              <p className="text-sm font-medium opacity-70">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative cursor-pointer"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="p-5 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                    {getServiceIcon(service.serviceName, 24)}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 size={12} />
                      <span className="text-[10px] font-bold uppercase">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{service.serviceName}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed h-12 overflow-hidden line-clamp-2">
                    Available for bookings. Created on {new Date(service.createdAt).toLocaleDateString()}.
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {service.id.substring(0, 12)}</p>
                    <button className="text-[10px] font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic">No matching services found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedService(null)}
          />
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl relative z-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-10 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl">
                  {getServiceIcon(selectedService.serviceName, 32)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedService.serviceName}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Service Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Active & Operational
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created Date</p>
                  <p className="text-slate-900 font-bold">{new Date(selectedService.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service Identifier</p>
                  <p className="text-slate-900 font-mono text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedService.id}</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-3">Specifications</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 size={16} className="text-teal-500" />
                    Real-time tracking enabled
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 size={16} className="text-teal-500" />
                    Global coverage compatible
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 size={16} className="text-teal-500" />
                    Standard insurance coverage
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-6 uppercase">Service Management</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
            Control the types of services available for customer bookings. Each service listed is synchronized with logistics protocols and defines the infrastructure for shipment initialization.
          </p>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Global Reach</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Secure Operations</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
}
