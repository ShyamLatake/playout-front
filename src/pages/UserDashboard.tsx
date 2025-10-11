import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext";
import { useUser } from "../contexts/UserContext";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Activity,
  Zap,
  Target,
  Dumbbell,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  UserCheck,
  UserX,
  Hourglass,
} from "lucide-react";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { games, approveRequest, rejectRequest, isLoading } = useGame();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<
    "organized" | "joined" | "requests"
  >("organized");

  if (!user || user.userType !== "normal_user") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            This page is only accessible to players.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Filter games based on user
  const organizedGames = games.filter(
    (game) => game.organizerId === user.id && new Date(game.date) >= new Date()
  );

  const joinedGames = games.filter(
    (game) =>
      game.players.some((player) => player.userId === user.id) &&
      game.organizerId !== user.id &&
      new Date(game.date) >= new Date()
  );

  const myGameRequests = games.filter(
    (game) => game.organizerId === user.id && game.requests.length > 0
  );

  const myJoinRequests = games.filter((game) =>
    game.requests.some((request) => request.userId === user.id)
  );

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case "cricket":
        return <Activity className="w-5 h-5 text-cricket-600" />;
      case "football":
        return <Zap className="w-5 h-5 text-football-600" />;
      case "tennis":
        return <Target className="w-5 h-5 text-blue-600" />;
      case "badminton":
        return <Dumbbell className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case "cricket":
        return "bg-cricket-100 text-cricket-800";
      case "football":
        return "bg-football-100 text-football-800";
      case "tennis":
        return "bg-blue-100 text-blue-800";
      case "badminton":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApproveRequest = async (gameId: string, requestId: string) => {
    try {
      await approveRequest(gameId, requestId);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (gameId: string, requestId: string) => {
    try {
      await rejectRequest(gameId, requestId);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">My Dashboard</h1>
              <p className="text-gray-600">Manage your games and requests</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/create")}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600">
                {organizedGames.length}
              </div>
              <div className="text-sm text-gray-600">Games Organized</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-turf-600">
                {joinedGames.length}
              </div>
              <div className="text-sm text-gray-600">Games Joined</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">
                {myGameRequests.reduce(
                  (sum, game) => sum + game.requests.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  {
                    key: "organized",
                    label: "My Games",
                    count: organizedGames.length,
                  },
                  {
                    key: "joined",
                    label: "Joined Games",
                    count: joinedGames.length,
                  },
                  {
                    key: "requests",
                    label: "Requests",
                    count:
                      myGameRequests.reduce(
                        (sum, game) => sum + game.requests.length,
                        0
                      ) + myJoinRequests.length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.key
                          ? "bg-primary-100 text-primary-600"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Organized Games Tab */}
              {activeTab === "organized" && (
                <div className="space-y-4">
                  {organizedGames.length > 0 ? (
                    organizedGames.map((game) => (
                      <div
                        key={game.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${getSportColor(
                                game.sport
                              )}`}
                            >
                              {getSportIcon(game.sport)}
                            </div>
                            <div>
                              <h4 className="font-semibold capitalize">
                                {game.sport}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {game.turfName}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/game/${game.id}`)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{format(new Date(game.date), "MMM dd")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              {game.startTime}-{game.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>
                              {game.currentPlayers}/{game.maxPlayers}
                            </span>
                          </div>
                          {game.perHeadContribution && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span>₹{game.perHeadContribution}</span>
                            </div>
                          )}
                        </div>

                        {game.requests.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {game.requests.length} pending request
                              {game.requests.length > 1 ? "s" : ""}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/game/${game.id}`)}
                                className="btn-primary text-sm py-1.5 px-3"
                              >
                                Review Requests
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No games organized
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start by creating your first game
                      </p>
                      <button
                        onClick={() => navigate("/create")}
                        className="btn-primary"
                      >
                        Create Your First Game
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Joined Games Tab */}
              {activeTab === "joined" && (
                <div className="space-y-4">
                  {joinedGames.length > 0 ? (
                    joinedGames.map((game) => (
                      <div
                        key={game.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${getSportColor(
                                game.sport
                              )}`}
                            >
                              {getSportIcon(game.sport)}
                            </div>
                            <div>
                              <h4 className="font-semibold capitalize">
                                {game.sport}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {game.turfName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Organized by {game.organizerName}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/game/${game.id}`)}
                            className="btn-secondary text-sm py-1.5 px-3"
                          >
                            View Details
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{format(new Date(game.date), "MMM dd")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              {game.startTime}-{game.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{game.turfLocation}</span>
                          </div>
                          {game.perHeadContribution && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span>₹{game.perHeadContribution}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No games joined
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Browse available games and join them
                      </p>
                      <button
                        onClick={() => navigate("/games")}
                        className="btn-primary"
                      >
                        Browse Games
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === "requests" && (
                <div className="space-y-6">
                  {/* Requests to my games */}
                  {myGameRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Requests to Join My Games
                      </h3>
                      <div className="space-y-4">
                        {myGameRequests.map((game) => (
                          <div
                            key={game.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold capitalize">
                                  {game.sport} - {game.turfName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(game.date), "MMM dd")} •{" "}
                                  {game.startTime}-{game.endTime}
                                </p>
                              </div>
                              <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                {game.requests.length} request
                                {game.requests.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {game.requests.map((request) => (
                                <div
                                  key={request.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                                      {request.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {request.userName}
                                      </p>
                                      {request.message && (
                                        <p className="text-sm text-gray-600">
                                          "{request.message}"
                                        </p>
                                      )}
                                      <p className="text-xs text-gray-500">
                                        {format(
                                          new Date(request.createdAt),
                                          "MMM dd, yyyy"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleApproveRequest(
                                          game.id,
                                          request.id
                                        )
                                      }
                                      disabled={isLoading}
                                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRejectRequest(game.id, request.id)
                                      }
                                      disabled={isLoading}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* My join requests */}
                  {myJoinRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Hourglass className="w-5 h-5" />
                        My Join Requests
                      </h3>
                      <div className="space-y-4">
                        {myJoinRequests.map((game) => {
                          const myRequest = game.requests.find(
                            (r) => r.userId === user.id
                          );
                          if (!myRequest) return null;

                          return (
                            <div
                              key={game.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold capitalize">
                                    {game.sport} - {game.turfName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Organized by {game.organizerName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(game.date), "MMM dd")} •{" "}
                                    {game.startTime}-{game.endTime}
                                  </p>
                                  {myRequest.message && (
                                    <p className="text-sm text-gray-700 mt-1">
                                      Your message: "{myRequest.message}"
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${myRequest.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : myRequest.status === "approved"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {myRequest.status}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {format(
                                      new Date(myRequest.createdAt),
                                      "MMM dd"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {myGameRequests.length === 0 &&
                    myJoinRequests.length === 0 && (
                      <div className="text-center py-8">
                        <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No requests
                        </h3>
                        <p className="text-gray-600">
                          No pending requests at the moment
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
