import React, { useState } from 'react';
import { CreateTurfForm, Sport } from '../types';
import { apiService } from '../services/api';

interface TurfFormProps {
  onSuccess?: (turf: any) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateTurfForm>;
  isEditing?: boolean;
  turfId?: string;
}

const SPORTS_OPTIONS: { value: Sport; label: string }[] = [
  { value: 'cricket', label: 'Cricket' },
  { value: 'football', label: 'Football' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'badminton', label: 'Badminton' }
];

const COMMON_AMENITIES = [
  'Parking', 'Restrooms', 'Changing Rooms', 'Drinking Water', 
  'First Aid', 'Equipment Rental', 'Lighting', 'Seating Area',
  'Cafeteria', 'WiFi', 'Air Conditioning', 'Lockers'
];

const COMMON_FACILITIES = [
  'Floodlights', 'Scoreboard', 'Sound System', 'CCTV', 
  'Security', 'Referee Available', 'Ball Boys', 'Live Streaming',
  'Professional Coaching', 'Equipment Store', 'Medical Support'
];

export const TurfForm: React.FC<TurfFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
  turfId
}) => {
  const [formData, setFormData] = useState<CreateTurfForm>({
    name: initialData?.name || '',
    location: initialData?.location || '',
    address: initialData?.address || '',
    sports: initialData?.sports || [],
    pricePerHour: initialData?.pricePerHour || 0,
    description: initialData?.description || '',
    contactPhone: initialData?.contactPhone || '',
    operatingHours: initialData?.operatingHours || { open: '06:00', close: '22:00' },
    facilities: initialData?.facilities || [],
    amenities: initialData?.amenities || []
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Turf name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.sports.length === 0) newErrors.sports = 'At least one sport is required';
    if (formData.pricePerHour <= 0) newErrors.pricePerHour = 'Price must be greater than 0';
    if (!isEditing && images.length === 0) newErrors.images = 'At least one image is required';

    // Validate operating hours
    const openTime = new Date(`2000-01-01T${formData.operatingHours.open}`);
    const closeTime = new Date(`2000-01-01T${formData.operatingHours.close}`);
    if (openTime >= closeTime) {
      newErrors.operatingHours = 'Opening time must be before closing time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const turfData = {
        ...formData,
        ...(images.length > 0 && { images })
      };

      let result: any;
      if (isEditing && turfId) {
        result = await apiService.updateTurf(turfId, turfData);
      } else {
        result = await apiService.createTurf({ ...turfData, images });
      }

      onSuccess?.(result?.data?.turf ?? result?.turf ?? result);
    } catch (error) {
      console.error('Error saving turf:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save turf' });
    } finally {
      setLoading(false);
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

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setImages(prev => [...prev, url.trim()]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Turf' : 'Create New Turf'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turf Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter turf name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Hour *
            </label>
            <input
              type="number"
              value={formData.pricePerHour}
              onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price per hour"
              min="1"
            />
            {errors.pricePerHour && <p className="text-red-500 text-sm mt-1">{errors.pricePerHour}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter location (e.g., Bangalore, Mumbai)"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter complete address"
            rows={3}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your turf"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contact phone number"
          />
        </div>

        {/* Sports */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sports Available *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SPORTS_OPTIONS.map(sport => (
              <label key={sport.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sports.includes(sport.value)}
                  onChange={() => handleSportToggle(sport.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{sport.label}</span>
              </label>
            ))}
          </div>
          {errors.sports && <p className="text-red-500 text-sm mt-1">{errors.sports}</p>}
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operating Hours *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
              <input
                type="time"
                value={formData.operatingHours.open}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  operatingHours: { ...prev.operatingHours, open: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
              <input
                type="time"
                value={formData.operatingHours.close}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  operatingHours: { ...prev.operatingHours, close: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {errors.operatingHours && <p className="text-red-500 text-sm mt-1">{errors.operatingHours}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images {!isEditing && '*'}
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleImageAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Image URL
            </button>
            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {images.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                    <img src={url} alt={`Turf ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {COMMON_AMENITIES.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facilities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {COMMON_FACILITIES.map(facility => (
              <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.facilities.includes(facility)}
                  onChange={() => handleFacilityToggle(facility)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Turf' : 'Create Turf')}
          </button>
        </div>
      </form>
    </div>
  );
};