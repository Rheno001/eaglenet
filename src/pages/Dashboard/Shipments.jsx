import React, { useEffect, useState } from "react";
import { Search, Filter, Download, Eye, Loader, AlertCircle, CheckCircle, Package, MapPin, Calendar, Copy } from "lucide-react";

export default function Shipment() {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shipments, searchTerm, filterCity, sortBy]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/backend/Shipments.php");
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Support two response shapes: direct array or { status, data }
      const shipmentData = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setShipments(shipmentData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load shipment data. Please try again.");
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...shipments];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.customerName?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.includes(search) ||
        item.id?.toString().includes(search)
      );
    }

    // City filter
    if (filterCity !== "all") {
      filtered = filtered.filter(item => item.destinationCity === filterCity);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === "name") {
        return (a.customerName || "").localeCompare(b.customerName || "");
      } else if (sortBy === "weight") {
        return parseFloat(b.packageWeight) - parseFloat(a.packageWeight);
      }
      return 0;
    });

    setFilteredShipments(filtered);
  };

  const getCities = () => {
    const cities = new Set(shipments.map(s => s.destinationCity).filter(Boolean));
    return Array.from(cities).sort();
  };

  const handleDownload = () => {
    const csv = [
      ["ID", "Tracking ID", "Customer Name", "Email", "Phone", "Pickup City", "Destination City", "Weight (kg)", "Type", "Date", "Status"],
      ...filteredShipments.map(item => [
        item.id,
        (item.trackingId || item.tracking_id || item.tracking || ''),
        item.customerName,
        item.email,
        item.phone,
        item.pickupCity,
        item.destinationCity,
        item.packageWeight,
        item.packageType,
        item.date,
        "Pending"
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shipments.csv";
    a.click();
  };

  const stats = [
    { label: "Total Shipments", value: shipments.length, icon: Package, color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: Math.floor(shipments.length * 0.6), icon: Calendar, color: "bg-yellow-100 text-yellow-600" },
    { label: "Completed", value: Math.floor(shipments.length * 0.4), icon: CheckCircle, color: "bg-green-100 text-green-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-700 font-semibold">Loading shipment records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipment Records</h1>
          <p className="text-gray-600">View and manage all shipment records</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Destination City</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Cities</option>
                {getCities().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Latest First</option>
                <option value="name">Customer Name</option>
                <option value="weight">Weight</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchShipments}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleDownload}
              disabled={filteredShipments.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600 font-medium">
          Showing {filteredShipments.length} of {shipments.length} shipments
        </div>

        {/* Table */}
        {filteredShipments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Route</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Weight</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-blue-600 font-semibold">{item.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {item.pickupCity} → {item.destinationCity}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.packageWeight} kg</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {item.packageType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedShipment(selectedShipment?.id === item.id ? null : item)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedShipment?.id === item.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No shipment records found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedShipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b">
                <h2 className="text-xl font-bold text-white">Shipment Details</h2>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Shipment ID</p>
                    <p className="text-gray-900 font-semibold">{selectedShipment.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-gray-900 font-semibold">Pending</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Sender Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Phone</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Shipment Route</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Pickup</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.pickupCity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Destination</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.destinationCity}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Package Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.packageType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Weight</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.packageWeight} kg</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Details</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.packageDetails}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Schedule & Additional</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Pickup Date</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Preferred Time</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.preferredTime || "Anytime"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Special Requirements</p>
                      <p className="text-gray-900 font-medium">{selectedShipment.specialRequirements || "None"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}