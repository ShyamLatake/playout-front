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
  Settings
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sports: { value: Sport; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'cricket', label: 'Cricket', icon: <Activity className="w-5 h-5" />, color: 'bg-cricket-100 text-cricket-800 border-cricket-200' },
    { value: 'football', label: 'Football', icon: <Zap className="w-5 h-5" />, color: 'bg-football-100 text-football-800 border-football-200' },
    { value: 'tennis', label: 'Tennis', icon: <Target className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'badminton', label: 'Badminton', icon: <Dumbbell className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ];

  const facilityOptions = [
    'Floodlights',
    'Scoreboard', 
    'Seating Area',
    'Sound System',
    'First Aid Kit',
    'Equipment Storage',
    'Referee Room',
    'Commentary Box'
  ];

  const amenityOptions = [
    'Parking',
    'Changing Rooms',
    'Washrooms',
    'Water Facility',
    'Refreshments',
    'Cafeteria',
    'Wi-Fi',
    'Air Conditioning',
    'Lockers',
    'Shower Facility'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Add New Turf</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turf Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Downtown Sports Complex"
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Downtown, Central Park"
                      className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Price per Hour *
                    </label>
                    <input
                      type="number"
                      value={formData.pricePerHour}
                      onChange={(e) => handleInputChange('pricePerHour', parseInt(e.target.value))}
                      min="1"
                      className={`input-field ${errors.pricePerHour ? 'border-red-500' : ''}`}
                    />
                    {errors.pricePerHour && <p className="text-red-500 text-sm mt-1">{errors.pricePerHour}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete address with landmarks"
                    rows={3}
                    className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="Contact number for bookings"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your turf, special features, etc."
                    rows={3}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Sports Selection */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Sports Available *</h3>
              <div className="grid grid-cols-2 gap-3">
                {sports.map((sport) => (
                  <button
                    key={sport.value}
                    type="button"
                    onClick={() => toggleSport(sport.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.sports.includes(sport.value)
                        ? `${sport.color} border-current`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {sport.icon}
                      <span className="font-medium">{sport.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.sports && <p className="text-red-500 text-sm mt-2">{errors.sports}</p>}
            </div>

            {/* Operating Hours */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={formData.operatingHours.open}
                    onChange={(e) => handleInputChange('operatingHours', {
                      ...formData.operatingHours,
                      open: e.target.value
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={formData.operatingHours.close}
                    onChange={(e) => handleInputChange('operatingHours', {
                      ...formData.operatingHours,
                      close: e.target.value
                    })}
                    className="input-field"
                  />
                </div>
              </div>
              {errors.operatingHours && <p className="text-red-500 text-sm mt-2">{errors.operatingHours}</p>}
            </div>

            {/* Facilities */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilityOptions.map((facility) => (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                      formData.facilities.includes(facility)
                        ? 'bg-primary-100 text-primary-800 border-primary-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                      formData.amenities.includes(amenity)
                        ? 'bg-turf-100 text-turf-800 border-turf-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Turf...' : 'Create Turf'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTurfPage;