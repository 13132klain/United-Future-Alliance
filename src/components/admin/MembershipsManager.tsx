import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Membership } from '../../types';
import { membershipsService } from '../../lib/firestoreServices';

interface MembershipsManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function MembershipsManager({ onClose, onActivityUpdate }: MembershipsManagerProps) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    setLoading(true);
    
    // Set up real-time subscription for memberships
    const unsubscribe = membershipsService.subscribeToMemberships((membershipsData) => {
      console.log('📊 MembershipsManager received data:', membershipsData);
      console.log('📊 Number of memberships:', membershipsData.length);
      setMemberships(membershipsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await membershipsService.updateMembership(id, {
        status,
        reviewedAt: new Date(),
        reviewedBy: 'Current Admin', // This would come from auth context
        notes: reviewNotes
      });
      setShowReviewModal(false);
      setSelectedMembership(null);
      setReviewNotes('');
      onActivityUpdate?.('membership', status === 'approved' ? 'Approved' : 'Rejected', selectedMembership?.firstName + ' ' + selectedMembership?.lastName);
    } catch (error) {
      console.error('Error updating membership status:', error);
    }
  };

  const handleDeleteMembership = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete membership application from "${name}"?`)) {
      try {
        await membershipsService.deleteMembership(id);
        onActivityUpdate?.('membership', 'Deleted', name);
      } catch (error) {
        console.error('Error deleting membership:', error);
      }
    }
  };

  const openDetailsModal = (membership: Membership) => {
    setSelectedMembership(membership);
    setShowDetailsModal(true);
  };

  const openReviewModal = (membership: Membership) => {
    setSelectedMembership(membership);
    setReviewNotes(membership.notes || '');
    setShowReviewModal(true);
  };

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = 
      membership.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.county.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || membership.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = memberships.filter(m => m.status === 'pending').length;
  const approvedCount = memberships.filter(m => m.status === 'approved').length;
  const rejectedCount = memberships.filter(m => m.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Membership Applications</h2>
          <p className="text-gray-600">Review and manage membership applications</p>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {pendingCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {pendingCount} membership application{pendingCount > 1 ? 's' : ''} pending review
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                New applications require your attention for approval or rejection.
              </p>
            </div>
            <button
              onClick={() => setStatusFilter('pending')}
              className="ml-auto px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMemberships.map((membership) => {
                  const StatusIcon = getStatusIcon(membership.status);
                  
                  return (
                    <tr key={membership.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {membership.firstName} {membership.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{membership.occupation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{membership.email}</div>
                        <div className="text-sm text-gray-500">{membership.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{membership.county}</div>
                        <div className="text-sm text-gray-500">{membership.constituency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(membership.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {membership.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {membership.submittedAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailsModal(membership)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {membership.status === 'pending' && (
                            <button
                              onClick={() => openReviewModal(membership)}
                              className="text-emerald-600 hover:text-emerald-900"
                              title="Review Application"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMembership(membership.id, `${membership.firstName} ${membership.lastName}`)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMemberships.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">No membership applications match your current filters</p>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedMembership && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Application Details - {selectedMembership.firstName} {selectedMembership.lastName}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-emerald-600" />
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedMembership.firstName} {selectedMembership.lastName}</div>
                    <div><span className="font-medium">Email:</span> {selectedMembership.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedMembership.phone}</div>
                    <div><span className="font-medium">Date of Birth:</span> {selectedMembership.dateOfBirth.toLocaleDateString()}</div>
                    <div><span className="font-medium">Gender:</span> {selectedMembership.gender}</div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                    Location
                  </h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">County:</span> {selectedMembership.county}</div>
                    <div><span className="font-medium">Constituency:</span> {selectedMembership.constituency}</div>
                    {selectedMembership.ward && <div><span className="font-medium">Ward:</span> {selectedMembership.ward}</div>}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                    Professional
                  </h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Occupation:</span> {selectedMembership.occupation}</div>
                    {selectedMembership.organization && <div><span className="font-medium">Organization:</span> {selectedMembership.organization}</div>}
                  </div>
                </div>

                {/* Application Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                    Application
                  </h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMembership.status)}`}>
                        {selectedMembership.status}
                      </span>
                    </div>
                    <div><span className="font-medium">Submitted:</span> {selectedMembership.submittedAt.toLocaleDateString()}</div>
                    {selectedMembership.reviewedAt && <div><span className="font-medium">Reviewed:</span> {selectedMembership.reviewedAt.toLocaleDateString()}</div>}
                    {selectedMembership.reviewedBy && <div><span className="font-medium">Reviewed By:</span> {selectedMembership.reviewedBy}</div>}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Areas of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMembership.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Motivation</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedMembership.motivation}</p>
              </div>

              {/* Volunteer Information */}
              {selectedMembership.isVolunteer && selectedMembership.volunteerAreas && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Volunteer Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembership.volunteerAreas.map(area => (
                      <span key={area} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedMembership.notes && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Review Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedMembership.notes}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {selectedMembership.status === 'pending' && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openReviewModal(selectedMembership);
                    }}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Review Application
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedMembership && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Review Application - {selectedMembership.firstName} {selectedMembership.lastName}
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Add any notes about this application..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleStatusUpdate(selectedMembership.id, 'approved')}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedMembership.id, 'rejected')}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
