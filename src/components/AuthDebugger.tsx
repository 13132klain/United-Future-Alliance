import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isFirebaseConfigured, firebaseInitialized } from '../lib/firebase';

const AuthDebugger: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Authentication Debug Info</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Firebase Configuration</h4>
            <p className={`text-sm ${isFirebaseConfigured() ? 'text-green-600' : 'text-red-600'}`}>
              {isFirebaseConfigured() ? '✅ Configured' : '❌ Not Configured'}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Firebase Initialized</h4>
            <p className={`text-sm ${firebaseInitialized ? 'text-green-600' : 'text-red-600'}`}>
              {firebaseInitialized ? '✅ Initialized' : '❌ Not Initialized'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Authentication Status</h4>
          <p className={`text-sm ${loading ? 'text-yellow-600' : user ? 'text-green-600' : 'text-red-600'}`}>
            {loading ? '⏳ Loading...' : user ? '✅ Authenticated' : '❌ Not Authenticated'}
          </p>
        </div>

        {user && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">User Details</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Admin Emails</h4>
          <p className="text-sm text-blue-800">
            The following emails are configured as admins:
          </p>
          <ul className="text-sm text-blue-800 mt-1 list-disc list-inside">
            <li>admin@ufa.org</li>
            <li>yemblocreations@gmail.com</li>
          </ul>
        </div>

        {user && user.email === 'yemblocreations@gmail.com' && user.role !== 'admin' && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">⚠️ Admin Access Issue</h4>
            <p className="text-sm text-red-800">
              Your email (yemblocreations@gmail.com) is configured as an admin, but your role is showing as "{user.role}". 
              This might be due to Firebase configuration issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebugger;
