import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  DollarSign, 
  Clock,
  Phone,
  Calendar,
  Activity,
  Zap,
  Target,
  Dumbbell,
  Wifi,
  Car,
  Users,
  Droplets,
  Coffee,
  Shield
} from 'lucide-react';

const TurfDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { turfId } = useParams<{ turfId: string }>();
  const { turfs } = useTurf();
  const { user } = useUser();

  const turf = turfs.find(t => t.id === turfId);

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return <Activity className="w-5 h-5 text-cricket-600" />;
      case 'football':
        return <Zap className="w-5 h-5 text-football-600" />;
      case 'tennis':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'badminton':
        return <Dumbbell className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return 'bg-cricket-100 text-cricket-800';
      case 'football':
        return 'bg-football-100 text-football-800';
      case 'tennis':
        return 'bg-blue-100 text-blue-800';
      case 'badminton':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'wi-fi':
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'changing rooms':
      case 'washrooms':
        return <Users className="w-4 h-4" />;
      case 'water facility':
        return <Droplets className="w-4 h-4" />;
      case 'refreshments':
      case 'cafeteria':
        return <Coffee className="w-4 h-4" />;
      case 'first aid kit':
        return <Shield className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const handleBookTurf = () => {
    if (!user) {
      navigate('/profile');
      return;
    }
    navigate(`/turf/${turfId}/book`);
  };

  if (!turf) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Turf not found</h2>
          <button
            onClick={() => navigate('/turfs')}
            className="btn-primary"
          >
            Browse Turfs
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
          <h1 className="text-xl font-semibold">Turf Details</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Turf Image */}
          <div className="h-64 bg-gradient-to-br from-turf-400 to-turf-600 rounded-xl flex items-center justify-center">
            <div className="text-white text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">{turf.name}</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{turf.name}</h2>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {turf.location}
                </p>
                <p className="text-sm text-gray-500 mt-1">{turf.address}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold">{turf.rating}</span>
              </div>
            </div>

            {/* Sports */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Available Sports</h4>
              <div className="flex flex-wrap gap-2">
                {turf.sports.map((sport) => (
                  <span
                    key={sport}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getSportColor(sport)}`}
                  >
                    {getSportIcon(sport)}
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-turf-600" />
                <div>
                  <span className="text-gray-500">Price:</span>
                  <p className="font-semibold text-turf-600">₹{turf.pricePerHour}/hour</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-gray-500">Hours:</span>
                  <p className="font-medium">{turf.operatingHours.open} - {turf.operatingHours.close}</p>
                </div>
              </div>
              {turf.contactPhone && (
                <div className="flex items-center gap-2 col-span-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="text-gray-500">Contact:</span>
                    <p className="font-medium">{turf.contactPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {turf.description && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">About This Turf</h3>
              <p className="text-gray-700">{turf.description}</p>
            </div>
          )}

          {/* Facilities */}
          {turf.facilities.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {turf.facilities.map((facility) => (
                  <div key={facility} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-primary-600" />
                    </div>
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {turf.amenities.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {turf.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-turf-100 rounded-full flex items-center justify-center text-turf-600">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="card">
            <div className="flex gap-3">
              <button
                onClick={handleBookTurf}
                className="btn-primary flex-1 py-3 text-lg font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book This Turf
              </button>
              {turf.contactPhone && (
                <button
                  onClick={() => window.open(`tel:${turf.contactPhone}`)}
                  className="btn-secondary px-4 py-3 flex items-center justify-center"
                >
                  <Phone className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {!user && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Please login to book this turf
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfDetailPage;