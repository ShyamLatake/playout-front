import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';
import { CreateTurfForm, Sport } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Activity, 
  Zap, 
  Target, 
  Dumbbell,
  Phone,
  FileText,
  Settings,
  Users,
  Wifi,
  Car,
  Shield,
  Star,
  Info
} from 'lucide-react';

const CreateTurfPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTurf, isLoading } = useTurf();
  const { user } = useUser();
  
  const [formData, setFormData] = useState<CreateTurfForm>({
    name: '',
    location: '',
    address: '',
    sports: [],
    pricePerHour: 500,
    description: '',
    contactPhone: '',
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    facilities: [],
    amenities: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sports: { value: Sport; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'cricket', label: 'Cricket', icon: <Activity className="w-5 h-5" />, color: 'bg-cricket-100 text-cricket-800 border-cricket-200' },
    { value: 'football', label: 'Football', icon: <Zap className="w-5 h-5" />, color: 'bg-football-100 text-football-800 border-football-200' },
    { value: 'tennis', label: 'Tennis', icon: <Target className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'badminton', label: 'Badminton', icon: <Dumbbell className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ];

  const facilityOptions = [
    { name: 'Floodlights', icon: <Zap className="w-4 h-4" />, description: 'Night time playing capability' },
    { name: 'Scoreboard', icon: <Target className="w-4 h-4" />, description: 'Digital or manual scoreboard' },
    { name: 'Seating Area', icon: <Users className="w-4 h-4" />, description: 'Spectator seating' },
    { name: 'Sound System', icon: <Activity className="w-4 h-4" />, description: 'Audio system for announcements' },
    { name: 'First Aid Kit', icon: <Shield className="w-4 h-4" />, description: 'Emergency medical supplies' },
    { name: 'Equipment Storage', icon: <Settings className="w-4 h-4" />, description: 'Storage for sports equipment' },
    { name: 'Referee Room', icon: <Users className="w-4 h-4" />, description: 'Dedicated referee facilities' },
    { name: 'Commentary Box', icon: <Activity className="w-4 h-4" />, description: 'Commentary facilities' },
    { name: 'CCTV Security', icon: <Shield className="w-4 h-4" />, description: 'Security camera system' },
    { name: 'Ground Maintenance', icon: <Settings className="w-4 h-4" />, description: 'Regular ground upkeep' }
  ];

  const amenityOptions = [
    { name: 'Parking', icon: <Car className="w-4 h-4" />, description: 'Vehicle parking space' },
    { name: 'Changing Rooms', icon: <Users className="w-4 h-4" />, description: 'Player changing facilities' },
    { name: 'Washrooms', icon: <Users className="w-4 h-4" />, description: 'Clean restroom facilities' },
    { name: 'Water Facility', icon: <Activity className="w-4 h-4" />, description: 'Drinking water availability' },
    { name: 'Refreshments', icon: <Activity className="w-4 h-4" />, description: 'Snacks and beverages' },
    { name: 'Cafeteria', icon: <Activity className="w-4 h-4" />, description: 'Full dining facility' },
    { name: 'Wi-Fi', icon: <Wifi className="w-4 h-4" />, description: 'Internet connectivity' },
    { name: 'Air Conditioning', icon: <Activity className="w-4 h-4" />, description: 'Climate control in indoor areas' },
    { name: 'Lockers', icon: <Shield className="w-4 h-4" />, description: 'Secure storage lockers' },
    { name: 'Shower Facility', icon: <Activity className="w-4 h-4" />, description: 'Hot water shower facilities' },
    { name: 'Medical Room', icon: <Shield className="w-4 h-4" />, description: 'Basic medical treatment room' },
    { name: '24/7 Security', icon: <Shield className="w-4 h-4" />, description: 'Round-the-clock security' }
  ];

  const handleInputChange = (field: keyof CreateTurfForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleSport = (sport: Sport) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.location.trim() && formData.address.trim();
      case 2:
        return formData.sports.length > 0;
      case 3:
        return formData.pricePerHour > 0;
      default:
        return true;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Turf name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (formData.sports.length === 0) {
      newErrors.sports = 'Select at least one sport';
    }
    if (formData.pricePerHour <= 0) {
      newErrors.pricePerHour = 'Price must be greater than 0';
    }
    if (formData.operatingHours.open >= formData.operatingHours.close) {
      newErrors.operatingHours = 'Closing time must be after opening time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createTurf(formData);
      navigate('/turf-dashboard');
    } catch (error) {
      console.error('Error creating turf:', error);
    }
  };

  if (user?.userType !== 'turf_owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only turf owners can create turfs.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Add New Turf</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Create your turf listing in {totalSteps} easy steps</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    i + 1 <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="mt-4 md:hidden">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar - Steps Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Setup Progress</h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Basic Information', icon: <Info className="w-4 h-4" /> },
                  { step: 2, title: 'Sports & Activities', icon: <Activity className="w-4 h-4" /> },
                  { step: 3, title: 'Pricing & Hours', icon: <Clock className="w-4 h-4" /> },
                  { step: 4, title: 'Facilities', icon: <Settings className="w-4 h-4" /> },
                  { step: 5, title: 'Amenities & Review', icon: <Star className="w-4 h-4" /> },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      currentStep === item.step
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : currentStep > item.step
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep === item.step
                        ? 'bg-primary-600 text-white'
                        : currentStep > item.step
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > item.step ? '✓' : item.step}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600">Let's start with the essential details about your turf</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Turf Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Downtown Sports Complex"
                        className={`input-field text-lg ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Location/Area *
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., Downtown, Central Park"
                          className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Complete Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter complete address with landmarks, pin code, etc."
                        rows={4}
                        className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your turf, special features, what makes it unique..."
                        rows={4}
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-2">This will help customers understand what makes your turf special</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Sports Selection */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sports & Activities</h2>
                    <p className="text-gray-600">Select all sports that can be played at your turf</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sports.map((sport) => (
                      <button
                        key={sport.value}
                        type="button"
                        onClick={() => toggleSport(sport.value)}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          formData.sports.includes(sport.value)
                            ? `${sport.color} border-current shadow-lg`
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-2xl">{sport.icon}</div>
                          <span className="font-semibold text-lg">{sport.label}</span>
                          {formData.sports.includes(sport.value) && (
                            <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.sports && <p className="text-red-500 text-sm mt-4">{errors.sports}</p>}
                </div>
              )}

              {/* Step 3: Pricing & Hours */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Operating Hours</h2>
                    <p className="text-gray-600">Set your pricing and when your turf is available</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Price per Hour (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                        <input
                          type="number"
                          value={formData.pricePerHour}
                          onChange={(e) => handleInputChange('pricePerHour', parseInt(e.target.value))}
                          min="1"
                          className={`input-field pl-8 text-lg font-semibold ${errors.pricePerHour ? 'border-red-500' : ''}`}
                          placeholder="500"
                        />
                      </div>
                      {errors.pricePerHour && <p className="text-red-500 text-sm mt-2">{errors.pricePerHour}</p>}
                      <p className="text-xs text-gray-500 mt-2">This is your base hourly rate. You can adjust pricing later.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Operating Hours
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Opening Time
                          </label>
                          <input
                            type="time"
                            value={formData.operatingHours.open}
                            onChange={(e) => handleInputChange('operatingHours', {
                              ...formData.operatingHours,
                              open: e.target.value
                            })}
                            className="input-field text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Closing Time
                          </label>
                          <input
                            type="time"
                            value={formData.operatingHours.close}
                            onChange={(e) => handleInputChange('operatingHours', {
                              ...formData.operatingHours,
                              close: e.target.value
                            })}
                            className="input-field text-lg"
                          />
                        </div>
                      </div>
                      {errors.operatingHours && <p className="text-red-500 text-sm mt-2">{errors.operatingHours}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Facilities */}
              {currentStep === 4 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Facilities</h2>
                    <p className="text-gray-600">Select the facilities available at your turf</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {facilityOptions.map((facility) => (
                      <button
                        key={facility.name}
                        type="button"
                        onClick={() => toggleFacility(facility.name)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                          formData.facilities.includes(facility.name)
                            ? 'bg-primary-50 text-primary-800 border-primary-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${formData.facilities.includes(facility.name) ? 'text-primary-600' : 'text-gray-400'}`}>
                            {facility.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{facility.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{facility.description}</div>
                          </div>
                          {formData.facilities.includes(facility.name) && (
                            <div className="ml-auto">
                              <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Amenities & Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Amenities</h2>
                      <p className="text-gray-600">Select additional amenities that enhance the experience</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {amenityOptions.map((amenity) => (
                        <button
                          key={amenity.name}
                          type="button"
                          onClick={() => toggleAmenity(amenity.name)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                            formData.amenities.includes(amenity.name)
                              ? 'bg-green-50 text-green-800 border-green-200'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${formData.amenities.includes(amenity.name) ? 'text-green-600' : 'text-gray-400'}`}>
                              {amenity.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{amenity.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{amenity.description}</div>
                            </div>
                            {formData.amenities.includes(amenity.name) && (
                              <div className="ml-auto">
                                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Review Your Turf</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-700">Turf Name</h4>
                          <p className="text-gray-600">{formData.name || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700">Location</h4>
                          <p className="text-gray-600">{formData.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700">Price per Hour</h4>
                          <p className="text-gray-600">₹{formData.pricePerHour}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700">Operating Hours</h4>
                          <p className="text-gray-600">{formData.operatingHours.open} - {formData.operatingHours.close}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Sports Available</h4>
                        <p className="text-gray-600">{formData.sports.join(', ') || 'None selected'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Facilities ({formData.facilities.length})</h4>
                        <p className="text-gray-600">{formData.facilities.join(', ') || 'None selected'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Amenities ({formData.amenities.length})</h4>
                        <p className="text-gray-600">{formData.amenities.join(', ') || 'None selected'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceedToNext()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg font-semibold"
                  >
                    {isLoading ? 'Creating Turf...' : 'Create Turf'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTurfPage;