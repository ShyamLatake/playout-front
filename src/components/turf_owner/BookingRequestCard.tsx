import React from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface BookingRequest {
  id: string;
  turfId: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  message?: string;
  status: string;
}

interface Turf {
  id: string;
  name: string;
}

interface BookingRequestCardProps {
  request: BookingRequest;
  turf?: Turf;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  request,
  turf,
  onApprove,
  onReject,
  isLoading = false,
  showActions = true,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{turf?.name}</h4>
          <div className="text-sm text-gray-600 space-y-1 mt-1">
            <p className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(request.date), "EEEE, MMMM dd, yyyy")}
            </p>
            <p className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {request.startTime} - {request.endTime}
            </p>
            <p className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />₹{request.totalAmount}
            </p>
            {request.message && (
              <p className="text-gray-700 mt-2">"{request.message}"</p>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(request.id)}
              className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1"
              disabled={isLoading}
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1"
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequestCard;

