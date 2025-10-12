import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useGame } from "../contexts/GameContext";
import { useToast } from "../contexts/ToastContext";
import { Sport } from "../types";
import {
  LogOut,
  Star,
  Trophy,
  Calendar,
  MapPin,
  Edit3,
  User,
  Mail,
  Phone,
  Save,
  X,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useUser();
  const { games } = useGame();
  const { showToast } = useToast();
  const [showEditForm, setShowEditForm] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    sports: user?.sports || [] as Sport[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const sports: { value: Sport; label: string; color: string }[] = [
    {
      value: "cricket",
      label: "Cricket",
      color: "bg-cricket-100 text-cricket-800",
    },
    {
      value: "football",
      label: "Football",
      color: "bg-football-100 text-football-800",
    },
    { value: "tennis", label: "Tennis", color: "bg-blue-100 text-blue-800" },
    {
      value: "badminton",
      label: "Badminton",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast({ type: 'success', title: 'Logged out successfully' });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      showToast({ type: 'error', title: 'Error logging out' });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!editData.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    try {
      // Here you would call an API to update the user profile
      // await updateProfile(editData);
      showToast({ type: 'success', title: 'Profile updated successfully!' });
      setShowEditForm(false);
    } catch (error) {
      console.error('Update error:', error);
      showToast({ type: 'error', title: 'Failed to update profile' });
      setErrors({ general: "Failed to update profile. Please try again." });
    }
  };

  const toggleSport = (sport: Sport) => {
    setEditData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const userGames = games.filter(
    (game) =>
      game.players.some((player) => player.userId === user?.id) ||
      game.organizerId === user?.id
  );

  const organizedGames = games.filter(game => game.organizerId === user?.id);
  const joinedGames = games.filter(game => 
    game.players.some(player => player.userId === user?.id) && game.organizerId !== user?.id
  );
  const upcomingGames = userGames.filter(game => new Date(game.date) > new Date());
  const completedGames = userGames.filter(game => new Date(game.date) <= new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">
                    {user.rating} rating
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 capitalize">
                    {user.userType.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Trophy className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Sports</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.sports.length > 0 ? (
                        user.sports.map((sport) => {
                          const sportInfo = sports.find(s => s.value === sport);
                          return (
                            <span
                              key={sport}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sportInfo?.color || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {sportInfo?.label || sport}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-sm text-gray-500">No sports selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card mt-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{userGames.length}</div>
                  <div className="text-sm text-gray-600">Total Games</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-3 bg-turf-50 rounded-lg">
                  <div className="text-2xl font-bold text-turf-600">{organizedGames.length}</div>
                  <div className="text-sm text-gray-600">Organized</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{upcomingGames.length}</div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="card mt-6">
              <h2 className="text-lg font-semibold mb-4">Activity Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Games Organized</span>
                  <span className="font-medium">{organizedGames.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Games Joined</span>
                  <span className="font-medium">{joinedGames.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Games</span>
                  <span className="font-medium">{completedGames.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {userGames.length > 0 ? Math.round((completedGames.length / userGames.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Games
              </h2>
              
              {userGames.length > 0 ? (
                <div className="space-y-4">
                  {userGames.slice(0, 5).map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/game/${game.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium capitalize">{game.sport}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {game.turfLocation}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(game.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {game.startTime} - {game.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No games yet</h3>
                  <p className="text-gray-600 mb-4">Start playing by joining or creating games</p>
                  <button
                    onClick={() => navigate('/games')}
                    className="btn-primary"
                  >
                    Browse Games
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sports Interests
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sports.map((sport) => (
                    <button
                      key={sport.value}
                      type="button"
                      onClick={() => toggleSport(sport.value)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        editData.sports.includes(sport.value)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {sport.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;