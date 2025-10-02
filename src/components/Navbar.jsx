import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // import Link for navigation
import Logo from "../assets/eaglenet-logo.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b py-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src={Logo} alt="EagleNet Logo" className="w-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link to="/quote" onClick={() => setIsOpen(false)}>
                <button className="bg-white border-[1px] border-gray-900 text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
                  Get Quote
                </button>
              </Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                  SignIn/SignUp
                </button>
              </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
              <Link
                to="/services"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link to="/quote" onClick={() => setIsOpen(false)}>
                <button className="bg-white border-[1px] border-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                  Get Quote
                </button>
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                  SignIn/SignUp
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
