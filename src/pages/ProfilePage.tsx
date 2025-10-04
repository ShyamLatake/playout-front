import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useGame } from "../contexts/GameContext";
import { Sport } from "../types";
import {
  LogIn,
  UserPlus,
  LogOut,
  Star,
  Trophy,
  Calendar,
  MapPin,
  Edit3,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, login, logout, register, isLoading } = useUser();
  const { games } = useGame();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(!user);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    sports: [] as Sport[],
    userType: "normal_user" as "normal_user" | "turf_owner",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!loginData.email || !loginData.password) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    try {
      // Determine user type based on email
      const userType =
        loginData.email === "owner@example.com" ? "turf_owner" : "normal_user";
      await login(loginData.email, loginData.password, userType);
      setShowLoginForm(false);
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setErrors({ general: "Please fill in all required fields" });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (registerData.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    try {
      await register({
        ...registerData,
        userType: registerData.userType || "normal_user",
      });
      setShowLoginForm(false);
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  const toggleSport = (sport: Sport) => {
    setRegisterData((prev) => ({
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

  if (user && !showLoginForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6">
          <div className="max-w-4xl mx-auto">
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
                </div>
              </div>
              <button
                onClick={() => setShowLoginForm(true)}
                className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-600">
                  {userGames.length}
                </div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="card text-center">
                <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-turf-600">
                  {userGames.filter((g) => g.organizerId === user.id).length}
                </div>
                <div className="text-sm text-gray-600">Games Organized</div>
              </div>
              <div className="card text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cricket-600">
                  {user.rating}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="card text-center">
                <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {user.sports.length}
                </div>
                <div className="text-sm text-gray-600">Sports</div>
              </div>
            </div>

            {/* Sports */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Sports I Play</h3>
              <div className="flex flex-wrap gap-2">
                {user.sports.map((sport) => {
                  const sportInfo = sports.find((s) => s.value === sport);
                  return (
                    <span
                      key={sport}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${sportInfo?.color}`}
                    >
                      {sportInfo?.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Recent Games */}
            {userGames.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Games</h3>
                <div className="space-y-3">
                  {userGames.slice(0, 5).map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium capitalize">
                          {game.sport}
                        </div>
                        <div className="text-sm text-gray-600">
                          {game.turfName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {new Date(game.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {game.startTime} - {game.endTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="mt-8 text-center">
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-2 mx-auto"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Turf Finder
          </h1>
          <p className="text-gray-600">
            Connect with players and find your perfect game
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLoginMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLoginMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Register
          </button>
        </div>

        {/* Forms */}
        {isLoginMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>
            {errors.general && (
              <div className="text-red-500 text-sm text-center">
                {errors.general}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="Create a password"
                required
              />
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setRegisterData((prev) => ({
                      ...prev,
                      userType: "normal_user",
                    }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    registerData.userType === "normal_user"
                      ? "bg-primary-100 text-primary-800 border-primary-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium">Player</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Join and create games
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRegisterData((prev) => ({
                      ...prev,
                      userType: "turf_owner",
                    }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    registerData.userType === "turf_owner"
                      ? "bg-turf-100 text-turf-800 border-turf-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium">Turf Owner</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Manage turfs and bookings
                  </p>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sports I Play
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sports.map((sport) => (
                  <button
                    key={sport.value}
                    type="button"
                    onClick={() => toggleSport(sport.value)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                      registerData.sports.includes(sport.value)
                        ? `${sport.color} border-current`
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-sm font-medium">{sport.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {errors.general && (
              <div className="text-red-500 text-sm text-center">
                {errors.general}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
