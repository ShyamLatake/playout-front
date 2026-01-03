import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useUser } from '../contexts/UserContext';
import { useTurfOwnerDashboard } from '../hooks/useTurfOwnerDashboard';
import {
  DashboardHeader,
  StatCard,
  TabNavigation,
  EmptyState,
} from '../components/common';
import {
  BookingCard,
  BookingRequestCard,
  OwnerTurfList,
} from '../components/turf_owner';
import {
  MapPin,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  CheckCircle,
  XCircle,
  Star,
  Settings
} from 'lucide-react';

const TurfOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    userTurfs,
    userBookings,
    userBookingRequests,
    stats,
    isLoading,
    getTurfBookings,
    handleApproveRequest,
    handleRejectRequest,
    getTurfById,
  } = useTurfOwnerDashboard();

  const [activeTab, setActiveTab] = useState<'overview' | 'turfs' | 'bookings' | 'requests'>('overview');

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'turfs', label: 'My Turfs', icon: MapPin },
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'requests', label: 'Requests', icon: Clock },
  ];

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
      <DashboardHeader
        title="Turf Owner Dashboard"
        subtitle="Manage your turfs and bookings"
        actionLabel="Add New Turf"
        onAction={() => navigate('/create-turf')}
      />

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/turf-management')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics & Management
            </button>
            <button
              onClick={() => navigate('/create-turf')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Add New Turf
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Turfs"
              value={stats.totalTurfs}
              icon={MapPin}
              color="primary"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              title="Today's Bookings"
              value={stats.todayBookingsCount}
              icon={Calendar}
              color="blue"
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequestsCount}
              icon={Clock}
              color="orange"
            />
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as any)}
            />

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {userBookingRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">New booking request</p>
                            <p className="text-sm text-gray-600">
                              {getTurfById(request.turfId)?.name} • {format(new Date(request.date), 'MMM dd, yyyy')} • {request.startTime}-{request.endTime}
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
                      ))}
                      {userBookingRequests.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Turfs Tab */}
              {activeTab === 'turfs' && (
                <OwnerTurfList
                  turfs={userTurfs}
                  isLoading={isLoading}
                  getTurfBookings={getTurfBookings}
                  onCreateNew={() => navigate('/create-turf')}
                />
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {userBookings.length > 0 ? (
                    userBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        turf={getTurfById(booking.turfId)}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={Calendar}
                      title="No bookings yet"
                      description="Bookings will appear here once users start booking your turfs"
                    />
                  )}
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {userBookingRequests.length > 0 ? (
                    userBookingRequests.map((request) => (
                      <BookingRequestCard
                        key={request.id}
                        request={request}
                        turf={getTurfById(request.turfId)}
                        onApprove={handleApproveRequest}
                        onReject={handleRejectRequest}
                        isLoading={isLoading}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={Clock}
                      title="No pending requests"
                      description="Booking requests will appear here for your approval"
                    />
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