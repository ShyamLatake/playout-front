import { useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { useTurf } from '../contexts/TurfContext';
import { useUser } from '../contexts/UserContext';

export const useTurfOwnerDashboard = () => {
  const { user } = useUser();
  const {
    myTurfs,
    turfs,
    bookings,
    bookingRequests,
    getMyTurfs,
    getTurfBookings,
    approveBookingRequest,
    rejectBookingRequest,
    isLoading
  } = useTurf();

  // Fetch user's turfs when component mounts or user changes
  useEffect(() => {
    if (user?.userType === 'turf_owner' && user?.id) {
      getMyTurfs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.userType]); // getMyTurfs is memoized, so it's stable

  // Use myTurfs from context, fallback to filtered turfs
  const userTurfs = useMemo(() => {
    // Always prefer myTurfs if available (from getMyTurfs API call)
    if (myTurfs && myTurfs.length > 0) {
      return myTurfs;
    }
    // Fallback to filtering all turfs by ownerId
    if (user?.id) {
      return turfs.filter(turf => {
        const ownerIdStr = turf.ownerId?.toString() || turf.ownerId;
        const userIdStr = user.id?.toString() || user.id;
        return ownerIdStr === userIdStr;
      });
    }
    return [];
  }, [myTurfs, turfs, user?.id]);

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