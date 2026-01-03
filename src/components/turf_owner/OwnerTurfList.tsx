import React from "react";
import { useNavigate } from "react-router-dom";
import { Turf } from "../../types";
import { MapPin, Star, Settings, Clock } from "lucide-react";

interface OwnerTurfListProps {
  turfs: Turf[];
  isLoading: boolean;
  getTurfBookings: (turfId: string) => any[];
  onCreateNew?: () => void;
}

const OwnerTurfList: React.FC<OwnerTurfListProps> = ({
  turfs,
  isLoading,
  getTurfBookings,
  onCreateNew,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <MapPin className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No turfs yet</h3>
        <p className="text-gray-600 mb-4">
          Start by adding your first turf to begin accepting bookings
        </p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Your First Turf
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          My Turfs ({turfs.length})
        </h3>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Add New Turf
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => {
          const bookingsCount = getTurfBookings(turf.id).length;
          return (
            <div
              key={turf.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Turf Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                {turf.images && turf.images.length > 0 ? (
                  <img
                    src={turf.images[0]}
                    alt={turf.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <MapPin className="w-16 h-16 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      turf.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {turf.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  {!turf.isVerified && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Turf Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {turf.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {turf.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">
                      {turf.rating > 0 ? turf.rating.toFixed(1) : "New"}
                    </span>
                  </div>
                </div>

                {/* Sports */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {turf.sports.slice(0, 3).map((sport) => (
                    <span
                      key={sport}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                    >
                      {sport}
                    </span>
                  ))}
                  {turf.sports.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{turf.sports.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <p className="font-semibold text-primary-600">
                      ₹{turf.pricePerHour}/hr
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bookings:</span>
                    <p className="font-semibold">{bookingsCount}</p>
                  </div>
                </div>

                {/* Operating Hours */}
                {turf.operatingHours && (
                  <div className="text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {turf.operatingHours.open} - {turf.operatingHours.close}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/turf/${turf.id}`)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/turf/${turf.id}/bookings`)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => navigate(`/turf/${turf.id}/edit`)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Edit Turf"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerTurfList;


