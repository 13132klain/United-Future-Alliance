import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Video, ExternalLink } from 'lucide-react';
import { Event } from '../types';
import { eventsService } from '../lib/mockFirestoreService';

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Set up real-time subscription for events
    const unsubscribe = eventsService.subscribeToEvents((eventsData) => {
      console.log('EventsPage received events:', eventsData);
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const mockEvents: Event[] = [
      {
        id: '1',
        title: 'National Youth Summit 2024',
        description: 'A comprehensive gathering of young leaders, innovators, and changemakers from across Kenya. Join us for workshops on entrepreneurship, leadership development, and civic engagement.',
        date: new Date('2024-02-15'),
        location: 'KICC, Nairobi',
        type: 'rally',
        registrationRequired: true,
        image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '2',
        title: 'Economic Policy Webinar',
        description: 'Digital discussion on sustainable economic growth strategies, featuring expert panelists and Q&A session with UFA leadership.',
        date: new Date('2024-02-20'),
        location: 'Online',
        type: 'webinar',
        registrationRequired: true,
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '3',
        title: 'Community Town Hall - Mombasa',
        description: 'Open forum for residents of Mombasa County to discuss local issues, share concerns, and engage with UFA representatives.',
        date: new Date('2024-02-25'),
        location: 'Mombasa Cultural Centre',
        type: 'meeting',
        registrationRequired: false,
        image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '4',
        title: 'Education Reform Fundraiser',
        description: 'Gala dinner event to raise funds for UFA\'s comprehensive education reform initiative, featuring keynote speeches and networking.',
        date: new Date('2024-03-05'),
        location: 'Safari Park Hotel, Nairobi',
        type: 'fundraiser',
        registrationRequired: true,
        image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ];

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'rally', label: 'Rallies' },
    { id: 'meeting', label: 'Meetings' },
    { id: 'webinar', label: 'Webinars' },
    { id: 'fundraiser', label: 'Fundraisers' }
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.type === selectedFilter);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rally': return Users;
      case 'webinar': return Video;
      case 'meeting': return Users;
      case 'fundraiser': return Users;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'rally': return 'bg-red-100 text-red-800';
      case 'webinar': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'fundraiser': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Events & Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us at our upcoming events, rallies, and community gatherings. 
            Be part of the movement shaping Kenya's future.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
            const EventIcon = getEventIcon(event.type);
            return (
              <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-br from-emerald-400 to-green-500 relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {event.date.getDate()}
                    </div>
                    <div className="text-xs text-gray-600 uppercase">
                      {event.date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>
                        {event.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <EventIcon className="w-4 h-4 text-emerald-500" />
                      <span className="capitalize">{event.type}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                    {event.registrationRequired ? 'Register Now' : 'Learn More'}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-2xl border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're always organizing new events and activities. Stay connected with us 
              to be the first to know about upcoming opportunities in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
                Subscribe to Updates
              </button>
              <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}