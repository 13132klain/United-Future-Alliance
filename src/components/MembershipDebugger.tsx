import React, { useState, useEffect } from 'react';
import { membershipsService } from '../lib/firestoreServices';
import { Membership } from '../types';

const MembershipDebugger: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [testForm, setTestForm] = useState({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+254700000000',
    dateOfBirth: '1990-01-01',
    gender: 'male' as const,
    county: 'Nairobi',
    constituency: 'Westlands',
    occupation: 'Tester',
    interests: ['Testing'],
    motivation: 'Testing the system',
    howDidYouHear: 'Debug',
    isVolunteer: false
  });

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

  const handleTestSubmission = async () => {
    console.log('🔍 MembershipDebugger: Testing submission');
    try {
      const membershipData: Omit<Membership, 'id'> = {
        ...testForm,
        dateOfBirth: new Date(testForm.dateOfBirth),
        status: 'pending',
        submittedAt: new Date()
      };
      
      const id = await membershipsService.addMembership(membershipData);
      console.log('🔍 MembershipDebugger: Submission successful, ID:', id);
    } catch (error) {
      console.error('🔍 MembershipDebugger: Submission failed:', error);
    }
  };

  const handleRefresh = async () => {
    console.log('🔍 MembershipDebugger: Manual refresh');
    setLoading(true);
    try {
      const data = await membershipsService.getMemberships();
      console.log('🔍 MembershipDebugger: Manual refresh result:', data);
      setMemberships(data);
    } catch (error) {
      console.error('🔍 MembershipDebugger: Manual refresh failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Membership Debugger</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Submission</h3>
        <button
          onClick={handleTestSubmission}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Test Membership
        </button>
        <button
          onClick={handleRefresh}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Refresh Data
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Current Memberships ({memberships.length})</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            {memberships.map((membership) => (
              <div key={membership.id} className="p-3 border rounded bg-gray-50">
                <div className="font-medium">{membership.firstName} {membership.lastName}</div>
                <div className="text-sm text-gray-600">{membership.email}</div>
                <div className="text-sm text-gray-600">Status: {membership.status}</div>
                <div className="text-sm text-gray-600">Submitted: {membership.submittedAt.toLocaleString()}</div>
              </div>
            ))}
            {memberships.length === 0 && (
              <p className="text-gray-500">No memberships found</p>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        <p>Check the browser console for detailed debugging information.</p>
      </div>
    </div>
  );
};

export default MembershipDebugger;
