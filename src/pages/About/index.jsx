import React, { useState, useEffect } from "react";
import { Users, Globe, Target, Truck, Award, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const CountingNumber = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.substring(0, 3));
    const totalDuration = duration * 1000;
    const incrementTime = totalDuration / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{value.replace(/[0-9]/g, '')}</span>;
}

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

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-900 selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1950&q=80"
            alt="Logistics background"
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
              Beyond <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-white">Borders</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed font-light">
              We're not just moving cargo; we're powering global trade. Connecting businesses to the world through reliable, innovative logistics solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeInWhenVisible>
            <div className="relative">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1596402184320-9a6b3aabe3b0?auto=format&fit=crop&w=1000&q=80"
                  alt="EagleNet warehouse"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gray-900 rounded-full flex items-center justify-center text-white p-6 text-center font-bold text-lg hidden md:flex shadow-xl z-20">
                Since <br /> 2010
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Our Story</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 mb-8 leading-tight">
              From local courier to global powerhouse.
            </h3>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                EagleNet Logistics began with a simple mission: to bring transparency and reliability to an industry often clouded by uncertainty.
              </p>
              <p>
                What started as a small fleet of delivery vans has grown into a comprehensive logistics network spanning continents. We've invested heavily in technology and talent, ensuring that every shipment—whether it's a single document or a full container load—is handled with precision.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} alt="Founder" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-900">Founded by industry veterans</p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "50+", label: "Global Partners" },
              { value: "2M+", label: "Parcels Delivered" },
              { value: "99%", label: "Satisfaction Rate" },
            ].map((stat, idx) => (
              <FadeInWhenVisible key={idx} delay={idx * 0.1}>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold font-heading text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">
                    <CountingNumber value={stat.value} />
                  </div>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "To simplify global trade by providing seamless, technology-driven logistics solutions that empower businesses to scale without borders.",
              color: "bg-blue-50 text-blue-600"
            },
            {
              icon: Globe,
              title: "Our Vision",
              desc: "To be the undisputed leader in African logistics, bridging the gap between local potential and global opportunity through excellence.",
              color: "bg-purple-50 text-purple-600"
            }
          ].map((item, idx) => (
            <FadeInWhenVisible key={idx} delay={idx * 0.2}>
              <div className="group p-10 rounded-[2rem] border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 h-full bg-white relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} rounded-bl-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-8`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 lg:py-32 bg-gray-50 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Why Choose Us</h2>
              <h3 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
                Built on trust, driven by excellence.
              </h3>
            </FadeInWhenVisible>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Reliability", desc: "We don't just make promises; we keep them. Your cargo arrives on time, every time." },
              { icon: Users, title: "Customer First", desc: "Our dedicated support team is available 24/7 to solve problems before they happen." },
              { icon: Award, title: "Excellence", desc: "We adhere to the highest international standards of safety and operational efficiency." },
            ].map((val, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-6">
                    <val.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4">Our Team</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
              Meet the experts behind <br /> the operations.
            </h3>
          </div>
          <button className="group flex items-center font-bold text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
            Join our team <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              role: "Customer Leads",
              img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba3?auto=format&fit=crop&w=400&q=80",
            },
          ].map((member, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl">
                <div className="aspect-3/4 bg-gray-200">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold font-heading">{member.name}</h3>
                  <p className="text-gray-300 text-sm font-medium">{member.role}</p>
                </div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">Ready to streamline your logistics?</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Join thousands of businesses that trust EagleNet for their shipping needs. Global reach, local expertise.
          </p>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl shadow-white/10">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
