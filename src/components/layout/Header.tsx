import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';
import { getUserType, getUserTypeDisplay } from '../../utils/userUtils';
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Shield,
  Plus,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, showSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const { games } = useGame();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate notifications count
  const notificationsCount = user ? games.filter(game =>
    game.organizerId === user.id && game.requests.length > 0
  ).reduce((sum, game) => sum + game.requests.length, 0) : 0;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // Silent error handling
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/games') return 'Games';
    if (path === '/turfs') return 'Turfs';
    if (path === '/my-dashboard') return 'My Dashboard';
    if (path === '/turf-dashboard') return 'Turf Dashboard';
    if (path === '/admin-dashboard') return 'Admin Dashboard';
    if (path === '/profile') return 'Profile';
    if (path === '/create') return 'Create Game';
    if (path === '/create-turf') return 'Create Turf';
    return 'Playmate';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button - Only show when user is logged in */}
            {user && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          {/* <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games, turfs, or players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div> */}

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Quick actions */}
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                {getUserType(user) === 'normal_user' && (
                  <button
                    onClick={() => navigate('/create')}
                    className="btn-primary text-sm py-2 px-3 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden lg:inline">Create Game</span>
                  </button>
                )}
                {getUserType(user) === 'turf_owner' && (
                  <button
                    onClick={() => navigate('/create-turf')}
                    className="btn-primary text-sm py-2 px-3 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden lg:inline">Add Turf</span>
                  </button>
                )}
              </div>
            )}

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationsCount > 9 ? '9+' : notificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[110]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsCount > 0 ? (
                        <div className="py-2">
                          {games
                            .filter(game => game.organizerId === user.id && game.requests.length > 0)
                            .slice(0, 5)
                            .map((game) => (
                              <div key={game.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                <p className="text-sm font-medium text-gray-900">
                                  New join request for {game.sport}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {game.requests.length} player(s) want to join your game
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {game.turfName} • {game.date.toString()}
                                </p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                    {notificationsCount > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <button
                          onClick={() => navigate('/my-dashboard')}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {getUserTypeDisplay(user)}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Profile dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[110]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>

                      {getUserType(user) === 'normal_user' && (
                        <button
                          onClick={() => {
                            navigate('/my-dashboard');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          My Dashboard
                        </button>
                      )}

                      {getUserType(user) === 'turf_owner' && (
                        <button
                          onClick={() => {
                            navigate('/turf-dashboard');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Turf Dashboard
                        </button>
                      )}

                      {getUserType(user) === 'admin' && (
                        <button
                          onClick={() => {
                            navigate('/admin-dashboard');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - Only show when user is logged in */}
      {/* {user && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      )} */}
    </header>
  );
};

export default Header;