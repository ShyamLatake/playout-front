import React from 'react';
import { AuthDebugger } from '../components/AuthDebugger';

export const DebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication & API Testing</h2>
          <p className="text-gray-600 mb-4">
            This page helps you debug authentication issues and test API endpoints.
            The debugger panel will appear in the bottom-right corner.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Common Issues & Solutions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>401 Unauthorized:</strong> User not logged in or invalid token</li>
              <li>• <strong>403 Forbidden:</strong> User doesn't have turf_owner role</li>
              <li>• <strong>Token Missing:</strong> Firebase authentication not working</li>
              <li>• <strong>User Not Loaded:</strong> User context not initialized</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Fixes</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Check User Role</h3>
              <p className="text-sm text-gray-600 mb-2">
                To create turfs, your user must have <code className="bg-gray-100 px-1 rounded">userType: 'turf_owner'</code>
              </p>
              <p className="text-xs text-gray-500">
                If you're a normal user, you need to register as a turf owner or update your user type in the database.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Verify Authentication</h3>
              <p className="text-sm text-gray-600 mb-2">
                Make sure you're logged in and Firebase authentication is working.
              </p>
              <p className="text-xs text-gray-500">
                Check the debugger panel to see your authentication status and JWT token.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Test API Endpoints</h3>
              <p className="text-sm text-gray-600 mb-2">
                Use the test buttons in the debugger to verify API connectivity.
              </p>
              <p className="text-xs text-gray-500">
                GET /turfs should work without authentication, POST /turfs requires turf_owner role.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <AuthDebugger />
    </div>
  );
};