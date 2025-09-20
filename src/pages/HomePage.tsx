import { ArrowRight, Users, Target, Shield, Lightbulb, Calendar, BookOpen, TrendingUp, X, MapPin, Clock, Mail, Phone, ExternalLink } from 'lucide-react';
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

  const coreValues = [
    {
      icon: Users,
      title: 'Unity & Inclusion',
      description: 'Building bridges across all communities, tribes, and backgrounds to create a truly united Kenya.'
    },
    {
      icon: Target,
      title: 'Progressive Governance',
      description: 'Implementing forward-thinking policies that address modern challenges with innovative solutions.'
    },
    {
      icon: Shield,
      title: 'Transparency & Accountability',
      description: 'Ensuring open governance with clear accountability mechanisms and citizen participation.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation & Sustainability',
      description: 'Embracing technology and sustainable practices to secure Kenya\'s environmental and economic future.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white text-gray-900 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-blue-50/30"></div>
        
        {/* Floating geometric shapes - hidden on mobile */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full animate-bounce delay-1000 hidden md:block"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200/40 rounded-lg rotate-45 animate-pulse delay-500 hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-200/40 rounded-full animate-ping delay-700 hidden md:block"></div>
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-green-200/50 rounded-full animate-bounce delay-300 hidden md:block"></div>
        
        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in-up text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 backdrop-blur-sm border border-green-200 rounded-full px-3 sm:px-4 py-2 text-green-700 text-xs sm:text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Join 25,000+ Kenyans Making a Difference</span>
                <span className="sm:hidden">25,000+ Members</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block animate-slide-in-left text-gray-900">Building Kenya's</span>
                <span className="block text-green-600 animate-slide-in-right delay-300 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Unified Future
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-500">
                Join the United Future Alliance in creating a progressive, inclusive, and sustainable Kenya 
                where every citizen has the opportunity to thrive and contribute to our nation's prosperity.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-700 max-w-md mx-auto lg:mx-0">
                <button
                  onClick={() => onNavigate('membership')}
                  className="group bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105 transform text-sm sm:text-base"
                >
                  <span>Join the Movement</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="group border-2 border-red-600 text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 transform text-sm sm:text-base"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 animate-fade-in-up delay-1000">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>47 Counties</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>15,000+ Youth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>12 Initiatives</span>
                </div>
              </div>
            </div>
            
            {/* Right Visual - Stacked Image Cards */}
            <div className="flex justify-center lg:block">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-96 lg:h-96 animate-fade-in-right delay-500">
                {/* Stacked Cards Container */}
                <div className="absolute inset-0 flex items-center justify-center stacked-cards-container">
                  {/* Card 1 - Growth (Top of Stack) */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-xl shadow-lg cursor-pointer group overflow-hidden stacked-card" style={{ zIndex: 6 }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop" 
                        alt="Growth and Development"
                        className="w-full h-full object-cover card-image grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-600/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                        <div className="text-xs sm:text-xs sm:text-xs font-bold">Growth</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Card 2 - Unity */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-xl shadow-lg cursor-pointer group overflow-hidden stacked-card" style={{ zIndex: 5 }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop" 
                        alt="Unity and Community"
                        className="w-full h-full object-cover card-image grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-600/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                        <div className="text-xs sm:text-xs font-bold">Unity</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Card 3 - Innovation */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-xl shadow-lg cursor-pointer group overflow-hidden stacked-card" style={{ zIndex: 4 }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop" 
                        alt="Innovation and Technology"
                        className="w-full h-full object-cover card-image grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-yellow-600/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                        <div className="text-xs sm:text-xs font-bold">Innovation</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Card 4 - Progress */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-xl shadow-lg cursor-pointer group overflow-hidden stacked-card" style={{ zIndex: 3 }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop" 
                        alt="Progress and Development"
                        className="w-full h-full object-cover card-image grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-600/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                        <div className="text-xs sm:text-xs font-bold">Progress</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Card 5 - Future */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-xl shadow-lg cursor-pointer group overflow-hidden stacked-card" style={{ zIndex: 2 }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop" 
                        alt="Future and Sustainability"
                        className="w-full h-full object-cover card-image grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-600/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                        <div className="text-xs sm:text-xs font-bold">Future</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Card 6 - Hope (Bottom of Stack) */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 rounded-xl shadow-lg cursor-pointer group overflow-hidden stacked-card" style={{ zIndex: 1 }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop" 
                        alt="Hope and Inspiration"
                        className="w-full h-full object-cover card-image grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-pink-600/20 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                        <div className="text-xs sm:text-xs font-bold">Hope</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Center Kenya Flag */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 sm:border-4 border-green-200 z-10">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">🇰🇪</div>
                  </div>
                </div>
                
                {/* Connecting lines (optional) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border border-green-200/30 rounded-full animate-spin-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 border border-blue-300/20 rounded-full animate-spin-reverse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-green-300 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-green-500 rounded-full mt-1 sm:mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Active Members', value: '25,000+', icon: Users },
              { label: 'Counties Reached', value: '47', icon: Target },
              { label: 'Youth Engaged', value: '15,000+', icon: TrendingUp },
              { label: 'Policy Initiatives', value: '12', icon: BookOpen }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  index === 0 ? 'bg-red-100' : 
                  index === 1 ? 'bg-green-100' : 
                  index === 2 ? 'bg-blue-100' : 
                  'bg-red-100'
                }`}>
                  <stat.icon className={`w-8 h-8 ${
                    index === 0 ? 'text-red-600' : 
                    index === 1 ? 'text-green-600' : 
                    index === 2 ? 'text-blue-600' : 
                    'text-red-600'
                  }`} />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to building a Kenya where unity, progress, and opportunity 
              are accessible to all citizens, regardless of background or circumstance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                  index === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
                  index === 2 ? 'bg-gradient-to-br from-green-500 to-green-600' : 
                  'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We envision a Kenya where every citizen thrives in a society built on justice, 
              innovation, and shared prosperity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Vision Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="text-2xl">🎯</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">A United Kenya</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Where all 47 counties work together as one nation, celebrating our diversity 
                      while building bridges of understanding and cooperation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="text-2xl">💡</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation-Driven Growth</h3>
                    <p className="text-gray-600 leading-relaxed">
                      A Kenya that leads Africa in technological advancement, sustainable development, 
                      and creative solutions to global challenges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="text-2xl">🌱</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Future</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Environmental stewardship that preserves our natural heritage while creating 
                      green jobs and sustainable economic opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="text-2xl">🤝</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusive Prosperity</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Economic growth that benefits every Kenyan, with equal opportunities for 
                      education, healthcare, and meaningful employment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">By 2030, We See:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>100% access to quality education and healthcare</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Renewable energy powering 80% of our nation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Digital infrastructure connecting every community</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Transparent governance with citizen participation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision Visual */}
            <div className="relative group">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                {/* Main Image */}
                <img 
                  src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                  alt="Kenya's Vision 2030 - United Future"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:grayscale group-hover:scale-105"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-green-900/40"></div>
                
                {/* Vision Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 text-white">
                    <div className="space-y-2">
                      <h4 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">Vision 2030</h4>
                      <p className="text-white/90 font-medium drop-shadow-md">United • Prosperous • Sustainable</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300/80 rounded-full animate-bounce delay-1000 shadow-lg"></div>
                <div className="absolute top-8 right-6 w-4 h-4 sm:w-6 sm:h-6 bg-blue-300/80 rounded-full animate-bounce delay-500 shadow-lg"></div>
                <div className="absolute bottom-8 left-6 w-3 h-3 sm:w-4 sm:h-4 bg-purple-300/80 rounded-full animate-bounce delay-700 shadow-lg"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 sm:w-6 sm:h-6 bg-pink-300/80 rounded-full animate-bounce delay-300 shadow-lg"></div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Latest Updates
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              News & Updates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about UFA's latest initiatives, policy developments, and community achievements.
            </p>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              newsItems.map((article, index) => (
              <article key={article.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {article.category}
                    </span>
                  </div>
                  
                  {/* Featured Badge for first article */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Read Time */}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                      5 min read
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <div className="text-emerald-600 text-sm font-bold">UFA</div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {article.publishDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">{article.author}</span>
                    </div>
                    
                    <button className="group/btn text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 transition-all duration-200 hover:gap-2">
                      Read More
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
              ))
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated with UFA</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get the latest news, policy updates, and community stories delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Join Our Community
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with fellow UFA members, learn about our initiatives, and be part of Kenya's progressive movement.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {loading ? (
              // Loading skeleton for events
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              upcomingEvents.map((event, index) => (
              <div key={event.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
                {/* Event Header */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-green-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 to-green-700/80"></div>
                  
                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg capitalize">
                      {event.type}
                    </span>
                  </div>
                  
                  {/* Featured Badge for first event */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Date Display */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                      <div className="text-white text-sm font-medium">
                        {event.date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-white text-2xl font-bold">
                        {event.date.getDate()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-20">
                    <h3 className="text-white text-lg font-bold drop-shadow-lg line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                      {event.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                  {event.description}
                </p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-5 h-5 text-gray-400">📍</div>
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {event.registrationRequired ? 'Registration Required' : 'Open to All'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => CalendarService.openCalendarOptions(event)}
                        className="group/btn border-2 border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                        title="Add to Calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEventModal(event)}
                        className="group/btn bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        {event.registrationRequired ? 'Register Now' : 'Learn More'}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Browse our full calendar of events, webinars, and community gatherings. There's always something happening in the UFA community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => onNavigate('events')}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  View All Events
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleAddToCalendar}
                  className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative overflow-hidden">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getEventTypeColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                </div>
                <button
                  onClick={closeEventModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>
              
              <div className="space-y-4 mb-6">
                {/* Event Details */}
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="font-medium">
                    {selectedEvent.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">
                    {selectedEvent.date.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{selectedEvent.location}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  {(() => {
                    const EventIcon = getEventIcon(selectedEvent.type);
                    return <EventIcon className="w-5 h-5 text-green-500" />;
                  })()}
                  <span className="font-medium capitalize">{selectedEvent.type}</span>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Event</h3>
                <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Registration Info */}
              {selectedEvent.registrationRequired && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Registration Required</h3>
                  <p className="text-green-700 text-sm">
                    This event requires prior registration. Please register to secure your spot.
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need More Information?</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>events@ufa.org</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>+254 700 000 000</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedEvent.registrationRequired ? (
                  <button 
                    onClick={handleRegisterForEvent}
                    className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    Get Directions
                    <MapPin className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={closeEventModal}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={showRegistrationModal}
          onClose={closeRegistrationModal}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Registration Success Message */}
      {registrationSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-800 text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="font-semibold">Registration Successful!</p>
              <p className="text-sm">Confirmation Code: {registrationSuccess}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}