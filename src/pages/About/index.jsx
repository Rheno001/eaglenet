import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Globe, Target, Truck, Award, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroContainer from "../../assets/hero-container-crane.png";
import HaulageServices from "../../assets/haulage-services.webp";
import EagleAbout from "../../assets/eagle-about.jpg";

export default function About() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#3B1350] selection:text-white overflow-x-hidden pt-20">
      {/* Premium Image Hero Section */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-20 overflow-hidden text-white min-h-[70vh] flex items-center">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: yHero }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
        >
          <img
            src={HaulageServices}
            alt="EagleNet Haulage Services"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-[#3B1350]/80 mix-blend-multiply z-0"></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex justify-start">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl lg:max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 bg-[#E31B23]"></div>
              <span className="text-sm font-black uppercase tracking-widest text-white/80">About EagleNet</span>
            </div>
            <h1 className="text-5xl lg:text-[6rem] font-black leading-[0.9] tracking-tighter uppercase mb-8">
              Pioneering <br /> <span className="text-white/70">Logistics.</span>
            </h1>
            <p className="text-lg lg:text-xl font-medium text-white/90 leading-relaxed">
              We leverage advanced technology and a robust global network to redefine supply chain efficiency and reliability for businesses worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 lg:py-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-0 items-start">
            <div className="lg:col-span-5 flex flex-col items-start gap-8">
              <h2 className="text-6xl lg:text-8xl font-black font-heading text-black leading-none uppercase tracking-tighter">
                Our <br /> Story
              </h2>
              <div className="w-full overflow-hidden">
                <img
                  src={EagleAbout}
                  alt="EagleNet About Us"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-1 hidden lg:block h-full border-l border-gray-100 mx-auto"></div>

            <div className="lg:col-span-6 space-y-8">
              <p className="text-base lg:text-lg text-gray-500 font-medium leading-relaxed">
                Eaglenet Logistics Services Ltd is a trusted name in freight forwarding, cargo handling, warehousing, and logistics solutions across Nigeria and beyond. Since our inception, we have remained dedicated to providing fast, efficient, and reliable door-to-door delivery services — ensuring that freight is always fulfilled, on time and with care.
                <br /><br />
                At Eaglenet, we believe logistics is more than just movement — it’s about connecting people, products, and possibilities. With a team of seasoned professionals, modern equipment, and a passion for excellence, we deliver integrated logistics and supply chain solutions tailored to your business needs.
              </p>
              <div className="pt-4">
                <Link to="/services" className="inline-flex items-center gap-4 text-[#3B1350] group">
                  <span className="text-lg font-black uppercase tracking-widest">Our Services</span>
                  <div className="w-10 h-10 bg-black flex items-center justify-center text-white group-hover:bg-[#3B1350] transition-all">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section (Red/Black Style) */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Our Mission</span>
              </div>
              <h3 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                Total Logistics <br /> Management
              </h3>
              <p className="text-xl text-gray-500 font-bold leading-relaxed">
                To give satisfaction, maintaining sentimental values of precious belongings and shouldering total logistics management.
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Our Vision</span>
              </div>
              <h3 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                Excellence In <br /> Technology
              </h3>
              <p className="text-xl text-gray-500 font-bold leading-relaxed">
                To achieve excellence in logistics and transport technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 lg:py-40 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Why Choose Us</span>
              </div>
              <h2 className="text-6xl lg:text-8xl font-black font-heading text-black uppercase tracking-tighter leading-[0.9]">
                The EagleNet <br /> Difference
              </h2>
            </div>
            <p className="max-w-md text-lg text-gray-500 font-medium leading-relaxed">
              We go beyond logistics — delivering trust, expertise, and a commitment to excellence at every step of your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-1 border-t border-l border-gray-100">
            {[
              {
                num: "01",
                title: "Our Value",
                desc: "We provide dependable operational support, including pre-financing when required, to ensure our clients' moving needs are efficiently met and kept on schedule."
              },
              {
                num: "02",
                title: "Experts",
                desc: "Eaglenet is equipped with seasoned experts who bring extensive professional experience, delivering efficient logistics solutions tailored to meet your diverse needs."
              },
              {
                num: "03",
                title: "Customer-Centric Service",
                desc: "Our clients are at the heart of what we do. We listen, understand, and tailor solutions to meet their unique logistics and relocation needs."
              },
              {
                num: "04",
                title: "Professionalism & Excellence",
                desc: "We maintain the highest standards in handling shipments, documentation, packing, delivery, and communication. Ensuring a seamless experience and top notch services to foster complete satisfaction is our initiative here at Eaglenet."
              },
            ].map((item, i) => (
              <div key={i} className="p-12 border-r border-b border-gray-100 group hover:bg-[#3B1350] transition-colors duration-500">
                <span className="text-xs font-black uppercase tracking-widest text-[#3B1350] group-hover:text-white/50 mb-8 block transition-colors">{item.num}</span>
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-6 text-black group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className="py-24 lg:py-40 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-[#3B1350]">Global Network</span>
              </div>
              <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
                Present In <br /> 150+ Countries
              </h2>
              <p className="text-xl text-white/60 font-medium leading-relaxed">
                Our Hubs Are Strategically Located In Every Major Continent, Ensuring That Whether Your Cargo Is Moving From Shanghai To Lagos Or London To New York, It's Always In Safe Hands.
              </p>
              <div className="grid grid-cols-2 gap-8 text-sm font-black uppercase tracking-widest text-[#3B1350]">
                <div className="space-y-4">
                  <p>• 50+ Modern Warehouses</p>
                  <p>• 1,200+ Fleet Vehicles</p>
                </div>
                <div className="space-y-4">
                  <p>• 5,000+ Global Partners</p>
                  <p>• 24/7 Support Hubs</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square border border-white/10 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-[#3B1350]/20 to-transparent"></div>
              <div className="relative z-10 text-center space-y-4">
                <Globe className="w-40 h-40 text-white/10 group-hover:text-[#3B1350]/40 transition-colors duration-700" />
                <span className="block text-xl font-black uppercase tracking-tighter">Connecting The World</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section (Grid Style) */}
      <section className="py-24 lg:py-40 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-[#3B1350]"></div>
              <span className="text-sm font-black uppercase tracking-widest text-gray-900">Our Core Value</span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter">
              Built On Trust
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-500 font-bold leading-relaxed mt-6">
              We believe in treating our valuable clients and customers with ultimate honor, respect, and personal commitment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 border-t border-l border-gray-200">
            {[
              { title: "Reliability", desc: "We don't just make promises; we keep them. Your cargo arrives on time, every time." },
              { title: "Customer First", desc: "Our dedicated support team is available 24/7 to solve problems before they happen." },
              { title: "Excellence", desc: "We adhere to the highest international standards of safety and efficiency." },
            ].map((val, i) => (
              <div key={i} className="p-12 bg-white border-r border-b border-gray-200 group hover:bg-black transition-colors">
                <span className="text-xs font-black uppercase tracking-widest text-[#3B1350] mb-8 block">0{i + 1}</span>
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-6 group-hover:text-white transition-colors">{val.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Premium Style) */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Our Team</span>
              </div>
              <h2 className="text-6xl lg:text-8xl font-black font-heading text-black uppercase tracking-tighter leading-[0.9]">
                Operational <br /> Experts
              </h2>
            </div>
            <p className="max-w-md text-lg text-gray-500 font-medium leading-relaxed">
              Meet The Experts Behind The Operations Ensuring Your Freight Is Handled With Utmost Care And Efficiency At Every Step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { name: "Emeka Johnson", role: "CEO & Founder", img: "/ceo.jpg" },
              { name: "Amina Bello", role: "Head of Operations", img: "https://images.unsplash.com/photo-1670868720765-ad8f6a0e80ab?w=400&q=80" },
              { name: "David Adeola", role: "Logistics Coordinator", img: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&q=80" },
              { name: "Chioma Nwankwo", role: "Customer Leads", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
            ].map((member, i) => (
              <div key={i} className="relative aspect-3/4 overflow-hidden group">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-10 left-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{member.name}</h3>
                  <p className="text-sm font-black uppercase tracking-widest text-[#3B1350]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-40 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-[#3B1350]"></div>
              <span className="text-sm font-black uppercase tracking-widest text-gray-900">FAQ</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "What areas do you serve?", a: "We provide logistics solutions across Nigeria and globally through our network of partners." },
              { q: "How can I track my shipment?", a: "You can track your shipment securely on our website using the Tracking ID provided." },
              { q: "Do you handle custom clearance?", a: "Yes, we handle end-to-end custom clearance and regulatory compliance for cross-border trade." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-8 border border-gray-200">
                <h3 className="text-2xl font-black text-black mb-4">{faq.q}</h3>
                <p className="text-gray-600 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-40 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
            World-Class <br /> Logistics Solutions
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-white/60 font-medium leading-relaxed">
            Connect Your Business To The World With EagleNet. We Move Your Cargo Safely, Efficiently, And On Time.
          </p>
          <div className="pt-8">
            <Link to="/contact">
              <div className="inline-flex items-center gap-8 group">
                <span className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">Get In Touch</span>
                <div className="w-16 h-16 bg-[#3B1350] flex items-center justify-center text-white hover:bg-[#4B1D66] transition-all group-hover:scale-110">
                  <ArrowRight className="w-8 h-8 -rotate-45" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div >
  );
}
