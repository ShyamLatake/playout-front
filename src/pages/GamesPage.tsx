import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { Sport, FilterOptions } from '../types';
import { Search, Filter, Activity, Zap, Target, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { GameCard } from '../components/common';

const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { games } = useGame();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<'date' | 'players' | 'price' | 'newest'>('date');

  const sports: { value: Sport; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'cricket', label: 'Cricket', icon: <Activity className="w-4 h-4" />, color: 'bg-cricket-100 text-cricket-800' },
    { value: 'football', label: 'Football', icon: <Zap className="w-4 h-4" />, color: 'bg-football-100 text-football-800' },
    { value: 'tennis', label: 'Tennis', icon: <Target className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'badminton', label: 'Badminton', icon: <Dumbbell className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800' },
  ];

  const filteredAndSortedGames = useMemo(() => {
    let filtered = games.filter((game) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          game.sport.toLowerCase().includes(searchLower) ||
          game.turfName.toLowerCase().includes(searchLower) ||
          game.turfLocation.toLowerCase().includes(searchLower) ||
          game.organizerName.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Sport filter
      if (filters.sport && game.sport !== filters.sport) {
        return false;
      }

      // Date filter
      if (filters.date) {
        const gameDate = format(new Date(game.date), 'yyyy-MM-dd');
        if (gameDate !== filters.date) {
          return false;
        }
      }

      // Location filter
      if (filters.location && !game.turfLocation.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Price filter
      if (filters.maxPrice && game.perHeadContribution && game.perHeadContribution > filters.maxPrice) {
        return false;
      }

      return true;
    });

    // Sort games
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'players':
          return (b.maxPlayers - b.currentPlayers) - (a.maxPlayers - a.currentPlayers);
        case 'price':
          const aPrice = a.perHeadContribution || 0;
          const bPrice = b.perHeadContribution || 0;
          return aPrice - bPrice;
        case 'newest':
          return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
        default:
          return 0;
      }
    });
  }, [games, searchTerm, filters, sortBy]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Find Games</h1>
          <p className="text-gray-600">Discover and join cricket, football, and other sports games</p>
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
                placeholder="Search games, turfs, or organizers..."
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

            {/* Create Game Button */}
            {user && (
              <button
                onClick={() => navigate('/create')}
                className="btn-primary px-6 py-2"
              >
                Create Game
              </button>
            )}
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

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={filters.date || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value || undefined }))}
                    className="input-field"
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="input-field"
                  />
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

      {/* Games List */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {filteredAndSortedGames.length} {filteredAndSortedGames.length === 1 ? 'Game' : 'Games'} Found
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
                <option value="date">Sort by Date</option>
                <option value="players">Available Spots</option>
                <option value="price">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          {filteredAndSortedGames.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms'
                  : 'No games are currently available'
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
              {!user && (
                <button
                  onClick={() => navigate('/profile')}
                  className="btn-primary ml-3"
                >
                  Login to Create Game
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default GamesPage;
