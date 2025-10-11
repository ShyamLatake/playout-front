import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import {
  Users,
  MapPin,
  // Calendar,
  DollarSign,
  // TrendingUp,
  AlertTriangle,
  // Shield,
  Settings,
  BarChart3,
  // Activity,
  // Clock,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  // UserCheck,
  // FileText,
  // Bell,
  // Search,
  // Filter,
  Download,
  RefreshCw,
  // ChevronRight,
  Star,
  // Phone,
  // Mail,
  MapPinIcon,
  Edit,
  // Trash2
} from 'lucide-react';
import type { AdminStats } from '../../types';

interface AdminTabletViewProps {
  stats: AdminStats;
  isLoading: boolean;
  onRefresh: () => void;
}

const AdminTabletView: React.FC<AdminTabletViewProps> = ({ stats, isLoading, onRefresh }) => {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'turfs' | 'reports'>('overview');

  const tabItems = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'turfs', label: 'Turfs', icon: MapPin },
    { key: 'reports', label: 'Reports', icon: AlertTriangle },
  ];

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Stats Grid - Tablet Layout */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
              </div>
              <Users className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Turfs</p>
                <p className="text-3xl font-bold text-turf-600">{stats.totalTurfs}</p>
                <p className="text-xs text-green-600 mt-1">+5 this week</p>
              </div>
              <MapPin className="w-10 h-10 text-turf-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+8% this month</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-red-600">{stats.pendingApprovals}</p>
                <p className="text-xs text-red-600 mt-1">Needs attention</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <button
                      onClick={onRefresh}
                      disabled={isLoading}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New user registration</p>
                          <p className="text-xs text-gray-600">John Doe joined the platform</p>
                          <p className="text-xs text-gray-500">{i} minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Manage Users</p>
                      <p className="text-xs text-gray-500">{stats.totalUsers} total</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('turfs')}
                      className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <MapPin className="w-8 h-8 text-turf-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Approve Turfs</p>
                      <p className="text-xs text-gray-500">12 pending</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Review Reports</p>
                      <p className="text-xs text-gray-500">8 pending</p>
                    </button>
                    
                    <button className="p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Settings</p>
                      <p className="text-xs text-gray-500">System config</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Users</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <button className="btn-secondary text-sm py-2 px-3">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                            JD
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">John Doe</h4>
                            <p className="text-sm text-gray-600">john@example.com</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Player
                              </span>
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Turfs Tab */}
            {activeTab === 'turfs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Turf Management</h3>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Turfs</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Suspended</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="aspect-video bg-gray-200"></div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Sports Arena {i}</h4>
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
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' :
                            i % 3 === 1 ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Approved' : 'Suspended'}
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

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Reports Management</h3>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Reports</option>
                    <option>Pending</option>
                    <option>Investigating</option>
                    <option>Resolved</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Reports */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        User Reports
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">5</span>
                      </h4>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">Inappropriate Behavior</p>
                              <p className="text-xs text-gray-600">Reported by: Jane Smith</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            User was using inappropriate language during the game.
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
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Turf Reports
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">3</span>
                      </h4>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">Poor Turf Condition</p>
                              <p className="text-xs text-gray-600">Turf: Sports Arena {i}</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Investigating
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            The turf surface was in very poor condition.
                          </p>
                          <div className="flex gap-2">
                            <button className="btn-primary text-xs py-1 px-2">
                              Contact Owner
                            </button>
                            <button className="btn-secondary text-xs py-1 px-2">
                              Suspend
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTabletView;