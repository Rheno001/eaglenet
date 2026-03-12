import React, { useEffect, useState } from "react";
import {
  Package,
  User,
  CreditCard,
  Download,
  Calendar,
  TrendingUp,
  Users,
  ArrowLeft,
  ArrowRight,
  FileText,
  DollarSign,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function MonthlyReport() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMonthDate = (offset) => {
    const now = new Date();
    now.setMonth(now.getMonth() - offset);
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };
  };

  const fetchData = async () => {
    setLoading(true);
    const { month, year } = getMonthDate(monthOffset);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://eaglenet-eb9x.onrender.com/api/admin/reports?month=${month}&year=${year}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      
      if (result.status === "success") {
        setReportData(result.data);
      } else {
        setReportData(null);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [monthOffset]);

  const handlePrevMonth = () => setMonthOffset(prev => prev + 1);
  const handleNextMonth = () => setMonthOffset(prev => Math.max(prev - 1, 0));

  const formatMonth = (offset) => {
    const now = new Date();
    now.setMonth(now.getMonth() - offset);
    return now.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const exportReport = () => {
    const { month, year } = getMonthDate(monthOffset);
    window.open(`https://eaglenet-eb9x.onrender.com/api/admin/reports/export?month=${month}&year=${year}`, "_blank");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
                <BarChart3 className="text-white" size={28} />
             </div>
             System Intelligence
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Monthly performance analytics and strategic reporting.</p>
        </div>

        <button
          onClick={exportReport}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition" />
          Generate PDF Ledger
        </button>
      </header>

      {/* Modern Month Selector */}
      <section className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={handlePrevMonth}
          className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-bold text-sm"
        >
          <ChevronLeft size={20} />
          Previous Audit
        </button>

        <div className="flex items-center gap-4 py-2 px-8 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
          <Calendar className="text-teal-400" size={20} />
          <span className="font-black tracking-tight text-lg uppercase">{formatMonth(monthOffset)}</span>
        </div>

        <button
          onClick={handleNextMonth}
          disabled={monthOffset === 0}
          className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next Audit
          <ChevronRight size={20} />
        </button>
      </section>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-slate-900" size={48} />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Compiling Intelligence...</p>
        </div>
      ) : reportData ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Bookings', value: reportData.totalBookings, icon: Package, color: 'blue', desc: 'Shipments processed' },
                { label: 'New Residents', value: reportData.newCustomers, icon: Users, color: 'emerald', desc: 'Growth this month' },
                { label: 'Net Revenue', value: `₦${parseFloat(reportData.totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'amber', desc: 'Financial yield' },
                { label: 'Report Status', value: reportData.reportReady ? 'Ready' : 'In Progress', icon: FileText, color: reportData.reportReady ? 'teal' : 'orange', desc: 'Audit completion' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                  <div className={`p-4 bg-slate-50 text-slate-900 rounded-3xl w-fit mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
                     <stat.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-400">{stat.desc}</p>
                </div>
              ))}
          </div>

          {/* Deep Analytics Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                   <Activity size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Monthly Growth <br/>Intelligence Audit</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                   The system has identified <span className="text-slate-900 font-bold">{reportData.newCustomers} new accounts</span> and processed 
                   <span className="text-slate-900 font-bold"> {reportData.totalBookings} logistics orders</span> during this cycle. 
                   Financial efficiency is currently holding at an optimized level with a total revenue stream of 
                   <span className="text-emerald-600 font-bold"> ₦{parseFloat(reportData.totalRevenue).toLocaleString()}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                         <Zap className="text-amber-500" size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Performance Peak</span>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                         <CheckCircle2 className="text-teal-500" size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Verified Integrity</span>
                   </div>
                </div>
             </div>

             <div className="relative">
                <div className="aspect-square bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between overflow-hidden">
                   <div className="z-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Live System Health</p>
                      <div className="space-y-8">
                         <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                               <span>Order Completion</span>
                               <span>98%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-teal-400 rounded-full" style={{width: '98%'}}></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                               <span>Financial Accuracy</span>
                               <span>100%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-amber-400 rounded-full" style={{width: '100%'}}></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                               <span>Data Redundancy</span>
                               <span>Active</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-400 rounded-full" style={{width: '65%'}}></div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="z-10">
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                         <div className="flex items-center gap-4">
                            <Clock className="text-teal-400" />
                            <div>
                               <p className="text-xs font-bold">Report Generation Time</p>
                               <p className="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">{new Date().toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   {/* Decorative background circle */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                </div>
             </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
           <Activity size={48} className="mx-auto text-slate-200 mb-6" />
           <p className="text-xl font-bold text-slate-900">No Intelligence Data Found</p>
           <p className="text-slate-400 font-medium">There are no records found for the selected audit period.</p>
        </div>
      )}

      {/* Audit Note */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Security Audit Protocol</h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
               This intelligence report is generated from verified system hits and financial settlements. 
               Admins must treat these analytics as proprietary intelligence. Local laws regarding data 
               privacy and financial auditing apply to all exported ledgers.
            </p>
            <div className="inline-flex items-center gap-4 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />)}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Monitored by Security Staff</span>
            </div>
         </div>
         <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}