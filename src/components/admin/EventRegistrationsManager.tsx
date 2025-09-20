import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Calendar, Search, Filter, Trash2, Printer, Download, Eye } from 'lucide-react';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<EventRegistration | null>(null);

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

  const handleDeleteRegistration = async (registrationId: string) => {
    try {
      const result = await eventRegistrationService.deleteEventRegistration(registrationId);
      if (result.success) {
        await loadRegistrations();
        onActivityUpdate?.('event-registration', 'Deleted', 'Registration deleted');
        setShowDeleteModal(false);
        setRegistrationToDelete(null);
      } else {
        alert('Failed to delete registration');
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Failed to delete registration');
    }
  };

  const handlePrintRegistrations = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>Event Registrations - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #10b981; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .status-confirmed { color: green; }
              .status-pending { color: orange; }
              .status-cancelled { color: red; }
              .summary { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>Event Registrations Report</h1>
            <div class="summary">
              <h3>Summary</h3>
              <p><strong>Total Registrations:</strong> ${stats.total}</p>
              <p><strong>Confirmed:</strong> ${stats.confirmed}</p>
              <p><strong>Pending:</strong> ${stats.pending}</p>
              <p><strong>Cancelled:</strong> ${stats.cancelled}</p>
              <p><strong>Checked In:</strong> ${stats.checkedIn}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th>Confirmation Code</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRegistrations.map(reg => `
                  <tr>
                    <td>${reg.firstName} ${reg.lastName}</td>
                    <td>${reg.eventTitle}</td>
                    <td>${reg.email}</td>
                    <td>${reg.phone}</td>
                    <td class="status-${reg.status}">${reg.status}</td>
                    <td>${new Date(reg.registrationDate).toLocaleDateString()}</td>
                    <td>${reg.confirmationCode}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportRegistrations = () => {
    const csvContent = [
      ['Participant Name', 'Event', 'Email', 'Phone', 'Status', 'Registration Date', 'Confirmation Code', 'Checked In'],
      ...filteredRegistrations.map(reg => [
        `${reg.firstName} ${reg.lastName}`,
        reg.eventTitle,
        reg.email,
        reg.phone,
        reg.status,
        new Date(reg.registrationDate).toLocaleDateString(),
        reg.confirmationCode,
        reg.checkedIn ? 'Yes' : 'No'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event-registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrintRegistrations}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Print Registrations"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleExportRegistrations}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Export to CSV"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
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
                      <button
                        onClick={() => setSelectedRegistration(registration)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {registration.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                          title="Confirm Registration"
                        >
                          Confirm
                        </button>
                      )}
                      {registration.status === 'confirmed' && !registration.checkedIn && (
                        <button
                          onClick={() => handleCheckIn(registration.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Check In Participant"
                        >
                          Check In
                        </button>
                      )}
                      {registration.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Cancel Registration"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRegistrationToDelete(registration);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && registrationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Registration</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the registration for{' '}
              <strong>{registrationToDelete.firstName} {registrationToDelete.lastName}</strong> for the event{' '}
              <strong>{registrationToDelete.eventTitle}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRegistrationToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRegistration(registrationToDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Participant Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRegistration.firstName} {selectedRegistration.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.eventTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRegistration.status)}`}>
                    {selectedRegistration.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmation Code</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedRegistration.confirmationCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRegistration.registrationDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Checked In</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRegistration.checkedIn ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </p>
                </div>
              </div>
              
              {selectedRegistration.idNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.idNumber}</p>
                </div>
              )}
              
              {selectedRegistration.county && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">County</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.county}</p>
                </div>
              )}
              
              {selectedRegistration.constituency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Constituency</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.constituency}</p>
                </div>
              )}
              
              {selectedRegistration.interests && selectedRegistration.interests.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interests</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedRegistration.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRegistration.additionalInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.additionalInfo}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRegistration(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

