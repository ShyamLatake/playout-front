import React from 'react';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';

const ExamplePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Example Page</h1>
              <p className="text-gray-600">This demonstrates the responsive layout system</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-secondary flex items-center gap-2 justify-center">
                Export Data
              </button>
              <button className="btn-primary flex items-center gap-2 justify-center">
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-primary-600">1,247</p>
                </div>
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Turfs</p>
                  <p className="text-2xl font-bold text-turf-600">89</p>
                </div>
                <MapPin className="w-8 h-8 text-turf-600" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Games Today</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Main Content</h3>
                <p className="text-gray-600 mb-4">
                  This is the main content area that adapts to different screen sizes.
                  On desktop, it takes up 2/3 of the width. On mobile, it takes the full width.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Item {i}</h4>
                      <p className="text-sm text-gray-600">
                        This is a sample item that demonstrates responsive grid layout.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Data Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 text-sm text-gray-900">Item {i}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">Dec 25, 2024</td>
                          <td className="px-4 py-3">
                            <button className="text-primary-600 hover:text-primary-900 text-sm">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Sidebar</h3>
                <p className="text-gray-600 mb-4">
                  This sidebar content appears on the right on desktop and below the main content on mobile.
                </p>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm">Sidebar Item {i}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Additional information or actions
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Active Sessions', value: '142', color: 'text-green-600' },
                    { label: 'Pending Tasks', value: '8', color: 'text-orange-600' },
                    { label: 'Completed', value: '95%', color: 'text-blue-600' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{stat.label}</span>
                      <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplePage;