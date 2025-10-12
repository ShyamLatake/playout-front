import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { useTurf } from '../contexts/TurfContext';
import { format } from 'date-fns';
import { Activity, Zap, MapPin, Clock, Users, Plus, Search, TrendingUp, Calendar, Star } from 'lucide-react';
import GameCard from '../components/GameCard';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const { games } = useGame();
  const { turfs } = useTurf();
  const navigate = useNavigate();

  const featuredGames = games.filter(game => 
    new Date(game.date) > new Date() && game.status === 'open'
  ).slice(0, 3);
  
  const upcomingGames = games.filter(game => 
    new Date(game.date) > new Date()
  ).slice(0, 4);

  const todaysGames = games.filter(game => {
    const today = new Date();
    const gameDate = new Date(game.date);
    return gameDate.toDateString() === today.toDateString();
  });

  const totalPlayers = games.reduce((sum, game) => sum + game.currentPlayers, 0);
  const activeTurfs = turfs.filter(turf => turf.isAvailable).length;

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return <Activity className="w-5 h-5 text-cricket-600" />;
      case 'football':
        return <Zap className="w-5 h-5 text-football-600" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-turf-500 via-turf-600 to-primary-600 text-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Game
          </h1>
          <p className="text-xl text-turf-100 mb-8 max-w-2xl mx-auto">
            Connect with players for cricket, football, and more on premium turfs across the city
          </p>
          
          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">{games.length}</div>
              <div className="text-sm text-turf-100">Active Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalPlayers}+</div>
              <div className="text-sm text-turf-100">Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{activeTurfs}+</div>
              <div className="text-sm text-turf-100">Turfs</div>
            </div>
          </div>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary bg-white text-turf-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/games')}
                className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-turf-600 px-8 py-3 text-lg font-semibold"
              >
                Browse Games
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/create')}
                className="btn-primary bg-white text-turf-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Game
              </button>
              <button
                onClick={() => navigate('/games')}
                className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-turf-600 px-8 py-3 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Games
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user?.userType === 'turf_owner' ? (
              <>
                <button
                  onClick={() => navigate('/turf-dashboard')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <Activity className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/create-turf')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <Plus className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">Add Turf</span>
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">View Games</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">My Profile</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/my-dashboard')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <Activity className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">My Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <Search className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">Find Games</span>
                </button>
                <button
                  onClick={() => navigate('/turfs')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">Book Turfs</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="card hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <span className="font-medium">My Profile</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Games */}
      {featuredGames.length > 0 && (
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Featured Games</h2>
            <div className="space-y-4">
              {featuredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Upcoming Games</h2>
            <div className="space-y-4">
              {upcomingGames.map((game) => (
                <div
                  key={game.id}
                  className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getSportColor(game.sport)}`}>
                        {getSportIcon(game.sport)}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{game.sport}</h3>
                        <p className="text-sm text-gray-600">{game.turfName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(game.date), 'MMM dd')} • {game.startTime}-{game.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {game.turfLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                        {game.currentPlayers}/{game.maxPlayers}
                      </div>
                      {game.perHeadContribution && (
                        <div className="text-sm font-medium text-turf-600">
                          ₹{game.perHeadContribution}/head
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's Games */}
      {todaysGames.length > 0 && (
        <div className="px-4 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Today's Games ({todaysGames.length})
              </h2>
              <button
                onClick={() => navigate('/games')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todaysGames.slice(0, 2).map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getSportColor(game.sport)}`}>
                        {getSportIcon(game.sport)}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{game.sport}</h3>
                        <p className="text-sm text-gray-600">{game.turfName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-turf-600">
                        {game.startTime} - {game.endTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        {game.currentPlayers}/{game.maxPlayers} players
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {game.turfLocation}
                    </span>
                    {game.perHeadContribution && (
                      <span className="font-medium text-turf-600">
                        ₹{game.perHeadContribution}/head
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Stats */}
      <div className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose TurfFinder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turf-400 to-turf-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Connections</h3>
              <p className="text-gray-600">Find and connect with players who share your passion for sports</p>
              <div className="text-2xl font-bold text-turf-600 mt-2">{totalPlayers}+ Players</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Turfs</h3>
              <p className="text-gray-600">Access to high-quality sports facilities across the city</p>
              <div className="text-2xl font-bold text-primary-600 mt-2">{activeTurfs}+ Turfs</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cricket-400 to-cricket-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Community</h3>
              <p className="text-gray-600">Join a thriving community of sports enthusiasts</p>
              <div className="text-2xl font-bold text-cricket-600 mt-2">{games.length}+ Games</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
