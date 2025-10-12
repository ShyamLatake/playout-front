import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';
import { Sport } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign, 
  Clock,
  Activity,
  Zap,
  Target,
  Dumbbell,
  Phone,
  Calendar
} from 'lucide-react';

interface TurfFilters {
  sport?: Sport;
  location?: string;
  maxPrice?: number;
  minRating?: number;
}

const TurfsPage: React.FC = () => {
  const navigate = useNavigate();
  const { turfs } = useTurf();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TurfFilters>({});
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high' | 'name'>('rating');

  const sports: { value: Sport; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'cricket', label: 'Cricket', icon: <Activity className="w-4 h-4" />, color: 'bg-cricket-100 text-cricket-800' },
    { value: 'football', label: 'Football', icon: <Zap className="w-4 h-4" />, color: 'bg-football-100 text-football-800' },
    { value: 'tennis', label: 'Tennis', icon: <Target className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'badminton', label: 'Badminton', icon: <Dumbbell className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800' },
  ];

  const filteredAndSortedTurfs = useMemo(() => {
    let filtered = turfs.filter((turf) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          turf.name.toLowerCase().includes(searchLower) ||
          turf.location.toLowerCase().includes(searchLower) ||
          turf.address.toLowerCase().includes(searchLower) ||
          turf.sports.some(sport => sport.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Sport filter
      if (filters.sport && !turf.sports.includes(filters.sport)) {
        return false;
      }

      // Location filter
      if (filters.location && !turf.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Price filter
      if (filters.maxPrice && turf.pricePerHour > filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (filters.minRating && turf.rating < filters.minRating) {
        return false;
      }

      // Only show available turfs
      return turf.isAvailable;
    });

    // Sort turfs
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.pricePerHour - b.pricePerHour;
        case 'price-high':
          return b.pricePerHour - a.pricePerHour;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [turfs, searchTerm, filters, sortBy]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm;

  const getSportIcon = (sport: Sport) => {
    const sportInfo = sports.find(s => s.value === sport);
    return sportInfo?.icon || <Activity className="w-4 h-4" />;
  };

  const getSportColor = (sport: Sport) => {
    const sportInfo = sports.find(s => s.value === sport);
    return sportInfo?.color || 'bg-gray-100 text-gray-800';
  };

  const handleBookTurf = (turfId: string) => {
    if (!user) {
      navigate('/profile');
      return;
    }
    navigate(`/turf/${turfId}/book`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Find Turfs</h1>
          <p className="text-gray-600">Discover and book premium sports turfs near you</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search turfs by name, location, or sport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sport Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
                  <select
                    value={filters.sport || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value as Sport || undefined }))}
                    className="input-field"
                  >
                    <option value="">All Sports</option>
                    {sports.map((sport) => (
                      <option key={sport.value} value={sport.value}>
                        {sport.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                    className="input-field"
                  />
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price/Hour</label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="input-field"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                  <select
                    value={filters.minRating || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="input-field"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Turfs List */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {filteredAndSortedTurfs.length} {filteredAndSortedTurfs.length === 1 ? 'Turf' : 'Turfs'} Found
              </h2>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing filtered results
                </p>
              )}
            </div>
            
            {/* Sort Options */}
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input-field w-auto min-w-[160px] appearance-none bg-white pr-8"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Sort by Name</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Turfs Grid */}
          {filteredAndSortedTurfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAndSortedTurfs.map((turf) => (
                <div key={turf.id} className="card hover:shadow-lg transition-shadow duration-200">
                  {/* Turf Image */}
                  <div className="h-48 bg-gradient-to-br from-turf-400 to-turf-600 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-white text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm opacity-90">Turf Image</p>
                    </div>
                  </div>

                  {/* Turf Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{turf.name}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {turf.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{turf.rating}</span>
                      </div>
                    </div>

                    {/* Sports */}
                    <div className="flex flex-wrap gap-2">
                      {turf.sports.map((sport) => (
                        <span
                          key={sport}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSportColor(sport)}`}
                        >
                          {getSportIcon(sport)}
                          {sport}
                        </span>
                      ))}
                    </div>

                    {/* Price and Hours */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-turf-600">₹{turf.pricePerHour}/hour</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{turf.operatingHours.open} - {turf.operatingHours.close}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {turf.amenities.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Amenities: </span>
                        {turf.amenities.slice(0, 3).join(', ')}
                        {turf.amenities.length > 3 && ` +${turf.amenities.length - 3} more`}
                      </div>
                    )}

                    {/* Contact */}
                    {turf.contactPhone && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{turf.contactPhone}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/turf/${turf.id}`)}
                        className="btn-secondary flex-1 text-sm py-2"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleBookTurf(turf.id)}
                        className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No turfs found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms'
                  : 'No turfs are currently available'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurfsPage;