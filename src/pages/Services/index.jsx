import React from "react";

const services = [
  {
    title: "Air Freight",
    desc: "Fast and reliable air cargo solutions to meet your global shipping needs.",
    img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Haulage & Distribution",
    desc: "Efficient inland haulage and distribution with a trusted fleet of vehicles.",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Ocean Freight",
    desc: "Secure and affordable international shipping via sea routes.",
    img: "https://images.unsplash.com/photo-1505839673365-e3971f8d9184?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Warehousing",
    desc: "Safe, accessible, and well-equipped storage facilities for your goods.",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Custom Clearing",
    desc: "Hassle-free customs clearance services to speed up your trade processes.",
    img: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "General Logistics",
    desc: "End-to-end logistics management tailored to your business.",
    img: "https://images.unsplash.com/photo-1581092334446-7e0cdfbb679b?auto=format&fit=crop&w=800&q=80",
  },
];

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
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex flex-col items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 px-6 mt-20">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="max-w-2xl mx-auto text-gray-200">
            We move your world — from air to sea, warehousing to delivery.  
            EagleNet ensures your logistics run smoothly, every time.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 lg:px-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our services cover every aspect of logistics, transportation, and freight —  
            ensuring your goods get where they need to be, on time and in perfect condition.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Logistics in Motion</h2>
          <p className="text-gray-600">A glimpse of our operations and network around the world.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-6">
          {[
            "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596402184320-9a6b3aabe3b0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602532291554-c7efb1d64701?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1543257580-7269da7733df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1610986603169-fd8f5784975b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581093808068-9e65f01e4895?auto=format&fit=crop&w=800&q=80",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt="logistics gallery"
              className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-500"
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-screen overflow-hidden relative left-1/2 right-1/2 -mx-[50vw] py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>

        {/* Row 1 - Left to Right */}
        <div className="overflow-hidden mb-8">
          <div className="flex space-x-6 animate-marquee-left w-max">
            {testimonialsRow1.concat(testimonialsRow1).map((t, idx) => (
              <div
                key={`row1-${idx}`}
                className="bg-white border border-gray-200 rounded-xl p-6 w-[320px] shadow-sm"
              >
                <p className="italic mb-3 text-gray-700">"{t.text}"</p>
                <h4 className="font-semibold">- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden">
          <div className="flex space-x-6 animate-marquee-right w-max">
            {testimonialsRow2.concat(testimonialsRow2).map((t, idx) => (
              <div
                key={`row2-${idx}`}
                className="bg-white border border-gray-200 rounded-xl p-6 w-[320px] shadow-sm"
              >
                <p className="italic mb-3 text-gray-700">"{t.text}"</p>
                <h4 className="font-semibold">- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
