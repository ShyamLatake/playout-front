import React, { useState, useEffect } from "react";
import { Turf, Sport } from "../types";
import { apiService } from "../services/api";

interface FilterState {
  sport?: Sport;
  location: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
}

export const TurfListing: React.FC = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTurfs();
  }, [filters, currentPage]);

  const loadTurfs = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page: currentPage,
        limit: 12,
      };

      // Add filters to params
      if (filters.sport) params.sport = filters.sport;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;

      const response = (await apiService.getTurfs(params)) as any;

      // Handle different response structures and format turfs
      const turfsArray = response?.data?.turfs || response?.turfs || [];
      const formattedTurfs = turfsArray.map((turf: any) => ({
        ...turf,
        id: turf._id?.toString() || turf.id?.toString() || turf.id,
        ownerId:
          turf.ownerId?._id?.toString() ||
          turf.ownerId?.toString() ||
          turf.ownerId,
      }));

      setTurfs(formattedTurfs);

      if (response?.pagination) {
        setTotalPages(response.pagination.pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load turfs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Turfs</h1>
          <p className="text-gray-600 mt-2">
            Discover and book the perfect turf for your game
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport
              </label>
              <select
                value={filters.sport || ""}
                onChange={(e) => handleFilterChange("sport", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sports</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="tennis">Tennis</option>
                <option value="badminton">Badminton</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder="Enter location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="₹ Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="₹ Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <p>Error loading turfs: {error}</p>
            <button
              onClick={loadTurfs}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Turfs Grid */}
        {!loading && !error && (
          <>
            {turfs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No turfs found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {turfs.map((turf) => (
                    <div
                      key={turf.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            turf.images[0] ||
                            "https://via.placeholder.com/400x200?text=No+Image"
                          }
                          alt={turf.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
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
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 truncate">
                          {turf.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 truncate">
                          {turf.location}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <p className="text-blue-600 font-bold text-lg">
                            {formatCurrency(turf.pricePerHour)}/hour
                          </p>
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-sm text-gray-600">
                              {turf.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {turf.sports.slice(0, 3).map((sport) => (
                            <span
                              key={sport}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {sport}
                            </span>
                          ))}
                          {turf.sports.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{turf.sports.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 mb-3">
                          <p>
                            Open: {turf.operatingHours.open} -{" "}
                            {turf.operatingHours.close}
                          </p>
                        </div>

                        {turf.amenities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">
                              Amenities:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {turf.amenities.slice(0, 3).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {turf.amenities.length > 3 && (
                                <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{turf.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          disabled={!turf.isAvailable}
                        >
                          {turf.isAvailable ? "Book Now" : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-md ${
                                currentPage === page
                                  ? "bg-blue-500 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
