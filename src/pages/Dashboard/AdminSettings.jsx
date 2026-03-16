import React from 'react';
import {
  User,
  Shield,
  Bell,
  Globe,
  Lock,
  Smartphone,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
            <User className="text-white" size={28} />
          </div>
          Profile Settings
        </h1>
        <p className="text-slate-500 font-medium mt-3 text-lg">Manage your personal information and account details.</p>
      </header>

      <main className="space-y-8">
        <section className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm">
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  defaultValue="admin@eaglenet.com"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bio / Role Description</label>
                <textarea
                  rows="4"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                  placeholder="Optional bio or notes..."
                ></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 text-xs uppercase tracking-widest">
                <CheckCircle2 size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}