import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const RecentOperations = ({ data = [], title = "Recents Operations" }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-50 overflow-hidden mt-8">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-64 transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#1e3a5f] text-white">
                            <th className="px-4 py-4 font-bold text-sm first:rounded-l-xl last:rounded-r-xl">Order ID</th>
                            <th className="px-4 py-4 font-bold text-sm">Tracking Number</th>
                            <th className="px-4 py-4 font-bold text-sm">Pickup Date</th>
                            <th className="px-4 py-4 font-bold text-sm">Delivery Date</th>
                            <th className="px-4 py-4 font-bold text-sm text-center">Parcel (Qty)</th>
                            <th className="px-4 py-4 font-bold text-sm last:rounded-r-xl">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {currentData.length > 0 ? (
                            currentData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.orderId}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.trackingNumber}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.pickupDate}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.deliveryDate}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-600 text-center">{row.parcelQty}</td>
                                    <td className="px-4 py-4 text-sm font-medium">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.status === 'Delivered' ? 'text-emerald-600 bg-emerald-50' :
                                                row.status === 'Pending' ? 'text-amber-600 bg-amber-50' :
                                                    'text-indigo-600 bg-indigo-50'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-12 text-center text-slate-400 font-medium italic">
                                    No operations found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                    Showing {currentData.length} of {filteredData.length} entries
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all font-bold text-sm"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all font-bold text-sm"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecentOperations;
