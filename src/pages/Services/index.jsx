import React from "react";
import { Truck, Package, Globe, Shield, ArrowRight, Plane, Ship, Home, ClipboardCheck, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import EagleHero from "../../assets/eagle.webp";

export default function Services() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  const solutions = [
    {
      icon: <Home className="w-12 h-12" />,
      title: "Household & Office Removals",
      desc: "We provide efficient household and office relocation services, handling, transportation, and delivery solutions designed to ensure stress-free moving experience.",
      details: [
        "Efficient relocation",
        "Professional handling",
        "Secure transportation",
        "Stress-free moving"
      ]
    },
    {
      icon: <Plane className="w-12 h-12" />,
      title: "Air Freight",
      desc: "Our air freight service provides fast, reliable global shipping with secure handling and tailored solutions designed to meet urgent commercial or personal needs.",
      details: [
        "Global shipping",
        "Secure handling",
        "Tailored solutions",
        "Urgent delivery"
      ]
    },
    {
      icon: <Ship className="w-12 h-12" />,
      title: "Ocean Freight",
      desc: "We deliver reliable ocean freight services with secure handling, flexible schedules, and cost-effective solutions for transporting commercial goods, equipment, or personal effects globally.",
      details: [
        "Flexible schedules",
        "Cost-effective",
        "Commercial goods",
        "Personal effects"
      ]
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Haulage & Distribution",
      desc: "We deliver reliable haulage and distribution services using a modern fleet, skilled drivers, and coordinated logistics to ensure timely transportation of goods nationwide.",
      details: [
        "Modern fleet",
        "Skilled drivers",
        "Coordinated logistics",
        "Nationwide delivery"
      ]
    },
    {
      icon: <ClipboardCheck className="w-12 h-12" />,
      title: "Customs Clearing",
      desc: "We provide fast customs clearing with accurate documentation, duty processing, inspection coordination, and compliance to ensure your goods move smoothly through regulatory procedures.",
      details: [
        "Accurate documentation",
        "Duty processing",
        "Inspection coordination",
        "Regulatory compliance"
      ]
    },
    {
      icon: <Warehouse className="w-12 h-12" />,
      title: "Warehousing",
      desc: "We provide secure, organized warehousing with short and long-term storage, professional handling, inventory management, and efficient distribution solutions tailored to meet your business and personal storage needs.",
      details: [
        "Organized warehousing",
        "Flexible storage",
        "Inventory management",
        "Efficient distribution"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#3B1350] selection:text-white pt-20 overflow-x-hidden">
      {/* Premium Image Hero Section (Standardized) */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-20 overflow-hidden text-white h-[70vh] flex items-center">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: yHero }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
        >
          <img
            src={EagleHero}
            alt="EagleNet Services"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-[#3B1350]/80 mix-blend-multiply z-0"></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-1 bg-white"></div>
              <span className="text-sm font-black uppercase tracking-widest text-white/80">Our Expertise</span>
            </div>
            <h1 className="text-6xl lg:text-[7rem] font-black leading-[0.9] tracking-tighter uppercase text-center mx-auto">
              Advanced Logistics Solutions.
            </h1>
            <p className="text-xl lg:text-2xl font-medium text-white/90 leading-relaxed max-w-4xl mx-auto text-center">
              We Provide Comprehensive, Technology-Driven Infrastructure To Power Your Business Growth Across Global Markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Detailed Grid */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-1">
            {solutions.map((item, idx) => (
              <div key={idx} className="p-12 border border-gray-100 group hover:bg-[#3B1350] transition-colors duration-500">
                <div className="text-[#3B1350] mb-12 transform group-hover:scale-110 group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed mb-12 group-hover:text-white/60 transition-colors">
                  {item.desc}
                </p>
                <div className="space-y-4">
                  {item.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/40 transition-colors">
                      <div className="w-2 h-2 bg-[#3B1350] group-hover:bg-white/40 transition-colors" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 lg:py-40 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
            Not sure which solution <br /> is right for you?
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            Our logistics experts are ready to help you design the perfect supply chain.
          </p>
          <div className="pt-8">
            <Link to="/contact">
              <div className="inline-flex items-center gap-8 group">
                <span className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">Talk To An Expert</span>
                <div className="w-16 h-16 bg-[#3B1350] flex items-center justify-center text-white hover:bg-[#4B1D66] transition-all group-hover:scale-110">
                  <ArrowRight className="w-8 h-8 -rotate-45" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
