import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
  Package,
  MapPin,
  Calendar,
  User,
  FileText,
  Truck,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  Search,
  UserCheck
} from "lucide-react";

const STEPS = [
  { id: 1, name: "Customer Information" },
  { id: 2, name: "Shipment Details" },
  { id: 3, name: "Upload Documents" },
  { id: 4, name: "Review & Submit" },
];

export default function Booking() {
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [tempDocTitle, setTempDocTitle] = useState("");
  const [tempDocDescription, setTempDocDescription] = useState("");

  const [formData, setFormData] = useState({
    // Step 1
    customerId: "",
    customerName: "",
    // Step 2
    shipmentType: "Export",
    pickupAddress: "",
    pickupCity: "",
    deliveryAddress: "",
    destinationCity: "",
    weight: "",
    dimensions: "",
    // Step 3
    documents: [],
    // Other
    serviceId: "",
    packageDetails: "",
    pickupDate: "",
    pickupTime: "Anytime",
    specialRequirements: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/users?role=customer`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "success") {
        setCustomers(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.phone || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const selectedCustomer = customers.find(c => String(c.id) === String(formData.customerId));

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCustomer,
          role: 'customer',
          password: 'User@12345' // Temporary default password
        })
      });
      const result = await response.json();
      if (result.status === "success") {
        Swal.fire('Success', 'Customer profile has been created successfully.', 'success');
        setShowModal(false);
        setNewCustomer({ firstName: "", lastName: "", email: "", phoneNumber: "" });
        await fetchCustomers();
        // Auto-select the new customer
        if (result.data?.id) {
          setFormData(prev => ({ ...prev, customerId: result.data.id }));
        }
      } else {
        Swal.fire('Error', result.message || 'Failed to create customer profile', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Could not connect to the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === 'documents') {
      const newDocs = files.map(file => ({
        file,
        title: tempDocTitle || file.name.split('.')[0],
        description: tempDocDescription || ""
      }));
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
      setTempDocTitle("");
      setTempDocDescription("");
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleDocumentDataChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.customerId) newErrors.customerId = "Please select a customer";
    } else if (currentStep === 2) {
      if (!formData.pickupAddress) newErrors.pickupAddress = "Pickup address is required";
      if (!formData.deliveryAddress) newErrors.deliveryAddress = "Delivery address is required";
    }
    // Add more validation as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Logic for submitting all data (FormData for files)
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          formData.documents.forEach((doc, idx) => {
            submitData.append(`documents[${idx}][file]`, doc.file);
            submitData.append(`documents[${idx}][title]`, doc.title);
            submitData.append(`documents[${idx}][description]`, doc.description);
          });
        } else if (key !== 'documentType') {
          submitData.append(key, formData[key]);
        }
      });

      // Simulation for now
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Booking Created!',
          text: 'Shipment has been successfully booked.',
          confirmButtonColor: '#10b981'
        });
        setCurrentStep(1);
        setLoading(false);
      }, 2000);

    } catch (error) {
      Swal.fire('Error', 'Failed to create booking', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Carefully fill the form with the correct information</h2>
      </div>

      {/* Stepper */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-3 relative z-10 group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black transition-all duration-300 border-4 ${currentStep >= step.id
                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20"
                : "bg-slate-100 border-slate-100 text-slate-400"
                }`}>
                {currentStep > step.id ? <CheckCircle size={24} /> : step.id}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight text-center max-w-[80px] ${currentStep >= step.id ? "text-slate-900" : "text-slate-400"
                }`}>
                {step.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="hidden md:block flex-1 h-0.5 bg-slate-100 min-w-[20px] transition-colors duration-500" style={{
                backgroundColor: currentStep > step.id ? "#0f172a" : "#f1f5f9"
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 md:p-12 space-y-10">
          {/* Selected Customer Progress Header */}
          {selectedCustomer && currentStep > 1 && (
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between animate-in slide-in-from-top-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                  <UserCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer information</p>
                  <h4 className="text-lg font-black text-slate-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</h4>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-600">{selectedCustomer.email}</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                  <p className="text-sm font-bold text-slate-600">{selectedCustomer.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Step {currentStep}: {STEPS[currentStep - 1].name}</h3>
              <p className="text-slate-500 font-medium">
                {currentStep === 1 && "Select the customer for this shipment"}
                {currentStep === 2 && "Enter origin, destination and package details"}
                {currentStep === 3 && "Upload necessary identification and shipment papers"}
                {currentStep === 4 && "Review all information before final submission"}
              </p>
            </div>
            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 border border-emerald-500 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-sm"
              >
                <Plus size={20} /> New Customer
              </button>
            )}
          </div>

          {/* Form Content */}
          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                {/* Search Bar */}
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search customers by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                  />
                </div>

                {/* Customers Table */}
                <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Select</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loadingCustomers ? (
                        <tr>
                          <td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-bold">
                            Loading.....
                          </td>
                        </tr>
                      ) : paginatedCustomers.length > 0 ? (
                        paginatedCustomers.map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => setFormData(prev => ({ ...prev, customerId: c.id }))}
                            className={`group cursor-pointer transition-colors ${formData.customerId === c.id ? "bg-emerald-50/50" : "hover:bg-slate-50/50"
                              }`}
                          >
                            <td className="px-6 py-5">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.customerId === c.id
                                ? "border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-500/20"
                                : "border-slate-200 group-hover:border-emerald-300"
                                }`}>
                                {formData.customerId === c.id && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                  <User size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800">{c.firstName} {c.lastName}</p>
                                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">Customer</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                  <Mail size={12} className="text-slate-300" /> {c.email}
                                </p>
                                <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                  <Phone size={12} className="text-slate-300" /> {c.phone || "No phone"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-bold">
                            No customers found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 pt-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-50 transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-50 transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {errors.customerId && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.customerId}</p>}
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Truck size={16} className="text-emerald-500" /> Shipment Type
                  </h4>
                  <div className="flex gap-4">
                    {["Export", "Import"].map(type => (
                      <label key={type} className={`flex-1 flex items-center justify-center gap-3 h-16 rounded-2xl border-2 cursor-pointer transition-all font-bold ${formData.shipmentType === type
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10"
                        : "border-slate-100 bg-white text-slate-400 hover:border-emerald-200"
                        }`}>
                        <input
                          type="radio"
                          name="shipmentType"
                          value={type}
                          checked={formData.shipmentType === type}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-500" /> Route Info
                  </h4>
                  <div className="space-y-4">
                    <input name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none" placeholder="Pickup Address" />
                    <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none" placeholder="Delivery Address" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={16} className="text-emerald-500" /> Package Info
                  </h4>
                  <div className="space-y-4">
                    <input name="weight" value={formData.weight} onChange={handleInputChange} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none" placeholder="Weight (kg)" />
                    <input name="dimensions" value={formData.dimensions} onChange={handleInputChange} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none" placeholder="Dimensions (LxWxH)" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                {/* Document Title & Description Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Document Title</label>
                    <input
                      type="text"
                      value={tempDocTitle}
                      onChange={(e) => setTempDocTitle(e.target.value)}
                      placeholder="e.g. Identity Card"
                      className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Document Description</label>
                    <input
                      type="text"
                      value={tempDocDescription}
                      onChange={(e) => setTempDocDescription(e.target.value)}
                      placeholder="e.g. Front and back view"
                      className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center space-y-4 hover:border-emerald-200 transition-colors group cursor-pointer relative">
                  <input type="file" multiple onChange={(e) => handleFileChange(e, 'documents')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="text-slate-400 group-hover:text-emerald-500" size={32} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-800">Click or drag files to upload</p>
                    <p className="text-slate-400 font-medium">Support for PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-4">
                    {formData.documents.map((doc, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-800 truncate">{doc.file.name}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(i)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Document Title</label>
                            <input
                              type="text"
                              value={doc.title}
                              onChange={(e) => handleDocumentDataChange(i, 'title', e.target.value)}
                              className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 outline-none transition-all"
                              placeholder="e.g. Identity Card"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
                            <input
                              type="text"
                              value={doc.description}
                              onChange={(e) => handleDocumentDataChange(i, 'description', e.target.value)}
                              className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 outline-none transition-all"
                              placeholder="e.g. Front and back view"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Customer Details</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Customer ID</span>
                        <span className="text-slate-900 font-black">{formData.customerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Shipment Type</span>
                        <span className="text-slate-900 font-black">{formData.shipmentType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Shipment Path</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Origin</p>
                          <p className="text-sm font-bold text-slate-800">{formData.pickupAddress || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Destination</p>
                          <p className="text-sm font-bold text-slate-800">{formData.deliveryAddress || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                  <div className="p-3 bg-emerald-500 rounded-xl text-white">
                    <Eye size={24} />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-black">Ready to submit?</p>
                    <p className="text-emerald-600 text-sm font-medium">Please double check all fields before proceeding.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-10 border-t border-slate-50">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className={`flex items-center gap-2 px-8 h-16 rounded-2xl font-black transition-all ${currentStep === 1
                ? "text-slate-200 cursor-not-allowed"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <ChevronLeft size={20} /> Back
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-10 h-16 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-1 transition-all"
              >
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-3 px-12 h-16 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Create Shipment"}
                {!loading && <CheckCircle size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">New Customer</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Details</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        required
                        type="text"
                        value={newCustomer.firstName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        required
                        type="text"
                        value={newCustomer.lastName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      required
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      required
                      type="tel"
                      value={newCustomer.phoneNumber}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 shadow-xl shadow-slate-200"
                >
                  {loading ? "Creating Profile..." : "Create Customer Profile"}
                  {!loading && <CheckCircle size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}