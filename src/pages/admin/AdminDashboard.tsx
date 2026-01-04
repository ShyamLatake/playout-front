import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
// import { format } from 'date-fns';
import AdminMobileView from "../../components/admin/AdminMobileView";
import AdminTabletView from "../../components/admin/AdminTabletView";
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Settings,
  BarChart3,
  Activity,
  // Clock,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  // UserCheck,
  FileText,
  Bell,
  Search,
  // Filter,
  Download,
  RefreshCw,
  Zap,
  Target,
  Dumbbell,
  Star,
  // Phone,
  // Mail,
  MapPinIcon,
  Edit,
  Trash2,
} from "lucide-react";
import type {
  AdminStats,
  // AdminActivity,
  // UserReport,
  // TurfReport,
  // AdminNotification,
  // User,
  // Turf,
  // Game,
  // Booking
} from "../../types";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "users"
    | "turfs"
    | "games"
    | "bookings"
    | "reports"
    | "settings"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  // Mock data - replace with actual API calls
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    totalTurfs: 89,
    totalGames: 2156,
    totalBookings: 3421,
    totalRevenue: 125000,
    activeUsers: 342,
    pendingApprovals: 12,
    recentActivity: [],
  });

  // const [users, setUsers] = useState<User[]>([]);
  // const [turfs, setTurfs] = useState<Turf[]>([]);
  // const [games, setGames] = useState<Game[]>([]);
  // const [bookings, setBookings] = useState<Booking[]>([]);
  // const [userReports, setUserReports] = useState<UserReport[]>([]);
  // const [turfReports, setTurfReports] = useState<TurfReport[]>([]);
  // const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    // Load admin data
    loadAdminData();
  }, []);

  // Detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Mock API calls - replace with actual implementation
      // await loadUsers();
      // await loadTurfs();
      // await loadGames();
      // await loadBookings();
      // await loadReports();
      // await loadNotifications();
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.userType !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            This page is only accessible to administrators.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render responsive views
  if (screenSize === "mobile") {
    return (
      <AdminMobileView
        stats={stats}
        isLoading={isLoading}
        onRefresh={loadAdminData}
      />
    );
  }

  if (screenSize === "tablet") {
    return (
      <AdminTabletView
        stats={stats}
        isLoading={isLoading}
        onRefresh={loadAdminData}
      />
    );
  }

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case "cricket":
        return <Activity className="w-4 h-4 text-cricket-600" />;
      case "football":
        return <Zap className="w-4 h-4 text-football-600" />;
      case "tennis":
        return <Target className="w-4 h-4 text-blue-600" />;
      case "badminton":
        return <Dumbbell className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
  //   setIsLoading(true);
  //   try {
  //     // Implement user action
  //     console.log(`${action} user:`, userId);
  //   } catch (error) {
  //     console.error(`Error ${action} user:`, error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleTurfAction = async (turfId: string, action: 'approve' | 'reject' | 'suspend') => {
  //   setIsLoading(true);
  //   try {
  //     // Implement turf action
  //     console.log(`${action} turf:`, turfId);
  //   } catch (error) {
  //     console.error(`Error ${action} turf:`, error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss' | 'investigate') => {
  //   setIsLoading(true);
  //   try {
  //     // Implement report action
  //     console.log(`${action} report:`, reportId);
  //   } catch (error) {
  //     console.error(`Error ${action} report:`, error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage platform operations and monitor activities
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadAdminData}
                  disabled={isLoading}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>

                <button className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Turfs</p>
                  <p className="text-2xl font-bold text-turf-600">
                    {stats.totalTurfs}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-turf-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Games</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalGames.toLocaleString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalBookings.toLocaleString()}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.activeUsers}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.pendingApprovals}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap gap-2 px-6 py-2">
                {[
                  { key: "overview", label: "Overview", icon: BarChart3 },
                  { key: "users", label: "Users", icon: Users },
                  { key: "turfs", label: "Turfs", icon: MapPin },
                  { key: "games", label: "Games", icon: Calendar },
                  { key: "bookings", label: "Bookings", icon: FileText },
                  { key: "reports", label: "Reports", icon: AlertTriangle },
                  { key: "settings", label: "Settings", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.key
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                      </h3>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                New user registration
                              </p>
                              <p className="text-xs text-gray-600">
                                John Doe joined the platform
                              </p>
                              <p className="text-xs text-gray-500">
                                {i} minutes ago
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          3
                        </span>
                      </h3>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {[
                          {
                            type: "urgent",
                            title: "Payment Issue",
                            message: "Failed payment requires attention",
                          },
                          {
                            type: "high",
                            title: "User Report",
                            message: "New harassment report submitted",
                          },
                          {
                            type: "medium",
                            title: "Turf Approval",
                            message: "2 turfs pending approval",
                          },
                        ].map((notification, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === "urgent"
                                  ? "bg-red-500"
                                  : notification.type === "high"
                                  ? "bg-orange-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                2 hours ago
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                        <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Manage Users</p>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                        <MapPin className="w-8 h-8 text-turf-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Approve Turfs</p>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Review Reports</p>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                        <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">System Settings</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="all">All Users</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="normal_user">Players</option>
                        <option value="turf_owner">Turf Owners</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                                  JD
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    John Doe
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    john@example.com
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Player
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Jan 15, 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              2 hours ago
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button className="text-primary-600 hover:text-primary-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-yellow-600 hover:text-yellow-900">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Ban className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Turfs Tab */}
              {activeTab === "turfs" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="all">All Turfs</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending Approval</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="card">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">
                                Sports Arena {i}
                              </h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPinIcon className="w-4 h-4" />
                                Mumbai, Maharashtra
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm">4.{i}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              {getSportIcon("cricket")}
                              Cricket
                            </span>
                            <span className="text-gray-500">₹500/hr</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                i % 3 === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : i % 3 === 1
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {i % 3 === 0
                                ? "Pending"
                                : i % 3 === 1
                                ? "Approved"
                                : "Suspended"}
                            </span>

                            <div className="flex gap-2">
                              <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Games Tab */}
              {activeTab === "games" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Game
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organizer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Players
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                {getSportIcon("cricket")}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    Cricket Match
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Sports Arena {i}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                John Doe
                              </div>
                              <div className="text-sm text-gray-500">
                                john@example.com
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Dec 25, 2024
                              </div>
                              <div className="text-sm text-gray-500">
                                6:00 PM - 8:00 PM
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {8 + i}/22
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Open
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button className="text-primary-600 hover:text-primary-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Turf
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              BK{String(i).padStart(4, "0")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                John Doe
                              </div>
                              <div className="text-sm text-gray-500">
                                john@example.com
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Sports Arena {i}
                              </div>
                              <div className="text-sm text-gray-500">
                                Mumbai
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Dec 25, 2024
                              </div>
                              <div className="text-sm text-gray-500">
                                6:00 PM - 8:00 PM
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{(500 * i).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  i % 3 === 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : i % 3 === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {i % 3 === 0
                                  ? "Pending"
                                  : i % 3 === 1
                                  ? "Confirmed"
                                  : "Cancelled"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button className="text-primary-600 hover:text-primary-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Reports */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        User Reports
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          5
                        </span>
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-sm">
                                  Inappropriate Behavior
                                </p>
                                <p className="text-xs text-gray-600">
                                  Reported by: Jane Smith
                                </p>
                                <p className="text-xs text-gray-600">
                                  Against: John Doe
                                </p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                Pending
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              User was using inappropriate language during the
                              game.
                            </p>
                            <div className="flex gap-2">
                              <button className="btn-primary text-xs py-1 px-2">
                                Investigate
                              </button>
                              <button className="btn-secondary text-xs py-1 px-2">
                                Dismiss
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Turf Reports */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Turf Reports
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          3
                        </span>
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-sm">
                                  Poor Turf Condition
                                </p>
                                <p className="text-xs text-gray-600">
                                  Reported by: Mike Johnson
                                </p>
                                <p className="text-xs text-gray-600">
                                  Turf: Sports Arena {i}
                                </p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                Investigating
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              The turf surface was in very poor condition with
                              holes and uneven areas.
                            </p>
                            <div className="flex gap-2">
                              <button className="btn-primary text-xs py-1 px-2">
                                Contact Owner
                              </button>
                              <button className="btn-secondary text-xs py-1 px-2">
                                Suspend Turf
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* System Settings */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        System Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Maintenance Mode</p>
                            <p className="text-sm text-gray-600">
                              Temporarily disable the platform
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Registrations</p>
                            <p className="text-sm text-gray-600">
                              Allow new user registrations
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Turf Approval Required
                            </p>
                            <p className="text-sm text-gray-600">
                              Require admin approval for new turfs
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Payment Settings
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform Commission (%)
                          </label>
                          <input
                            type="number"
                            defaultValue="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Processing Fee (₹)
                          </label>
                          <input
                            type="number"
                            defaultValue="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cancellation Refund (%)
                          </label>
                          <input
                            type="number"
                            defaultValue="80"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn-primary">Save Settings</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
