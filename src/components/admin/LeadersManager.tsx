import React, { useState } from 'react';
import { Leader } from '../../types';
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
  ExternalLink
} from 'lucide-react';

interface LeadersManagerProps {
  onClose: () => void;
}

export default function LeadersManager({ onClose }: LeadersManagerProps) {
  const [leaders, setLeaders] = useState<Leader[]>([
    {
      id: '1',
      name: 'Dr. Sarah Mwangi',
      position: 'Chairman & Co-Founder',
      email: 'sarah.mwangi@ufa.org',
      phone: '+254712345678',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahmwangi',
        twitter: 'https://twitter.com/sarahmwangi_ufa'
      }
    },
    {
      id: '2',
      name: 'James Kipkoech',
      position: 'Secretary General',
      email: 'james.kipkoech@ufa.org',
      phone: '+254723456789',
      socialLinks: {
        facebook: 'https://facebook.com/jameskipkoech',
        linkedin: 'https://linkedin.com/in/jameskipkoech'
      }
    },
    {
      id: '3',
      name: 'Aisha Hassan',
      position: 'Youth Coordinator',
      email: 'aisha.hassan@ufa.org',
      phone: '+254734567890',
      socialLinks: {
        instagram: 'https://instagram.com/aishahassan_ufa',
        twitter: 'https://twitter.com/aishahassan_ufa'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leaders Management</h2>
          <p className="text-gray-600">Manage UFA leadership team and representatives</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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

      {/* Leaders Grid */}
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
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Add Leader Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Leader</h3>
            <p className="text-gray-600 mb-4">Leader creation form will be implemented here.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save Leader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
