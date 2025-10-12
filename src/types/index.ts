export interface User {
  id: string;
  firebaseId?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating: number;
  sports: Sport[];
  userType: UserType;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface TurfOwner extends User {
  userType: 'turf_owner';
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  turfs: string[]; // Array of turf IDs
  totalBookings: number;
  totalRevenue: number;
}

export interface NormalUser extends User {
  userType: 'normal_user';
  joinedGames: string[]; // Array of game IDs
  totalGamesPlayed: number;
  preferredLocations: string[];
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  address: string;
  sports: Sport[];
  pricePerHour: number;
  images: string[];
  rating: number;
  amenities: string[];
  ownerId: string;
  isAvailable: boolean;
  description?: string;
  contactPhone?: string;
  operatingHours: {
    open: string;
    close: string;
  };
  facilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  sport: Sport;
  date: Date;
  startTime: string;
  endTime: string;
  turfId: string;
  turfName: string;
  turfLocation: string;
  maxPlayers: number;
  currentPlayers: number;
  requiredPlayers: number;
  perHeadContribution?: number;
  organizerId: string;
  organizerName: string;
  status: GameStatus;
  players: GamePlayer[];
  requests: JoinRequest[];
  description?: string;
  createdAt: Date;
}

export interface GamePlayer {
  userId: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
  isConfirmed: boolean;
}

export interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message?: string;
  status: RequestStatus;
  createdAt: Date;
}

export interface Booking {
  id: string;
  turfId: string;
  userId: string;
  gameId?: string; // Optional - if booking is for a specific game
  date: Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TurfBookingRequest {
  id: string;
  turfId: string;
  userId: string;
  gameId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  message?: string;
  status: RequestStatus;
  createdAt: Date;
}

export type Sport = 'cricket' | 'football' | 'tennis' | 'badminton';
export type UserType = 'normal_user' | 'turf_owner' | 'admin';
export type GameStatus = 'open' | 'full' | 'cancelled' | 'completed';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CreateGameForm {
  sport: Sport;
  date: string;
  startTime: string;
  endTime: string;
  turfId?: string; // If booking through app
  turfName: string;
  turfLocation: string;
  maxPlayers: number;
  requiredPlayers: number;
  perHeadContribution?: number;
  isOfflineBooking?: boolean; // If turf is booked offline
  description?: string;
}

export interface CreateTurfForm {
  name: string;
  location: string;
  address: string;
  sports: Sport[];
  pricePerHour: number;
  description?: string;
  contactPhone?: string;
  operatingHours: {
    open: string;
    close: string;
  };
  facilities: string[];
  amenities: string[];
}

export interface FilterOptions {
  sport?: Sport;
  date?: string;
  location?: string;
  maxPrice?: number;
}
// Admin specific interfaces
export interface AdminUser extends User {
  userType: 'admin';
  permissions: AdminPermission[];
  role: AdminRole;
}

export interface AdminStats {
  totalUsers: number;
  totalTurfs: number;
  totalGames: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingApprovals: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'user_registration' | 'turf_creation' | 'game_creation' | 'booking' | 'payment' | 'report';
  description: string;
  userId?: string;
  userName?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  evidence?: string[];
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface TurfReport {
  id: string;
  turfId: string;
  turfName: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  evidence?: string[];
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface AdminNotification {
  id: string;
  type: 'approval_required' | 'report_submitted' | 'payment_issue' | 'system_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  actionRequired: boolean;
  relatedId?: string;
  createdAt: Date;
}

export interface SystemSettings {
  id: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireTurfApproval: boolean;
  maxBookingsPerUser: number;
  cancellationPolicy: {
    hoursBeforeGame: number;
    refundPercentage: number;
  };
  paymentSettings: {
    processingFee: number;
    platformCommission: number;
  };
  updatedAt: Date;
  updatedBy: string;
}

export type AdminPermission = 
  | 'manage_users' 
  | 'manage_turfs' 
  | 'manage_games' 
  | 'manage_bookings' 
  | 'view_reports' 
  | 'manage_payments' 
  | 'system_settings'
  | 'view_analytics';

export type AdminRole = 'super_admin' | 'admin' | 'moderator';

export type ReportReason = 
  | 'inappropriate_behavior' 
  | 'fake_profile' 
  | 'spam' 
  | 'harassment' 
  | 'fraud' 
  | 'poor_turf_condition' 
  | 'misleading_information' 
  | 'other';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';