import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { LogIn, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, isLoading } = useUser();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || null;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectToDashboard();
    }
  }, [user]);

  const redirectToDashboard = () => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }

    // Redirect based on user type
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const userData = await login(formData.email, formData.password);
      showToast({ type: 'success', title: 'Login successful!' });
      
      // Redirect based on user type or intended destination
      if (from) {
        navigate(from, { replace: true });
      } else {
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
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast({ type: 'error', title: 'Login failed. Please check your credentials.' });
      setErrors({ general: 'Invalid email or password' });
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Image Section - 70% on desktop, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[70%] relative">
        <img
          src="/login.jpg"
          alt="Login"
          className="w-full h-full object-cover"
        />
        {/* Overlay with slogan */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl xl:text-5xl font-bold mb-3">Welcome Back!</h1>
            <p className="text-lg xl:text-xl mb-2">Your Sports Journey Continues Here</p>
            <p className="text-base xl:text-lg opacity-90">Book turfs, join games, and play with passion</p>
          </div>
        </div>
      </div>

      {/* Form Section - 30% on desktop, full width on mobile */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-3 lg:p-4 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm lg:max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-4 lg:mb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg lg:text-2xl">PM</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-600 text-xs lg:text-sm">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
                  <p className="text-red-600 text-sm font-medium">{errors.general}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
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
                    className={`w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
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

              {/* Password Field */}
              <div className="space-y-2">
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
                    className={`w-full pl-12 pr-12 py-3.5 text-sm bg-gray-50/50 border-2 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                      errors.password ? 'border-red-300 bg-red-50/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your password"
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;