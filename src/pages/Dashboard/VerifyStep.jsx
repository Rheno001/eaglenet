import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft,
  Info,
  Clock,
  User,
  Activity
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function VerifyStep() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("Initial document check passed.");
  const [stepData, setStepData] = useState(null);
  const [fetching, setFetching] = useState(true);

  // In a real app, we might fetch the step details first to show what we are verifying
  useEffect(() => {
    const fetchStepDetails = async () => {
      setFetching(true);
      try {
        const token = localStorage.getItem("jwt");
        const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
        const response = await fetch(`${baseUrl}/api/workflows/step/${stepId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.status === "success") {
          setStepData(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch step details:", err);
      } finally {
        setFetching(false);
      }
    };

    if (stepId) fetchStepDetails();
  }, [stepId]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
      
      const response = await fetch(`${baseUrl}/api/workflows/step/${stepId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "COMPLETED",
          comments: comments
        })
      });

      const result = await response.json();

      if (result.status === "success") {
        await Swal.fire({
          icon: 'success',
          title: 'Verification Complete',
          text: `Step '${result.data.name || "Workflow Step"}' has been successfully verified.`,
          timer: 2500,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            title: 'text-slate-900 font-black',
            htmlContainer: 'text-slate-500 font-medium'
          }
        });
        navigate(-1);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: result.message || 'Could not complete the verification process.',
          confirmButtonColor: '#0f172a'
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      Swal.fire({
        icon: 'error',
        title: 'System Error',
        text: 'A network error occurred while connecting to the verification server.',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:shadow-lg group-hover:scale-110 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back
        </button>
        <div className="flex bg-slate-900 text-white px-4 py-2 rounded-2xl border border-slate-700 items-center gap-2 text-[10px] font-black tracking-widest uppercase shadow-xl shadow-slate-200">
          <ShieldCheck size={14} className="text-teal-400" />
          Shipment Verification
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Verification Form */}
        <div className="lg:col-span-3">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Step Verification</h1>
              <p className="text-slate-400 font-medium tracking-tight">Approve this workflow step and add comments.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MessageSquare size={14} /> Verification Comments
                </label>
                <textarea
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide internal notes for this verification..."
                  className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-900 resize-none h-48 outline-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white px-8 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} className="text-teal-400" />}
                Complete Step Verification
              </button>
            </form>
          </div>
        </div>

        {/* Step Context / Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all duration-700" />
            
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Info size={14} className="text-teal-400" /> Process Metadata
            </h3>

            <div className="space-y-8">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Workflow Step ID</p>
                <p className="font-mono text-xs text-slate-300 truncate">{stepId}</p>
              </div>

              {stepData && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Clock size={20} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Order Sequence</p>
                      <p className="font-black text-sm">Step {stepData.stepOrder || 1}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <User size={20} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Step Category</p>
                      <p className="font-black text-sm">{stepData.name || "Document Verification"}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 w-fit">
                   <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Awaiting Approval</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                   <ShieldCheck size={24} />
                </div>
                <h4 className="font-black text-slate-900 tracking-tight">Security Note</h4>
             </div>
             <p className="text-slate-500 text-xs font-medium leading-relaxed">
                By completing this verification, you are confirming that all documentation for this shipment stage has been reviewed and meets organizational standards.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
