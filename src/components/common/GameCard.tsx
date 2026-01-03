import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Activity,
  Zap,
  MapPin,
  Clock,
  Users,
  Calendar,
  UserPlus,
} from "lucide-react";
import { Game } from "../../types";
import { useUser } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext";

interface GameCardProps {
  game: Game;
  showActions?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, showActions = true }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { joinGame, isLoading } = useGame();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case "cricket":
        return <Activity className="w-5 h-5 text-cricket-600" />;
      case "football":
        return <Zap className="w-5 h-5 text-football-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case "cricket":
        return "bg-cricket-100 text-cricket-800 border-cricket-200";
      case "football":
        return "bg-football-100 text-football-800 border-football-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "full":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const isGameFull = game.currentPlayers >= game.maxPlayers;
  const isGameToday =
    format(new Date(game.date), "yyyy-MM-dd") ===
    format(new Date(), "yyyy-MM-dd");

  const isOrganizer = user?.id === game.organizerId;
  const isPlayerInGame = game.players.some(
    (player) => player.userId === user?.id
  );
  const hasRequestedToJoin = game.requests.some(
    (request) => request.userId === user?.id && request.status === "pending"
  );
  const canJoin =
    user &&
    !isOrganizer &&
    !isPlayerInGame &&
    !hasRequestedToJoin &&
    !isGameFull;

  const handleJoinGame = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!game || !user) return;

    try {
      await joinGame(game.id, joinMessage);
      setShowJoinForm(false);
      setJoinMessage("");
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleQuickJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!game || !user) return;

    try {
      await joinGame(game.id);
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  return (
    <div
      className="card hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary-500"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getSportColor(game.sport)} border`}>
            {getSportIcon(game.sport)}
          </div>
          <div>
            <h3 className="font-semibold text-lg capitalize">{game.sport}</h3>
            <p className="text-sm text-gray-600">{game.turfName}</p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              game.status
            )}`}
          >
            {game.status}
          </span>
          {isGameToday && (
            <div className="text-xs text-orange-600 font-medium mt-1">
              Today!
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(game.date), "EEEE, MMMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {game.startTime} - {game.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{game.turfLocation}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            {game.currentPlayers}/{game.maxPlayers} players
          </span>
        </div>
        {game.perHeadContribution && (
          <div className="text-sm font-medium text-turf-600">
            ₹{game.perHeadContribution}/head
          </div>
        )}
      </div>

      {showActions && (
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Organized by:</span>
            <span className="font-medium text-gray-700">
              {game.organizerName}
            </span>
          </div>

          {/* Join Form */}
          {showJoinForm && canJoin && (
            <div className="space-y-2">
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Add a message (optional)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleJoinGame}
                  disabled={isLoading}
                  className="btn-primary text-sm py-1.5 px-3 flex-1"
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowJoinForm(false);
                    setJoinMessage("");
                  }}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/game/${game.id}`);
              }}
              className="btn-secondary text-sm py-1.5 px-3 flex-1"
            >
              View Details
            </button>

            {canJoin && !showJoinForm && (
              <>
                <button
                  onClick={handleQuickJoin}
                  disabled={isLoading}
                  className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  Quick Join
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowJoinForm(true);
                  }}
                  className="btn-secondary text-sm py-1.5 px-2"
                >
                  +Message
                </button>
              </>
            )}

            {hasRequestedToJoin && (
              <span className="text-sm text-green-600 font-medium py-1.5 px-3 bg-green-50 rounded-lg">
                Request Sent
              </span>
            )}

            {isGameFull && !isPlayerInGame && !isOrganizer && (
              <span className="text-sm text-red-600 font-medium py-1.5 px-3 bg-red-50 rounded-lg">
                Game Full
              </span>
            )}

            {!user && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/profile");
                }}
                className="btn-primary text-sm py-1.5 px-3 flex-1"
              >
                Login to Join
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;


