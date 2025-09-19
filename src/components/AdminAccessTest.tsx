import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isFirebaseConfigured, firebaseInitialized } from '../lib/firebase';

const AdminAccessTest: React.FC = () => {
  const { user, loading, signIn, signInWithGoogle } = useAuth();
  const [testEmail, setTestEmail] = useState('yemblocreations@gmail.com');
  const [testPassword, setTestPassword] = useState('');

  const handleTestLogin = async () => {
    try {
      await signIn(testEmail, testPassword);
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Admin Access Test
        </h1>

        <div className="space-y-6">
          {/* Firebase Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Firebase Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Configuration:</p>
                <p className={`font-medium ${isFirebaseConfigured() ? 'text-green-600' : 'text-red-600'}`}>
                  {isFirebaseConfigured() ? '✅ Configured' : '❌ Not Configured'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Initialization:</p>
                <p className={`font-medium ${firebaseInitialized ? 'text-green-600' : 'text-red-600'}`}>
                  {firebaseInitialized ? '✅ Initialized' : '❌ Not Initialized'}
                </p>
              </div>
            </div>
          </div>

          {/* Current User Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Current User Status</h2>
            {loading ? (
              <p className="text-yellow-600">⏳ Loading...</p>
            ) : user ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </p>
                <p><strong>Admin Access:</strong> 
                  <span className={`ml-2 font-medium ${
                    user.role === 'admin' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.role === 'admin' ? '✅ Granted' : '❌ Denied'}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-red-600">❌ Not authenticated</p>
            )}
          </div>

          {/* Test Login Form */}
          {!user && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Test Login</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleTestLogin}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Test Login
                  </button>
                  <button
                    onClick={handleGoogleLogin}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Google Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Emails Info */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Configured Admin Emails</h2>
            <ul className="space-y-1">
              <li className="text-sm">• admin@ufa.org</li>
              <li className="text-sm">• yemblocreations@gmail.com</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Only these emails will have admin access to the dashboard.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Troubleshooting Steps</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Check if Firebase is properly configured in your environment variables</li>
              <li>Verify that your email is in the admin list above</li>
              <li>Try logging in with Google if email/password doesn't work</li>
              <li>Check browser console for any error messages</li>
              <li>Ensure your Firebase project has Authentication enabled</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessTest;
