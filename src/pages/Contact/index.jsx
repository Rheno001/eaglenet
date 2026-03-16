import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import EagleHero from "../../assets/eagle.webp";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 p-8 rounded-3xl hover:bg-gray-50 transition-all duration-300 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none group"
      >
        <span className="text-xl font-black uppercase tracking-tighter text-gray-900 group-hover:text-[#3B1350] transition-colors">{question}</span>
        {isOpen ? <ChevronUp className="w-6 h-6 text-[#3B1350]" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-gray-500 font-medium leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactInput = ({ label, type = "text", placeholder, rows }) => {
  return (
    <div className="relative group space-y-2">
      <label className="block text-sm font-black uppercase tracking-widest text-[#3B1350]">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 resize-none font-medium text-gray-900 placeholder:text-gray-400"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400"
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

export default function Contact() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#3B1350] selection:text-white pt-20 overflow-x-hidden">
      {/* Premium Image Hero Section (Standardized) */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-20 overflow-hidden text-white min-h-[70vh] flex items-center">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: yHero }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
        >
          <img
            src={EagleHero}
            alt="EagleNet Contact"
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
              <span className="text-sm font-black uppercase tracking-widest text-white/80">Support</span>
            </div>
            <h1 className="text-6xl lg:text-[7rem] font-black leading-[0.9] tracking-tighter uppercase text-center mx-auto">
              Get In Touch.
            </h1>
            <p className="text-xl lg:text-2xl font-medium text-white/90 leading-relaxed max-w-4xl mx-auto text-center">
              Have a question or need a custom logistics solution? Our team is here to help 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 lg:py-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-24">

          {/* Contact Details (Left Side) */}
          <div className="lg:w-5/12 space-y-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3B1350]"></div>
                <span className="text-sm font-black uppercase tracking-widest text-[#3B1350]">Contact Info</span>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-black">
                Reach Out <br /> To Us
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-8"
            >
              {[
                { icon: MapPin, title: "Head Office", details: ["Carlin Concept Complex Plot 1483,", "Km 27, Umaru Musa Yar'adua Way Airport Road,", "Abuja, Nigeria", "Tel: +234 803 786 0962", "Tel: +234 810 557 0699"] },
                { icon: MapPin, title: "Lagos Office 1", details: ["8A Lateef Salami Street", "Ajao Estate, Lagos.", "Tel: +234 805 895 1862", "Tel: +234 810 557 0699"] },
                { icon: MapPin, title: "Lagos Sea Operations", details: ["21, Warehouse Road,", "Apapa Lagos.", "Tel: +234 803 786 0962", "Tel: +234 810 557 0699"] },
                { icon: Mail, title: "Email Us", details: ["info@eaglenetnigeria.com", "operations@eaglenetnigeria.com"] }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-[#F9FAFB] flex items-center justify-center group-hover:bg-[#3B1350] group-hover:text-white transition-colors duration-500 shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-black uppercase tracking-tighter text-2xl mb-4 group-hover:text-[#3B1350] transition-colors">{item.title}</h3>
                    <div className="space-y-1">
                      {item.details.map((line, idx) => (
                        <p key={idx} className="text-gray-500 font-medium">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Form (Right Side) */}
          <div className="lg:w-7/12">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-black">Send us a message</h3>
                <p className="text-gray-500 font-medium text-lg">We usually respond within 2 hours.</p>
              </div>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <ContactInput label="First Name" placeholder="John" />
                  <ContactInput label="Last Name" placeholder="Doe" />
                </div>
                <ContactInput label="Email Address" type="email" placeholder="john@example.com" />
                <ContactInput label="Subject" placeholder="Shipping Inquiry" />
                <ContactInput label="Message" rows={5} placeholder="Tell us about your shipment..." />

                <button className="flex items-center gap-8 group pt-4 bg-transparent border-none p-0 cursor-pointer text-left w-auto">
                  <span className="text-3xl font-black uppercase tracking-tighter">Send Message</span>
                  <div className="w-16 h-16 bg-[#3B1350] flex items-center justify-center text-white group-hover:bg-[#4B1D66] transition-all group-hover:scale-110 shrink-0">
                    <Send className="w-6 h-6" />
                  </div>
                </button>
              </form>
            </motion.div>

          </div>
        </div>

        {/* FAQ Area (Centered Below) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-24 lg:pt-40 border-t border-gray-100 max-w-4xl mx-auto"
        >
          <div className="text-center mb-16 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-[#3B1350]"></div>
              <span className="text-sm font-black uppercase tracking-widest text-[#3B1350]">Common Questions</span>
            </div>
            <h3 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter text-black">
              Frequently Asked <br /> Questions
            </h3>
          </div>
          <div className="space-y-4">
            <FAQItem question="How do I track my shipment?" answer="You can track your shipment using the tracking ID provided in your confirmation email. Simply enter it on our homepage tracking tool." />
            <FAQItem question="What are your delivery hours?" answer="We deliver between 8:00 AM and 6:00 PM, Monday through Saturday. Express delivery services may include Sundays." />
            <FAQItem question="Do you offer insurance?" answer="Yes, all shipments are covered by our basic insurance policy. Comprehensive coverage is available for high-value items." />
          </div>
        </motion.div>
      </section>

      {/* Head Office Map */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#3B1350]"></div>
              <span className="text-sm font-black uppercase tracking-widest text-[#3B1350]">Our Location</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-black">
              Find Us Here
            </h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl">
              Carlin Concept Complex Plot 1483, Km 27, Umaru Musa Yar'adua Way Airport Road, Abuja, Nigeria.
            </p>
          </div>
        </div>
        <div className="w-full h-[500px] lg:h-[600px]">
          <iframe
            title="EagleNet Head Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d7.3!3d9.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOSswMCcwMC4wIk4gNyswMCcwMC4wIkU!5e0!3m2!1sen!2sng!4v1!5m2!1sen!2sng&q=Km+27+Airport+Road+Abuja+Nigeria"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
