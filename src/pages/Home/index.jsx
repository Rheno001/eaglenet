import React, { useState } from 'react';
import { Search, Package, Truck, Globe, Clock, Shield, ArrowRight, Menu, X } from 'lucide-react';

export default function LogisticsWebsite() {
  const [trackingCode, setTrackingCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTrackSubmit = () => {
    if (trackingCode.trim()) {
      alert(`Tracking order: ${trackingCode}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrackSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-gray-100 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                  Trusted by 10,000+ businesses
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ship faster,
                <br />
                deliver better
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Global logistics solutions that scale with your business. Track shipments in real-time and experience seamless delivery.
              </p>

              {/* Tracking Input */}
              <div className="relative">
                <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-2 focus-within:border-gray-900 transition-colors">
                  <Search className="h-5 w-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-900 placeholder-gray-400"
                  />
                  <button
                    onClick={handleTrackSubmit}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center space-x-2"
                  >
                    <span>Track</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>150+ countries</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                  alt="Logistics warehouse"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">99.8%</div>
                <div className="text-sm text-gray-600">On-time delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500K+', label: 'Shipments' },
              { number: '150+', label: 'Countries' },
              { number: '24/7', label: 'Support' },
              { number: '15+', label: 'Years' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to ship globally
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8" />,
                title: 'Freight Forwarding',
                description: 'Air, sea, and land freight with competitive rates and reliable transit times.'
              },
              {
                icon: <Package className="h-8 w-8" />,
                title: 'Warehousing',
                description: 'Secure storage facilities with advanced inventory management systems.'
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: 'Express Delivery',
                description: 'Fast-track shipping for urgent deliveries with guaranteed times.'
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: 'Global Network',
                description: 'Extensive worldwide coverage with local expertise in every market.'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Customs Clearance',
                description: 'Expert handling of international shipping documentation and regulations.'
              },
              {
                icon: <Search className="h-8 w-8" />,
                title: 'Real-Time Tracking',
                description: 'Monitor your shipments 24/7 with detailed location and status updates.'
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition-all cursor-pointer"
              >
                <div className="mb-4 text-gray-900">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <div className="mt-4 flex items-center text-gray-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Request a Quote',
                description: 'Tell us what you need to ship and where. Get instant pricing for your shipment.'
              },
              {
                step: '02',
                title: 'Book Your Shipment',
                description: 'Choose your service level and schedule pickup at your convenience.'
              },
              {
                step: '03',
                title: 'Track & Deliver',
                description: 'Monitor your shipment in real-time until it reaches its destination.'
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-gray-200 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900 rounded-3xl p-12 lg:p-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to ship with us?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses that trust EagleNet for their logistics needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg">
                Get Started
              </button>
              <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all font-semibold text-lg">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}