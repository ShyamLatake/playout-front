import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Turf } from '../../types';
import { 
  MapPin, 
  Star, 
  Clock, 
  Edit,
  ArrowLeft,
  IndianRupee,
  Phone,
  Calendar,
  BarChart3,
  BookOpen,
  Eye,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  Wifi,
  Car,
  Coffee,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  Save
} from 'lucide-react';

const ViewTurf: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetchTurf();
    }
  }, [id]);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && turf && turf.images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % turf.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, turf]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (turf && turf.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [turf]);

  const fetchTurf = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await apiService.getTurfById(id!);
      
      // Handle response structure
      let turfData = response.data?.turf || response.data || response;
      
      // Map fields if needed
      if (turfData._id) {
        turfData = {
          ...turfData,
          id: turfData._id,
          createdAt: new Date(turfData.createdAt),
          updatedAt: new Date(turfData.updatedAt)
        };
      }
      
      setTurf(turfData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch turf details');
    } finally {
      setLoading(false);
    }
  };

  const copyTurfLink = () => {
    const link = `${window.location.origin}/turf/${turf?.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextImage = () => {
    if (turf && turf.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % turf.images.length);
    }
  };

  const prevImage = () => {
    if (turf && turf.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + turf.images.length) % turf.images.length);
    }
  };

  const goToImage = (index: number) => {
    setSelectedImage(index);
  };

  const startEditing = () => {
    setIsEditing(true);
    // Initialize all form data
    setEditFormData({
      name: turf?.name || '',
      location: turf?.location || '',
      address: turf?.address || '',
      pricePerHour: turf?.pricePerHour || 0,
      contactPhone: turf?.contactPhone || '',
      isAvailable: turf?.isAvailable ?? true,
      description: turf?.description || '',
      sports: turf?.sports || [],
      operatingHours: {
        open: turf?.operatingHours?.open || '06:00',
        close: turf?.operatingHours?.close || '22:00'
      },
      amenities: turf?.amenities || [],
      facilities: turf?.facilities || []
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const saveChanges = async () => {
    if (!turf) return;

    try {
      setSaving(true);
      await apiService.updateTurf(turf.id, editFormData);
      
      // Update local turf state
      setTurf(prev => prev ? { ...prev, ...editFormData } : null);
      setIsEditing(false);
      setEditFormData({});
    } catch (err: any) {
      setError(err.message || 'Failed to update turf');
    } finally {
      setSaving(false);
    }
  };





  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Parking': <Car className="h-4 w-4" />,
      'Wifi': <Wifi className="h-4 w-4" />,
      'Refreshments': <Coffee className="h-4 w-4" />,
      'Cafeteria': <Coffee className="h-4 w-4" />,
      'Changing Rooms': <Users className="h-4 w-4" />,
      'Security': <Shield className="h-4 w-4" />,
    };
    return iconMap[amenity] || <CheckCircle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Turf not found'}</div>
          <button
            onClick={() => navigate('/turf-owner/turfs')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to My Turfs
          </button>
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
            
            <div className="flex items-center gap-3">
              <button
                onClick={copyTurfLink}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={startEditing}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Turf
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Carousel */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              
              <div className="relative mb-4 group">
                <img
                  src={turf.images.length > 0 ? turf.images[selectedImage] : 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center'}
                  alt={turf.name}
                  className="w-full h-80 object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center';
                  }}
                />
                
                {/* Navigation Arrows */}
                {turf.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter and Auto-play Toggle */}
                {turf.images.length > 1 && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {turf.images.length}
                    </div>
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    >
                      {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  </div>
                )}

                {/* Dot Indicators */}
                {turf.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {turf.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          selectedImage === index 
                            ? 'bg-white scale-110' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {turf.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {turf.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-green-500 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${turf.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop&crop=center';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {turf.images.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                  <p className="text-sm">No images uploaded yet</p>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{turf.name}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{turf.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    turf.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {turf.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  
                  {turf.isVerified && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Price per Hour</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">₹{turf.pricePerHour}</span>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Rating</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{turf.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Sports */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Sports Available</h3>
                <div className="flex flex-wrap gap-2">
                  {turf.sports.map((sport) => (
                    <span
                      key={sport}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium rounded-full border border-blue-200 capitalize"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                {turf.sports.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">No sports selected yet</p>
                  </div>
                )}
              </div>

              {/* Operating Hours */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Operating Hours</span>
                </div>
                <span className="text-lg text-gray-700">{turf.operatingHours.open} - {turf.operatingHours.close}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Turf</h2>
              {turf.description ? (
                <p className="text-gray-700 leading-relaxed text-lg">{turf.description}</p>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No description added yet. Add one to help customers learn more about your turf.</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {turf.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-green-600">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="font-medium text-gray-800">{amenity}</span>
                  </div>
                ))}
              </div>
              {turf.amenities.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No amenities added yet</p>
                </div>
              )}
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {turf.facilities.map((facility) => (
                  <div key={facility} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-600">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800">{facility}</span>
                  </div>
                ))}
              </div>
              {turf.facilities.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No facilities added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {turf.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{turf.contactPhone}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                  <span className="text-gray-700">{turf.address}</span>
                </div>
              </div>
              {!turf.contactPhone && (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">No contact phone added yet</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{turf.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{turf.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sports Count</span>
                  <span className="font-medium">{turf.sports.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amenities</span>
                  <span className="font-medium">{turf.amenities.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/turf-owner/turf/${turf.id}/bookings`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  View Bookings
                </button>
                <button
                  onClick={() => navigate(`/turf-owner/turf/${turf.id}/analytics`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </button>
                <button
                  onClick={() => window.open(`/turf/${turf.id}`, '_blank')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  Public View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTurf;