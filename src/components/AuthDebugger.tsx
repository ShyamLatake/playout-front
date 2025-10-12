import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useUser } from '../contexts/UserContext';
import { apiService } from '../services/api';

// Simple JWT decoder (for debugging only)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthDebugger: React.FC = () => {
  const { user } = useUser();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenPayload, setTokenPayload] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
          
          // Decode token to see payload
          const payload = decodeJWT(idToken);
          setTokenPayload(payload);
          
          console.log('🔑 Token Details:', {
            token: idToken,
            payload: payload,
            exp: payload?.exp ? new Date(payload.exp * 1000) : 'Unknown',
            iat: payload?.iat ? new Date(payload.iat * 1000) : 'Unknown'
          });
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        setToken(null);
        setTokenPayload(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const testTurfCreation = async () => {
    console.log('🧪 Starting turf creation test...');
    
    try {
      // Get fresh token
      const freshToken = firebaseUser ? await firebaseUser.getIdToken(true) : null;
      console.log('🔑 Fresh token obtained:', {
        hasToken: !!freshToken,
        tokenLength: freshToken?.length,
        tokenPreview: freshToken ? `${freshToken.substring(0, 30)}...` : 'No token'
      });

      const testTurf = {
        name: 'Debug Test Turf',
        location: 'Test Location',
        address: 'Test Address, Test City, 123456',
        sports: ['cricket'],
        pricePerHour: 1000,
        images: ['https://via.placeholder.com/400x300?text=Debug+Test'],
        amenities: ['Parking'],
        facilities: ['Floodlights'],
        operatingHours: {
          open: '06:00',
          close: '22:00'
        }
      };

      console.log('📤 Sending turf data:', testTurf);
      const result = await apiService.createTurf(testTurf);
      console.log('✅ Turf creation successful:', result);
      setApiTest({ success: true, data: result });
    } catch (error) {
      console.error('❌ Turf creation failed:', error);
      setApiTest({ success: false, error: error.message });
    }
  };

  const testGetTurfs = async () => {
    try {
      const result = await apiService.getTurfs();
      setApiTest({ success: true, data: result, type: 'get' });
    } catch (error) {
      setApiTest({ success: false, error: error.message, type: 'get' });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-lg mb-3">🔍 Auth Debugger</h3>
      
      {/* Firebase Auth Status */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm">Firebase Auth:</h4>
        <p className="text-xs">
          Status: {firebaseUser ? '✅ Authenticated' : '❌ Not authenticated'}
        </p>
        {firebaseUser && (
          <p className="text-xs">Email: {firebaseUser.email}</p>
        )}
      </div>

      {/* App User Status */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm">App User:</h4>
        <p className="text-xs">
          Status: {user ? '✅ Loaded' : '❌ Not loaded'}
        </p>
        {user && (
          <>
            <p className="text-xs">Name: {user.name}</p>
            <p className="text-xs">Type: {user.userType}</p>
            <p className="text-xs">
              Can Create Turfs: {user.userType === 'turf_owner' ? '✅ Yes' : '❌ No'}
            </p>
          </>
        )}
      </div>

      {/* Token Status */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm">JWT Token:</h4>
        <p className="text-xs">
          Status: {token ? '✅ Available' : '❌ Missing'}
        </p>
        {token && (
          <>
            <p className="text-xs break-all">
              Token: {token.substring(0, 20)}...
            </p>
            {tokenPayload && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <p><strong>UID:</strong> {tokenPayload.uid}</p>
                <p><strong>Email:</strong> {tokenPayload.email}</p>
                <p><strong>Expires:</strong> {new Date(tokenPayload.exp * 1000).toLocaleString()}</p>
                <p><strong>Issued:</strong> {new Date(tokenPayload.iat * 1000).toLocaleString()}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* API Test Buttons */}
      <div className="mb-3 space-y-2">
        <button
          onClick={testGetTurfs}
          className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test GET Turfs (Public)
        </button>
        
        <button
          onClick={async () => {
            try {
              const result = await apiService.debugAuth();
              setApiTest({ success: true, data: result, type: 'debug-auth' });
            } catch (error) {
              setApiTest({ success: false, error: error.message, type: 'debug-auth' });
            }
          }}
          className="w-full px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
        >
          Test Auth Debug
        </button>
        
        <button
          onClick={async () => {
            try {
              const result = await apiService.debugTurfOwner();
              setApiTest({ success: true, data: result, type: 'debug-turf-owner' });
            } catch (error) {
              setApiTest({ success: false, error: error.message, type: 'debug-turf-owner' });
            }
          }}
          className="w-full px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
        >
          Test Turf Owner Auth
        </button>
        
        <button
          onClick={testTurfCreation}
          disabled={!user || user.userType !== 'turf_owner'}
          className="w-full px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test CREATE Turf (Protected)
        </button>
      </div>

      {/* API Test Results */}
      {apiTest && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm">API Test Result:</h4>
          <div className={`text-xs p-2 rounded ${
            apiTest.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {apiTest.success ? (
              <div>
                <p>✅ Success!</p>
                {apiTest.type === 'get' && (
                  <p>Found {apiTest.data?.data?.turfs?.length || 0} turfs</p>
                )}
                {apiTest.type === 'debug-auth' && (
                  <div>
                    <p>User: {apiTest.data?.data?.user?.name}</p>
                    <p>Type: {apiTest.data?.data?.user?.userType}</p>
                  </div>
                )}
                {apiTest.type === 'debug-turf-owner' && (
                  <p>✅ Turf owner authorization successful!</p>
                )}
                {!apiTest.type && (
                  <p>Turf created: {apiTest.data?.data?.turf?.name}</p>
                )}
              </div>
            ) : (
              <div>
                <p>❌ Error:</p>
                <p>{apiTest.error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear Results */}
      {apiTest && (
        <button
          onClick={() => setApiTest(null)}
          className="w-full px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      )}
    </div>
  );
};