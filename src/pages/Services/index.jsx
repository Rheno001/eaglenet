import React from "react";

// Example service data
const services = [
  {
    title: "Air Freight",
    desc: "Fast and reliable air cargo solutions to meet your global shipping needs.",
    icon: "✈️",
  },
  {
    title: "Haulage & Distribution",
    desc: "Efficient inland haulage and distribution with a trusted fleet of vehicles.",
    icon: "🚛",
  },
  {
    title: "Ocean Freight",
    desc: "Secure and affordable international shipping via sea routes.",
    icon: "🚢",
  },
  {
    title: "Warehousing",
    desc: "Safe, accessible, and well-equipped storage facilities for your goods.",
    icon: "🏬",
  },
  {
    title: "Custom Clearing",
    desc: "Hassle-free customs clearance services to speed up your trade processes.",
    icon: "🛃",
  },
  {
    title: "General Logistics",
    desc: "End-to-end logistics management tailored to your business.",
    icon: "📦",
  },
];

// Example testimonials
const testimonialsRow1 = [
  { name: "John Doe", text: "EagleNet handled my shipments quickly and professionally!" },
  { name: "Mary Smith", text: "Their warehousing facilities are top-notch and reliable." },
  { name: "Ahmed Musa", text: "Air freight service was fast, efficient, and affordable." },
  { name: "Chioma Okeke", text: "Haulage was smooth and the team was very responsive." },
];

const testimonialsRow2 = [
  { name: "James Lee", text: "Ocean freight was seamless with excellent communication." },
  { name: "Fatima Bello", text: "Their customer service is always friendly and supportive." },
  { name: "Daniel Johnson", text: "Customs clearing was handled effortlessly by EagleNet." },
  { name: "Grace Brown", text: "Best logistics partner I’ve worked with in years." },
];

export default function Services() {
  return (
    <div className="bg-white text-gray-900 min-h-screen py-16 px-6 lg:px-20">
      {/* Page Title */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-600">
          At EagleNet, we provide a wide range of logistics and freight solutions tailored to your needs.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-20">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>

        {/* Row 1 - Left to Right */}
        <div className="overflow-hidden mb-6">
          <div className="flex space-x-6 animate-slide-left">
            {testimonialsRow1.concat(testimonialsRow1).map((t, idx) => (
              <div
                key={`row1-${idx}`}
                className="bg-gray-100 border border-gray-200 rounded-xl p-6 min-w-[300px] shadow-sm"
              >
                <p className="italic mb-3">"{t.text}"</p>
                <h4 className="font-semibold">- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden">
          <div className="flex space-x-6 animate-slide-right">
            {testimonialsRow2.concat(testimonialsRow2).map((t, idx) => (
              <div
                key={`row2-${idx}`}
                className="bg-gray-100 border border-gray-200 rounded-xl p-6 min-w-[300px] shadow-sm"
              >
                <p className="italic mb-3">"{t.text}"</p>
                <h4 className="font-semibold">- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
