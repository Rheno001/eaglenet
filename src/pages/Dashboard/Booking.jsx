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
  Clock
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
        { id: "s1", serviceName: "Household & Office Removals", desc: "Efficient relocation & professional handling" },
        { id: "s2", serviceName: "Air Freight", desc: "Fast global shipping & tailored solutions" },
        { id: "s3", serviceName: "Ocean Freight", desc: "Cost-effective global goods transportation" },
        { id: "s4", serviceName: "Haulage & Distribution", desc: "Nationwide delivery with a modern fleet" },
        { id: "s5", serviceName: "Customs Clearing", desc: "Accurate documentation & duty processing" },
        { id: "s6", serviceName: "Warehousing", desc: "Secure organized storage & inventory management" }
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
        origin: `${formData.pickupAddress}, ${formData.pickupCity}`,
        destination: `${formData.destination}, ${formData.destinationCity}`,
        packageType: formData.packageType,
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
          confirmButtonText: 'Book now',
          customClass: { confirmButton: 'bg-slate-900 text-white px-8 py-3 rounded-xl font-bold' }
        });
        setCurrentStep(1);
        setFormData({
          customerName: "", email: "", phone: "", pickupAddress: "", pickupCity: "",
          destination: "", destinationCity: "", packageType: "general",
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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl">
              <Truck className="text-white" size={32} />
            </div>
            Booking
          </h1>
          <p className="text-slate-500 font-medium mt-1">Initialize a new shipment booking in our network.</p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                }`}
            >
              Step {s}
            </div>
          ))}
        </div>
      </header>

      <div className="w-full">
        <form className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 w-full">

          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <User className="text-teal-500" /> Shipper Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="Full name" />
                  {errors.customerName && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.customerName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="email@example.com" />
                  {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.email}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="+234 ..." />
                  {errors.phone && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <MapPin className="text-teal-500" /> Shipment Route
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin City</label>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination City</label>
                    <select name="destinationCity" value={formData.destinationCity} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900">
                      <option value="">Select Destination</option>
                      {nigerianCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.destinationCity && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.destinationCity}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Address</label>
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
                <Package className="text-teal-500" /> Shipment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                  <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900 shadow-inner">
                    <option value="">Select Service Type</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.serviceName}</option>)}
                  </select>
                  {errors.serviceId && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.serviceId}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Package Contents</label>
                  <textarea name="packageDetails" value={formData.packageDetails} onChange={handleChange} rows="3" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" placeholder="List of items, fragility note..." />
                  {errors.packageDetails && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.packageDetails}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Desired Pickup Date</label>
                  <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900" />
                  {errors.date && <p className="text-rose-500 text-[10px] font-bold uppercase ml-1">{errors.date}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Pickup Time</label>
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
                Create Shipment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}