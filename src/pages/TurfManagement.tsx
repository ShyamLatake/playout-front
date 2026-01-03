import React, { useState, useEffect } from "react";
import { Turf } from "../types";
import { apiService } from "../services/api";
import { TurfForm, AnalyticsDashboard } from "../components/turf_owner";
import { useToast } from "../contexts/ToastContext";

type TabType = "overview" | "turfs" | "create" | "analytics";

export const TurfManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadTurfs();
  }, []);

  const loadTurfs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = (await apiService.getMyTurfs()) as any;
      console.log("response", response.json());
      if (response.success && response.data?.turfs) {
        console.log(response.data.turfs);
        const formattedTurfs = response.data.turfs.map((turf: any) => ({
          ...turf,
          id: turf._id || turf.id,
        }));
        setTurfs(formattedTurfs);
      } else {
        setTurfs([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load turfs";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTurfCreated = (newTurf: Turf) => {
    setTurfs((prev) => [...prev, newTurf]);
    setActiveTab("turfs");
  };

  const handleTurfUpdated = (updatedTurf: Turf) => {
    setTurfs((prev) =>
      prev.map((turf) => (turf.id === updatedTurf.id ? updatedTurf : turf))
    );
    setSelectedTurf(null);
    setActiveTab("turfs");
  };

  const handleDeleteTurf = async (turfId: string) => {
    if (!confirm("Are you sure you want to delete this turf?")) return;

    try {
      const response = (await apiService.deleteTurf(turfId)) as any;
      if (response.success) {
        setTurfs((prev) => prev.filter((turf) => turf.id !== turfId));
        showSuccess("Turf deleted successfully");
      } else {
        throw new Error(response.message || "Failed to delete turf");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete turf";
      showError(errorMessage);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AnalyticsDashboard />;

      case "turfs":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Turfs</h2>
              <button
                onClick={() => setActiveTab("create")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add New Turf
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : turfs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven't created any turfs yet.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Your First Turf
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turfs.map((turf) => (
                  <div
                    key={turf.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      src={
                        turf.images[0] ||
                        "https://via.placeholder.com/400x200?text=No+Image"
                      }
                      alt={turf.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {turf.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {turf.location}
                      </p>
                      <p className="text-blue-600 font-medium mb-2">
                        ₹{turf.pricePerHour}/hour
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {turf.sports.map((sport) => (
                          <span
                            key={sport}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {turf.rating.toFixed(1)}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            turf.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {turf.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTurf(turf);
                            setActiveTab("analytics");
                          }}
                          className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Analytics
                        </button>
                        <button
                          onClick={() => setSelectedTurf(turf)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTurf(turf.id)}
                          className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "create":
        return (
          <TurfForm
            onSuccess={handleTurfCreated}
            onCancel={() => setActiveTab("turfs")}
          />
        );

      case "analytics":
        return (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setActiveTab("turfs")}
                className="text-blue-500 hover:text-blue-700"
              >
                ← Back to Turfs
              </button>
              {selectedTurf && (
                <h2 className="text-xl font-semibold mt-2">
                  Analytics for {selectedTurf.name}
                </h2>
              )}
            </div>
            <AnalyticsDashboard turfId={selectedTurf?.id} />
          </div>
        );

      default:
        return null;
    }
  };

  // Edit turf modal
  if (selectedTurf && activeTab !== "analytics") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
          <TurfForm
            initialData={selectedTurf}
            isEditing={true}
            turfId={selectedTurf.id}
            onSuccess={handleTurfUpdated}
            onCancel={() => setSelectedTurf(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Turf Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your turfs and view analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "turfs", label: "My Turfs", icon: "🏟️" },
              { id: "create", label: "Create Turf", icon: "➕" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};
