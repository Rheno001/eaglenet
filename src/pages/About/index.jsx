import React from "react";
import { Users, Globe, Target, Truck } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex flex-col items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 px-6 mt-20">
          <h1 className="text-5xl font-bold mb-4">About EagleNet Logistics</h1>
          <p className="max-w-2xl mx-auto text-gray-200 text-lg">
            Connecting businesses to the world through reliable and innovative logistics solutions.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            EagleNet Logistics is a trusted name in global freight and logistics management.  
            From our humble beginnings, we’ve grown into a multi-service logistics company providing
            seamless delivery solutions that bridge continents, empower trade, and connect people.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is simple — to make logistics efficient, transparent, and dependable.  
            Whether by air, land, or sea, we move your goods safely, on time, every time.
          </p>
        </div>

        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1596402184320-9a6b3aabe3b0?auto=format&fit=crop&w=1000&q=80"
            alt="EagleNet warehouse"
            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 py-20 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <Target className="h-10 w-10 text-gray-900 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To simplify global logistics through technology, professionalism, and unparalleled customer service.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <Globe className="h-10 w-10 text-gray-900 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To be Africa’s leading logistics provider, connecting people and businesses worldwide through excellence.
            </p>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold mb-8">What Sets Us Apart</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <Truck className="h-10 w-10 text-gray-900 mx-auto mb-4" />,
              title: "Reliable Logistics",
              desc: "We guarantee safe and timely delivery through our optimized transportation network.",
            },
            {
              icon: <Users className="h-10 w-10 text-gray-900 mx-auto mb-4" />,
              title: "Dedicated Team",
              desc: "Our team of experts ensures every consignment is handled with care and precision.",
            },
            {
              icon: <Globe className="h-10 w-10 text-gray-900 mx-auto mb-4" />,
              title: "Global Reach",
              desc: "We serve clients worldwide, ensuring seamless cross-border operations.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 py-20 px-6 lg:px-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our people make the difference — a passionate team of logistics professionals committed to excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Emeka Johnson",
              role: "CEO & Founder",
              img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Amina Bello",
              role: "Head of Operations",
              img: "https://images.unsplash.com/photo-1603415526960-f7e0328ecf1a?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "David Brown",
              role: "Logistics Coordinator",
              img: "https://images.unsplash.com/photo-1603415526859-19dd2ed3f1f3?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Chioma Nwankwo",
              role: "Customer Relations Lead",
              img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba3?auto=format&fit=crop&w=400&q=80",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition text-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Join the EagleNet Network</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6">
          Partner with us for world-class logistics solutions that move your business forward.
        </p>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
          Get Started
        </button>
      </section>
    </div>
  );
}
