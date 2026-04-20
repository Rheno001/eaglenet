import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package, User, MapPin, Clock, ArrowLeft, CheckCircle, 
  Activity, Warehouse, Shield, TrendingUp, Search, 
  CreditCard, FileText, Truck, Calendar, ChevronRight, 
  MoreVertical, Info, Globe, Bell, Eye, X
} from "lucide-react";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [previewDoc, setPreviewDoc] = useState(null);

  // Mock data for the UI
  const shipment = {
    id: "AF-1023",
    trackingNumber: "TRK-AF1023-2026",
    status: "In Transit",
    type: "Export",
    customer: "Ambassador Michael Chen",
    origin: "Washington DC, USA",
    destination: "Beijing, China",
    date: "10/04/2026",
    weight: "45 kg",
    createdBy: "Sarah Johnson",
    route: "Air Freight Route",
    amount: 1250.00,
    service: "Global Express",
    documents: [
      {
        id: 1,
        name: "Diplomatic Clearance Certificate",
        type: "Diplomatic Clearance",
        date: "10/04/2026",
        uploadedBy: "Sarah Johnson",
        fileSize: "2.4 MB"
      },
      {
        id: 2,
        name: "Commercial Invoice",
        type: "Shipping Docs",
        date: "11/04/2026",
        uploadedBy: "Admin",
        fileSize: "1.1 MB"
      }
    ]
  };

  const tabs = ["Overview", "Tracking", "Documents", "Payments", "Delivery"];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm font-bold text-sm"
        >
          <ArrowLeft size={18} />
          Back to Shipment
        </button>

        {/* Shipment Header Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16" />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shipment {shipment.id}</h1>
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest ${getStatusColor(shipment.status)}`}>
                  {shipment.status}
                </span>
                <span className="px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest">
                  {shipment.type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Customer</p>
                  <p className="font-bold text-emerald-600 truncate">{shipment.customer}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Route</p>
                  <p className="font-bold text-slate-800">{shipment.origin} <span className="text-slate-300 mx-1">→</span> {shipment.destination}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date Created</p>
                  <p className="font-bold text-slate-800">{shipment.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0F172A] rounded-full p-2 flex overflow-x-auto no-scrollbar shadow-2xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${
                activeTab === tab 
                  ? "bg-[#4FB683] text-white shadow-lg shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipment Information */}
              <div className="bg-white rounded-[2rem] border-2 border-blue-400 p-8 space-y-8 shadow-xl shadow-blue-500/5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Shipment Information</h3>
                
                <div className="grid grid-cols-2 gap-y-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</p>
                    <p className="text-lg font-black text-slate-900">{shipment.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Number</p>
                    <p className="text-sm font-black text-slate-900">{shipment.trackingNumber}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Status</p>
                    <span className="inline-flex px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-black text-slate-700 bg-slate-50">
                      {shipment.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-lg border text-[10px] font-black ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</p>
                    <p className="text-lg font-black text-slate-900">{shipment.weight}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Created By</p>
                    <p className="text-sm font-bold text-slate-800">{shipment.createdBy}</p>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Route Information</h3>
                
                <div className="space-y-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</p>
                    <p className="text-lg font-black text-slate-900">{shipment.id}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Route</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                      <p className="text-sm font-bold text-emerald-600 uppercase tracking-tight">{shipment.route}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</p>
                    <p className="text-lg font-black text-slate-900">{shipment.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Documents" && (
            <div className="bg-white rounded-[2rem] border-2 border-blue-400 p-8 md:p-12 space-y-10 shadow-xl shadow-blue-500/5 min-h-[400px]">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Shipment Documents</h3>
                <p className="text-slate-400 font-medium">View and manage documents</p>
              </div>

              <div className="space-y-4">
                {shipment.documents.map((doc) => (
                  <div key={doc.id} className="p-6 bg-white rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg hover:shadow-slate-200/40 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        <FileText size={28} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 leading-none">{doc.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-xs font-bold text-slate-400">{doc.type}</span>
                          <span className="text-xs font-bold text-slate-400">{doc.date}</span>
                          <span className="text-xs font-bold text-slate-400">Uploaded by {doc.uploadedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center gap-2 px-5 h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
                      >
                        <Eye size={16} /> Preview
                      </button>
                      <button className="flex items-center gap-2 px-5 h-12 bg-white border border-slate-200 rounded-xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                        <Clock size={16} /> Download
                      </button>
                      <button className="flex items-center gap-2 px-5 h-12 bg-white border border-slate-200 rounded-xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                        <Activity size={16} /> Forward
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Delivery" && (
            <div className="bg-white rounded-[2rem] border-2 border-blue-400 p-8 md:p-12 space-y-10 shadow-xl shadow-blue-500/5 min-h-[500px] flex flex-col">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Delivery Information</h3>
                <p className="text-slate-400 font-medium">Upload proof of delivery and update status</p>
              </div>

              {/* Delivery Metadata Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Final Delivery Receipt"
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Package received by front desk"
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center pt-4">
                <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center space-y-6 hover:border-emerald-200 transition-all group cursor-pointer relative bg-slate-50/30">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:shadow-emerald-500/10 transition-all">
                    <Truck className="text-slate-300 group-hover:text-emerald-500" size={40} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-800">Upload Proof of Delivery</p>
                    <p className="text-slate-400 font-medium">Photo, signature, or delivery confirmation</p>
                  </div>
                  <div className="max-w-md mx-auto h-14 bg-white border border-slate-200 rounded-xl flex items-center px-4">
                    <span className="text-slate-400 text-sm font-medium">Choose files No file chosen</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-10 h-16 bg-[#4FB683] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                  <Activity size={20} /> Upload
                </button>
              </div>
            </div>
          )}

          {activeTab !== "Overview" && activeTab !== "Documents" && activeTab !== "Delivery" && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Package size={40} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">{activeTab} Details</h4>
                <p className="text-slate-400 font-medium">Detailed information for {activeTab.toLowerCase()} is being processed.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setPreviewDoc(null)} />
          
          <div className="relative bg-white w-full max-w-4xl max-h-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">{previewDoc.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{previewDoc.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-3 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div className="aspect-[3/4] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4">
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      <FileText size={48} />
                    </div>
                    <p className="font-bold text-sm">Document Preview Area</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {previewDoc.description || "This is a secured diplomatic document regarding the shipment clearance. It contains essential verification details for international freight processing."}
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metadata</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Uploaded</span>
                        <span className="text-[10px] font-black text-slate-900">{previewDoc.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Size</span>
                        <span className="text-[10px] font-black text-slate-900">{previewDoc.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">By</span>
                        <span className="text-[10px] font-black text-slate-900">{previewDoc.uploadedBy}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                    <Clock size={16} /> Download Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
