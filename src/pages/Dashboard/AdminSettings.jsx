import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Database,
  Cloud,
  Mail
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System Configuration', icon: Database },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your administrative preferences and system controls.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <aside className="lg:w-72 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "text-gray-500 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronRight size={16} />}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                      A
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Smartphone size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Administrator Profile</h3>
                    <p className="text-gray-500 text-sm font-medium">Update your photo and personal details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Admin User"
                      className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="admin@eaglenet.com"
                      className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Role Description</label>
                    <textarea 
                      rows="3"
                      className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-900"
                      placeholder="Tell us about your management scope..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                 <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <Lock className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Two-Factor Authentication is Active</p>
                      <p className="text-xs font-medium text-emerald-700">Your account is secured with mobile verification.</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <section>
                       <h3 className="font-bold text-slate-900 mb-4">Password Management</h3>
                       <div className="space-y-4">
                          <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                             <div className="flex items-center gap-3">
                                <Shield className="text-slate-400 group-hover:text-teal-600 transition-colors" />
                                <span className="text-sm font-bold text-slate-700">Change password</span>
                             </div>
                             <ChevronRight size={18} className="text-slate-300" />
                          </button>
                       </div>
                    </section>
                 </div>
              </div>
            )}
            
            {/* Save Button */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
              <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                <CheckCircle2 size={18} />
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-blue-50 rounded-2xl">
                  <Cloud className="text-blue-600" />
               </div>
               <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Storage Status</p>
                  <p className="text-sm font-bold text-slate-900">84% of 10GB Used</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-purple-50 rounded-2xl">
                  <Mail className="text-purple-600" />
               </div>
               <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Quota</p>
                  <p className="text-sm font-bold text-slate-900">12.5k / 50k Sent</p>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}