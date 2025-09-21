import { ArrowRight, Users, Target, Shield, Lightbulb, Calendar, BookOpen, TrendingUp, X, MapPin, Clock, Mail, Phone, ExternalLink, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { NavigationPage, NewsItem, Event } from '../types';
import { useState, useEffect } from 'react';
import { newsService, eventsService } from '../lib/firestoreServices';
import EventRegistrationModal from '../components/EventRegistrationModal';
import { CalendarService } from '../lib/calendarService';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Set up real-time subscriptions for live updates
    const unsubscribeNews = newsService.subscribeToLatestNews((news) => {
      setNewsItems(news.slice(0, 3));
      setLoading(false);
    }, 3);

    const unsubscribeEvents = eventsService.subscribeToUpcomingEvents((events) => {
      setUpcomingEvents(events.slice(0, 2));
    }, 2);

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeNews();
      unsubscribeEvents();
    };
  }, []);

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setShowEventModal(false);
  };

  const handleRegisterForEvent = () => {
    if (selectedEvent) {
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSuccess = (confirmationCode: string) => {
    setRegistrationSuccess(confirmationCode);
    setShowRegistrationModal(false);
    // Close the event modal after successful registration
    setTimeout(() => {
      closeEventModal();
      setRegistrationSuccess(null);
    }, 3000);
  };

  const closeRegistrationModal = () => {
    setShowRegistrationModal(false);
  };

  const handleAddToCalendar = () => {
    if (upcomingEvents.length > 0) {
      // If there are upcoming events, show options for the first one
      // In a real implementation, you might want to show a list of events to choose from
      CalendarService.openCalendarOptions(upcomingEvents[0]);
    } else {
      // If no events, show a message or redirect to events page
      alert('No upcoming events available. Please check our events page for more information.');
      onNavigate('events');
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rally': return Users;
      case 'webinar': return BookOpen;
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
      case 'fundraiser': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your <span className="text-blue-600">Kenya</span> Into a 
              <br />
              <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Progressive Future
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              We help Kenyans build a united, inclusive, and sustainable future through 
              innovative governance, social justice, and community empowerment.
            </p>
            
            {/* CTA Button */}
            <button
              onClick={() => onNavigate('membership')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
            >
              Join Our Movement
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Before/After Comparison */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Before Card */}
              <div className="relative">
                <div className="text-center mb-4">
                  <span className="text-gray-500 text-sm font-medium">Before</span>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Kenya Today</h3>
                      <p className="text-gray-600 text-sm">Fragmented Communities</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Divided by politics, limited opportunities, and unequal access to resources.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Inequality +25%
                    </span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                      <Users className="w-3 h-3 inline mr-1" />
                      Disconnected -40%
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex justify-center">
                <div className="bg-blue-100 rounded-full p-4">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* After Card */}
              <div className="relative">
                <div className="text-center mb-4">
                  <span className="text-gray-500 text-sm font-medium">After</span>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Kenya with UFA</h3>
                      <p className="text-gray-600 text-sm">United Future Alliance</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    United communities, equal opportunities, and sustainable development for all.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Unity +300%
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <Users className="w-3 h-3 inline mr-1" />
                      Connected +500%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              How We Transform Kenya
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach to building a better future for all Kenyans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Unity</h3>
              <p className="text-gray-600">
                Bringing together diverse communities across all 47 counties to work toward common goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparent Governance</h3>
              <p className="text-gray-600">
                Promoting accountability, transparency, and citizen participation in decision-making processes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation & Growth</h3>
              <p className="text-gray-600">
                Fostering innovation, entrepreneurship, and sustainable economic development across Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Our Impact Across Kenya
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real results from our community-driven initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">47</div>
              <div className="text-blue-100">Counties Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Community Programs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">25,000+</div>
              <div className="text-blue-100">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Latest Updates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about our latest initiatives and community achievements
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading latest news...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    <button
                      onClick={() => onNavigate('resources')}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Shape Kenya's Future?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of Kenyans who are already part of the United Future Alliance. 
            Together, we can build the progressive, inclusive Kenya we all envision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('membership')}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Become a Member
            </button>
            <button
              onClick={() => onNavigate('donate')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition-colors"
            >
              Support the Cause
            </button>
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRegisterForEvent}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Register for Event
                </button>
                <button
                  onClick={handleAddToCalendar}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          onClose={closeRegistrationModal}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Success Message */}
      {registrationSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Registration successful! Confirmation: {registrationSuccess}</span>
          </div>
        </div>
      )}
    </div>
  );
}
