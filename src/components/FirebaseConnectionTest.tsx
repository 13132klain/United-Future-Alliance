import React, { useState, useEffect } from 'react';
import { db, firebaseInitialized, isFirebaseConfigured } from '../lib/firebase';
import { membershipsService } from '../lib/firestoreServices';

export default function FirebaseConnectionTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = isError ? '❌' : '✅';
    setTestResults(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('Starting Firebase connection tests...');

    // Test 1: Check environment variables
    addResult('Test 1: Checking environment variables...');
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
    if (missingVars.length > 0) {
      addResult(`Missing environment variables: ${missingVars.join(', ')}`, true);
    } else {
      addResult('All required environment variables are present');
    }

    // Test 2: Check Firebase configuration
    addResult('Test 2: Checking Firebase configuration...');
    if (!isFirebaseConfigured()) {
      addResult('Firebase is not properly configured', true);
    } else {
      addResult('Firebase configuration is valid');
    }

    // Test 3: Check Firebase initialization
    addResult('Test 3: Checking Firebase initialization...');
    if (!firebaseInitialized) {
      addResult('Firebase is not initialized', true);
    } else {
      addResult('Firebase is initialized successfully');
    }

    // Test 4: Check Firestore connection
    addResult('Test 4: Testing Firestore connection...');
    if (!db) {
      addResult('Firestore database is not available', true);
    } else {
      addResult('Firestore database is available');
    }

    // Test 5: Test membership service
    addResult('Test 5: Testing membership service...');
    try {
      const memberships = await membershipsService.getMemberships();
      addResult(`Membership service working - found ${memberships.length} memberships`);
    } catch (error) {
      addResult(`Membership service error: ${error}`, true);
    }

    // Test 6: Test adding a membership
    addResult('Test 6: Testing membership creation...');
    try {
      const testMembership = {
        firstName: 'Firebase',
        lastName: 'Test',
        email: 'firebase-test@example.com',
        phone: '+254700000000',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male' as const,
        county: 'Nairobi',
        constituency: 'Test Constituency',
        occupation: 'Software Developer',
        interests: ['Technology'],
        motivation: 'Testing Firebase connection',
        howDidYouHear: 'website',
        isVolunteer: false,
        status: 'pending' as const,
        submittedAt: new Date(),
        registrationFee: 200,
        monthlyContribution: 100,
        feeAgreement: true
      };

      const membershipId = await membershipsService.addMembership(testMembership);
      addResult(`Test membership created successfully with ID: ${membershipId}`);
    } catch (error) {
      addResult(`Failed to create test membership: ${error}`, true);
    }

    addResult('Firebase connection tests completed!');
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Firebase Connection Test</h3>
        <div className="space-x-2">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-4">
          This tool will test your Firebase configuration and connection to help diagnose any issues with the membership system.
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {testResults.length === 0 && !isRunning && (
          <div className="text-center text-gray-500 py-8">
            Click "Run Tests" to check your Firebase configuration
          </div>
        )}
      </div>
    </div>
  );
}
