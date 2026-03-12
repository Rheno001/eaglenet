import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Users, Package, ShieldCheck } from 'lucide-react';

export default function SuperAdminDashboard() {
  const mockOrderData = [
    { date: 'Oct 01', orders: 45 },
    { date: 'Oct 05', orders: 52 },
    { date: 'Oct 10', orders: 48 },
    { date: 'Oct 15', orders: 70 },
    { date: 'Oct 20', orders: 61 },
    { date: 'Oct 25', orders: 85 },
    { date: 'Oct 30', orders: 92 },
  ];

  const mockStats = [
    { label: 'Registered Residents', value: '1,240', icon: Users, color: 'indigo' },
    { label: 'System Analytics', value: 'Live', icon: TrendingUp, color: 'teal' },
    { label: 'Security Status', value: 'Optimal', icon: ShieldCheck, color: 'emerald' },
    { label: 'Global Orders', value: '8,421', icon: Package, color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
           <div className="p-2.5 bg-slate-900 rounded-2xl">
              <TrendingUp className="text-white" size={28} />
           </div>
           Master Intelligence
        </h1>
        <p className="text-slate-500 font-medium mt-2">Global system oversight and high-level analytics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`p-4 bg-slate-50 text-slate-900 rounded-3xl w-fit mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-10">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">System Growth Velocity</h2>
           <div className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
              Auto-Syncing
           </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockOrderData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontWeight: '800', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#0f172a" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#0f172a', strokeWidth: 3, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}