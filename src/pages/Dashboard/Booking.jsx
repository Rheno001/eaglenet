import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  FileText, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  ArrowRight,
  Info,
  Clock,
  Weight
} from "lucide-react";

export default function Booking() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    pickupAddress: "",
    pickupCity: "",
    destination: "",
    destinationCity: "",
    packageWeight: "",
    packageType: "general",
    packageDetails: "",
    date: "",
    preferredTime: "anytime",
    specialRequirements: "",
    serviceId: "",
  });

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-eb9x.onrender.com";
      const response = await fetch(`${baseUrl}/api/shipments/services`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      console.log("🛠️ [Service Registry Search]", result);
      if (result.status === "success" && Array.isArray(result.data)) {
        setServices(result.data);
      }
    } catch (err) {
      console.error("Registry fetch error:", err);
      // Resilience fallback
      setServices([
        { id: "fe8d22b9-0f26-4db5-ba14-592afce1887c", serviceName: "Air Freight" },
        { id: "58477e45-464c-49f2-9db4-8369c3151208", serviceName: "Ocean Freight" },
        { id: "960f4f5a-9078-4cec-82e6-d5a6bd356cc8", serviceName: "General Logistics" },
        { id: "99758a29-e31d-4145-84f6-36868b26b284", serviceName: "Haulage & Distribution" }
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.customerName) newErrors.customerName = "Full Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
    } else if (step === 2) {
      if (!formData.pickupAddress) newErrors.pickupAddress = "Pickup Address is required";
      if (!formData.pickupCity) newErrors.pickupCity = "Origin City is required";
      if (!formData.destination) newErrors.destination = "Destination Address is required";
      if (!formData.destinationCity) newErrors.destinationCity = "Destination City is required";
    } else if (step === 3) {
      if (!formData.serviceId) newErrors.serviceId = "Primary Service is required";
      if (!formData.packageWeight) newErrors.packageWeight = "Weight is required";
      if (!formData.packageDetails) newErrors.packageDetails = "Description is required";
      if (!formData.date) newErrors.date = "Pickup Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const payload = {
        fullName: formData.customerName,
        email: formData.email,
        phoneNumber: formData.phone,
        pickupAddress: formData.pickupAddress,
        pickupCity: formData.pickupCity,
        deliveryAddress: formData.destination,
        destinationCity: formData.destinationCity,
        weight: formData.packageWeight,
        packageDetails: formData.packageDetails,
        preferredPickupDate: formData.date,
        preferredPickupTime: formData.preferredTime,
        specialRequirements: formData.specialRequirements,
        serviceId: formData.serviceId,
      };

      const response = await fetch("https://eaglenet-eb9x.onrender.com/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Mission Initialized',
          html: `<div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Tracking ID</p>
                  <p class="text-2xl font-black text-slate-900 font-mono mb-4">${result.data.trackingId}</p>
                  <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest">Shipment logged in high-priority registry</p>
                </div>`,
          confirmButtonText: 'Command Center',
          customClass: { confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold' }
        });
        setCurrentStep(1);
        setFormData({
          customerName: "", email: "", phone: "", pickupAddress: "", pickupCity: "",
          destination: "", destinationCity: "", packageWeight: "", packageType: "general",
          packageDetails: "", date: "", preferredTime: "anytime", specialRequirements: "", serviceId: ""
        });
      } else {
        Swal.fire('Registry Error', result.message || 'Operation failed', 'error');
      }
    } catch (err) {
      Swal.fire('Connection Interrupted', 'Could not sync with the logistics hub.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const nigerianCities = [
    "Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Enugu", "Owerri", "Ilorin"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl">
                <Truck className="text-white" size={32} />
             </div>
             Logistics Booking
          </h1>
          <p className="text-slate-500 font-medium mt-1">Initialize a new shipment mission within the EAGLENET registry.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          {[1, 2, 3].map(s => (
            <div 
              key={s}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                currentStep === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
              }`}
            >
              Step {s}
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
            
            {currentStep === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <User className="text-teal-500" /> Identity Intelligence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Name</label>
                    <input name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="Full legal name" />
                    {errors.customerName && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.customerName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="official@agency.com" />
                    {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Line (Phone)</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="+234 ..." />
                    {errors.phone && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <MapPin className="text-teal-500" /> Route Mapping
                </h2>
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pickup City</label>
                         <select name="pickupCity" value={formData.pickupCity} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900">
                           <option value="">Select Origin</option>
                           {nigerianCities.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                         {errors.pickupCity && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.pickupCity}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Address</label>
                         <input name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="Street, landmark..." />
                         {errors.pickupAddress && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.pickupAddress}</p>}
                      </div>
                   </div>
                   <div className="h-px bg-slate-100"></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery City</label>
                         <select name="destinationCity" value={formData.destinationCity} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900">
                           <option value="">Select Destination</option>
                           {nigerianCities.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                         {errors.destinationCity && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.destinationCity}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                         <input name="destination" value={formData.destination} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="Street, hub..." />
                         {errors.destination && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.destination}</p>}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <Package className="text-teal-500" /> Payload Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                      <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900 shadow-inner">
                        <option value="">Select Clearance</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.serviceName}</option>)}
                      </select>
                      {errors.serviceId && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.serviceId}</p>}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Weight Class (KG)</label>
                      <input name="packageWeight" type="number" step="0.1" value={formData.packageWeight} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="0.0" />
                      {errors.packageWeight && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.packageWeight}</p>}
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Manifesto</label>
                      <textarea name="packageDetails" value={formData.packageDetails} onChange={handleChange} rows="3" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="List of items, fragile markers..." />
                      {errors.packageDetails && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.packageDetails}</p>}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dispatch Date</label>
                      <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" />
                      {errors.date && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.date}</p>}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dispatch Window</label>
                      <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900">
                        <option value="anytime">Flexible</option>
                        <option value="morning">Morning (08:00 - 12:00)</option>
                        <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                      </select>
                   </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
               {currentStep > 1 && (
                 <button type="button" onClick={prevStep} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
               )}
               {currentStep < 3 ? (
                 <button type="button" onClick={nextStep} className="ml-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                   Continue <ArrowRight size={20} />
                 </button>
               ) : (
                 <button type="button" onClick={handleSubmit} disabled={loading} className="ml-auto px-10 py-4 bg-teal-500 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20 disabled:opacity-50">
                   {loading ? <Loader className="animate-spin" /> : <CheckCircle size={20} />}
                   Confirm Mission
                 </button>
               )}
            </div>
          </form>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                 <Info size={20} className="text-teal-400" /> Intelligence Summary
              </h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-teal-400 transition-colors"><Weight size={14}/></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Yield</span>
                    </div>
                    <span className="text-xl font-black">{formData.packageWeight || "0.0"} <span className="text-xs text-slate-500">kg</span></span>
                 </div>
                 <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-teal-400 transition-colors"><Clock size={14}/></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dispatch Window</span>
                    </div>
                    <span className="text-xs font-black uppercase">{formData.preferredTime}</span>
                 </div>
                 <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Financial Projection</p>
                    <div className="flex items-end justify-between">
                       <p className="text-3xl font-black">₦ {(parseFloat(formData.packageWeight || 0) * 150).toLocaleString()}</p>
                       <p className="text-[9px] text-slate-500 font-bold mb-1 italic">est. conversion</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Clearances</h4>
              <div className="space-y-2">
                 {loadingServices ? (
                    <div className="animate-pulse flex flex-col gap-2">
                       <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                       <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                 ) : (
                    services.slice(0, 4).map(s => (
                       <div key={s.id} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <CheckCircle size={14} className="text-teal-500" /> {s.serviceName}
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}