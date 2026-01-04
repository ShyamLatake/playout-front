import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Turf, Sport } from '../../types';
import { 
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Phone,
  IndianRupee,
  Image as ImageIcon,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const EditTurf: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    description: '',
    contactPhone: '',
    pricePerHour: 0,
    sports: [] as Sport[],
    amenities: [] as string[],
    facilities: [] as string[],
    images: [] as string[],
    isAvailable: true,
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    operatingHours: {
      open: '06:00',
      close: '22:00',
      slotDuration: 30
    },
    availabilitySettings: {
      advanceBookingDays: 30,
      cancellationHours: 24,
      autoConfirm: false
    }
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newImage, setNewImage] = useState('');

  const availableSports: Sport[] = ['cricket', 'football', 'tennis', 'badminton'];
  const commonAmenities = ['Parking', 'Changing Rooms', 'Washrooms', 'Water Facility', 'Refreshments', 'Cafeteria'];
  const commonFacilities = ['Floodlights', 'Scoreboard', 'Seating Area', 'Sound System', 'First Aid Kit', 'Equipment Storage'];

  useEffect(() => {
    if (id) {
      fetchTurf();
    }
  }, [id]);

  const fetchTurf = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await apiService.getTurfById(id!);
      
      let turfData = response.data?.turf || response.data || response;
      
      if (turfData._id) {
        turfData = { ...turfData, id: turfData._id };
      }
      
      setFormData({
        name: turfData.name || '',
        location: turfData.location || '',
        address: turfData.address || '',
        description: turfData.description || '',
        contactPhone: turfData.contactPhone || '',
        pricePerHour: turfData.pricePerHour || 0,
        sports: turfData.sports || [],
        amenities: turfData.amenities || [],
        facilities: turfData.facilities || [],
        images: turfData.images || [],
        isAvailable: turfData.isAvailable ?? true,
        coordinates: {
          latitude: turfData.coordinates?.latitude || 0,
          longitude: turfData.coordinates?.longitude || 0
        },
        operatingHours: {
          open: turfData.operatingHours?.open || '06:00',
          close: turfData.operatingHours?.close || '22:00',
          slotDuration: turfData.operatingHours?.slotDuration || 30
        },
        availabilitySettings: {
          advanceBookingDays: turfData.availabilitySettings?.advanceBookingDays || 30,
          cancellationHours: turfData.availabilitySettings?.cancellationHours || 24,
          autoConfirm: turfData.availabilitySettings?.autoConfirm || false
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch turf details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : 
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSportToggle = (sport: Sport) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addFacility = (facility: string) => {
    if (facility && !formData.facilities.includes(facility)) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facility]
      }));
    }
    setNewFacility('');
  };

  const removeFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }));
  };

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    }
    setNewImage('');
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.sports.length === 0) {
      setError('Please select at least one sport');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Clean up the form data before sending
      const cleanedFormData = {
        ...formData,
        // Remove contactPhone if it's empty, or send null
        contactPhone: formData.contactPhone.trim() || undefined,
        // Ensure coordinates are numbers or undefined
        coordinates: (formData.coordinates.latitude !== 0 || formData.coordinates.longitude !== 0) 
          ? formData.coordinates 
          : undefined
      };
      
      await apiService.updateTurf(id!, cleanedFormData);
      navigate('/turf-owner/turfs');
    } catch (err: any) {
      setError(err.message || 'Failed to update turf');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded mr-2 animate-pulse"></div>
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Basic Information Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div>
                  <div className="w-20 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="md:col-span-2">
                  <div className="w-28 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div>
                  <div className="w-36 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="md:col-span-2">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-full h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sports Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center p-4 border border-gray-200 rounded-xl">
                    <div className="w-5 h-5 bg-gray-200 rounded mr-3 animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-56 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coordinates Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="w-20 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Booking Settings Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="w-48 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-2 mt-6">
                <div className="flex items-center p-4 border border-gray-200 rounded-xl">
                  <div className="w-5 h-5 bg-gray-200 rounded mr-3 animate-pulse"></div>
                  <div>
                    <div className="w-40 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    <div className="w-64 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="mb-6">
                <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="w-40 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="w-20 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Submit Buttons Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-end space-x-4">
                <div className="w-20 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/turf-owner/turfs')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to My Turfs
            </button>
            
            {/* <h1 className="text-2xl font-bold text-gray-900">Edit Turf</h1> */}
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Turf Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter turf name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g., Kharadi, Pune"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter complete address with landmarks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Optional - Leave empty if not available</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per Hour (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="500"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Describe your turf, its features, and what makes it special..."
                />
              </div>
            </div>
          </div>

          {/* Sports */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sports Available *</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableSports.map((sport) => (
                <label key={sport} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.sports.includes(sport)}
                    onChange={() => handleSportToggle(sport)}
                    className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="capitalize font-medium">{sport}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Operating Hours & Slots</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  name="operatingHours.open"
                  value={formData.operatingHours.open}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  name="operatingHours.close"
                  value={formData.operatingHours.close}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slot Duration (minutes)
                </label>
                <select
                  name="operatingHours.slotDuration"
                  value={formData.operatingHours.slotDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Coordinates */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Location Coordinates</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="coordinates.latitude"
                  value={formData.coordinates.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="18.5204"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="coordinates.longitude"
                  value={formData.coordinates.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="73.8567"
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> You can get coordinates from Google Maps by right-clicking on your turf location and selecting the coordinates that appear.
              </p>
            </div>
          </div>

          {/* Availability Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Advance Booking Days
                </label>
                <input
                  type="number"
                  name="availabilitySettings.advanceBookingDays"
                  value={formData.availabilitySettings.advanceBookingDays}
                  onChange={handleInputChange}
                  min="1"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-600 mt-1">How many days in advance customers can book</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cancellation Hours
                </label>
                <input
                  type="number"
                  name="availabilitySettings.cancellationHours"
                  value={formData.availabilitySettings.cancellationHours}
                  onChange={handleInputChange}
                  min="1"
                  max="168"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-600 mt-1">Hours before booking when cancellation is allowed</p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="availabilitySettings.autoConfirm"
                    checked={formData.availabilitySettings.autoConfirm}
                    onChange={handleInputChange}
                    className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Auto-confirm bookings</span>
                    <p className="text-sm text-gray-600 mt-1">Automatically confirm bookings without manual approval</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
            </div>
            
            {/* Common Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Common Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => {
                        if (formData.amenities.includes(amenity)) {
                          removeAmenity(amenity);
                        } else {
                          addAmenity(amenity);
                        }
                      }}
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Amenity */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Custom Amenity</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Enter custom amenity"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => addAmenity(newAmenity)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Selected Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Facilities</h2>
            </div>
            
            {/* Common Facilities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Common Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonFacilities.map((facility) => (
                  <label key={facility} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => {
                        if (formData.facilities.includes(facility)) {
                          removeFacility(facility);
                        } else {
                          addFacility(facility);
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Facility */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Custom Facility</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="Enter custom facility"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => addFacility(newFacility)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Selected Facilities */}
            {formData.facilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Selected Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeFacility(facility)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Images</h2>
            </div>
            
            {/* Add Image */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Image URL</h3>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            {formData.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Turf image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop&crop=center';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.images.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No images added yet. Add some images to showcase your turf.</p>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Availability Settings</h2>
            </div>
            <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div>
                <span className="font-semibold text-gray-900">Turf is currently available for booking</span>
                <p className="text-sm text-gray-600 mt-1">Uncheck this if you want to temporarily disable bookings</p>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/turf-owner/turfs')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 font-medium transition-colors"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTurf;