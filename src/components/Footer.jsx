import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/eaglenet-logo-removebg-preview.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Freight Forwarding", path: "/services" },
        { name: "Custom Clearance", path: "/services" },
        { name: "Haulage", path: "/services" },
        { name: "All Services", path: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Our Journey", path: "/about" },
        { name: "Our Team", path: "/about" },
        { name: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "Get a Quote", path: "/quote" },
        { name: "Tracking", path: "/customer-dashboard/track" },
        { name: "Site Planning", path: "/planning" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Integrated Logistics", path: "/solutions" },
        { name: "Supply Chain", path: "/solutions" },
        { name: "Global Networks", path: "/solutions" },
        { name: "All Solutions", path: "/solutions" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand Area */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center mb-8">
              <img src={logo} alt="EagleNet Logistics" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
              Moving freight with care. We combine tracking, a reliable fleet, and a global network to ensure your business runs smoothly.
            </p>
          </div>

          {/* Links Area */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-500 hover:text-[#3B1350] transition-colors text-sm font-bold uppercase tracking-wider"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            © {currentYear} EagleNet. All Rights Reserved.
          </div>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link to="/privacy" className="hover:text-[#3B1350] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#3B1350] transition-colors">Terms Of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
