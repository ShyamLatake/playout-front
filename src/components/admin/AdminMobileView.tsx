import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MapPin,
  // Calendar,
  DollarSign,
  // TrendingUp,
  AlertTriangle,
  // Shield,
  Settings,
  // BarChart3,
  // Activity,
  // Clock,
  CheckCircle,
  XCircle,
  // Eye,
  // Ban,
  // UserCheck,
  // FileText,
  // Bell,
  // Search,
  // Filter,
  // Download,
  RefreshCw,
  ChevronRight,
  // Star,
  // Phone,
  // Mail,
  // MapPinIcon,
  // Edit,
  // Trash2
} from 'lucide-react';
import type { AdminStats } from '../../types';

interface AdminMobileViewProps {
  stats: AdminStats;
  isLoading: boolean;
  onRefresh: () => void;
}

const AdminMobileView: React.FC<AdminMobileViewProps> = ({ stats, isLoading, onRefresh }) => {
  const navigate = useNavigate();
  // const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'turfs' | 'reports'>('overview');

  const quickActions = [
    { icon: Users, label: 'Manage Users', count: stats.totalUsers, color: 'bg-blue-500', path: '/admin/users' },
    { icon: MapPin, label: 'Approve Turfs', count: 12, color: 'bg-green-500', path: '/admin/turfs' },
    { icon: AlertTriangle, label: 'Review Reports', count: 8, color: 'bg-red-500', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', count: 0, color: 'bg-gray-500', path: '/admin/settings' },
  ];

  const recentActivity = [
    { type: 'user', message: 'New user registered', time: '2m ago', icon: Users },
    { type: 'turf', message: 'Turf approval pending', time: '5m ago', icon: MapPin },
    { type: 'report', message: 'New report submitted', time: '10m ago', icon: AlertTriangle },
    { type: 'payment', message: 'Payment issue resolved', time: '15m ago', icon: DollarSign },
  ];

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Mobile Stats Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-primary-600">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Turfs</p>
                <p className="text-xl font-bold text-turf-600">{stats.totalTurfs}</p>
              </div>
              <MapPin className="w-6 h-6 text-turf-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-green-600">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-xl font-bold text-red-600">{stats.pendingApprovals}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                      <Icon className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{action.label}</p>
                      {action.count > 0 && (
                        <p className="text-sm text-gray-500">{action.count} items</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Pending Approvals
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {stats.pendingApprovals}
              </span>
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sports Arena {i}</p>
                    <p className="text-xs text-gray-500">Turf approval pending</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMobileView;