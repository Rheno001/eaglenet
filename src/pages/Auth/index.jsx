import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';
import logo from "../../assets/eaglenet-logo-removebg-preview.png";

export default function Auth() {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Silent token verification
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.status === 'success' && res.data.data) {
          const userData = res.data.data;
          login(userData, token);
          const redirectPath = userData.role?.toLowerCase() === 'customer' ? '/customer-dashboard' : '/admin-dashboard';
          if (userData.role) navigate(redirectPath);
        }
      } catch (err) {
        console.error('Token verification error:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
        }
      }
    };
    verifyToken();
  }, [login, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return setError('Please enter your email address');
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/forgot-password.php`,
        { email: forgotEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const result = response.data;
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: result.message || 'Password reset link has been sent to your email.',
        });
        setForgotEmail('');
        setShowForgot(false);
      } else {
        setError(result.message || 'Failed to send reset email.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Could not connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin
      ? `${import.meta.env.VITE_API_URL}/api/auth/login`
      : `${import.meta.env.VITE_API_URL}/api/auth/register`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
      };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      const result = response.data;

      const token = result.token || result.accessToken || result.data?.token;
      const isSuccess = result.success === true || result.status === 'success' || !!token;

      if (isSuccess) {
        const source = result.user || result.data?.user || result.data || {};
        const userData = {
          id: source.id,
          email: source.email,
          firstName: source.firstName || 'User',
          lastName: source.lastName || '',
          phone: source.phoneNumber || source.phone || '',
          role: source.role || ROLES.USER,
          outstandingBalance: source.outstandingBalance || '0.00',
        };

        login(userData, token);
        localStorage.setItem('jwt', token);

        Swal.fire({
          icon: 'success',
          title: isLogin ? 'Welcome back!' : 'Account Created!',
          text: result.message || (isLogin ? 'Login successful' : 'Registration successful'),
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          const redirectPath = userData.role?.toLowerCase() === 'customer' ? '/customer-dashboard' : '/admin-dashboard';
          navigate(redirectPath);
        });

        setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
      } else {
        setError(result.message || result.error || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (err) {
      console.error('Server error:', err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to connect to the server. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-sans selection:bg-[#3B1350] selection:text-white pt-20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#3B1350]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#3B1350]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex justify-center">
        {/* Auth Card Only */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 rounded-3xl"
        >
          <div className="mb-10 text-center">
            <div className="mb-10 flex justify-center">
              <Link to="/">
                <img src={logo} alt="EagleNet" className="h-12 w-auto" />
              </Link>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-4">
              {showForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 font-medium">
              {showForgot
                ? 'Enter your email to receive a reset link.'
                : isLogin
                  ? 'Sign in to access your dashboard'
                  : 'Join the EagleNet logistics network'}
            </p>
          </div>

          {showForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3B1350]">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 rounded-xl"
                />
              </div>
              {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between group bg-[#3B1350] text-white p-2 pl-8 rounded-xl font-bold transition-all hover:bg-[#4B1D66] disabled:opacity-50"
              >
                <span className="uppercase tracking-widest mt-1">{loading ? 'Sending...' : 'Send Link'}</span>
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-all rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full text-center text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#3B1350] transition-colors"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#3B1350]">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="John"
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#3B1350]">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Doe"
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[#3B1350]">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. +234 800 000 0000"
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 rounded-xl"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#3B1350]">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 rounded-xl"
                />
              </div>

              <div className="relative space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-[#3B1350]">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#3B1350] transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#3B1350] outline-none transition-all duration-300 font-medium text-gray-900 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B1350] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between group bg-[#3B1350] text-white p-2 pl-8 rounded-xl font-bold transition-all hover:bg-[#4B1D66] disabled:opacity-50"
              >
                <span className="uppercase tracking-widest mt-1">{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-all rounded-lg">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#3B1350] transition-colors group"
                >
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <span className="ml-2 text-[#3B1350] group-hover:underline">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
