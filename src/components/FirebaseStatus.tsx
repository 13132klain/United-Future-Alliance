import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Database, Cloud } from 'lucide-react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { eventsService, newsService, leadersService } from '../lib/firestoreServices';

export default function FirebaseStatus() {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    services: {
      events: boolean;
      news: boolean;
      leaders: boolean;
    };
    error?: string;
  }>({
    configured: false,
    connected: false,
    services: {
      events: false,
      news: false,
      leaders: false
    }
  });

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      const configured = isFirebaseConfigured();
      
      if (!configured) {
        setFirebaseStatus({
          configured: false,
          connected: false,
          services: { events: false, news: false, leaders: false },
          error: 'Firebase not configured - check .env.local file'
        });
        return;
      }

      try {
        // Test database connection by trying to fetch data
        const [events, news, leaders] = await Promise.allSettled([
          eventsService.getEvents(),
          newsService.getNews(),
          leadersService.getLeaders()
        ]);

        setFirebaseStatus({
          configured: true,
          connected: !!db,
          services: {
            events: events.status === 'fulfilled',
            news: news.status === 'fulfilled',
            leaders: leaders.status === 'fulfilled'
          }
        });
      } catch (error) {
        setFirebaseStatus({
          configured: true,
          connected: false,
          services: { events: false, news: false, leaders: false },
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    checkFirebaseStatus();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Firebase Status</h3>
      </div>

      <div className="space-y-3">
        {/* Configuration Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Configuration</span>
          {getStatusIcon(firebaseStatus.configured)}
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Database Connection</span>
          {getStatusIcon(firebaseStatus.connected)}
        </div>

        {/* Services Status */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Services</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Events Service</span>
              {getStatusIcon(firebaseStatus.services.events)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">News Service</span>
              {getStatusIcon(firebaseStatus.services.news)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Leaders Service</span>
              {getStatusIcon(firebaseStatus.services.leaders)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {firebaseStatus.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{firebaseStatus.error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {firebaseStatus.configured && firebaseStatus.connected && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
            <div className="flex items-start gap-2">
              <Cloud className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">
                Firebase is connected and ready! Events, news, and leaders will be stored in Firestore.
              </p>
            </div>
          </div>
        )}

        {/* Fallback Message */}
        {!firebaseStatus.connected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Using mock data. Configure Firebase to enable persistent storage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
