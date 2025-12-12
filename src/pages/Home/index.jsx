import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, Globe, Clock, Shield, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from 'framer-motion';

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
    const [trackingCode, setTrackingCode] = useState('');
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-gray-900 selection:text-white overflow-x-hidden">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] lg:w-[800px] h-[300px] lg:h-[800px] bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[200px] lg:w-[600px] h-[200px] lg:h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="space-y-8 lg:space-y-10 text-center lg:text-left"
                        >
                            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 lg:px-4 lg:py-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs lg:text-sm font-medium text-gray-600">The world's most trusted logistics partner</span>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-8xl font-heading font-bold text-gray-900 leading-[1.1] lg:leading-[0.95] tracking-tight">
                                Ship faster, <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-500">
                                    deliver better.
                                </span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Seamless global logistics solutions designed to scale with your business. Real-time tracking, 24/7 support, and guaranteed delivery times.
                            </motion.p>

                            {/* Tracking Input */}
                            <motion.div variants={itemVariants} className="relative max-w-lg mx-auto lg:mx-0">
                                <div className="flex flex-col sm:flex-row items-center bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 rounded-2xl p-2 focus-within:ring-2 ring-gray-900/5 transition-all">
                                    <div className="hidden sm:block pl-4 text-gray-400">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter tracking number"
                                        value={trackingCode}
                                        onChange={(e) => setTrackingCode(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full sm:flex-1 bg-transparent px-4 py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder-gray-400 focus:outline-none border-none ring-0 focus:ring-0 text-center sm:text-left"
                                    />
                                    <button
                                        onClick={handleTrackSubmit}
                                        className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 sm:py-4 rounded-xl hover:bg-black transition-all font-medium flex items-center justify-center space-x-2 group mt-2 sm:mt-0"
                                    >
                                        <span>Track</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-8 pt-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://randomuser.me/api/portraits/men/${i * 10}.jpg`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Trusted by 10,000+ businesses</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Image - Made visible on mobile but simplified */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative h-[400px] lg:h-[700px] hidden sm:block"
                        >
                            <div className="absolute inset-0 bg-gray-900 rounded-4xl lg:rounded-[3rem] rotate-3 opacity-5"></div>
                            <div className="relative h-full rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                                    alt="Logistics warehouse"
                                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent"></div>

                                {/* Floating Card */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute bottom-6 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 lg:p-8 rounded-2xl text-white"
                                >
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-gray-300 mb-1 lg:mb-2 text-sm lg:text-base">Total Deliveries</p>
                                            <p className="text-3xl lg:text-4xl font-bold font-heading">2.4M+</p>
                                        </div>
                                        <div className="h-10 w-10 lg:h-12 lg:w-12 bg-white rounded-full flex items-center justify-center text-gray-900">
                                            <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 -rotate-45" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 lg:py-20 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
                        {[
                            { number: '500K+', label: 'Shipments Completed' },
                            { number: '150+', label: 'Countries Served' },
                            { number: '24/7', label: 'Support Available' },
                            { number: '99%', label: 'On-Time Delivery' },
                        ].map((stat, index) => (
                            <FadeInWhenVisible key={index} delay={index * 0.1}>
                                <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="text-4xl lg:text-6xl font-bold font-heading mb-2 lg:mb-3 text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">
                                        <CountingNumber value={stat.number} />
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-400 font-medium group-hover:text-white transition-colors">{stat.label}</div>
                                </div>
                            </FadeInWhenVisible>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20">
                        <FadeInWhenVisible>
                            <span className="text-gray-500 font-semibold tracking-wider uppercase text-xs lg:text-sm">Our Services</span>
                            <h2 className="text-3xl lg:text-5xl font-bold font-heading text-gray-900 mt-3 mb-4 lg:mb-6">
                                Everything you need to ship globally
                            </h2>
                            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                                Comprehensive logistics solutions designed for modern businesses, from warehousing to last-mile delivery.
                            </p>
                        </FadeInWhenVisible>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                icon: <Truck className="h-6 w-6 lg:h-8 lg:w-8" />,
                                title: 'Freight Forwarding',
                                description: 'Air, sea, and land freight with competitive rates and reliable transit times.'
                            },
                            {
                                icon: <Package className="h-6 w-6 lg:h-8 lg:w-8" />,
                                title: 'Warehousing',
                                description: 'Secure storage facilities with advanced inventory management systems.'
                            },
                            {
                                icon: <Clock className="h-6 w-6 lg:h-8 lg:w-8" />,
                                title: 'Express Delivery',
                                description: 'Fast-track shipping for urgent deliveries with guaranteed times.'
                            },
                            {
                                icon: <Globe className="h-6 w-6 lg:h-8 lg:w-8" />,
                                title: 'Global Network',
                                description: 'Extensive worldwide coverage with local expertise in every market.'
                            },
                            {
                                icon: <Shield className="h-6 w-6 lg:h-8 lg:w-8" />,
                                title: 'Customs Clearance',
                                description: 'Expert handling of international shipping documentation and regulations.'
                            },
                            {
                                icon: <Search className="h-6 w-6 lg:h-8 lg:w-8" />,
                                title: 'Real-Time Tracking',
                                description: 'Monitor your shipments 24/7 with detailed location and status updates.'
                            },
                        ].map((service, index) => (
                            <FadeInWhenVisible key={index} delay={index * 0.1}>
                                <div
                                    className="group h-full p-6 lg:p-10 bg-white rounded-2xl lg:rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                                    <div className="relative z-10">
                                        <div className="mb-6 lg:mb-8 inline-flex p-3 lg:p-4 bg-gray-50 rounded-xl lg:rounded-2xl group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-bold font-heading text-gray-900 mb-3 lg:mb-4">{service.title}</h3>
                                        <p className="text-gray-600 leading-relaxed mb-6 lg:mb-8 text-sm lg:text-base">{service.description}</p>
                                        <div className="flex items-center text-gray-900 font-medium group-hover:translate-x-2 transition-transform text-sm lg:text-base">
                                            Learn more <ArrowRight className="h-4 w-4 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </FadeInWhenVisible>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <FadeInWhenVisible>
                            <div className="relative order-2 lg:order-1">
                                <div className="aspect-4/3 rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1566576912906-253c7235575a?w=800&q=80"
                                        alt="Shipping process"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Floating Play Button (Decorative) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 lg:w-20 lg:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 fill-gray-900 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </FadeInWhenVisible>

                        <div className="space-y-8 lg:space-y-12 order-1 lg:order-2">
                            <FadeInWhenVisible delay={0.2}>
                                <h2 className="text-3xl lg:text-5xl font-bold font-heading text-gray-900 mb-4 lg:mb-6 leading-tight">
                                    Simple steps to <br /> get started
                                </h2>
                                <p className="text-lg lg:text-xl text-gray-600">
                                    We've streamlined the shipping process to make it as easy as possible for you to get your goods where they need to go.
                                </p>
                            </FadeInWhenVisible>

                            <div className="space-y-6 lg:space-y-8">
                                {[
                                    {
                                        step: '01',
                                        title: 'Request a Quote',
                                        description: 'Tell us what you need to ship and where. Get instant pricing.'
                                    },
                                    {
                                        step: '02',
                                        title: 'Book Your Shipment',
                                        description: 'Choose your service level and schedule pickup at your convenience.'
                                    },
                                    {
                                        step: '03',
                                        title: 'Track & Deliver',
                                        description: 'Monitor your shipment in real-time untill it arrives safely.'
                                    },
                                ].map((item, index) => (
                                    <FadeInWhenVisible key={index} delay={0.3 + (index * 0.1)}>
                                        <div className="flex gap-4 lg:gap-6 group">
                                            <div className="shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gray-50 flex items-center justify-center text-lg lg:text-xl font-bold text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                                {item.step}
                                            </div>
                                            <div>
                                                <h3 className="text-lg lg:text-xl font-bold font-heading text-gray-900 mb-1 lg:mb-2">{item.title}</h3>
                                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{item.description}</p>
                                            </div>
                                        </div>
                                    </FadeInWhenVisible>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <FadeInWhenVisible>
                        <div className="relative rounded-4xl lg:rounded-[3rem] bg-gray-900 overflow-hidden px-6 py-12 lg:p-24 text-center">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-gray-800 to-gray-950 opacity-90"></div>

                            <div className="relative z-10 max-w-3xl mx-auto space-y-6 lg:space-y-8">
                                <h2 className="text-3xl lg:text-6xl font-bold font-heading text-white leading-tight">
                                    Ready to streamline your logistics?
                                </h2>
                                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                                    Join thousands of businesses that trust EagleNet for their shipping needs. Get started today.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 lg:pt-8 w-full sm:w-auto">
                                    <button className="w-full sm:w-auto bg-white text-gray-900 px-8 lg:px-10 py-4 lg:py-5 rounded-xl hover:bg-gray-100 transition-all font-bold text-base lg:text-lg shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1">
                                        Get Started Now
                                    </button>
                                    <Link
                                        to="/contact"
                                        className="w-full sm:w-auto bg-transparent text-white border-2 border-white/20 px-8 lg:px-10 py-4 lg:py-5 rounded-xl hover:bg-white/10 transition-all font-bold text-base lg:text-lg backdrop-blur-sm"
                                    >
                                        Contact Sales
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>
        </div>
    );
}