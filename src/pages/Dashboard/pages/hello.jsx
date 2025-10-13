import React, { useState } from 'react';
import { MapPin, Package, Clock, CheckCircle, AlertCircle, Download, Eye, Filter, Search, TrendingUp, Truck, Users, DollarSign, BarChart3 } from 'lucide-react';

export default function ShipmentDashboard() {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { label: 'Total Shipments', value: '1,247', icon: Package, color: 'bg-blue-100', iconColor: 'text-blue-600', trend: '+12%' },
    { label: 'In Transit', value: '342', icon: Truck, color: 'bg-orange-100', iconColor: 'text-orange-600', trend: '+5%' },
    { label: 'Delivered', value: '865', icon: CheckCircle, color: 'bg-green-100', iconColor: 'text-green-600', trend: '+23%' },
    { label: 'Revenue', value: '₦2.4M', icon: DollarSign, color: 'bg-purple-100', iconColor: 'text-purple-600', trend: '+18%' },
  ];

  const shipments = [
    { id: 'EGL-2024-001', destination: 'Lagos', status: 'delivered', progress: 100, date: 'Dec 15, 2024', weight: '25kg', customer: 'ABC Logistics', location: 'Victoria Island', lat: 6.4274, lng: 3.4197 },
    { id: 'EGL-2024-002', destination: 'Ibadan', status: 'in_transit', progress: 65, date: 'Dec 18, 2024', weight: '40kg', customer: 'XYZ Trading', location: 'Oyo State', lat: 7.3775, lng: 3.9470 },
    { id: 'EGL-2024-003', destination: 'Abuja', status: 'in_transit', progress: 45, date: 'Dec 19, 2024', weight: '30kg', customer: 'Tech Hub Ltd', location: 'Gudu', lat: 9.0765, lng: 7.3986 },
    { id: 'EGL-2024-004', destination: 'Port Harcourt', status: 'processing', progress: 20, date: 'Dec 20, 2024', weight: '50kg', customer: 'Oil & Gas Co', location: 'Warehouse', lat: 4.7711, lng: 6.9256 },
    { id: 'EGL-2024-005', destination: 'Kano', status: 'pending', progress: 5, date: 'Dec 21, 2024', weight: '35kg', customer: 'Northern Trade', location: 'Pending Pickup', lat: 11.9591, lng: 8.6753 },
  ];

  const statusConfig = {
    delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered', icon: CheckCircle },
    in_transit: { color: 'bg-blue-100 text-blue-700', label: 'In Transit', icon: Truck },
    processing: { color: 'bg-yellow-100 text-yellow-700', label: 'Processing', icon: Clock },
    pending: { color: 'bg-gray-100 text-gray-700', label: 'Pending', icon: AlertCircle },
  };

  const filteredShipments = filterStatus === 'all' ? shipments : shipments.filter(s => s.status === filterStatus);

  const getProgressColor = (status) => {
    const colors = {
      delivered: 'bg-green-500',
      in_transit: 'bg-blue-500',
      processing: 'bg-yellow-500',
      pending: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Shipment Dashboard</h1>
        <p className="text-gray-400">Real-time tracking and management of all logistics operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="text-green-400 text-sm font-semibold">{stat.trend}</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Search */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search shipment ID, customer..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                <Filter className="w-5 h-5" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'in_transit', 'delivered', 'processing', 'pending'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    filterStatus === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Shipments List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Active Shipments</h2>
            {filteredShipments.map(shipment => {
              const statusInfo = statusConfig[shipment.status];
              const StatusIcon = statusInfo.icon;
              return (
                <div 
                  key={shipment.id}
                  onClick={() => setSelectedShipment(selectedShipment?.id === shipment.id ? null : shipment)}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-5 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-white">{shipment.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Customer: <span className="text-white font-medium">{shipment.customer}</span></p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-500 hover:text-blue-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-700">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Destination</p>
                      <p className="text-white font-medium">{shipment.destination}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Weight</p>
                      <p className="text-white font-medium">{shipment.weight}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Ship Date</p>
                      <p className="text-white font-medium">{shipment.date}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-400 text-xs font-medium">Progress</p>
                      <p className="text-blue-400 text-sm font-bold">{shipment.progress}%</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(shipment.status)}`}
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {shipment.location}
                  </div>

                  {selectedShipment?.id === shipment.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 rounded p-3">
                          <p className="text-gray-500 text-xs mb-1">Tracking Number</p>
                          <p className="text-white font-mono text-sm">{shipment.id}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded p-3">
                          <p className="text-gray-500 text-xs mb-1">Coordinates</p>
                          <p className="text-white font-mono text-xs">{shipment.lat}, {shipment.lng}</p>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                        View Full Tracking Details
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Today's Activity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 text-sm">Pickups</span>
                <span className="text-white font-bold text-lg">24</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 text-sm">Deliveries</span>
                <span className="text-white font-bold text-lg">156</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 text-sm">Issues Reported</span>
                <span className="text-orange-400 font-bold text-lg">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Avg Delivery Time</span>
                <span className="text-white font-bold text-lg">3.2h</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">On-Time Rate</span>
                  <span className="text-green-400 font-bold">94.3%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '94.3%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Fleet Utilization</span>
                  <span className="text-blue-400 font-bold">87.6%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: '87.6%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Customer Satisfaction</span>
                  <span className="text-purple-400 font-bold">96.1%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: '96.1%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Alerts
            </h3>
            <div className="space-y-3">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-400 text-sm font-medium mb-1">Delayed Delivery</p>
                <p className="text-gray-400 text-xs">EGL-2024-002 delayed by 2 hours</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm font-medium mb-1">High Temperature</p>
                <p className="text-gray-400 text-xs">Vehicle EGL-VH-045 exceeds temp</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-sm font-medium mb-1">Maintenance Due</p>
                <p className="text-gray-400 text-xs">Vehicle EGL-VH-032 maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}