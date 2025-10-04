import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { format } from 'date-fns';
import { Activity, Zap, MapPin, Clock, Users, Plus, Search } from 'lucide-react';
import GameCard from '../components/GameCard';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const { games } = useGame();
  const navigate = useNavigate();

  const featuredGames = games.slice(0, 3);
  const upcomingGames = games.filter(game => 
    new Date(game.date) > new Date()
  ).slice(0, 2);

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
      <div className="bg-gradient-to-br from-turf-500 to-turf-600 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Find Your Perfect Game
          </h1>
          <p className="text-turf-100 mb-6">
            Connect with players for cricket, football, and more on premium turfs
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="btn-primary bg-white text-turf-600 hover:bg-gray-100"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/games')}
                className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-turf-600"
              >
                Browse Games
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/create')}
                className="btn-primary bg-white text-turf-600 hover:bg-gray-100"
              >
                Create Game
              </button>
              <button
                onClick={() => navigate('/games')}
                className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-turf-600"
              >
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

      {/* Stats Section */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Platform Stats</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{games.length}</div>
              <div className="text-sm text-gray-600">Active Games</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-turf-600">150+</div>
              <div className="text-sm text-gray-600">Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cricket-600">25+</div>
              <div className="text-sm text-gray-600">Turfs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
