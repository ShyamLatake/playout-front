import { useMemo } from 'react';
import { format } from 'date-fns';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';

export const useTurfOwnerDashboard = () => {
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

  // Filter data for current user's turfs
  const userTurfs = useMemo(() => 
    turfs.filter(turf => turf.ownerId === user?.id), 
    [turfs, user?.id]
  );

  const userTurfIds = useMemo(() => 
    userTurfs.map(turf => turf.id), 
    [userTurfs]
  );

  const userBookings = useMemo(() => 
    bookings.filter(booking => userTurfIds.includes(booking.turfId)), 
    [bookings, userTurfIds]
  );

  const userBookingRequests = useMemo(() => 
    bookingRequests.filter(request =>
      userTurfIds.includes(request.turfId) && request.status === 'pending'
    ), 
    [bookingRequests, userTurfIds]
  );

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = userBookings
      .filter(booking => booking.paymentStatus === 'paid')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    const todayBookings = userBookings.filter(booking =>
      format(new Date(booking.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );

    return {
      totalTurfs: userTurfs.length,
      totalRevenue,
      todayBookingsCount: todayBookings.length,
      pendingRequestsCount: userBookingRequests.length,
    };
  }, [userTurfs.length, userBookings, userBookingRequests.length]);

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

  const getTurfById = (turfId: string) => {
    return userTurfs.find(turf => turf.id === turfId);
  };

  return {
    userTurfs,
    userBookings,
    userBookingRequests,
    stats,
    isLoading,
    getTurfBookings,
    handleApproveRequest,
    handleRejectRequest,
    getTurfById,
  };
};