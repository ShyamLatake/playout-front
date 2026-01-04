import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Turf } from '../../types';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  RefreshCw,
  MapPin,
  IndianRupee,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Save
} from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  notes?: string;
}

const TurfBookings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    startTime: '',
    endTime: '',
    notes: '',
    paymentStatus: 'paid' as 'paid' | 'pending'
  });
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTurf();
      fetchBookings();
    }
  }, [id, selectedDate, statusFilter]);

  const fetchTurf = async () => {
    try {
      const response: any = await apiService.getTurfById(id!);
      let turfData = response.data?.turf || response.data || response;
      
      if (turfData._id) {
        turfData = {
          ...turfData,
          id: turfData._id,
          createdAt: new Date(turfData.createdAt),
          updatedAt: new Date(turfData.updatedAt)
        };
      }
      
      setTurf(turfData);
      generateTimeSlots(turfData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch turf details');
    }
  };

  const generateTimeSlots = (turfData: Turf) => {
    const slots: string[] = [];
    const openTime = turfData.operatingHours.open;
    const closeTime = turfData.operatingHours.close;
    const slotDuration = turfData.operatingHours.slotDuration || 60;

    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);

    let currentTime = openHour * 60 + openMin;
    const endTime = closeHour * 60 + closeMin;

    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60);
      const min = currentTime % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeString);
      currentTime += slotDuration;
    }

    setTimeSlots(slots);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        date: selectedDate,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };

      const response: any = await apiService.getTurfBookings(id!, params);
      
      // Handle response structure
      let bookingsData = response.data?.bookings || response.data || response;
      if (!Array.isArray(bookingsData)) {
        bookingsData = [];
      }

      // Map the API response to match our Booking interface
      const mappedBookings = bookingsData.map((booking: any) => ({
        ...booking,
        id: booking._id || booking.id,
        createdAt: booking.createdAt || new Date().toISOString(),
        date: booking.date || selectedDate
      }));

      setBookings(mappedBookings);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
      // Fallback to empty array on error
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId);
      await apiService.updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any }
          : booking
      ));
      
      setError(null);
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      setError(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isSlotBooked = (time: string) => {
    return bookings.some(booking => 
      booking.status !== 'cancelled' && 
      booking.startTime <= time && 
      booking.endTime > time
    );
  };

  const openBookingModal = (slot: string) => {
    setSelectedSlot(slot);
    setBookingForm({
      customerName: '',
      customerPhone: '',
      startTime: slot,
      endTime: getNextSlot(slot),
      notes: '',
      paymentStatus: 'paid'
    });
    setShowBookingModal(true);
  };

  const getNextSlot = (currentSlot: string) => {
    const currentIndex = timeSlots.indexOf(currentSlot);
    if (currentIndex !== -1 && currentIndex < timeSlots.length - 1) {
      return timeSlots[currentIndex + 1];
    }
    return currentSlot;
  };

  const handleBookingFormChange = (field: string, value: string) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createOwnerBooking = async () => {
    if (!bookingForm.customerName || !bookingForm.startTime || !bookingForm.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreatingBooking(true);
      const bookingData = {
        turfId: id,
        customerName: bookingForm.customerName,
        customerPhone: bookingForm.customerPhone || undefined,
        date: selectedDate,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        totalAmount: calculateBookingAmount(bookingForm.startTime, bookingForm.endTime),
        paymentStatus: bookingForm.paymentStatus,
        notes: bookingForm.notes || undefined,
        status: 'confirmed', // Owner bookings are auto-confirmed
        bookingType: 'owner' // Mark as owner booking
      };

      const response: any = await apiService.createBooking(bookingData);
      
      // Handle response structure
      let newBooking = response.data?.booking || response.data || response;
      
      // Map the response to match our interface
      const mappedBooking: Booking = {
        ...newBooking,
        id: newBooking._id || newBooking.id,
        userId: newBooking.userId || 'owner',
        userName: newBooking.customerName || bookingForm.customerName,
        userPhone: newBooking.customerPhone || bookingForm.customerPhone,
        createdAt: newBooking.createdAt || new Date().toISOString()
      };

      // Add to local state
      setBookings(prev => [...prev, mappedBooking]);
      setShowBookingModal(false);
      setError(null);
      
      // Reset form
      closeBookingModal();
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setCreatingBooking(false);
    }
  };

  const calculateBookingAmount = (startTime: string, endTime: string) => {
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    const duration = endIndex - startIndex;
    const slotDuration = turf?.operatingHours.slotDuration || 60;
    const hours = (duration * slotDuration) / 60;
    return Math.round(hours * (turf?.pricePerHour || 0));
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedSlot('');
    setBookingForm({
      customerName: '',
      customerPhone: '',
      startTime: '',
      endTime: '',
      notes: '',
      paymentStatus: 'paid'
    });
  };

  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await apiService.deleteBooking(bookingId);
      
      // Remove from local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setError(null);
    } catch (err: any) {
      console.error('Error deleting booking:', err);
      setError(err.message || 'Failed to delete booking');
    }
  };

  if (loading && !turf) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Turf not found'}</div>
          <button
            onClick={() => navigate('/turf-owner/turfs')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to My Turfs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/turf-owner/turfs')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to My Turfs
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{turf.name} - Bookings</h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                {turf.location}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchBookings}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Filter
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Customer
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name or phone..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchBookings}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Time Slots Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Time Slots - {new Date(selectedDate).toLocaleDateString()}
            </h2>
            
            <div className="space-y-2">
              {timeSlots.map((slot) => {
                const isBooked = isSlotBooked(slot);
                const booking = bookings.find(b => b.startTime <= slot && b.endTime > slot && b.status !== 'cancelled');
                
                return (
                  <div
                    key={slot}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isBooked 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{slot}</span>
                      {isBooked ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-600">Booked</span>
                          {booking && (
                            <span className="text-xs text-gray-600">{booking.userName}</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">Available</span>
                          <button
                            onClick={() => openBookingModal(slot)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Book
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Bookings ({bookings.length})
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4">
                      <div className="animate-pulse">
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-32 h-5 bg-gray-200 rounded"></div>
                          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-48 h-4 bg-gray-200 rounded"></div>
                          <div className="w-36 h-4 bg-gray-200 rounded"></div>
                          <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">No bookings for the selected date and filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            {booking.userName}
                          </h3>
                          {booking.userPhone && (
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              <Phone className="h-4 w-4" />
                              {booking.userPhone}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-medium flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {booking.totalAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Booked On</p>
                          <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Notes:</p>
                          <p className="text-gray-800">{booking.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                disabled={updatingStatus === booking.id}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {updatingStatus === booking.id ? 'Confirming...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                disabled={updatingStatus === booking.id}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                {updatingStatus === booking.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              disabled={updatingStatus === booking.id}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                              {updatingStatus === booking.id ? 'Completing...' : 'Mark Complete'}
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Booking"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteBooking(booking.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Slot</h2>
                <button
                  onClick={closeBookingModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Selected Slot Info */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Slot</h3>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-4 w-4" />
                    <span>{selectedSlot} - {getNextSlot(selectedSlot)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={bookingForm.customerName}
                    onChange={(e) => handleBookingFormChange('customerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={bookingForm.customerPhone}
                      onChange={(e) => handleBookingFormChange('customerPhone', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <select
                      value={bookingForm.startTime}
                      onChange={(e) => handleBookingFormChange('startTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot} disabled={isSlotBooked(slot)}>
                          {slot} {isSlotBooked(slot) ? '(Booked)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time *
                    </label>
                    <select
                      value={bookingForm.endTime}
                      onChange={(e) => handleBookingFormChange('endTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={bookingForm.paymentStatus}
                    onChange={(e) => handleBookingFormChange('paymentStatus', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Amount Display */}
                {bookingForm.startTime && bookingForm.endTime && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {calculateBookingAmount(bookingForm.startTime, bookingForm.endTime)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => handleBookingFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Any special notes or requirements..."
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeBookingModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createOwnerBooking}
                    disabled={creatingBooking}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {creatingBooking ? 'Creating...' : 'Create Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurfBookings;