import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none group"
      >
        <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactInput = ({ label, type = "text", placeholder, rows }) => {
  return (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-blue-600">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300"
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-900 selection:text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold font-heading mb-6"
          >
            Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-white">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Have a question or need a custom logistics solution? Our team is here to help 24/7.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-500">We usually respond within 2 hours.</p>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ContactInput label="First Name" placeholder="John" />
                <ContactInput label="Last Name" placeholder="Doe" />
              </div>
              <ContactInput label="Email Address" type="email" placeholder="john@example.com" />
              <ContactInput label="Subject" placeholder="Shipping Inquiry" />
              <ContactInput label="Message" rows={5} placeholder="Tell us about your shipment..." />

              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black hover:scale-[1.02] transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 cursor-pointer">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info & FAQ */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-6"
            >
              {[
                { icon: MapPin, title: "Our Office", details: ["123 Logistics Avenue", "Abuja, Nigeria"] },
                { icon: Phone, title: "Phone", details: ["+234 800 123 4567", "+234 800 987 6543"] },
                { icon: Mail, title: "Email", details: ["support@eaglenet.com", "sales@eaglenet.com"] }
              ].map((item, i) => (
                <div key={i} className="flex items-start p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 shadow-sm mr-6 shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                    {item.details.map((line, idx) => (
                      <p key={idx} className="text-gray-600">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" /> FAQ
              </h3>
              <div className="space-y-2">
                <FAQItem question="How do I track my shipment?" answer="You can track your shipment using the tracking ID provided in your confirmation email. Simply enter it on our homepage tracking tool." />
                <FAQItem question="What are your delivery hours?" answer="We deliver between 8:00 AM and 6:00 PM, Monday through Saturday. Express delivery services may include Sundays." />
                <FAQItem question="Do you offer insurance?" answer="Yes, all shipments are covered by our basic insurance policy. Comprehensive coverage is available for high-value items." />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
