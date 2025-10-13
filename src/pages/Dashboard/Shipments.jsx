import React, { useState } from 'react';
import { MapPin, Package, Clock, CheckCircle, AlertCircle, Download, Eye, Filter, Search, TrendingUp, Truck, Phone, Mail, Star, Calendar, Zap } from 'lucide-react';

export default function CustomerShipmentDashboard() {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [expandedTracking, setExpandedTracking] = useState(null);

  // Customer info
  const customer = {
    name: 'John Okafor',
    email: 'john.okafor@email.com',
    phone: '+234 801 234 5678',
    rating: 4.8,
    totalShipments: 47
  };

  // Customer's shipments
  const shipments = [
    { 
      id: 'EGL-2024-001', 
      destination: 'Lagos', 
      status: 'delivered', 
      progress: 100, 
      date: 'Dec 15, 2024', 
      weight: '25kg',
      origin: 'Abuja',
      estimatedDelivery: 'Dec 15, 2024 - Completed',
      actualDelivery: 'Dec 15, 2024 at 2:30 PM',
      cost: '₦5,500',
      trackingSteps: [
        { step: 'Order Placed', date: 'Dec 13, 2024 10:00 AM', completed: true },
        { step: 'Package Picked Up', date: 'Dec 13, 2024 3:45 PM', completed: true },
        { step: 'In Transit', date: 'Dec 14, 2024 8:00 AM', completed: true },
        { step: 'Out for Delivery', date: 'Dec 15, 2024 9:30 AM', completed: true },
        { step: 'Delivered', date: 'Dec 15, 2024 2:30 PM', completed: true }
      ]
    },
    { 
      id: 'EGL-2024-005', 
      destination: 'Ibadan', 
      status: 'in_transit', 
      progress: 68, 
      date: 'Dec 18, 2024', 
      weight: '40kg',
      origin: 'Lagos',
      estimatedDelivery: 'Dec 19, 2024 - Expected',
      actualDelivery: 'In Transit',
      cost: '₦8,200',
      trackingSteps: [
        { step: 'Order Placed', date: 'Dec 17, 2024 11:00 AM', completed: true },
        { step: 'Package Picked Up', date: 'Dec 17, 2024 4:15 PM', completed: true },
        { step: 'In Transit', date: 'Dec 18, 2024 6:00 AM', completed: true },
        { step: 'Out for Delivery', date: 'Dec 19, 2024 8:00 AM', completed: false },
        { step: 'Delivered', date: 'Pending', completed: false }
      ]
    },
    { 
      id: 'EGL-2024-008', 
      destination: 'Port Harcourt', 
      status: 'processing', 
      progress: 25, 
      date: 'Dec 20, 2024', 
      weight: '30kg',
      origin: 'Abuja',
      estimatedDelivery: 'Dec 21, 2024 - Expected',
      actualDelivery: 'Pending',
      cost: '₦7,100',
      trackingSteps: [
        { step: 'Order Placed', date: 'Dec 20, 2024 9:30 AM', completed: true },
        { step: 'Package Picked Up', date: 'Pending', completed: false },
        { step: 'In Transit', date: 'Pending', completed: false },
        { step: 'Out for Delivery', date: 'Pending', completed: false },
        { step: 'Delivered', date: 'Pending', completed: false }
      ]
    },
  ];

  const statusConfig = {
    delivered: { color: 'bg-green-100 text-green-700', bgLight: 'bg-green-50', label: 'Delivered', icon: CheckCircle, accentColor: 'text-green-600' },
    in_transit: { color: 'bg-blue-100 text-blue-700', bgLight: 'bg-blue-50', label: 'In Transit', icon: Truck, accentColor: 'text-blue-600' },
    processing: { color: 'bg-yellow-100 text-yellow-700', bgLight: 'bg-yellow-50', label: 'Processing', icon: Clock, accentColor: 'text-yellow-600' },
  };

  const getProgressColor = (status) => {
    const colors = {
      delivered: 'bg-green-500',
      in_transit: 'bg-blue-500',
      processing: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Shipments</h1>
        <p className="text-gray-600">Track and manage all your deliveries</p>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              JO
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-gray-600">{customer.totalShipments} Total Shipments</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-900">{customer.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-900 font-medium">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-gray-900 font-medium">{customer.phone}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Processing</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by tracking number..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Shipments</h2>
        
        {shipments.map(shipment => {
          const statusInfo = statusConfig[shipment.status];
          const StatusIcon = statusInfo.icon;
          const isExpanded = expandedTracking === shipment.id;

          return (
            <div 
              key={shipment.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Main Card */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl font-bold text-gray-900">{shipment.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{shipment.origin} → {shipment.destination}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedTracking(isExpanded ? null : shipment.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600 text-sm font-medium">Delivery Progress</p>
                    <p className="text-blue-600 text-sm font-bold">{shipment.progress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(shipment.status)}`}
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Weight</p>
                    <p className="text-gray-900 font-semibold">{shipment.weight}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Ordered Date</p>
                    <p className="text-gray-900 font-semibold">{shipment.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Shipping Cost</p>
                    <p className="text-gray-900 font-semibold">{shipment.cost}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Estimated Delivery</p>
                    <p className="text-gray-900 font-semibold text-sm">{shipment.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Tracking Details */}
              {isExpanded && (
                <div className={`${statusInfo.bgLight} border-t border-gray-200 p-6`}>
                  <h3 className={`text-lg font-bold ${statusInfo.accentColor} mb-6`}>Tracking Timeline</h3>
                  
                  <div className="space-y-6">
                    {shipment.trackingSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            step.completed 
                              ? `${statusInfo.color} border-current` 
                              : 'border-gray-300 bg-gray-100'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            )}
                          </div>
                          {idx < shipment.trackingSteps.length - 1 && (
                            <div className={`w-0.5 h-12 my-2 ${step.completed ? statusInfo.color.split(' ')[0] : 'bg-gray-300'}`}></div>
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={`font-semibold mb-1 ${step.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                            {step.step}
                          </p>
                          <p className="text-sm text-gray-600">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 pt-6 border-t border-gray-300">
                    <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
                      📞 Contact Support
                    </button>
                    <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
                      ⬇️ Download Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How long does delivery take?</h3>
            <p className="text-gray-600 text-sm">Most deliveries take 2-3 business days depending on your location.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change delivery address?</h3>
            <p className="text-gray-600 text-sm">Contact our support team within 1 hour of placing your order.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What if my package is delayed?</h3>
            <p className="text-gray-600 text-sm">We provide automatic alerts and compensation for significant delays.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How do I track my shipment?</h3>
            <p className="text-gray-600 text-sm">Use your tracking ID above to get real-time updates on your delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}