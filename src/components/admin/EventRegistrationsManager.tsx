import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { EventRegistration } from '../../types';
import { eventRegistrationService } from '../../lib/eventRegistrationService';

interface EventRegistrationsManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function EventRegistrationsManager({ onClose, onActivityUpdate }: EventRegistrationsManagerProps) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await eventRegistrationService.getEventRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading event registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const result = await eventRegistrationService.updateRegistrationStatus(registrationId, newStatus);
      if (result.success) {
        await loadRegistrations();
        onActivityUpdate?.('event-registration', 'Updated', `Status changed to ${newStatus}`);
      } else {
        alert('Failed to update registration status');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Failed to update registration status');
    }
  };

  const handleCheckIn = async (registrationId: string) => {
    try {
      const result = await eventRegistrationService.checkInParticipant(registrationId);
      if (result.success) {
        await loadRegistrations();
        onActivityUpdate?.('event-registration', 'Checked In', 'Participant checked in');
      } else {
        alert('Failed to check in participant');
      }
    } catch (error) {
      console.error('Error checking in participant:', error);
      alert('Failed to check in participant');
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    const matchesEvent = eventFilter === 'all' || registration.eventId === eventFilter;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueEvents = () => {
    const events = registrations.reduce((acc, reg) => {
      if (!acc.find(e => e.id === reg.eventId)) {
        acc.push({ id: reg.eventId, title: reg.eventTitle });
      }
      return acc;
    }, [] as { id: string; title: string }[]);
    return events;
  };

  const getStats = () => {
    const total = registrations.length;
    const confirmed = registrations.filter(r => r.status === 'confirmed').length;
    const pending = registrations.filter(r => r.status === 'pending').length;
    const cancelled = registrations.filter(r => r.status === 'cancelled').length;
    const checkedIn = registrations.filter(r => r.checkedIn).length;
    
    return { total, confirmed, pending, cancelled, checkedIn };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Registrations</h2>
          <p className="text-gray-600">Manage and track event registrations</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Checked In</p>
              <p className="text-2xl font-bold text-gray-900">{stats.checkedIn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search registrations..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Events</option>
              {getUniqueEvents().map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.firstName} {registration.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Code: {registration.confirmationCode}
                      </div>
                      {registration.checkedIn && (
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Checked In
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{registration.eventTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{registration.email}</div>
                    <div className="text-sm text-gray-500">{registration.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {registration.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirm
                        </button>
                      )}
                      {registration.status === 'confirmed' && !registration.checkedIn && (
                        <button
                          onClick={() => handleCheckIn(registration.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Check In
                        </button>
                      )}
                      {registration.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || eventFilter !== 'all' 
                ? 'Try adjusting your filters to see more results.'
                : 'Event registrations will appear here once users start registering for events.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
