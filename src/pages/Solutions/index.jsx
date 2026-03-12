import React from "react";
import { Truck, Package, Globe, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Solutions() {
    const solutions = [
        {
            icon: <Truck className="w-12 h-12" />,
            title: "Freight Forwarding",
            desc: "Our freight forwarding services cover air, sea, and land. We handle everything from documentation to final delivery, ensuring your goods move fast and cost-effectively.",
            details: [
                "Global network coverage",
                "Air, Sea, and Road options",
                "Real-time tracking",
                "Consolidated shipping"
            ]
        },
        {
            icon: <Package className="w-12 h-12" />,
            title: "Warehousing & distribution",
            desc: "Secure, climate-controlled warehousing solutions with strategic distribution hubs to keep your inventory close to your customers.",
            details: [
                "Inventory management",
                "Order fulfillment",
                "Cross-docking",
                "Last-mile integration"
            ]
        },
        {
            icon: <Globe className="w-12 h-12" />,
            title: "Supply Chain Optimization",
            desc: "We analyze your supply chain to identify inefficiencies and implement technology-driven solutions that reduce costs and improve speed.",
            details: [
                "Route optimization",
                "Vendor management",
                "Risk assessment",
                "Digital integration"
            ]
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "Customs & Compliance",
            desc: "Expert handling of complex customs regulations and international trade compliance to prevent delays and ensure smooth border crossings.",
            details: [
                "Import/Export documentation",
                "Tariff classification",
                "Regulatory consulting",
                "Bonded warehousing"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#E40000] selection:text-white pt-20">
            {/* Hero Section */}
            <section className="bg-black py-24 lg:py-40 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                    <h1 className="text-[30vw] font-black uppercase tracking-tighter leading-none select-none">SMART</h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#E40000]"></div>
                            <span className="text-sm font-black uppercase tracking-widest text-white/60">Our Expertise</span>
                        </div>
                        <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                            Advanced <br /> Logistics <br /> Solutions
                        </h1>
                        <p className="text-xl lg:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl">
                            We Provide Comprehensive, Technology-Driven Infrastructure To Power Your Business Growth Across Global Markets.
                        </p>
                    </div>
                </div>
            </section>

            {/* Solutions Detailed Grid */}
            <section className="py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-1">
                        {solutions.map((item, idx) => (
                            <div key={idx} className="p-12 border border-gray-100 group hover:bg-black transition-colors duration-500">
                                <div className="text-[#E40000] mb-12 transform group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 group-hover:text-white transition-colors">{item.title}</h3>
                                <p className="text-lg text-gray-500 font-medium leading-relaxed mb-12 group-hover:text-white/60 transition-colors">
                                    {item.desc}
                                </p>
                                <div className="space-y-4">
                                    {item.details.map((detail, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/40 transition-colors">
                                            <div className="w-2 h-2 bg-[#E40000]" />
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
                                <div className="w-16 h-16 bg-[#E40000] flex items-center justify-center text-white hover:bg-[#C20000] transition-all group-hover:scale-110">
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
