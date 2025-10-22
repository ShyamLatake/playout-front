import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { UserType } from '../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, register, isLoading } = useUser();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'normal_user' as UserType
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectToDashboard();
    }
  }, [user]);

  const redirectToDashboard = () => {
    switch (user?.userType) {
      case 'admin':
        navigate('/admin-dashboard', { replace: true });
        break;
      case 'turf_owner':
        navigate('/turf-dashboard', { replace: true });
        break;
      case 'normal_user':
        navigate('/my-dashboard', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const userData = await register({
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        sports: [],
        rating: 0
      });
      showToast({ type: 'success', title: 'Registration successful! Welcome to Playmate!' });
      
      // Redirect based on user type
      switch (userData.userType) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'turf_owner':
          navigate('/turf-dashboard', { replace: true });
          break;
        case 'normal_user':
          navigate('/my-dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast({ type: 'error', title: 'Registration failed. Please try again.' });
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Image Section - 70% on desktop, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[70%] relative">
        <img
          src="/signup.jpg"
          alt="Sign Up"
          className="w-full h-full object-cover"
        />
        {/* Overlay with slogan */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl xl:text-5xl font-bold mb-3">Join the Game!</h1>
            <p className="text-lg xl:text-xl mb-2">Start Your Sports Adventure Today</p>
            <p className="text-base xl:text-lg opacity-90">Connect with players, discover turfs, and play your heart out</p>
          </div>
        </div>
      </div>

      {/* Form Section - 30% on desktop, full width on mobile */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-3 lg:p-4 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm lg:max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-3 lg:mb-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-lg lg:text-2xl">PM</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Join Playmate</h2>
            <p className="text-gray-600 text-xs lg:text-sm">Create your account to get started</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-5 lg:p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-3">
                  <p className="text-red-600 text-xs font-medium">{errors.general}</p>
                </div>
              )}

              {/* User Type Selection */}
              <div className="space-y-1.5">
                <label htmlFor="userType" className="block text-sm font-semibold text-gray-800">
                  Account Type
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-sm bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
                >
                  <option value="normal_user">🏃‍♂️ Player</option>
                  <option value="turf_owner">🏟️ Turf Owner</option>
                </select>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                      errors.name ? 'border-red-300 bg-red-50/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                      errors.email ? 'border-red-300 bg-red-50/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                      errors.phone ? 'border-red-300 bg-red-50/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                      errors.password ? 'border-red-300 bg-red-50/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
                >
                  Sign in now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;