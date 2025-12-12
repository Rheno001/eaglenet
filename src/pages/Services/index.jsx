import React from "react";
import { Plane, Ship, Truck, Package, Shield, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const services = [
  {
    title: "Air Freight",
    desc: "Rapid global delivery for time-sensitive cargo. We ensure your goods reach any destination significantly faster than standard shipping methods.",
    img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
    icon: Plane,
    colSpan: "md:col-span-2",
  },
  {
    title: "Ocean Freight",
    desc: "Cost-effective international shipping for large volumes. Secure containers and reliable schedules.",
    img: "https://images.unsplash.com/photo-1505839673365-e3971f8d9184?auto=format&fit=crop&w=800&q=80",
    icon: Ship,
    colSpan: "md:col-span-1",
  },
  {
    title: "Haulage & Distribution",
    desc: "Reliable inland transportation network connecting ports to warehouses and final destinations.",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    icon: Truck,
    colSpan: "md:col-span-1",
  },
  {
    title: "Warehousing",
    desc: "Secure, climate-controlled storage facilities with advanced inventory management systems.",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    icon: Package,
    colSpan: "md:col-span-2",
  },
  {
    title: "Customs Clearing",
    desc: "Expert handling of documentation and regulatory compliance to prevent delays.",
    img: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80",
    icon: Shield,
    colSpan: "md:col-span-1",
  },
  {
    title: "Global Logistics",
    desc: "End-to-end supply chain solutions tailored to your specific business requirements.",
    img: "https://images.unsplash.com/photo-1581092334446-7e0cdfbb679b?auto=format&fit=crop&w=800&q=80",
    icon: Globe,
    colSpan: "md:col-span-2",
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
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-900 selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: yHero }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=1950&q=80"
            alt="Services background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 tracking-tight">
              World-Class <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-white">Solutions</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed font-light">
              From express air freight to complex supply chain management, we deliver excellence at every step of the journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Bento Style) */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">What We Offer</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
              Comprehensive logistics <br /> for the modern world.
            </h3>
          </FadeInWhenVisible>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`${service.colSpan} group relative h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500`}
            >
              <div className="absolute inset-0">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              </div>

              <div className="relative h-full p-8 flex flex-col justify-end">
                <div className="mb-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-gray-900 transition-colors duration-300">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-3">{service.title}</h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">How We Work</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Seamless integration from pickup to delivery.</p>
            </FadeInWhenVisible>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 z-0"></div>

            {[
              { step: "01", title: "Consultation", desc: "We analyze your shipping needs and requirements." },
              { step: "02", title: "Booking", desc: "Seamless scheduling and documentation handling." },
              { step: "03", title: "Transit", desc: "Real-time tracking as your cargo moves globally." },
              { step: "04", title: "Delivery", desc: "Safe arrival at destination, on time and secure." },
            ].map((item, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.1}>
                <div className="relative z-10 bg-gray-50">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center text-2xl font-bold text-gray-900 shadow-lg mb-6 mx-auto group-hover:border-gray-900 transition-colors">
                    {item.step}
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="text-center mb-12 px-6">
          <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Our Operations</h2>
          <h3 className="text-3xl font-bold font-heading text-gray-900">Logistics in Motion</h3>
        </div>

        <div className="flex flex-nowrap space-x-6 overflow-x-auto pb-12 px-6 snap-x">
          {[
            "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596402184320-9a6b3aabe3b0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602532291554-c7efb1d64701?auto=format&fit=crop&w=800&q=80",
          ].map((src, i) => (
            <motion.div
              key={i}
              className="shrink-0 w-[300px] md:w-[400px] aspect-4/3 rounded-2xl overflow-hidden snap-center"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={src}
                alt="logistics gallery"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">Trusted by Global Businesses</h2>
        </div>

        {/* Row 1 */}
        <div className="mb-8 flex space-x-6 animate-marquee-left w-max">
          {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((t, idx) => (
            <div
              key={`row1-${idx}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-[350px] hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-4 h-4 bg-yellow-400 rounded-sm"></div>)}
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-600"></div>
                <h4 className="font-bold text-white">{t.name}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex space-x-6 animate-marquee-right w-max">
          {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((t, idx) => (
            <div
              key={`row2-${idx}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-[350px] hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-4 h-4 bg-yellow-400 rounded-sm"></div>)}
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-600"></div>
                <h4 className="font-bold text-white">{t.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold font-heading text-gray-900 mb-6">Ready to ship?</h2>
        <p className="text-xl text-gray-600 mb-8">Get a competitive quote for your next shipment in minutes.</p>
        <button className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all hover:-translate-y-1 shadow-xl shadow-gray-900/20">
          Request a Quote
        </button>
      </section>
    </div>
  );
}
