import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, LogOut, User, LayoutDashboard, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/eaglenet-logo-removebg-preview.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const drawerVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/20 border-b border-white/20 py-3"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 z-50 relative group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <img src={Logo} alt="EagleNet Logo" className="w-16 lg:w-20 object-contain relative z-10" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="bg-white/50 backdrop-blur-sm border border-white/60 p-1.5 rounded-full flex items-center shadow-sm mr-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                      ? "text-gray-900 bg-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200/50">
                <Link to="/quote">
                  <button className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors px-2">
                    Get Quote
                  </button>
                </Link>

                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link to="/dashboard">
                      <button className="bg-gray-900 text-white pl-4 pr-5 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium text-sm shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-95 flex items-center gap-2 group">
                        <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full border border-transparent hover:border-red-100"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login">
                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium text-sm shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-95 flex items-center gap-2 group">
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button - Hamburger */}
            <button
              className="md:hidden z-50 p-2 text-gray-600 hover:text-gray-900 relative group"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <div className="absolute inset-0 bg-gray-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              <Menu className="h-6 w-6 relative z-10" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Drawer Header */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold font-heading text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 space-y-6">
                  {navLinks.map((link) => (
                    <motion.div key={link.name} variants={itemVariants}>
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between text-2xl font-bold font-heading group ${location.pathname === link.path ? "text-gray-900" : "text-gray-400"
                          }`}
                      >
                        <span className="group-hover:text-gray-900 transition-colors">{link.name}</span>
                        {location.pathname === link.path && (
                          <motion.div layoutId="activeDot" className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants} className="h-px w-full bg-gray-100 my-6" />

                  {/* Actions */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <Link to="/quote">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <h4 className="font-bold text-gray-900">Get a Quote</h4>
                          <p className="text-sm text-gray-500">Estimate shipping costs</p>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                        </div>
                      </div>
                    </Link>

                    {user ? (
                      <>
                        <Link to="/dashboard">
                          <div className="p-4 rounded-2xl bg-gray-900 text-white flex items-center justify-between group cursor-pointer shadow-lg shadow-gray-900/20 active:scale-95 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/10 rounded-full">
                                <LayoutDashboard className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold">Dashboard</h4>
                                <p className="text-xs text-gray-400">Manage shipments</p>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full p-4 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 rounded-2xl transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link to="/login">
                        <button className="w-full bg-gray-900 text-white p-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95 flex items-center justify-center gap-2">
                          Sign In
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                    )}
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-400">© 2024 EagleNet Logistics</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
