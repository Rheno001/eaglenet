import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Loader,
  AlertCircle,
  CheckCircle,
  Package,
  MapPin,
  Clock,
  Truck,
  User,
  X,
  ChevronRight
} from "lucide-react";

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

  // Fetch shipments from backend filtered by user email
  const fetchShipments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setShipments([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost/backend/Shipments.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      // The PHP backend returns shipments under data.shipments
      const shipmentData = data.shipments || [];
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

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.customerName?.toLowerCase().includes(search) ||
          item.email?.toLowerCase().includes(search) ||
          item.phone?.includes(search) ||
          item.trackingId?.toLowerCase().includes(search)
      );
    }

    if (filterCity !== "all") {
      filtered = filtered.filter(
        (item) => item.destinationCity === filterCity
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
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
    const cities = new Set(
      shipments.map((s) => s.destinationCity).filter(Boolean)
    );
    return Array.from(cities).sort();
  };

  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            <Package className="w-3 h-3" /> Pending
          </span>
        );
      case "in transit":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-700 font-semibold">
            Loading shipment records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shipment Records
          </h1>
          <p className="text-gray-600">
            View and manage all shipment records and their delivery status
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or tracking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination City
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Cities</option>
                {getCities().map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
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
        </div>

        {/* Table */}
        {filteredShipments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Tracking ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Weight
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShipments.map((item) => (
                    <tr key={item.trackingId} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-gray-800">
                        {item.trackingId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 inline mr-1" />
                        {item.pickupCity} → {item.destinationCity}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.packageWeight} kg
                      </td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() =>
                            setSelectedShipment(
                              selectedShipment?.trackingId === item.trackingId
                                ? null
                                : item
                            )
                          }
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedShipment?.trackingId === item.trackingId ? "Hide" : "View"}
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
            <p className="text-gray-600 text-lg font-medium">
              No shipment records found
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedShipment && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal content (same as your original code) */}
              <div className="sticky top-0 bg-[#1e3a8a] text-white px-8 py-5 flex items-center justify-between border-b border-teal-500">
                <div className="flex items-center gap-3">
                  <Package className="w-7 h-7 text-teal-300" />
                  <h2 id="modal-title" className="text-2xl font-bold">
                    Shipment Details
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 rounded-full hover:bg-teal-600 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Modal body remains the same */}
              <div className="p-8 space-y-8">
                {/* Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <Truck className="w-5 h-5 text-teal-500" /> Tracking ID
                    </p>
                    <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500" /> Status
                    </p>
                    <div className="mt-2">{getStatusBadge(selectedShipment.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" /> Customer
                    </p>
                    <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.customerName}</p>
                  </div>
                </div>

                {/* Sender Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <User className="w-6 h-6 text-teal-500" /> Sender Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Email</p>
                      <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Phone</p>
                      <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-orange-500" /> Route
                  </h3>
                  <p className="text-lg text-gray-900 font-medium flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                    {selectedShipment.pickupCity} → {selectedShipment.destinationCity}
                  </p>
                </div>

                {/* Package Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <Package className="w-6 h-6 text-purple-500" /> Package Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Type</p>
                      <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.packageType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Weight</p>
                      <p className="text-lg text-gray-900 font-semibold mt-2">{selectedShipment.packageWeight} kg</p>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="text-sm text-gray-600 font-medium">Details</p>
                      <p className="text-lg text-gray-900 mt-2">{selectedShipment.packageDetails}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-8 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 font-semibold shadow-sm"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
