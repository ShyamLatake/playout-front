import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';
import {
  Home,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  // User,
  Settings,
  Shield,
  Plus,
  FileText,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Dumbbell,
  // Bell,
  // MessageSquare
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { games } = useGame();

  // Calculate pending requests count
  const pendingRequestsCount = user ? games.filter(game =>
    game.organizerId === user.id && game.requests.length > 0
  ).reduce((sum, game) => sum + game.requests.length, 0) : 0;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        path: '/',
        label: 'Home',
        icon: Home,
        description: 'Dashboard overview'
      },
      {
        path: '/games',
        label: 'Games',
        icon: Users,
        description: 'Browse and join games'
      },
    ];

    if (user?.userType === 'admin') {
      return [
        {
          path: '/admin-dashboard',
          label: 'Admin Dashboard',
          icon: Shield,
          description: 'Platform management',
          badge: 12 // Mock pending approvals
        },
        {
          path: '/admin-dashboard',
          label: 'Users',
          icon: Users,
          description: 'Manage users',
          subPath: 'users'
        },
        {
          path: '/admin-dashboard',
          label: 'Turfs',
          icon: MapPin,
          description: 'Manage turfs',
          subPath: 'turfs'
        },
        {
          path: '/admin-dashboard',
          label: 'Games',
          icon: Calendar,
          description: 'Monitor games',
          subPath: 'games'
        },
        {
          path: '/admin-dashboard',
          label: 'Bookings',
          icon: FileText,
          description: 'Track bookings',
          subPath: 'bookings'
        },
        {
          path: '/admin-dashboard',
          label: 'Reports',
          icon: AlertTriangle,
          description: 'Handle reports',
          subPath: 'reports',
          badge: 8 // Mock reports count
        },
        {
          path: '/admin-dashboard',
          label: 'Analytics',
          icon: TrendingUp,
          description: 'View analytics',
          subPath: 'analytics'
        },
        {
          path: '/admin-dashboard',
          label: 'Settings',
          icon: Settings,
          description: 'System settings',
          subPath: 'settings'
        },
      ];
    }

    if (user?.userType === 'turf_owner') {
      return [
        {
          path: '/turf-dashboard',
          label: 'Dashboard',
          icon: BarChart3,
          description: 'Turf management overview'
        },
        {
          path: '/turfs',
          label: 'My Turfs',
          icon: MapPin,
          description: 'Manage your turfs'
        },
        {
          path: '/create-turf',
          label: 'Add Turf',
          icon: Plus,
          description: 'Register new turf'
        },
        {
          path: '/bookings',
          label: 'Bookings',
          icon: FileText,
          description: 'View turf bookings'
        },
        {
          path: '/analytics',
          label: 'Analytics',
          icon: TrendingUp,
          description: 'Revenue and stats'
        },
      ];
    }

    // Normal user navigation
    return [
      ...baseItems,
      {
        path: '/turfs',
        label: 'Find Turfs',
        icon: MapPin,
        description: 'Discover nearby turfs'
      },
      {
        path: '/my-dashboard',
        label: 'My Dashboard',
        icon: BarChart3,
        description: 'Your games and requests',
        badge: pendingRequestsCount
      },
      {
        path: '/create',
        label: 'Create Game',
        icon: Plus,
        description: 'Organize a new game'
      },
      {
        path: '/my-games',
        label: 'My Games',
        icon: Calendar,
        description: 'Games you joined'
      },
    ];
  };

  const navigationItems = getNavigationItems();

  const getSportIcons = () => [
    { sport: 'cricket', icon: Activity, color: 'text-cricket-600', bg: 'bg-cricket-100' },
    { sport: 'football', icon: Zap, color: 'text-football-600', bg: 'bg-football-100' },
    { sport: 'tennis', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
    { sport: 'badminton', icon: Dumbbell, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[90] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-[95] h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">

          {/* Navigation */}
          <nav className="py-4">
            <div className="px-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={`${item.path}-${(item as any).subPath || ''}`}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <div className={`p-1.5 rounded-md ${isActive ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-600'
                        }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{item.label}</span>
                        {(item as any).badge > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {(item as any).badge > 9 ? '9+' : (item as any).badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sports quick access for normal users */}
            {user?.userType === 'normal_user' && (
              <div className="mt-4 px-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Access
                </h3>
                <div className="space-y-1">
                  {getSportIcons().map(({ sport, icon: SportIcon, color, bg }) => (
                    <button
                      key={sport}
                      onClick={() => handleNavigation(`/games?sport=${sport}`)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`p-1.5 rounded-md ${bg}`}>
                        <SportIcon className={`w-4 h-4 ${color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-gray-900">
                        {sport}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent activity for admins */}
            {user?.userType === 'admin' && (
              <div className="mt-4 px-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Recent Activity
                </h3>
                <div className="space-y-1">
                  {[
                    { type: 'user', message: 'New user registered', time: '2m ago' },
                    { type: 'turf', message: 'Turf approval pending', time: '5m ago' },
                    { type: 'report', message: 'New report submitted', time: '10m ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </nav>

          {/* Spacer to push user info to bottom */}
          <div className="flex-1"></div>

          {/* User info at bottom */}
          {user && (
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {user.userType.replace('_', ' ')}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;