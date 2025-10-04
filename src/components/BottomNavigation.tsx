import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/GameContext';
import { Home, Users, User, MapPin, BarChart3 } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { games } = useGame();

  // Calculate pending requests for current user
  const pendingRequestsCount = user ? games.filter(game => 
    game.organizerId === user.id && game.requests.length > 0
  ).reduce((sum, game) => sum + game.requests.length, 0) : 0;

  const getNavItems = () => {
    const baseItems = [
      {
        path: '/',
        label: 'Home',
        icon: Home,
        active: location.pathname === '/',
      },
      {
        path: '/games',
        label: 'Games',
        icon: Users,
        active: location.pathname === '/games',
      },
    ];

    if (user?.userType === 'turf_owner') {
      return [
        ...baseItems,
        {
          path: '/turf-dashboard',
          label: 'Dashboard',
          icon: BarChart3,
          active: location.pathname === '/turf-dashboard',
          badge: 0, // Could add turf booking requests count here
        },
        {
          path: '/profile',
          label: 'Profile',
          icon: User,
          active: location.pathname === '/profile',
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          path: '/turfs',
          label: 'Turfs',
          icon: MapPin,
          active: location.pathname === '/turfs',
        },
        {
          path: '/my-dashboard',
          label: 'Dashboard',
          icon: BarChart3,
          active: location.pathname === '/my-dashboard',
          badge: pendingRequestsCount,
        },
        {
          path: '/profile',
          label: 'Profile',
          icon: User,
          active: location.pathname === '/profile',
        },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`mb-1 ${
                    item.active ? 'text-primary-600' : 'text-gray-500'
                  }`}
                />
                {(item as any).badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {(item as any).badge > 9 ? '9+' : (item as any).badge}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  item.active ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
