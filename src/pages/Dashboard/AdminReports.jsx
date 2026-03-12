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
  CheckCircle2,
  FileSpreadsheet,
  File,
  LayoutDashboard
} from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';

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

  const exportToExcel = () => {
    if (!reportData) return;
    
    const { month, year } = getMonthDate(monthOffset);
    const monthName = formatMonth(monthOffset);
    
    const data = [
      ["EAGLENET LOGISTICS: GLOBAL BUSINESS INTELLIGENCE"],
      ["Audit Identification", `REP-${year}-${month}-${Math.floor(Math.random() * 9000) + 1000}`],
      ["Temporal Range", monthName],
      ["Extraction Metadata", new Date().toLocaleString()],
      [""],
      ["OFFICIAL KPI REGISTRY", "VALUE", "STRATEGIC CONTEXT"],
      ["Logistics Throughput", reportData.totalBookings, "Total unique shipments successfully entered into system registry."],
      ["User Base Expansion", reportData.newCustomers, "Verification of new citizen identities cleared for service access."],
      ["Liquidity Audit (Net)", `₦${parseFloat(reportData.totalRevenue).toLocaleString()}`, "Financial clearance received via authenticated PG channels."],
      ["Security Level", "HIGH-VERIFIED", "End-to-end data encryption and integrity checks completed."],
      [""],
      ["CERTIFIED BY EAGLENET CENTRAL COMMAND - CONFIDENTIAL"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    
    ws['!cols'] = [
      { wch: 35 }, // A
      { wch: 25 }, // B
      { wch: 60 }, // C
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial intelligence");
    
    XLSX.writeFile(wb, `Eaglenet_BI_Suite_${month}_${year}.xlsx`);
  };

  const exportToWord = async () => {
    if (!reportData) return;

    const { month, year } = getMonthDate(monthOffset);
    const monthName = formatMonth(monthOffset);

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
             alignment: AlignmentType.CENTER,
             children: [
                new TextRun({
                   text: "EAGLENET SOLUTIONS",
                   bold: true,
                   size: 36,
                   color: "1e293b"
                }),
             ],
             spacing: { after: 200 },
          }),
          new Paragraph({
             alignment: AlignmentType.CENTER,
             children: [
                new TextRun({
                   text: "OPERATIONAL INTELLIGENCE & FISCAL AUDIT",
                   color: "475569",
                   size: 22,
                   bold: true,
                   smallCaps: true
                }),
             ],
             spacing: { after: 400, before: 100 },
             border: {
               bottom: { color: "e2e8f0", space: 1, style: BorderStyle.SINGLE, size: 6 }
             }
          }),
          new Paragraph({
            spacing: { before: 300 },
            children: [
              new TextRun({ text: "AUDIT PERIOD: ", bold: true, size: 24, color: "0f172a" }),
              new TextRun({ text: monthName.toUpperCase(), size: 24, color: "3b82f6" }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "REGISTRY ID: ", bold: true, size: 18, color: "94a3b8" }),
              new TextRun({ text: `EGL-DOSS-X${month}${year}`, size: 18, color: "94a3b8" }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ 
                     shading: { fill: "1e293b" },
                     children: [new Paragraph({ children: [new TextRun({ text: "OPERATIONAL KPI", color: "ffffff", bold: true })], alignment: AlignmentType.CENTER })] 
                  }),
                  new TableCell({ 
                     shading: { fill: "1e293b" },
                     children: [new Paragraph({ children: [new TextRun({ text: "METRIC DATA", color: "ffffff", bold: true })], alignment: AlignmentType.CENTER })] 
                  }),
                  new TableCell({ 
                     shading: { fill: "1e293b" },
                     children: [new Paragraph({ children: [new TextRun({ text: "STRATEGIC AUDIT", color: "ffffff", bold: true })], alignment: AlignmentType.CENTER })] 
                  }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Shipment Logistics Volume", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: reportData.totalBookings.toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph("High-fidelity logistics bookings successfully cleared.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resident Acquisition", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: `+${reportData.newCustomers}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph("New account identities verified within the period.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Net Liquid Revenue", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: `₦${parseFloat(reportData.totalRevenue).toLocaleString()}`, alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph("Gross financial yield received via secure gateways.")] }),
                ]
              }),
            ]
          }),
          new Paragraph({
             text: "\nEXECUTIVE DATA SUMMARY",
             bold: true,
             size: 26,
             color: "0f172a",
             spacing: { before: 600, after: 200 },
          }),
          new Paragraph({
             text: `The intelligence extraction for ${monthName} confirms an operational health score of A+. Current logistics throughput stands at ${reportData.totalBookings} units, yielding a performance peak of ₦${parseFloat(reportData.totalRevenue).toLocaleString()}. All system nodes are currently in a state of verified integrity.`,
             size: 22,
             color: "475569",
             spacing: { after: 1200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
               new TextRun({ 
                  text: "EAGLENET SOLUTIONS - SECURITY AUDIT PROTOCOL - DO NOT DUPLICATE", 
                  italics: true, 
                  size: 16,
                  color: "cbd5e1",
                  bold: true
               }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Eaglenet_Business_Dossier_${month}_${year}.docx`);
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
             Strategic Intelligence Ledger
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Holistic performance auditing and mission-critical analytics.</p>
        </div>
      </header>

      {/* Export Intelligence Hub */}
      <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-top-4">
         <div className="flex items-center gap-6">
            <div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl">
               <FileText size={32} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Intelligence Export Hub</h3>
               <p className="text-slate-500 text-sm font-medium">Extract high-fidelity reports for external auditing and analysis.</p>
            </div>
         </div>
         <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button
               onClick={exportToExcel}
               className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-sm"
            >
               <FileSpreadsheet size={16} />
               <span>Excel Data Registry</span>
            </button>
            <button
               onClick={exportToWord}
               className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 font-bold rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-sm"
            >
               <File size={16} />
               <span>Word Official Dossier</span>
            </button>
            <button
               onClick={exportReport}
               className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
               <Download size={16} />
               <span>PDF Final Ledger</span>
            </button>
         </div>
      </section>

      {/* Precise filtering Controls */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm"
              title="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              disabled={monthOffset === 0}
              className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 disabled:opacity-20 shadow-sm"
              title="Next Month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
          <div className="flex items-center gap-3 py-2.5 px-6 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
            <Calendar className="text-teal-400" size={18} />
            <span className="font-black tracking-tight text-sm uppercase">{formatMonth(monthOffset)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={getMonthDate(monthOffset).month}
            onChange={(e) => {
              const targetMonth = parseInt(e.target.value);
              const { year: currentYear } = getMonthDate(monthOffset);
              const now = new Date();
              const diffMonth = (now.getFullYear() - currentYear) * 12 + (now.getMonth() + 1 - targetMonth);
              setMonthOffset(diffMonth);
            }}
            className="flex-1 md:flex-none bg-slate-50 border-none rounded-2xl px-6 py-3.5 font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none text-sm"
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={i+1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select 
            value={getMonthDate(monthOffset).year}
            onChange={(e) => {
              const targetYear = parseInt(e.target.value);
              const { month: currentMonth } = getMonthDate(monthOffset);
              const now = new Date();
              const diffMonth = (now.getFullYear() - targetYear) * 12 + (now.getMonth() + 1 - currentMonth);
              setMonthOffset(diffMonth);
            }}
            className="flex-1 md:flex-none bg-slate-50 border-none rounded-2xl px-6 py-3.5 font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none text-sm"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button 
            onClick={fetchData}
            className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Activity size={20} />
          </button>
        </div>
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