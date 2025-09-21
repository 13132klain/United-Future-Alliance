import React, { useState, useEffect } from 'react';
import { Leader } from '../../types';
import { leadersService } from '../../lib/firestoreServices';
import { fileStorageService } from '../../lib/fileStorageService';
import { indexedDBFileStorageService } from '../../lib/indexedDBFileStorageService';
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
  Loader2,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';

// Component to handle async image loading from IndexedDB
const LeaderImage: React.FC<{ 
  imageValue: string; 
  alt: string; 
  className: string;
  fallbackInitials: string;
}> = ({ imageValue, alt, className, fallbackInitials }) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageValue) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        // If it's already a blob URL, use it directly
        if (imageValue.startsWith('blob:')) {
          setImageURL(imageValue);
          setLoading(false);
          return;
        }

        // If it's a fileId, generate a new blob URL
        if (imageValue.startsWith('file_')) {
          const url = await indexedDBFileStorageService.getImageURL(imageValue);
          setImageURL(url);
        } else {
          // For other cases (like external URLs), use as is
          setImageURL(imageValue);
        }
      } catch (err) {
        console.error('Failed to load image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageValue]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !imageURL) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center`}>
        <span className="text-white font-bold text-2xl">
          {fallbackInitials}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imageURL} 
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

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
    image: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Helper function to get image URL (handles both fileIds and blob URLs)
  const getImageDisplayURL = async (imageValue: string): Promise<string | null> => {
    if (!imageValue) return null;
    
    // If it's already a blob URL, return it
    if (imageValue.startsWith('blob:')) {
      return imageValue;
    }
    
    // If it's a fileId, generate a new blob URL
    if (imageValue.startsWith('file_')) {
      try {
        return await indexedDBFileStorageService.getImageURL(imageValue);
      } catch (error) {
        console.error('Failed to get image URL for fileId:', imageValue, error);
        return null;
      }
    }
    
    // For other cases (like external URLs), return as is
    return imageValue;
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Upload to IndexedDB (no CORS issues)
      const result = await fileStorageService.uploadFile(file, 'leaders');
      
      if (result.success && result.fileId) {
        // Store the fileId instead of blob URL for persistence
        setFormData({ ...formData, image: result.fileId });
        
        // Generate preview URL for immediate display
        const imageURL = await indexedDBFileStorageService.getImageURL(result.fileId);
        if (imageURL) {
          setImagePreview(imageURL);
          setImageFile(file);
        } else {
          alert('Failed to generate image preview');
        }
      } else {
        alert(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
    setImageFile(null);
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
        image: formData.image,
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
        image: formData.image,
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
      image: leader.image || '',
      socialLinks: {
        linkedin: leader.socialLinks?.linkedin || '',
        twitter: leader.socialLinks?.twitter || '',
        facebook: leader.socialLinks?.facebook || '',
        instagram: leader.socialLinks?.instagram || ''
      }
    });
    setImagePreview(leader.image || '');
    setImageFile(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      image: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      }
    });
    setImageFile(null);
    setImagePreview('');
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
          <div key={leader.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Full Background Image */}
            <LeaderImage 
              imageValue={leader.image || ''}
              alt={leader.name}
              className="w-full h-48 object-cover"
              fallbackInitials={getInitials(leader.name)}
            />
            
            {/* Card Content */}
            <div className="p-4">
              {/* Name and Status */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{leader.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Active</span>
                </div>
              </div>
              
              {/* Position */}
              <div className="text-center mb-3">
                <p className="text-sm font-medium text-gray-700">{leader.position}</p>
              </div>
              
              {/* Contact Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{leader.email}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => openEditModal(leader)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button 
                  onClick={() => handleDeleteLeader(leader.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image (Optional)
                </label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        ) : (
                          <Upload className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm text-gray-700">
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </span>
                      </div>
                    </label>
                    {!imagePreview && (
                      <span className="text-xs text-gray-500">
                        JPG, PNG up to 5MB
                      </span>
                    )}
                  </div>
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
