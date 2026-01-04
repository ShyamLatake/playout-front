import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { auth } from '../../config/firebase';
import { Turf } from '../../types';
// import { toast } from 'react-hot-toast';
import { 
  MapPin, 
  Star, 
  Eye, 
  Pencil, 
  Trash2,
  Plus,
  Calendar
} from 'lucide-react';

const ListOwnerTurfs: React.FC = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTurfs();
  }, []);

  const fetchMyTurfs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Fetching turfs for user:', user.uid);
      const response : any = await apiService.getMyTurfs();
      console.log('API Response:', response);
      
      // Handle different response structures
      let turfsData = [];
      if (response.data && response.data.turfs && Array.isArray(response.data.turfs)) {
        turfsData = response.data.turfs;
      } else if (Array.isArray(response)) {
        turfsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        turfsData = response.data;
      } else if (response.turfs && Array.isArray(response.turfs)) {
        turfsData = response.turfs;
      } else {
        console.warn('Unexpected response structure:', response);
        turfsData = [];
      }
      
      // Map the API response to match our Turf interface
      const mappedTurfs = turfsData.map((turf: any) => ({
        ...turf,
        id: turf._id || turf.id, // Map _id to id
        rating: turf.rating || 0,
        images: turf.images || [],
        sports: turf.sports || [],
        amenities: turf.amenities || [],
        facilities: turf.facilities || [],
        createdAt: new Date(turf.createdAt),
        updatedAt: new Date(turf.updatedAt)
      }));
      
      setTurfs(mappedTurfs);
    } catch (err: any) {
      console.error('Error fetching turfs:', err);
      setError(err.message || 'Failed to fetch turfs');
    //   toast.error('Failed to load your turfs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTurf = async (turfId: string) => {
    if (!window.confirm('Are you sure you want to delete this turf?')) {
      return;
    }

    try {
      await apiService.deleteTurf(turfId);
      setTurfs(turfs.filter(turf => turf.id !== turfId));
    //   toast.success('Turf deleted successfully');
    } catch (err: any) {
    //   toast.error(err.message || 'Failed to delete turf');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="w-32 h-9 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-64 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Image Skeleton */}
              <div className="relative">
                <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
                
                {/* Status badges skeleton */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <div className="w-20 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>

                {/* Rating overlay skeleton */}
                <div className="absolute bottom-3 left-3">
                  <div className="w-16 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-12 h-4 bg-gray-200 rounded ml-1 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Sports tags skeleton */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                    <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Key amenities skeleton */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Action buttons skeleton */}
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchMyTurfs}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Turfs</h1>
          <p className="text-gray-600">Manage and monitor your turf properties</p>
        </div>
        <button
          onClick={() => navigate('/turf-owner/create-turf')}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Turf
        </button>
      </div>

      {!Array.isArray(turfs) || turfs.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No turfs yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first turf property</p>
            <button
              onClick={() => navigate('/turf-owner/create-turf')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Your First Turf
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {turfs.map((turf) => (
            <div key={turf.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img
                  src={turf.images.length > 0 ? turf.images[0] : 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&crop=center'}
                  alt={turf.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&crop=center';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Status badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    turf.isAvailable 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {turf.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  
                  {turf.isVerified && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white backdrop-blur-sm">
                      Verified
                    </span>
                  )}
                </div>

                {/* Rating overlay */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-semibold text-gray-800">{turf.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{turf.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm line-clamp-1">{turf.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">₹{turf.pricePerHour}</span>
                      <span className="text-sm text-gray-500 ml-1">/hour</span>
                    </div>
                  </div>
                </div>

                {/* Sports tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {turf.sports.slice(0, 3).map((sport) => (
                      <span
                        key={sport}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                      >
                        {sport}
                      </span>
                    ))}
                    {turf.sports.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{turf.sports.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Key amenities */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {turf.amenities.slice(0, 2).map((amenity) => (
                      <div key={amenity} className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                        {amenity}
                      </div>
                    ))}
                    {turf.amenities.length > 2 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        +{turf.amenities.length - 2} amenities
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/turf-owner/view-turf/${turf.id}`)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  
                  <button
                    onClick={() => navigate(`/turf-owner/turf/${turf.id}/bookings`)}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Bookings
                  </button>
                  
                  <button
                    onClick={() => navigate(`/turf-owner/turfs/${turf.id}`)}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteTurf(turf.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListOwnerTurfs;