import { useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-[#4C3241] text-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/eaglenet-logo.jpg" alt="Eaglenet" className="h-10 w-auto" />
            <span className="font-bold text-xl">Eaglenet</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {["Home", "Services", "Tracking", "About", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-[#A04422] transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-[#4C3241] px-4 pb-4 space-y-2">
            {["Home", "Services", "Tracking", "About", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="block hover:text-[#A04422] transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-r from-[#4C3241] to-[#A04422] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Reliable Logistics, <br /> Powered by{" "}
              <span className="text-[#FFD580]">Eaglenet</span>
            </h1>
            <p className="text-lg text-gray-200">
              Air Freight • Ocean Freight • Haulage • Distribution • Warehousing
            </p>
            <div className="space-x-4">
              <a
                href="#"
                className="px-6 py-3 bg-[#A04422] hover:bg-[#FFD580] text-white hover:text-[#4C3241] rounded-lg shadow-lg transition"
              >
                Get Started
              </a>
              <a
                href="#services"
                className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-[#4C3241] transition"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 mt-10 md:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/eaglenet-logo.jpg"
              alt="Eaglenet Logistics"
              className="w-full max-w-sm mx-auto drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4C3241] text-white text-center py-6 mt-12">
        <p>© {new Date().getFullYear()} Eaglenet Logistic Services. All rights reserved.</p>
      </footer>
    </div>
  );
}
