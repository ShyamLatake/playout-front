import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Turf,
  Booking,
  TurfBookingRequest,
  BookingStatus,
  RequestStatus,
} from "../types";
import { apiService } from "../services/api";

interface TurfContextType {
  turfs: Turf[];
  myTurfs: Turf[];
  bookings: Booking[];
  bookingRequests: TurfBookingRequest[];
  createTurf: (turfData: any) => Promise<Turf>;
  updateTurf: (turfId: string, turfData: Partial<Turf>) => Promise<void>;
  deleteTurf: (turfId: string) => Promise<void>;
  getMyTurfs: () => Promise<void>;
  getTurfBookings: (turfId: string) => Booking[];
  getTurfBookingRequests: (turfId: string) => TurfBookingRequest[];
  createBookingRequest: (
    requestData: Omit<TurfBookingRequest, "id" | "createdAt">
  ) => Promise<TurfBookingRequest>;
  approveBookingRequest: (requestId: string) => Promise<void>;
  rejectBookingRequest: (requestId: string) => Promise<void>;
  updateBookingStatus: (
    bookingId: string,
    status: BookingStatus
  ) => Promise<void>;
  isLoading: boolean;
}

const TurfContext = createContext<TurfContextType | undefined>(undefined);

export const useTurf = () => {
  const context = useContext(TurfContext);
  if (context === undefined) {
    throw new Error("useTurf must be used within a TurfProvider");
  }
  return context;
};

interface TurfProviderProps {
  children: ReactNode;
}

export const TurfProvider: React.FC<TurfProviderProps> = ({ children }) => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [myTurfs, setMyTurfs] = useState<Turf[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingRequests, setBookingRequests] = useState<TurfBookingRequest[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTurfs();
  }, []);

  const loadTurfs = async () => {
    try {
      setIsLoading(true);
      // Fetch all turfs with a high limit (or fetch multiple pages if needed)
      const response = (await apiService.getTurfs({ limit: 100 })) as any;

      // Handle different response structures
      const turfsArray = response?.data?.turfs || response?.turfs || [];

      const formattedTurfs = turfsArray.map((turf: any) => ({
        ...turf,
        id: turf._id?.toString() || turf.id?.toString() || turf.id,
        ownerId:
          turf.ownerId?._id?.toString() ||
          turf.ownerId?.toString() ||
          turf.ownerId,
      }));

      setTurfs(formattedTurfs);

      // Also load bookings and booking requests
      try {
        const bookingsResponse = (await apiService.getBookings()) as any;
        if (bookingsResponse.success && bookingsResponse.data?.bookings) {
          const formattedBookings = bookingsResponse.data.bookings.map(
            (booking: any) => ({
              ...booking,
              id: booking._id || booking.id,
              turfId:
                booking.turfId?._id || booking.turfId?.id || booking.turfId,
            })
          );
          setBookings(formattedBookings);
        }
      } catch (bookingError) {
        // Bookings might not be accessible, that's okay
        console.warn("Could not load bookings:", bookingError);
      }

      // Note: Booking requests would need a separate API endpoint
      // For now, we'll leave it empty until the backend implements it
      setBookingRequests([]);
    } catch (error) {
      console.error("Error loading turfs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTurf = async (turfData: any): Promise<Turf> => {
    setIsLoading(true);
    try {
      const response = (await apiService.createTurf(turfData)) as any;
      if (!response.success) {
        throw new Error(response.message || "Failed to create turf");
      }
      const newTurf = response.data?.turf;
      if (newTurf) {
        // Map backend _id to frontend id
        const formattedTurf = {
          ...newTurf,
          id: newTurf._id || newTurf.id,
        };
        setTurfs((prev) => [...prev, formattedTurf]);
        setMyTurfs((prev) => [...prev, formattedTurf]);
        return formattedTurf;
      }
      throw new Error("No turf data returned from server");
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.error?.message || "Failed to create turf";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTurf = async (turfId: string, turfData: Partial<Turf>) => {
    setIsLoading(true);
    try {
      const response = (await apiService.updateTurf(turfId, turfData)) as any;
      if (!response.success) {
        throw new Error(response.message || "Failed to update turf");
      }
      const updatedTurf = {
        ...response.data?.turf,
        id: response.data?.turf?._id || response.data?.turf?.id || turfId,
      };
      setTurfs((prev) =>
        prev.map((turf) => (turf.id === turfId ? updatedTurf : turf))
      );
      setMyTurfs((prev) =>
        prev.map((turf) => (turf.id === turfId ? updatedTurf : turf))
      );
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.error?.message || "Failed to update turf";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTurf = async (turfId: string) => {
    setIsLoading(true);
    try {
      const response = (await apiService.deleteTurf(turfId)) as any;
      if (!response.success) {
        throw new Error(response.message || "Failed to delete turf");
      }
      setTurfs((prev) => prev.filter((turf) => turf.id !== turfId));
      setMyTurfs((prev) => prev.filter((turf) => turf.id !== turfId));
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.error?.message || "Failed to delete turf";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getMyTurfs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = (await apiService.getMyTurfs()) as any;

      // Handle different response structures
      const turfsArray = response?.data?.turfs || response?.turfs || [];

      const formattedTurfs = turfsArray.map((turf: any) => ({
        ...turf,
        id: turf._id?.toString() || turf.id?.toString() || turf.id,
        ownerId:
          turf.ownerId?._id?.toString() ||
          turf.ownerId?.toString() ||
          turf.ownerId,
      }));

      setMyTurfs(formattedTurfs);
    } catch (error) {
      console.error("Error loading my turfs:", error);
      setMyTurfs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTurfBookings = (turfId: string): Booking[] => {
    return bookings.filter((booking) => booking.turfId === turfId);
  };

  const getTurfBookingRequests = (turfId: string): TurfBookingRequest[] => {
    return bookingRequests.filter((request) => request.turfId === turfId);
  };

  const createBookingRequest = async (
    requestData: Omit<TurfBookingRequest, "id" | "createdAt">
  ): Promise<TurfBookingRequest> => {
    setIsLoading(true);
    try {
      // Real API call - this would need to be implemented in the backend
      const response = (await apiService.createBooking(requestData)) as any;
      const newRequest = response.data?.booking;
      setBookingRequests((prev) => [...prev, newRequest]);
      return newRequest;
    } finally {
      setIsLoading(false);
    }
  };

  const approveBookingRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      // Real API call - this would need to be implemented in the backend
      await apiService.confirmBooking(requestId);
      setBookingRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "approved" as RequestStatus } : r
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBookingRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      // Real API call - this would need to be implemented in the backend
      await apiService.cancelBooking(requestId);
      setBookingRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "rejected" as RequestStatus } : r
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    setIsLoading(true);
    try {
      // Real API call
      await apiService.updateBooking(bookingId, { status });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status, updatedAt: new Date() }
            : booking
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const value: TurfContextType = {
    turfs,
    myTurfs,
    bookings,
    bookingRequests,
    createTurf,
    updateTurf,
    deleteTurf,
    getMyTurfs,
    getTurfBookings,
    getTurfBookingRequests,
    createBookingRequest,
    approveBookingRequest,
    rejectBookingRequest,
    updateBookingStatus,
    isLoading,
  };

  return <TurfContext.Provider value={value}>{children}</TurfContext.Provider>;
};
