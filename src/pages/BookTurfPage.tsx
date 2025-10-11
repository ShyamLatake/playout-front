import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';

import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Phone,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

const BookTurfPage: React.FC = () => {
  const navigate = useNavigate();
  const { turfId } = useParams<{ turfId: string }>();
  const { turfs, createBookingRequest, isLoading } = useTurf();
  const { user } = useUser();

  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '17:00',
    endTime: '19:00',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const turf = turfs.find(t => t.id === turfId);

  const calculateTotal = () => {
    if (!bookingData.startTime || !bookingData.endTime) return 0;

    const start = new Date(`2000-01-01T${bookingData.startTime}`);
    const end = new Date(`2000-01-01T${bookingData.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    return hours > 0 ? hours * (turf?.pricePerHour || 0) : 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bookingData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = 'Cannot book for past dates';
      }
    }

    if (!bookingData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!bookingData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (bookingData.startTime && bookingData.endTime && bookingData.startTime >= bookingData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Check if time is within operating hours
    if (turf && bookingData.startTime && bookingData.endTime) {
      if (bookingData.startTime < turf.operatingHours.open || bookingData.endTime > turf.operatingHours.close) {
        newErrors.time = `Booking must be within operating hours (${turf.operatingHours.open} - ${turf.operatingHours.close})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !turf || !user) {
      return;
    }

    try {
      await createBookingRequest({
        turfId: turf.id,
        userId: user.id,
        date: new Date(bookingData.date),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount: calculateTotal(),
        message: bookingData.message,
        status: 'pending'
      });

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error creating booking request:', error);
      setErrors({ general: 'Failed to create booking request. Please try again.' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please login to book a turf</h2>
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Turf not found</h2>
          <button
            onClick={() => navigate('/turfs')}
            className="btn-primary"
          >
            Browse Turfs
          </button>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Booking Request Sent!</h2>
          <p className="text-gray-600 mb-6">
            Your booking request has been sent to the turf owner. You'll be notified once it's approved.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/games')}
              className="btn-primary w-full"
            >
              Browse Games
            </button>
            <button
              onClick={() => navigate('/turfs')}
              className="btn-secondary w-full"
            >
              Browse More Turfs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Book Turf</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Turf Info */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{turf.name}</h2>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {turf.location}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{turf.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Price per hour:</span>
                <p className="font-medium text-turf-600">₹{turf.pricePerHour}</p>
              </div>
              <div>
                <span className="text-gray-500">Operating hours:</span>
                <p className="font-medium">{turf.operatingHours.open} - {turf.operatingHours.close}</p>
              </div>
              <div>
                <span className="text-gray-500">Sports:</span>
                <p className="font-medium capitalize">{turf.sports.join(', ')}</p>
              </div>
              {turf.contactPhone && (
                <div>
                  <span className="text-gray-500">Contact:</span>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {turf.contactPhone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h3 className="text-lg font-semibold">Booking Details</h3>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className={`input-field ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time *
                </label>
                <input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, startTime: e.target.value }))}
                  min={turf.operatingHours.open}
                  max={turf.operatingHours.close}
                  className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                />
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData(prev => ({ ...prev, endTime: e.target.value }))}
                  min={turf.operatingHours.open}
                  max={turf.operatingHours.close}
                  className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
                />
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Message (Optional)
              </label>
              <textarea
                value={bookingData.message}
                onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Any special requirements or notes for the turf owner..."
                rows={3}
                className="input-field"
              />
            </div>

            {/* Total Calculation */}
            {bookingData.startTime && bookingData.endTime && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {((new Date(`2000-01-01T${bookingData.endTime}`).getTime() - new Date(`2000-01-01T${bookingData.startTime}`).getTime()) / (1000 * 60 * 60)).toFixed(1)} hours
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">₹{turf.pricePerHour}/hour</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg text-turf-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ₹{calculateTotal()}
                  </span>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="text-red-500 text-sm text-center">{errors.general}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || calculateTotal() <= 0}
              className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending Request...' : 'Send Booking Request'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your booking request will be sent to the turf owner for approval.
              You'll be notified once it's confirmed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTurfPage;