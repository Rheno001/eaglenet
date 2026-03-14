import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, Globe, Clock, Shield, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from 'framer-motion';
import HeroContainer from "../../assets/CONTAINER.png";
import gemnetwork from "../../assets/gemnetwork.webp";
import iam from "../../assets/iam.webp";
import moverspoe from "../../assets/moverspoe.webp";
import pcg from "../../assets/pcg.webp";

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

export default function LogisticsWebsite() {
    // eslint-disable-next-line no-unused-vars
    const [trackingCode, setTrackingCode] = useState('');
    const { scrollYProgress, scrollY } = useScroll();
    // eslint-disable-next-line no-unused-vars
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax effect for the hero image
    const imageY = useTransform(scrollY, [0, 1000], [0, -300]);

    const handleTrackSubmit = () => {
        if (trackingCode.trim()) {
            alert(`Tracking order: ${trackingCode}`);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTrackSubmit();
        }
    };

    // Rotating hero text state
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const logisticsTerms = ["Delivering", "Logistics", "Shipping", "Forwarding", "Global"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % logisticsTerms.length);
        }, 3000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reviews carousel state
    const reviews = [
        { quote: "EagleNet Has Transformed Our Supply Chain Efficiency, Reducing Delays And Helping Us Serve Customers Better Than Ever.", author: "GlobalMart Inc." },
        { quote: "Their door-to-door delivery service is unmatched. Our goods always arrive on time and in perfect condition.", author: "AgroExpress Ltd." },
        { quote: "Customs clearing used to be a nightmare for us. EagleNet made the whole process seamless and stress-free.", author: "TechHub Imports" },
        { quote: "We've used EagleNet for our warehousing needs for over two years. Professional, organized, and always reliable.", author: "MapleGoods Nigeria" },
    ];
    const [activeReview, setActiveReview] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % reviews.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    const goToPrev = () => setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    const goToNext = () => setActiveReview((prev) => (prev + 1) % reviews.length);

    // eslint-disable-next-line no-unused-vars
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#3B1350] selection:text-white overflow-x-hidden pt-20">
            {/* Hero Section - Premium Logistics Theme */}
            <section className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Part: Background Text + Container Image */}
                    <div className="relative h-[55vh] lg:h-[75vh] flex items-center justify-center">
                        {/* Background Text - Rotating and Repositioned Higher */}
                        <div className="absolute inset-x-0 top-0 lg:top-10 flex items-center justify-center pointer-events-none select-none overflow-hidden h-1/2 max-w-[80vw] mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={logisticsTerms[currentTextIndex]}
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -40, opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="text-[12vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap bg-linear-to-b from-black to-gray-400 bg-clip-text text-transparent"
                                >
                                    {logisticsTerms[currentTextIndex]}
                                </motion.h1>
                            </AnimatePresence>
                        </div>

                        {/* Crane Container Image - Drop In Motion */}
                        <motion.div
                            initial={{ y: -500, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                damping: 8,
                                stiffness: 80,
                                restDelta: 0.001
                            }}
                            className="relative z-10 w-full max-w-3xl"
                        >
                            <motion.img
                                style={{ y: imageY }}
                                src={HeroContainer}
                                alt="EagleNet Shipping Container"
                                className="w-full h-auto drop-shadow-2xl translate-y-2 lg:translate-y-8"
                            />
                        </motion.div>
                    </div>

                    {/* Middle Part: Info Columns */}
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-0 items-start py-20 border-t border-gray-100">
                        <div className="lg:col-span-5 flex flex-col items-start gap-8">
                            <h2 className="text-6xl lg:text-8xl font-black font-heading text-black leading-none uppercase tracking-tighter">
                                Start <br /> Shipping
                            </h2>
                            <Link to="/quote">
                                <div className="w-20 h-20 bg-[#3B1350] flex items-center justify-center text-white hover:bg-[#4B1D66] transition-all group">
                                    <ArrowRight className="w-10 h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform -rotate-45" />
                                </div>
                            </Link>
                        </div>

                        <div className="lg:col-span-1 hidden lg:block h-full border-l border-gray-100 mx-auto"></div>

                        <div className="lg:col-span-6">
                            <p className="text-2xl lg:text-3xl text-gray-500 font-bold leading-relaxed">
                                Eaglenet Logistic Services Ltd is a leading Nigerian logistics company delivering efficient transport solutions across air, sea, and land. Since 2009, we’ve designed smart supply chains that increase speed and reduce cost, making logistics simple, reliable, and stress-free.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Part: Logo Banner (Scrolling Marquee) */}
                <div className="w-full bg-transparent py-8 relative z-20 overflow-hidden flex">
                    <motion.div
                        animate={{ x: [0, "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                        className="flex whitespace-nowrap shrink-0"
                    >
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-24 shrink-0 px-12">
                                {[gemnetwork, iam, moverspoe, pcg].map((logo, idx) => (
                                    <img
                                        key={idx}
                                        src={logo}
                                        alt="Partner Logo"
                                        className="h-16 w-auto object-contain"
                                    />
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>


            {/* Smart Logistics Section */}
            <section className="py-24 lg:py-40 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-[#3B1350]"></div>
                                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Our Solutions</span>
                            </div>
                            <h2 className="text-6xl lg:text-8xl font-black font-heading text-black uppercase tracking-tighter leading-[0.9]">
                                Smart Logistics <br /> For All Businesses
                            </h2>
                        </div>
                        <div className="max-w-md space-y-8">
                            <div className="relative overflow-hidden min-h-32">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={activeReview}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-lg text-gray-500 font-medium leading-relaxed italic border-l-4 border-gray-100 pl-8"
                                    >
                                        "{reviews[activeReview].quote}" — {reviews[activeReview].author}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={goToPrev} className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <ArrowRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button onClick={goToNext} className="w-12 h-12 bg-[#3B1350] flex items-center justify-center hover:bg-[#4B1D66] transition-colors cursor-pointer group">
                                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-100">
                        {[
                            {
                                icon: <Truck className="w-8 h-8" />,
                                title: 'Freight Forwarding',
                                desc: 'End-To-End Freight Management Across Air, Sea, And Land With Reliable Scheduling And Competitive Rates.',
                                path: "/services"
                            },
                            {
                                icon: <Package className="w-8 h-8" />,
                                title: 'Warehousing & Distribution',
                                desc: 'Secure Storage Facilities And Seamless Distribution To Keep Your Inventory Moving Efficiently.',
                                path: "/services"
                            },
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: 'Last-Mile Delivery',
                                desc: 'Fast And Transparent Last-Mile Delivery That Ensures Products Reach Customers On Time, Every Time.',
                                path: "/services"
                            },
                            {
                                icon: <Shield className="w-8 h-8" />,
                                title: 'Customs & Compliance',
                                desc: 'Expert Handling Of Customs Clearance And Regulatory Requirements To Simplify Cross-Border Trade.',
                                path: "/services"
                            }
                        ].map((item, idx) => (
                            <Link key={idx} to={item.path} className="p-10 border-r border-b border-gray-100 transition-colors duration-500 group flex flex-col cursor-pointer bg-white hover:bg-[#3B1350] hover:text-white">
                                <div className="w-12 h-12 flex items-center justify-center mb-40 bg-black text-white group-hover:bg-white group-hover:text-black transition-colors duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black group-hover:text-white transition-colors duration-500">{item.title}</h3>
                                <p className="text-sm font-medium leading-relaxed text-gray-500 group-hover:text-white/80 transition-colors duration-500">
                                    {item.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tailored Logistics Section */}
            <section className="py-24 lg:py-40 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-[#3B1350]"></div>
                                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Our Services</span>
                            </div>
                            <h2 className="text-6xl lg:text-8xl font-black font-heading text-black uppercase tracking-tighter leading-[0.9]">
                                Tailored Logistics <br /> Services For You
                            </h2>
                        </div>
                        <p className="max-w-md text-lg text-gray-500 font-medium leading-relaxed">
                            From Transportation To Supply Chain Optimization, EagleNet Provides End-To-End Services That Help Your Business Move Faster And Smarter.
                        </p>
                        <div className="pt-4">
                            <Link to="/services" className="text-sm font-black uppercase tracking-widest text-[#3B1350] border-b-2 border-[#3B1350] pb-1 hover:text-black hover:border-black transition-all">
                                Explore All Services
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        {[
                            {
                                img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                                title: "Integrated Logistics",
                                num: "01",
                                path: "/services"
                            },
                            {
                                img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
                                title: "Supply Chain",
                                num: "02",
                                path: "/services"
                            },
                            {
                                img: "https://images.unsplash.com/photo-1566576912906-253c7235575a?w=800&q=80",
                                title: "Global Networks",
                                num: "03",
                                path: "/services"
                            }
                        ].map((item, idx) => (
                            <Link key={idx} to={item.path} className="relative aspect-4/5 overflow-hidden group cursor-pointer block">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end text-white">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{item.title}</h3>
                                    <span className="text-xl font-black tracking-widest opacity-60">{item.num}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA / Procedural Section */}
            <section className="py-24 lg:py-40 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative aspect-video lg:aspect-21/9 mb-24 overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1600&q=80"
                            alt="Logistics Background"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute bottom-10 left-10 lg:bottom-20 lg:left-20">
                            <h2 className="text-6xl lg:text-[10vw] font-black font-heading text-white uppercase tracking-tighter leading-none">
                                Ready To Move Your <br /> Business Forward?
                            </h2>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-24 items-end">
                        <div className="space-y-12">
                            <p className="text-2xl text-gray-500 font-bold leading-relaxed">
                                Partner With EagleNet For Fast, Reliable, And Transparent Logistics Solutions That Keep Your Supply Chain Running Smoothly.
                            </p>
                            <Link to="/quote">
                                <div className="flex items-center gap-8 group">
                                    <span className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Get A Free Quote</span>
                                    <div className="w-16 h-16 bg-[#3B1350] flex items-center justify-center text-white hover:bg-[#4B1D66] transition-all group-hover:scale-110">
                                        <ArrowRight className="w-8 h-8 -rotate-45" />
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="space-y-12">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-[#3B1350]"></div>
                                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Simple steps to get started</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { num: '01', title: 'Request Quote', desc: 'Tell us what you need to ship and get instant pricing.' },
                                    { num: '02', title: 'Book Shipment', desc: 'Choose your service level and schedule pickup.' },
                                    { num: '03', title: 'Track & Deliver', desc: 'Monitor your shipment in real-time until it arrives.' }
                                ].map((step, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-sm font-black uppercase tracking-widest">
                                            {step.num}
                                        </div>
                                        <h4 className="text-lg font-black uppercase tracking-tighter">{step.title}</h4>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}