import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/eaglenet-logo-removebg-preview.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

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
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-gray-900 font-medium">
              Services
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
              Contact
            </Link>
            <Link to="/quote">
              <button className="bg-white border border-gray-900 text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
                Get Quote
              </button>
            </Link>

            {/* Auth / Dashboard Buttons */}
            {user ? (
              <>
                <Link to="/dashboard">
                  <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                  SignIn/SignUp
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-200">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900 font-medium">
              Services
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900 font-medium">
              Contact
            </Link>
            <Link to="/quote" onClick={() => setIsOpen(false)}>
              <button className="bg-white border border-gray-900 text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
                Get Quote
              </button>
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium">
                  SignIn/SignUp
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
