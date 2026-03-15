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
    { label: 'Total Customers', value: '1,240', icon: Users, color: 'indigo' },
    { label: 'Analytics Status', value: 'Live', icon: TrendingUp, color: 'teal' },
    { label: 'System Health', value: 'Healthy', icon: ShieldCheck, color: 'emerald' },
    { label: 'Total Shipments', value: '8,421', icon: Package, color: 'amber' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
            <TrendingUp className="text-white" size={28} />
          </div>
          System Overview
        </h1>
        <p className="text-slate-500 font-medium mt-3 text-lg">System status and growth overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mockStats.map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="p-4 bg-slate-50 text-slate-900 rounded-2xl w-fit mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-sm font-bold text-slate-400 border-l-4 border-slate-900 pl-4 uppercase tracking-widest">Growth Trend</h2>
          <div className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-teal-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
            Live
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
                tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                itemStyle={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}
                cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
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