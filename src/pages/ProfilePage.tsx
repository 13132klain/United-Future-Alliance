import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Users,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Membership } from '../types';
import { membershipsService } from '../lib/firestoreServices';

interface ProfilePageProps {
  onNavigate: (page: any) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, loading: authLoading } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    county: '',
    constituency: '',
    ward: '',
    occupation: '',
    organization: '',
    interests: [] as string[],
    motivation: '',
    howDidYouHear: '',
    isVolunteer: false,
    volunteerAreas: [] as string[]
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Get user's membership application
      console.log('👤 Loading profile for user:', user?.email);
      const memberships = await membershipsService.getMemberships();
      console.log('👤 All memberships:', memberships.map(m => ({ email: m.email, name: `${m.firstName} ${m.lastName}`, status: m.status })));
      const userMembership = memberships.find(m => m.email === user?.email);
      console.log('👤 Found user membership:', userMembership);
      
      if (userMembership) {
        setMembership(userMembership);
        setProfileData({
          firstName: userMembership.firstName,
          lastName: userMembership.lastName,
          email: userMembership.email,
          phone: userMembership.phone,
          dateOfBirth: userMembership.dateOfBirth.toISOString().split('T')[0],
          gender: userMembership.gender,
          county: userMembership.county,
          constituency: userMembership.constituency,
          ward: userMembership.ward || '',
          occupation: userMembership.occupation,
          organization: userMembership.organization || '',
          interests: userMembership.interests,
          motivation: userMembership.motivation,
          howDidYouHear: userMembership.howDidYouHear,
          isVolunteer: userMembership.isVolunteer,
          volunteerAreas: userMembership.volunteerAreas || []
        });
      } else {
        console.log('👤 No membership found for user:', user?.email);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProfileData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'interests' || name === 'volunteerAreas') {
      const checkbox = e.target as HTMLInputElement;
      const currentValues = profileData[name as keyof typeof profileData] as string[];
      if (checkbox.checked) {
        setProfileData(prev => ({
          ...prev,
          [name]: [...currentValues, value]
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          [name]: currentValues.filter(item => item !== value)
        }));
      }
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!membership) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await membershipsService.updateMembership(membership.id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        dateOfBirth: new Date(profileData.dateOfBirth),
        gender: profileData.gender,
        county: profileData.county,
        constituency: profileData.constituency,
        ward: profileData.ward || undefined,
        occupation: profileData.occupation,
        organization: profileData.organization || undefined,
        interests: profileData.interests,
        motivation: profileData.motivation,
        howDidYouHear: profileData.howDidYouHear,
        isVolunteer: profileData.isVolunteer,
        volunteerAreas: profileData.isVolunteer ? profileData.volunteerAreas : undefined
      });
      
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and membership status</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-800">Profile updated successfully!</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.name || 'User'}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                {/* Membership Status */}
                {membership && (
                  <div className="mb-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(membership.status)}`}>
                      {getStatusIcon(membership.status)}
                      <span className="ml-2 capitalize">{membership.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {membership.status === 'pending' && 'Your application is under review'}
                      {membership.status === 'approved' && 'Welcome to UFA!'}
                      {membership.status === 'rejected' && 'Please contact us for more information'}
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {membership ? new Date(membership.submittedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">
                      {membership ? `${membership.county}, ${membership.constituency}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Volunteer</span>
                    <span className="font-medium">
                      {membership?.isVolunteer ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('events')}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                  <span>View Events</span>
                </button>
                <button
                  onClick={() => onNavigate('community')}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 mr-3 text-green-600" />
                  <span>Community Hub</span>
                </button>
                <button
                  onClick={() => onNavigate('resources')}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 mr-3 text-purple-600" />
                  <span>Resources</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setError(null);
                        loadUserProfile(); // Reset form data
                      }}
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {!membership ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Membership Application</h4>
                  <p className="text-gray-600 mb-6">You haven't submitted a membership application yet.</p>
                  <button
                    onClick={() => onNavigate('membership')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply for Membership
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{profileData.email}</p>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {editing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      {editing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      {editing ? (
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 capitalize">{profileData.gender}</p>
                      )}
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                      {editing ? (
                        <input
                          type="text"
                          name="county"
                          value={profileData.county}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.county}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Constituency</label>
                      {editing ? (
                        <input
                          type="text"
                          name="constituency"
                          value={profileData.constituency}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.constituency}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                      {editing ? (
                        <input
                          type="text"
                          name="ward"
                          value={profileData.ward}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.ward || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                      {editing ? (
                        <input
                          type="text"
                          name="occupation"
                          value={profileData.occupation}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.occupation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                      {editing ? (
                        <input
                          type="text"
                          name="organization"
                          value={profileData.organization}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.organization || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Interests and Motivation */}
              {membership && (
                <div className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
                    {editing ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Civic Education', 'Youth Development', 'Women Empowerment', 'Environmental Conservation', 'Community Development', 'Policy Advocacy'].map(interest => (
                          <label key={interest} className="flex items-center">
                            <input
                              type="checkbox"
                              name="interests"
                              value={interest}
                              checked={profileData.interests.includes(interest)}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{interest}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.interests.map(interest => (
                          <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Motivation for Joining UFA</label>
                    {editing ? (
                      <textarea
                        name="motivation"
                        value={profileData.motivation}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.motivation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about UFA?</label>
                    {editing ? (
                      <input
                        type="text"
                        name="howDidYouHear"
                        value={profileData.howDidYouHear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.howDidYouHear}</p>
                    )}
                  </div>

                  {/* Volunteer Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Interest</label>
                    {editing ? (
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isVolunteer"
                            checked={profileData.isVolunteer}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <span className="text-gray-700">I am interested in volunteering</span>
                        </label>
                        
                        {profileData.isVolunteer && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Areas</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {['Event Organization', 'Community Outreach', 'Social Media', 'Research', 'Training', 'Administration'].map(area => (
                                <label key={area} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="volunteerAreas"
                                    value={area}
                                    checked={profileData.volunteerAreas.includes(area)}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-gray-700">{area}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-900 mb-2">
                          {profileData.isVolunteer ? 'Yes, interested in volunteering' : 'No volunteer interest'}
                        </p>
                        {profileData.isVolunteer && profileData.volunteerAreas.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {profileData.volunteerAreas.map(area => (
                              <span key={area} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {area}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
