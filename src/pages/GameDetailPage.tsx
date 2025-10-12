import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Target,
  Dumbbell
} from 'lucide-react';

const GameDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { games, joinGame, leaveGame, approveRequest, rejectRequest, isLoading } = useGame();
  const { user } = useUser();
  
  const [joinMessage, setJoinMessage] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const game = games.find(g => g.id === id);

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return <Activity className="w-6 h-6 text-cricket-600" />;
      case 'football':
        return <Zap className="w-6 h-6 text-football-600" />;
      case 'tennis':
        return <Target className="w-6 h-6 text-blue-600" />;
      case 'badminton':
        return <Dumbbell className="w-6 h-6 text-purple-600" />;
      default:
        return <Activity className="w-6 h-6 text-gray-600" />;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return 'bg-cricket-100 text-cricket-800 border-cricket-200';
      case 'football':
        return 'bg-football-100 text-football-800 border-football-200';
      case 'tennis':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'badminton':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOrganizer = user?.id === game?.organizerId;
  const isPlayerInGame = game?.players.some(player => player.userId === user?.id);
  const hasRequestedToJoin = game?.requests.some(request => request.userId === user?.id && request.status === 'pending');
  const isGameFull = game ? game.currentPlayers >= game.maxPlayers : false;
  const canJoin = user && !isOrganizer && !isPlayerInGame && !hasRequestedToJoin && !isGameFull;

  const handleJoinGame = async () => {
    if (!game || !user) return;
    
    try {
      await joinGame(game.id, joinMessage);
      setShowJoinForm(false);
      setJoinMessage('');
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  const handleLeaveGame = async () => {
    if (!game || !user) return;
    
    try {
      await leaveGame(game.id);
    } catch (error) {
      console.error('Error leaving game:', error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!game) return;
    
    try {
      await approveRequest(game.id, requestId);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!game) return;
    
    try {
      await rejectRequest(game.id, requestId);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Game not found</h2>
          <button
            onClick={() => navigate('/games')}
            className="btn-primary"
          >
            Browse Games
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
          <h1 className="text-xl font-semibold">Game Details</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Game Info */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg border ${getSportColor(game.sport)}`}>
                  {getSportIcon(game.sport)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold capitalize">{game.sport}</h2>
                  <p className="text-gray-600">{game.turfName}</p>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                game.status === 'open' ? 'bg-green-100 text-green-800' :
                game.status === 'full' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {game.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{format(new Date(game.date), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{game.startTime} - {game.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{game.turfLocation}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{game.currentPlayers}/{game.maxPlayers} players</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-turf-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(game.currentPlayers / game.maxPlayers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {game.perHeadContribution && (
                  <div className="flex items-center gap-2 text-turf-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">₹{game.perHeadContribution} per head</span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Need:</span> {game.requiredPlayers} more players
                </div>
              </div>
              
              {game.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{game.description}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Organized by:</span> {game.organizerName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created {format(new Date(game.createdAt || game.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    game.status === 'open' ? 'bg-green-100 text-green-800' :
                    game.status === 'full' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {game.status === 'open' ? 'Open for Join' : 
                     game.status === 'full' ? 'Full' : 'Closed'}
                  </div>
                </div>
              </div>
              

            </div>
          </div>

          {/* Action Buttons */}
          {user && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              
              {canJoin && (
                <div className="space-y-3">
                  {!showJoinForm ? (
                    <button
                      onClick={() => setShowJoinForm(true)}
                      className="btn-primary w-full"
                    >
                      Request to Join
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={joinMessage}
                        onChange={(e) => setJoinMessage(e.target.value)}
                        placeholder="Add a message (optional)"
                        rows={3}
                        className="input-field"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleJoinGame}
                          disabled={isLoading}
                          className="btn-primary flex-1"
                        >
                          {isLoading ? 'Sending...' : 'Send Request'}
                        </button>
                        <button
                          onClick={() => setShowJoinForm(false)}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isPlayerInGame && !isOrganizer && (
                <button
                  onClick={handleLeaveGame}
                  disabled={isLoading}
                  className="btn-secondary w-full"
                >
                  {isLoading ? 'Leaving...' : 'Leave Game'}
                </button>
              )}

              {hasRequestedToJoin && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-medium">Request sent!</p>
                  <p className="text-sm text-gray-600">Waiting for organizer approval</p>
                </div>
              )}

              {isGameFull && !isPlayerInGame && !isOrganizer && (
                <div className="text-center py-4">
                  <p className="text-red-600 font-medium">Game is full</p>
                  <p className="text-sm text-gray-600">No more spots available</p>
                </div>
              )}

              {!user && (
                <button
                  onClick={() => navigate('/profile')}
                  className="btn-primary w-full"
                >
                  Login to Join
                </button>
              )}
            </div>
          )}

          {/* Players List */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Players ({game.currentPlayers})</h3>
            <div className="space-y-3">
              {game.players.map((player) => (
                <div key={player.userId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-gray-600">
                      Joined {format(new Date(player.joinedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  {player.userId === game.organizerId && (
                    <span className="text-xs bg-turf-100 text-turf-800 px-2 py-1 rounded-full">
                      Organizer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Join Requests (Only for organizer) */}
          {isOrganizer && game.requests.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Join Requests ({game.requests.length})</h3>
              <div className="space-y-4">
                {game.requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium">
                          {request.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{request.userName}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                          </p>
                          {request.message && (
                            <p className="text-sm text-gray-700 mt-1">"{request.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={isLoading}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;