import React from "react";

const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-all duration-300"
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${stat.bgColor || 'bg-slate-50'} ${stat.textColor || 'text-slate-600'}`}>
                            <stat.icon size={20} />
                        </div>
                        <div className={`text-[32px] font-bold ${stat.textColor || 'text-slate-900'}`}>
                            {stat.value}
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
