import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface Booking {
  id: string;
  turfId: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
}

interface Turf {
  id: string;
  name: string;
}

interface BookingCardProps {
  booking: Booking;
  turf?: Turf;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, turf }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{turf?.name}</h4>
          <div className="text-sm text-gray-600 space-y-1 mt-1">
            <p className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(booking.date), 'EEEE, MMMM dd, yyyy')}
            </p>
            <p className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking.startTime} - {booking.endTime}
            </p>
            <p className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ₹{booking.totalAmount}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Payment: {booking.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;