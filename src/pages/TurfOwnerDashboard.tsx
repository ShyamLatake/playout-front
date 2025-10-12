import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';
import { 
  Plus, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  DollarSign,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  TrendingUp
} from 'lucide-react';

const TurfOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { 
    turfs, 
    bookings, 
    bookingRequests, 
    getTurfBookings, 
    approveBookingRequest,
    rejectBookingRequest,
    isLoading 
  } = useTurf();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'turfs' | 'bookings' | 'requests'>('overview');

  // Filter data for current user's turfs
  const userTurfs = turfs.filter(turf => turf.ownerId === user?.id);
  const userTurfIds = userTurfs.map(turf => turf.id);
  const userBookings = bookings.filter(booking => userTurfIds.includes(booking.turfId));
  const userBookingRequests = bookingRequests.filter(request => 
    userTurfIds.includes(request.turfId) && request.status === 'pending'
  );

  // Calculate stats
  const totalRevenue = userBookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  const todayBookings = userBookings.filter(booking => 
    format(new Date(booking.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveBookingRequest(requestId);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectBookingRequest(requestId);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (user?.userType !== 'turf_owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is only accessible to turf owners.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Turf Owner Dashboard</h1>
              <p className="text-gray-600">Manage your turfs and bookings</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/create-turf')}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                Add New Turf
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Turfs</p>
                  <p className="text-2xl font-bold text-primary-600">{userTurfs.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-blue-600">{todayBookings.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-orange-600">{userBookingRequests.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'overview', label: 'Overview', icon: BarChart3 },
                  { key: 'turfs', label: 'My Turfs', icon: MapPin },
                  { key: 'bookings', label: 'Bookings', icon: Calendar },
                  { key: 'requests', label: 'Requests', icon: Clock },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.key
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {userBookingRequests.slice(0, 5).map((request) => {
                        const turf = userTurfs.find(t => t.id === request.turfId);
                        return (
                          <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">New booking request</p>
                              <p className="text-sm text-gray-600">
                                {turf?.name} • {format(new Date(request.date), 'MMM dd, yyyy')} • {request.startTime}-{request.endTime}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                disabled={isLoading}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                disabled={isLoading}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {userBookingRequests.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Turfs Tab */}
              {activeTab === 'turfs' && (
                <div className="space-y-4">
                  {userTurfs.length > 0 ? (
                    userTurfs.map((turf) => (
                      <div key={turf.id} className="border border-gray-200 rounded-lg p-4">
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
                              onClick={() => navigate(`/turf/${turf.id}/edit`)}
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
                            <p className="font-medium">{getTurfBookings(turf.id).length}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <p className={`font-medium ${turf.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {turf.isAvailable ? 'Available' : 'Unavailable'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No turfs yet</h3>
                      <p className="text-gray-600 mb-4">Start by adding your first turf</p>
                      <button
                        onClick={() => navigate('/create-turf')}
                        className="btn-primary"
                      >
                        Add Your First Turf
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {userBookings.length > 0 ? (
                    userBookings.map((booking) => {
                      const turf = userTurfs.find(t => t.id === booking.turfId);
                      return (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
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
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Payment: {booking.paymentStatus}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-600">Bookings will appear here once users start booking your turfs</p>
                    </div>
                  )}
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {userBookingRequests.length > 0 ? (
                    userBookingRequests.map((request) => {
                      const turf = userTurfs.find(t => t.id === request.turfId);
                      return (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{turf?.name}</h4>
                              <div className="text-sm text-gray-600 space-y-1 mt-1">
                                <p className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(request.date), 'EEEE, MMMM dd, yyyy')}
                                </p>
                                <p className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {request.startTime} - {request.endTime}
                                </p>
                                <p className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  ₹{request.totalAmount}
                                </p>
                                {request.message && (
                                  <p className="text-gray-700 mt-2">"{request.message}"</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1"
                                disabled={isLoading}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1"
                                disabled={isLoading}
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                      <p className="text-gray-600">Booking requests will appear here for your approval</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfOwnerDashboard;