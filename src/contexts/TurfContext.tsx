import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Turf, CreateTurfForm, Booking, TurfBookingRequest, BookingStatus, RequestStatus } from '../types';
import { apiService } from '../services/api';


interface TurfContextType {
  turfs: Turf[];
  bookings: Booking[];
  bookingRequests: TurfBookingRequest[];
  createTurf: (turfData: CreateTurfForm) => Promise<Turf>;
  updateTurf: (turfId: string, turfData: Partial<Turf>) => Promise<void>;
  deleteTurf: (turfId: string) => Promise<void>;
  getTurfBookings: (turfId: string) => Booking[];
  getTurfBookingRequests: (turfId: string) => TurfBookingRequest[];
  createBookingRequest: (requestData: Omit<TurfBookingRequest, 'id' | 'createdAt'>) => Promise<TurfBookingRequest>;
  approveBookingRequest: (requestId: string) => Promise<void>;
  rejectBookingRequest: (requestId: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  isLoading: boolean;
}

const TurfContext = createContext<TurfContextType | undefined>(undefined);

export const useTurf = () => {
  const context = useContext(TurfContext);
  if (context === undefined) {
    throw new Error('useTurf must be used within a TurfProvider');
  }
  return context;
};

interface TurfProviderProps {
  children: ReactNode;
}

export const TurfProvider: React.FC<TurfProviderProps> = ({ children }) => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingRequests, setBookingRequests] = useState<TurfBookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTurfs();
  }, []);

  const loadTurfs = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTurfs() as any;
      setTurfs(response.data?.turfs || []);
      
      // Also load bookings and booking requests
      const bookingsResponse = await apiService.getBookings() as any;
      setBookings(bookingsResponse.data?.bookings || []);
      
      // Note: Booking requests would need a separate API endpoint
      // For now, we'll leave it empty until the backend implements it
      setBookingRequests([]);
    } catch (error) {
      console.error('Error loading turfs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTurf = async (turfData: CreateTurfForm): Promise<Turf> => {
    setIsLoading(true);
    try {
      const response = await apiService.createTurf(turfData) as any;
      const newTurf = response.data?.turf;
      setTurfs(prev => [...prev, newTurf]);
      return newTurf;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTurf = async (turfId: string, turfData: Partial<Turf>) => {
    setIsLoading(true);
    try {
      const response = await apiService.updateTurf(turfId, turfData) as any;
      const updatedTurf = response.data?.turf;
      setTurfs(prev => prev.map(turf => 
        turf.id === turfId ? updatedTurf : turf
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTurf = async (turfId: string) => {
    setIsLoading(true);
    try {
      await apiService.deleteTurf(turfId);
      setTurfs(prev => prev.filter(turf => turf.id !== turfId));
    } finally {
      setIsLoading(false);
    }
  };

  const getTurfBookings = (turfId: string): Booking[] => {
    return bookings.filter(booking => booking.turfId === turfId);
  };

  const getTurfBookingRequests = (turfId: string): TurfBookingRequest[] => {
    return bookingRequests.filter(request => request.turfId === turfId);
  };

  const createBookingRequest = async (requestData: Omit<TurfBookingRequest, 'id' | 'createdAt'>): Promise<TurfBookingRequest> => {
    setIsLoading(true);
    try {
      // Real API call - this would need to be implemented in the backend
      const response = await apiService.createBooking(requestData) as any;
      const newRequest = response.data?.booking;
      setBookingRequests(prev => [...prev, newRequest]);
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
      setBookingRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'approved' as RequestStatus }
          : r
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBookingRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      // Real API call - this would need to be implemented in the backend
      await apiService.cancelBooking(requestId);
      setBookingRequests(prev => prev.map(r => 
        r.id === requestId 
          ? { ...r, status: 'rejected' as RequestStatus }
          : r
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setIsLoading(true);
    try {
      // Real API call
      await apiService.updateBooking(bookingId, { status });
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status, updatedAt: new Date() }
          : booking
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const value: TurfContextType = {
    turfs,
    bookings,
    bookingRequests,
    createTurf,
    updateTurf,
    deleteTurf,
    getTurfBookings,
    getTurfBookingRequests,
    createBookingRequest,
    approveBookingRequest,
    rejectBookingRequest,
    updateBookingStatus,
    isLoading,
  };

  return (
    <TurfContext.Provider value={value}>
      {children}
    </TurfContext.Provider>
  );
};