import React from 'react';
import { MapPin, Star, Settings } from 'lucide-react';

interface Turf {
  id: string;
  name: string;
  location: string;
  rating: number;
  sports: string[];
  pricePerHour: number;
  isAvailable: boolean;
}

interface TurfCardProps {
  turf: Turf;
  bookingsCount: number;
  onEdit: (turfId: string) => void;
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, bookingsCount, onEdit }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold">{turf.name}</h4>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {turf.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{turf.rating}</span>
          </div>
          <button
            onClick={() => onEdit(turf.id)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Sports:</span>
          <p className="font-medium capitalize">{turf.sports.join(', ')}</p>
        </div>
        <div>
          <span className="text-gray-500">Price:</span>
          <p className="font-medium">₹{turf.pricePerHour}/hour</p>
        </div>
        <div>
          <span className="text-gray-500">Bookings:</span>
          <p className="font-medium">{bookingsCount}</p>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <p className={`font-medium ${turf.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {turf.isAvailable ? 'Available' : 'Unavailable'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;