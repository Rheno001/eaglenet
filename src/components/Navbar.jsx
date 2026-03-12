import { useState, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/eaglenet-logo-removebg-preview.png";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinksLeft = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
  ];

  const navLinksRight = [
    { name: "Contact Us", path: "/contact" },
    { name: "Get A Quote", path: "/quote" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between w-full h-full relative">
              {/* Left Links */}
              <div className="relative z-10 flex items-center h-full">
                {navLinksLeft.map((link) => (
                  <div key={link.name} className="flex items-center h-full border-r border-gray-100">
                    <Link
                      to={link.path}
                      className="px-8 flex items-center h-full text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-[#3B1350] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Centered Logo Area */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Link to="/" className="flex items-center pointer-events-auto">
                  <img src={logo} alt="EagleNet Logistics" className="h-14 w-auto object-contain" />
                </Link>
              </div>

              {/* Right Links */}
              <div className="relative z-10 flex items-center h-full">
                <div className="h-full border-l border-gray-100"></div>
                {navLinksRight.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="px-8 flex items-center h-full border-r border-gray-100 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-[#3B1350] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}


                {/* Dynamic Auth Section */}
                {user ? (
                  <div className="flex items-center h-full">
                    <Link to={user.role?.toLowerCase() === 'customer' ? '/customer-dashboard' : '/admin-dashboard'} className="h-full">
                      <button className="h-full px-8 bg-gray-50 text-[#3B1350] font-bold text-sm uppercase tracking-widest border-l border-gray-100 hover:bg-gray-100 transition-all">
                        Dashboard
                      </button>
                    </Link>
                    <button 
                      onClick={logout}
                      className="h-full px-8 bg-[#3B1350] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#4B1D66] transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="h-full">
                    <button className="h-full px-10 bg-[#3B1350] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#4B1D66] transition-all">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Logo & Menu Button */}
            <div className="flex md:hidden items-center justify-between w-full">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="EagleNet" className="h-10 w-auto" />
              </Link>
              <button
                className="p-2 text-gray-900"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[300px] bg-white z-[70] md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <img src={logo} alt="EagleNet" className="h-8 w-auto" />
                  <button onClick={() => setIsOpen(false)}>
                    <X className="h-8 w-8 text-gray-900" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pt-6">
                  {[...navLinksLeft, ...navLinksRight].map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-8 py-5 text-lg font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50 hover:text-[#3B1350]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="p-6">
                  {user ? (
                    <div className="space-y-3">
                      <Link 
                        to={user.role?.toLowerCase() === 'customer' ? '/customer-dashboard' : '/admin-dashboard'} 
                        onClick={() => setIsOpen(false)}
                      >
                        <button className="w-full py-5 bg-gray-100 text-[#3B1350] font-black uppercase tracking-widest text-sm hover:bg-gray-200">
                          Dashboard
                        </button>
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full py-5 bg-[#3B1350] text-white font-black uppercase tracking-widest text-sm hover:bg-[#4B1D66]"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-5 bg-[#3B1350] text-white font-black uppercase tracking-widest text-sm hover:bg-[#4B1D66]">
                        Login
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
