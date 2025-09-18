import React, { useState, useEffect } from 'react';
import { Leader } from '../../types';
import { leadersService } from '../../lib/mockFirestoreService';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Mail,
  Phone,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface LeadersManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function LeadersManager({ onClose, onActivityUpdate }: LeadersManagerProps) {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  // Load leaders from Firestore
  useEffect(() => {
    const unsubscribe = leadersService.subscribeToLeaders((leadersData) => {
      setLeaders(leadersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leader.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPosition === 'all' || leader.position === filterPosition;
    return matchesSearch && matchesFilter;
  });

  const getPositionColor = (position: string) => {
    if (position.includes('Chairman') || position.includes('President')) {
      return 'bg-purple-100 text-purple-800';
    } else if (position.includes('Secretary')) {
      return 'bg-blue-100 text-blue-800';
    } else if (position.includes('Coordinator')) {
      return 'bg-green-100 text-green-800';
    } else if (position.includes('Director')) {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty social links
      const socialLinks = Object.fromEntries(
        Object.entries(formData.socialLinks).filter(([_, value]) => value.trim() !== '')
      );

      const leaderData = {
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        socialLinks: socialLinks
      };

      await leadersService.addLeader(leaderData);
      setShowAddModal(false);
      resetForm();
      onActivityUpdate?.('leader', 'Added', leaderData.name);
    } catch (error) {
      console.error('Error adding leader:', error);
    }
  };

  const handleEditLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeader) return;

    try {
      // Filter out empty social links
      const socialLinks = Object.fromEntries(
        Object.entries(formData.socialLinks).filter(([_, value]) => value.trim() !== '')
      );

      const leaderData = {
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        socialLinks: socialLinks
      };

      await leadersService.updateLeader(editingLeader.id, leaderData);
      setEditingLeader(null);
      resetForm();
      onActivityUpdate?.('leader', 'Updated', leaderData.name);
    } catch (error) {
      console.error('Error updating leader:', error);
    }
  };

  const handleDeleteLeader = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leader?')) {
      try {
        const leader = leaders.find(l => l.id === id);
        await leadersService.deleteLeader(id);
        onActivityUpdate?.('leader', 'Deleted', leader?.name || 'Leader');
      } catch (error) {
        console.error('Error deleting leader:', error);
      }
    }
  };

  const openEditModal = (leader: Leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      position: leader.position,
      email: leader.email,
      phone: leader.phone,
      socialLinks: {
        linkedin: leader.socialLinks?.linkedin || '',
        twitter: leader.socialLinks?.twitter || '',
        facebook: leader.socialLinks?.facebook || '',
        instagram: leader.socialLinks?.instagram || ''
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leaders Management</h2>
          <p className="text-gray-600">Manage UFA leadership team and representatives</p>
        </div>
        <button
          onClick={() => {
            console.log('Add Leader button clicked');
            setShowAddModal(true);
            console.log('showAddModal set to true');
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Leader</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
            >
              <option value="all">All Positions</option>
              <option value="Chairman">Chairman</option>
              <option value="Secretary">Secretary</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Director">Director</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading leaders...</span>
        </div>
      )}

      {/* Leaders Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeaders.map((leader) => (
          <div key={leader.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Leader Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-600">
                    {getInitials(leader.name)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{leader.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(leader.position)}`}>
                    {leader.position}
                  </span>
                </div>
              </div>
            </div>

            {/* Leader Details */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="truncate">{leader.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{leader.phone}</span>
                </div>
              </div>

              {/* Social Links */}
              {leader.socialLinks && Object.keys(leader.socialLinks).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Social Links</p>
                  <div className="flex space-x-2">
                    {Object.entries(leader.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title={`${platform} profile`}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEditModal(leader)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteLeader(leader.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {filteredLeaders.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leaders found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterPosition !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first leader.'
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Leader
          </button>
        </div>
      )}

      {/* Add/Edit Leader Modal */}
      {(showAddModal || editingLeader) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{zIndex: 9999}}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingLeader ? 'Edit Leader' : 'Add New Leader'}
            </h3>
            
            <form onSubmit={editingLeader ? handleEditLeader : handleAddLeader} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Position</option>
                    <option value="Chairman & Co-Founder">Chairman & Co-Founder</option>
                    <option value="Secretary General">Secretary General</option>
                    <option value="Youth Coordinator">Youth Coordinator</option>
                    <option value="Director of Operations">Director of Operations</option>
                    <option value="Communications Director">Communications Director</option>
                    <option value="Finance Director">Finance Director</option>
                    <option value="Policy Advisor">Policy Advisor</option>
                    <option value="Community Outreach Coordinator">Community Outreach Coordinator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Social Media Links (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: {...formData.socialLinks, linkedin: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: {...formData.socialLinks, twitter: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: {...formData.socialLinks, facebook: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: {...formData.socialLinks, instagram: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLeader(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingLeader ? 'Update Leader' : 'Create Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
