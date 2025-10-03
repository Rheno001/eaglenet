import React from "react";
import Logo from "../assets/eaglenet-logo-removebg-preview.png";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <img src={Logo} alt="EagleNet Logo" className="w-20" />
            </div>
            <p className="text-gray-400">Movers, that's who we are</p>
          </div>

          {/* Links */}
          {[
            {
              title: "Company",
              links: ["About Us", "Terms & Conditions", "Privacy Policy"],
            },
            {
              title: "Services",
              links: [
                "Freight Forwarding",
                "Warehousing",
                "Express Delivery",
                "Customs",
              ],
            },
            {
              title: "Support",
              links: ["Help Center", "Track Shipment", "Get Quote", "Contact"],
            },
          ].map((section, index) => (
            <div
              key={index}
              className="flex flex-col items-center md:items-start"
            >
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} EagleNet Logistic Services. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
