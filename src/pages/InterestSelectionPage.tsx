import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { apiService } from "../services/api";
import { Sport as SportType } from "../types";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const InterestSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading, refreshProfile } = useUser();
  const { showToast } = useToast();
  const [selectedSports, setSelectedSports] = useState<SportType[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const availableSports: SportType[] = [
    "cricket",
    "football",
    "tennis",
    "badminton",
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, userLoading, navigate]);

  // Load existing sports if user already has some
  useEffect(() => {
    if (user && user.sports) {
      setSelectedSports(user.sports);
    }
  }, [user]);

  const handleSportToggle = (sport: SportType) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSkip = () => {
    redirectToDashboard();
  };

  const handleContinue = async () => {
    if (selectedSports.length === 0) {
      showToast({
        type: "error",
        title: "Please select at least one sport interest",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update user profile with selected sports
      await apiService.updateProfile({ sports: selectedSports });

      // Refresh user profile to get updated data
      await refreshProfile();

      showToast({
        type: "success",
        title: "Interests saved successfully!",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        redirectToDashboard();
      }, 500);
    } catch (error) {
      console.error("Error saving interests:", error);
      showToast({
        type: "error",
        title: "Failed to save interests. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const redirectToDashboard = () => {
    if (!user) return;

    switch (user.userType) {
      case "admin":
        navigate("/admin-dashboard", { replace: true });
        break;
      case "turf_owner":
        navigate("/turf-dashboard", { replace: true });
        break;
      case "coach":
        navigate("/coach-dashboard", { replace: true });
        break;
      case "normal_user":
        navigate("/my-dashboard", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                Welcome to Playmate! 🎉
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Let's personalize your experience
              </p>
              <p className="text-sm text-gray-500">
                Select your favorite sports to discover relevant games and
                events
              </p>
            </div>

            {/* Sports Selection */}
            <div className="mb-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {availableSports.map((sport) => {
                  const isSelected = selectedSports.includes(sport);
                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => handleSportToggle(sport)}
                      className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105"
                          : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                          isSelected
                            ? "bg-primary-500 shadow-md"
                            : "bg-gray-200 group-hover:bg-gray-300"
                        }`}
                      >
                        <span className="text-4xl">
                          {sport === "cricket" && "🏏"}
                          {sport === "football" && "⚽"}
                          {sport === "tennis" && "🎾"}
                          {sport === "badminton" && "🏸"}
                        </span>
                      </div>
                      <span
                        className={`text-base font-bold capitalize block ${
                          isSelected ? "text-primary-700" : "text-gray-700"
                        }`}
                      >
                        {sport}
                      </span>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedSports.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Select at least one sport to continue
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isSaving}
                className="px-8 py-4 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={isSaving || selectedSports.length === 0}
                className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="relative z-10">Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Continue</span>
                    <ArrowRight className="w-5 h-5 relative z-10" />
                  </>
                )}
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span className="ml-2">Step 2 of 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestSelectionPage;
