import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';
// import jwt_decode from 'jwt-decode';  
import { ROLES } from '../../utils/roles';

export default function Auth() {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '', // Changed from firstName and lastName
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Silent token verification on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      try {
        const res = await axios.post(
          'http://localhost/backend/verify-token.php',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          const userData = res.data.user;
          login(userData, token);
          // Redirect based on role
          if (userData.role === ROLES.USER) navigate('/dashboard');
          else if (userData.role === ROLES.ADMIN) navigate('/dashboard/requests');
          else if (userData.role === ROLES.SUPER_ADMIN) navigate('/dashboard/manage-admins');
        } else {
          localStorage.removeItem('jwt'); // invalid token, clear it
        }
      } catch (err) {
        console.error('Token verification error:', err);
        localStorage.removeItem('jwt');
      }
    };

    verifyToken();
  }, [login, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin
      ? `${import.meta.env.VITE_API_URL}/login.php`
      : `${import.meta.env.VITE_API_URL}/reg.php`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const result = response.data;

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: result.message || (isLogin ? 'Login successful' : 'Registration successful'),
          showConfirmButton: true,
        });

        const userData = {
          email: result.user?.email,
          firstName: result.user?.firstName || 'User',
          lastName: result.user?.lastName || '',
          role: result.user?.role || ROLES.USER,
        };

        if (isLogin) {
          // ✅ Store token persistently
          login(userData, result.token);
          localStorage.setItem('jwt', result.token);

          if (userData.role === ROLES.USER) navigate('/dashboard');
          else if (userData.role === ROLES.ADMIN) navigate('/dashboard/requests');
          else if (userData.role === ROLES.SUPER_ADMIN) navigate('/dashboard/manage-admins');
        } else {
          toggleForm(); // Switch to login form after signup
        }

        setFormData({ firstName: '', lastName: '', email: '', password: '' });
      } else {
        setError(result.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (err) {
      console.error('Server or network error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Server error occurred');
      } else if (err.request) {
        setError('No response from server. Is the backend running at http://localhost:8000?');
      } else {
        setError(err.message || 'Cannot connect to server. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-gray-50 px-4 py-10 text-gray-900">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          {isLogin ? (
            <LogIn className="mx-auto h-10 w-10 text-gray-900" />
          ) : (
            <UserPlus className="mx-auto h-10 w-10 text-gray-900" />
          )}
          <h1 className="text-3xl font-bold mt-3">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin
              ? 'Sign in to continue'
              : 'Join us today to manage your logistics easily'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-gray-900 outline-none"
              />
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-gray-900 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-gray-900 outline-none"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 pr-10 focus:border-gray-900 outline-none"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleForm}
              className="text-gray-900 font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}