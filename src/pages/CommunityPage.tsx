import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  Bookmark,
  Clock,
  UserPlus,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  TrendingUp,
  Activity
} from 'lucide-react';
import { NavigationPage } from '../types';
import { localOpportunitiesService, CommunityGroup, VolunteerOpportunity, LocalEvent } from '../lib/localOpportunitiesService';

interface CommunityPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export default function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState<'groups' | 'discussions' | 'volunteer' | 'events'>('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [counties, setCounties] = useState<string[]>([]);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [groups, volunteers, events, countyList] = await Promise.all([
        localOpportunitiesService.getCommunityGroups(),
        localOpportunitiesService.getVolunteerOpportunities(),
        localOpportunitiesService.getLocalEvents(),
        localOpportunitiesService.getCounties()
      ]);
      
      setCommunityGroups(groups);
      setVolunteerOpportunities(volunteers);
      setLocalEvents(events);
      setCounties(countyList);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = communityGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCounty = !selectedCounty || group.county === selectedCounty;
    const matchesType = !selectedType || group.type === selectedType;
    return matchesSearch && matchesCounty && matchesType;
  });

  const filteredVolunteers = volunteerOpportunities.filter(volunteer => {
    const matchesSearch = volunteer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCounty = !selectedCounty || volunteer.county === selectedCounty;
    return matchesSearch && matchesCounty;
  });

  const filteredEvents = localEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCounty = !selectedCounty || event.county === selectedCounty;
    return matchesSearch && matchesCounty;
  });

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'youth': return '👥';
      case 'women': return '👩';
      case 'environmental': return '🌱';
      case 'business': return '💼';
      case 'religious': return '⛪';
      case 'cultural': return '🎭';
      case 'sports': return '⚽';
      case 'education': return '📚';
      default: return '👥';
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'youth': return 'bg-blue-100 text-blue-800';
      case 'women': return 'bg-pink-100 text-pink-800';
      case 'environmental': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'religious': return 'bg-yellow-100 text-yellow-800';
      case 'cultural': return 'bg-orange-100 text-orange-800';
      case 'sports': return 'bg-red-100 text-red-800';
      case 'education': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const result = await localOpportunitiesService.registerForOpportunity(groupId, 'community');
      if (result.success) {
        alert('Successfully joined the community group!');
        // Refresh data
        loadCommunityData();
      } else {
        alert('Failed to join group. Please try again.');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleVolunteer = async (opportunityId: string) => {
    try {
      const result = await localOpportunitiesService.registerForOpportunity(opportunityId, 'volunteer');
      if (result.success) {
        alert('Successfully registered as volunteer!');
        loadCommunityData();
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error registering as volunteer:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const result = await localOpportunitiesService.registerForOpportunity(eventId, 'event');
      if (result.success) {
        alert('Successfully registered for the event!');
        loadCommunityData();
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const renderCommunityGroups = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search community groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Counties</option>
              {counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="youth">Youth</option>
              <option value="women">Women</option>
              <option value="environmental">Environmental</option>
              <option value="business">Business</option>
              <option value="religious">Religious</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="education">Education</option>
            </select>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map(group => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getGroupTypeIcon(group.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGroupTypeColor(group.type)}`}>
                      {group.type.charAt(0).toUpperCase() + group.type.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {expandedGroup === group.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{group.location}, {group.county}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{group.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{group.meetingSchedule}</span>
                </div>
              </div>

              {expandedGroup === group.id && (
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.activities.map((activity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{group.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{group.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{group.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  {group.socialMedia && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Social Media</h4>
                      <div className="flex gap-2">
                        {group.socialMedia.facebook && (
                          <a href={group.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {group.socialMedia.twitter && (
                          <a href={group.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {group.socialMedia.instagram && (
                          <a href={group.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Join Group
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No community groups found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or check back later for new groups.</p>
        </div>
      )}
    </div>
  );

  const renderVolunteerOpportunities = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search volunteer opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteer Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVolunteers.map(opportunity => (
          <div key={opportunity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                <p className="text-sm text-gray-600">{opportunity.organization}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                opportunity.status === 'active' ? 'bg-green-100 text-green-800' :
                opportunity.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {opportunity.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>

            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{opportunity.location}, {opportunity.county}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{opportunity.timeCommitment}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Start Date: {new Date(opportunity.startDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleVolunteer(opportunity.id)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Volunteer
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteer opportunities found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );

  const renderLocalEvents = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search local events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.organizer}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}, {event.county}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleJoinEvent(event.id)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Join Event
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No local events found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or check back later for new events.</p>
        </div>
      )}
    </div>
  );

  const renderDiscussions = () => (
    <div className="space-y-6">
      {/* Discussion Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">General Discussion</h3>
              <p className="text-sm text-gray-500">Open conversations</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>1,234 topics</span>
            <span>5,678 posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Policy & Advocacy</h3>
              <p className="text-sm text-gray-500">Political discussions</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>456 topics</span>
            <span>2,345 posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Community Events</h3>
              <p className="text-sm text-gray-500">Event discussions</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>234 topics</span>
            <span>1,567 posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Success Stories</h3>
              <p className="text-sm text-gray-500">Member achievements</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>123 topics</span>
            <span>789 posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Volunteer Hub</h3>
              <p className="text-sm text-gray-500">Volunteer discussions</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>345 topics</span>
            <span>1,234 posts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Local Issues</h3>
              <p className="text-sm text-gray-500">Community concerns</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>567 topics</span>
            <span>3,456 posts</span>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
        <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Discussion Forum Coming Soon</h3>
        <p className="text-gray-600 mb-4">
          We're building an interactive discussion platform where you can connect with fellow UFA members, 
          share ideas, and collaborate on important issues affecting our communities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Notified
          </button>
          <button 
            onClick={() => onNavigate('membership')}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Join UFA
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6"><span className="marker-highlight">Community Hub</span></h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Connect with fellow UFA members, join community groups, volunteer for causes you care about, 
              and participate in local events that make a difference.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap">
            {[
              { id: 'groups', label: 'Community Groups', icon: Users },
              { id: 'discussions', label: 'Discussions', icon: MessageCircle },
              { id: 'volunteer', label: 'Volunteer', icon: Heart },
              { id: 'events', label: 'Local Events', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'groups' && renderCommunityGroups()}
        {activeTab === 'discussions' && renderDiscussions()}
        {activeTab === 'volunteer' && renderVolunteerOpportunities()}
        {activeTab === 'events' && renderLocalEvents()}
      </div>
    </div>
  );
}

