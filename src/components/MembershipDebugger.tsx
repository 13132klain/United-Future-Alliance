import React, { useState, useEffect } from 'react';
import { membershipsService } from '../lib/firestoreServices';
import { Membership } from '../types';

export default function MembershipDebugger() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    console.log('🔍 MembershipDebugger: Setting up subscription');
    
    const unsubscribe = membershipsService.subscribeToMemberships((data) => {
      console.log('🔍 MembershipDebugger: Received data:', data);
      setMemberships(data);
      setLoading(false);
    });

    return () => {
      console.log('🔍 MembershipDebugger: Cleaning up subscription');
      unsubscribe();
    };
  }, []);

  const testAddMembership = async () => {
    try {
      setTestResult('Testing membership addition...');
      
      const testMembership = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+254700000000',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male' as const,
        county: 'Nairobi',
        constituency: 'Test Constituency',
        ward: 'Test Ward',
        occupation: 'Software Developer',
        organization: 'Test Company',
        interests: ['Technology', 'Education'],
        motivation: 'Test motivation for joining UFA',
        howDidYouHear: 'website',
        isVolunteer: false,
        volunteerAreas: undefined,
        status: 'pending' as const,
        submittedAt: new Date(),
        registrationFee: 200,
        monthlyContribution: 100,
        feeAgreement: true
      };

      console.log('🔍 MembershipDebugger: Adding test membership:', testMembership);
      const id = await membershipsService.addMembership(testMembership);
      console.log('🔍 MembershipDebugger: Test membership added with ID:', id);
      
      setTestResult(`✅ Test membership added successfully with ID: ${id}`);
    } catch (error) {
      console.error('🔍 MembershipDebugger: Error adding test membership:', error);
      setTestResult(`❌ Error adding test membership: ${error}`);
    }
  };

  const testGetMemberships = async () => {
    try {
      setTestResult('Testing membership retrieval...');
      
      console.log('🔍 MembershipDebugger: Getting memberships directly');
      const data = await membershipsService.getMemberships();
      console.log('🔍 MembershipDebugger: Direct get result:', data);
      
      setTestResult(`✅ Retrieved ${data.length} memberships directly`);
    } catch (error) {
      console.error('🔍 MembershipDebugger: Error getting memberships:', error);
      setTestResult(`❌ Error getting memberships: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Membership Debugger</h3>
        <p className="text-blue-700">Loading memberships...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Membership Debugger</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-blue-700 mb-2">
            <strong>Current Memberships:</strong> {memberships.length}
          </p>
          {memberships.length > 0 && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold mb-2">Membership Details:</h4>
              {memberships.map((membership, index) => (
                <div key={membership.id || index} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p><strong>ID:</strong> {membership.id}</p>
                  <p><strong>Name:</strong> {membership.firstName} {membership.lastName}</p>
                  <p><strong>Email:</strong> {membership.email}</p>
                  <p><strong>Status:</strong> {membership.status}</p>
                  <p><strong>Submitted:</strong> {membership.submittedAt?.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={testAddMembership}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Add Membership
          </button>
          
          <button
            onClick={testGetMemberships}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
          >
            Test Get Memberships
          </button>
        </div>

        {testResult && (
          <div className="p-3 bg-white rounded border">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}