import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import {
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
} from "lucide-react";
import { UserType, Sport as SportType } from "../types";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, register, isLoading } = useUser();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "normal_user" as UserType,
    sports: [] as SportType[],
    businessName: "",
    businessAddress: "",
    businessPhone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectToDashboard();
    }
  }, [user]);

  const redirectToDashboard = () => {
    switch (user?.userType) {
      case "admin":
        navigate("/admin-dashboard", { replace: true });
        break;
      case "turf_owner":
        navigate("/turf-dashboard", { replace: true });
        break;
      case "coach":
        navigate("/coach-dashboard", { replace: true });
        break;
      case "normal_user":
        navigate("/my-dashboard", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Step 1: Account type validation (always valid if userType is set)
      if (!formData.userType) {
        newErrors.userType = "Please select an account type";
      }
    } else if (step === 2) {
      // Step 2: Personal information validation
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      // Phone is optional, but if provided, validate it
      if (
        formData.phone &&
        !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ""))
      ) {
        newErrors.phone = "Please enter a valid phone number";
      }
    } else if (step === 3) {
      // Step 3: Business details validation (for turf_owner and coach)
      if (formData.userType === "turf_owner" || formData.userType === "coach") {
        if (!formData.businessName.trim()) {
          newErrors.businessName = `Business name is required for ${
            formData.userType === "turf_owner" ? "turf owners" : "coaches"
          }`;
        } else if (formData.businessName.trim().length < 2) {
          newErrors.businessName =
            "Business name must be at least 2 characters";
        }

        if (
          formData.businessAddress &&
          formData.businessAddress.trim().length < 5
        ) {
          newErrors.businessAddress =
            "Business address must be at least 5 characters";
        }

        if (
          formData.businessPhone &&
          !/^[+]?[1-9][\d]{0,15}$/.test(
            formData.businessPhone.replace(/\D/g, "")
          )
        ) {
          newErrors.businessPhone =
            "Please enter a valid business phone number";
        }
      }
    } else if (step === 4) {
      // Step 4: Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Validate all steps
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        // Skip business details step if user is not turf_owner or coach
        if (
          currentStep === 2 &&
          formData.userType !== "turf_owner" &&
          formData.userType !== "coach"
        ) {
          setCurrentStep(4); // Skip to password step
        } else {
          setCurrentStep(currentStep + 1);
        }
        // Clear errors when moving to next step
        setErrors({});
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Skip business details step if user is not turf_owner or coach
      if (
        currentStep === 4 &&
        formData.userType !== "turf_owner" &&
        formData.userType !== "coach"
      ) {
        setCurrentStep(2); // Go back to personal info
      } else {
        setCurrentStep(currentStep - 1);
      }
      // Clear errors when going back
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const registrationData: any = {
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone || "",
        password: formData.password,
        userType: formData.userType,
        sports: [], // Sports will be collected on the interest selection page
        rating: 0,
      };

      // Add business fields for turf owners and coaches
      if (formData.userType === "turf_owner" || formData.userType === "coach") {
        registrationData.businessName = formData.businessName.trim();
        if (formData.businessAddress.trim()) {
          registrationData.businessAddress = formData.businessAddress.trim();
        }
        if (formData.businessPhone.trim()) {
          registrationData.businessPhone = formData.businessPhone.trim();
        }
      }

      const userData = await register(registrationData);
      showToast({
        type: "success",
        title: "Registration successful! Welcome to Playmate!",
      });

      // Redirect to interest selection page for normal users and coaches
      // Other user types go directly to their dashboards
      if (
        userData.userType === "normal_user" ||
        userData.userType === "coach"
      ) {
        navigate("/select-interests", { replace: true });
      } else {
        // Redirect based on user type for non-normal users
        switch (userData.userType) {
          case "admin":
            navigate("/admin-dashboard", { replace: true });
            break;
          case "turf_owner":
            navigate("/turf-dashboard", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast({
        type: "error",
        title: "Registration failed. Please try again.",
      });
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start lg:items-center">
            {/* Left Side - Branding & Info */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">PM</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      Playmate
                    </h1>
                    <p className="text-gray-600">Your Sports Community</p>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏃‍♂️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Join Games
                      </h3>
                      <p className="text-sm text-gray-600">
                        Connect with players and join exciting sports games in
                        your area
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏟️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Discover Turfs
                      </h3>
                      <p className="text-sm text-gray-600">
                        Find and book the best sports facilities near you
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Build Community
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create lasting connections with fellow sports
                        enthusiasts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full">
              <div className="bg-transparent rounded-2xl lg:rounded-3xl p-2 sm:p-3 lg:p-4 flex flex-col">
                {/* Mobile Logo and Title */}
                <div className="lg:hidden text-center mb-2 sm:mb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      PM
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                    Join Playmate
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Create your account to get started
                  </p>
                </div>

                {/* Desktop Title */}
                <div className="hidden lg:block mb-2 sm:mb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Join thousands of sports enthusiasts
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                  <div className="space-y-2 sm:space-y-3">
                    {/* General Error */}
                    {errors.general && (
                      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              !
                            </span>
                          </div>
                          <p className="text-red-700 text-sm font-medium">
                            {errors.general}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Account Type */}
                    {currentStep === 1 && (
                      <div className="space-y-2">
                        <div className="mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            Account Type
                          </h3>
                          <p className="text-xs text-gray-500 hidden sm:block">
                            Choose your role
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          <label
                            className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              formData.userType === "normal_user"
                                ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="userType"
                              value="normal_user"
                              checked={formData.userType === "normal_user"}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 ${
                                formData.userType === "normal_user"
                                  ? "bg-primary-500"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span className="text-2xl sm:text-3xl">🏃‍♂️</span>
                            </div>
                            <span
                              className={`text-sm sm:text-base font-bold mb-0.5 ${
                                formData.userType === "normal_user"
                                  ? "text-primary-700"
                                  : "text-gray-800"
                              }`}
                            >
                              Player
                            </span>
                            <span className="text-xs text-gray-600 text-center hidden sm:block">
                              Join games & events
                            </span>
                            {formData.userType === "normal_user" && (
                              <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </label>
                          <label
                            className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              formData.userType === "coach"
                                ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="userType"
                              value="coach"
                              checked={formData.userType === "coach"}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 ${
                                formData.userType === "coach"
                                  ? "bg-primary-500"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span className="text-2xl sm:text-3xl">👨‍🏫</span>
                            </div>
                            <span
                              className={`text-sm sm:text-base font-bold mb-0.5 ${
                                formData.userType === "coach"
                                  ? "text-primary-700"
                                  : "text-gray-800"
                              }`}
                            >
                              Coach
                            </span>
                            <span className="text-xs text-gray-600 text-center hidden sm:block">
                              Train & manage teams
                            </span>
                            {formData.userType === "coach" && (
                              <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </label>
                          <label
                            className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              formData.userType === "turf_owner"
                                ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="userType"
                              value="turf_owner"
                              checked={formData.userType === "turf_owner"}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 ${
                                formData.userType === "turf_owner"
                                  ? "bg-primary-500"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span className="text-2xl sm:text-3xl">🏟️</span>
                            </div>
                            <span
                              className={`text-sm sm:text-base font-bold mb-0.5 ${
                                formData.userType === "turf_owner"
                                  ? "text-primary-700"
                                  : "text-gray-800"
                              }`}
                            >
                              Turf Owner
                            </span>
                            <span className="text-xs text-gray-600 text-center hidden sm:block">
                              Manage your turfs
                            </span>
                            {formData.userType === "turf_owner" && (
                              <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Personal Information */}
                    {currentStep === 2 && (
                      <div className="space-y-2">
                        <div className="mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            Personal Information
                          </h3>
                          <p className="text-xs text-gray-500 hidden sm:block">
                            Tell us about yourself
                          </p>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-1">
                          <label
                            htmlFor="name"
                            className="block text-xs sm:text-sm font-semibold text-gray-800"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                errors.name
                                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                  : formData.name
                                  ? "border-green-300 bg-green-50/30"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              placeholder="John Doe"
                            />
                            {formData.name && !errors.name && (
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          {errors.name && (
                            <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                          <label
                            htmlFor="email"
                            className="block text-xs sm:text-sm font-semibold text-gray-800"
                          >
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                errors.email
                                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                  : formData.email &&
                                    /\S+@\S+\.\S+/.test(formData.email)
                                  ? "border-green-300 bg-green-50/30"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              placeholder="john@example.com"
                            />
                            {formData.email &&
                              !errors.email &&
                              /\S+@\S+\.\S+/.test(formData.email) && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}
                          </div>
                          {errors.email && (
                            <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1">
                          <label
                            htmlFor="phone"
                            className="block text-xs sm:text-sm font-semibold text-gray-800"
                          >
                            Phone Number{" "}
                            <span className="text-gray-500 text-xs font-normal">
                              (Optional)
                            </span>
                          </label>
                          <div className="relative group">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                errors.phone
                                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                  : formData.phone && !errors.phone
                                  ? "border-green-300 bg-green-50/30"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              placeholder="+1234567890"
                            />
                            {formData.phone && !errors.phone && (
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          {errors.phone && (
                            <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Business Details (for turf_owner and coach) */}
                    {currentStep === 3 &&
                      (formData.userType === "turf_owner" ||
                        formData.userType === "coach") && (
                        <div className="space-y-2">
                          <div className="mb-2">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                              Business Information
                            </h3>
                            <p className="text-xs text-gray-500 hidden sm:block">
                              Tell us about your business
                            </p>
                          </div>

                          {/* Business Name */}
                          <div className="space-y-1">
                            <label
                              htmlFor="businessName"
                              className="block text-xs sm:text-sm font-semibold text-gray-800"
                            >
                              Business Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                              <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                  errors.businessName
                                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                    : formData.businessName
                                    ? "border-green-300 bg-green-50/30"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                placeholder={
                                  formData.userType === "coach"
                                    ? "My Coaching Academy"
                                    : "My Sports Turf"
                                }
                              />
                              {formData.businessName &&
                                !errors.businessName && (
                                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={3}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                            </div>
                            {errors.businessName && (
                              <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {errors.businessName}
                              </p>
                            )}
                          </div>

                          {/* Business Address */}
                          <div className="space-y-1">
                            <label
                              htmlFor="businessAddress"
                              className="block text-xs sm:text-sm font-semibold text-gray-800"
                            >
                              Business Address{" "}
                              <span className="text-gray-500 text-xs font-normal">
                                (Optional)
                              </span>
                            </label>
                            <div className="relative group">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                              <input
                                type="text"
                                id="businessAddress"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleInputChange}
                                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                  errors.businessAddress
                                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                    : formData.businessAddress
                                    ? "border-green-300 bg-green-50/30"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                placeholder="123 Main Street, City"
                              />
                              {formData.businessAddress &&
                                !errors.businessAddress && (
                                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={3}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                            </div>
                            {errors.businessAddress && (
                              <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {errors.businessAddress}
                              </p>
                            )}
                          </div>

                          {/* Business Phone */}
                          <div className="space-y-1">
                            <label
                              htmlFor="businessPhone"
                              className="block text-xs sm:text-sm font-semibold text-gray-800"
                            >
                              Business Phone{" "}
                              <span className="text-gray-500 text-xs font-normal">
                                (Optional)
                              </span>
                            </label>
                            <div className="relative group">
                              <Phone className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                              <input
                                type="tel"
                                id="businessPhone"
                                name="businessPhone"
                                value={formData.businessPhone}
                                onChange={handleInputChange}
                                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                  errors.businessPhone
                                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                    : formData.businessPhone &&
                                      !errors.businessPhone
                                    ? "border-green-300 bg-green-50/30"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                placeholder="+1234567890"
                              />
                              {formData.businessPhone &&
                                !errors.businessPhone && (
                                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={3}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                            </div>
                            {errors.businessPhone && (
                              <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {errors.businessPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Step 4: Password */}
                    {currentStep === 4 && (
                      <div className="space-y-2">
                        <div className="mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            Security
                          </h3>
                          <p className="text-xs text-gray-500 hidden sm:block">
                            Create a secure password
                          </p>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                          <label
                            htmlFor="password"
                            className="block text-xs sm:text-sm font-semibold text-gray-800"
                          >
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                errors.password
                                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                  : formData.password &&
                                    formData.password.length >= 6
                                  ? "border-green-300 bg-green-50/30"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              placeholder="Minimum 6 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors p-1 z-10"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {/* Password Strength Indicator */}
                          {formData.password && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    formData.password.length < 6
                                      ? "bg-red-500 w-1/3"
                                      : formData.password.length < 10
                                      ? "bg-yellow-500 w-2/3"
                                      : "bg-green-500 w-full"
                                  }`}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  formData.password.length < 6
                                    ? "text-red-600"
                                    : formData.password.length < 10
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {formData.password.length < 6
                                  ? "Weak"
                                  : formData.password.length < 10
                                  ? "Medium"
                                  : "Strong"}
                              </span>
                            </div>
                          )}
                          {errors.password && (
                            <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {errors.password}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-xs sm:text-sm font-semibold text-gray-800"
                          >
                            Confirm Password{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors z-10" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm bg-white border-2 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder-gray-400 ${
                                errors.confirmPassword
                                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                                  : formData.confirmPassword &&
                                    formData.password ===
                                      formData.confirmPassword
                                  ? "border-green-300 bg-green-50/30"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              placeholder="Re-enter your password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors p-1 z-10"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                            {formData.confirmPassword &&
                              formData.password === formData.confirmPassword &&
                              !errors.confirmPassword && (
                                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-2 sm:pt-3 mt-2 sm:mt-3">
                    <div className="flex gap-2 sm:gap-3">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          <span className="hidden sm:inline">Previous</span>
                        </button>
                      )}
                      {(currentStep < totalSteps &&
                        !(
                          currentStep === 3 &&
                          formData.userType !== "turf_owner" &&
                          formData.userType !== "coach"
                        )) ||
                      (currentStep === 2 &&
                        formData.userType !== "turf_owner" &&
                        formData.userType !== "coach") ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                          <span className="relative z-10">Next</span>
                          <svg
                            className="w-4 h-4 relative z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs sm:text-sm">
                                Creating...
                              </span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                              <span className="relative z-10 text-xs sm:text-sm">
                                Create Account
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      By creating an account, you agree to our{" "}
                      <Link
                        to="/terms"
                        className="text-primary-600 hover:underline font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary-600 hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Sign In Link */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-center">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all inline-flex items-center gap-1"
                    >
                      Sign in now
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
