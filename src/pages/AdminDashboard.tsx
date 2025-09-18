import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavigationPage } from '../types';
import EventsManager from '../components/admin/EventsManager';
import NewsManager from '../components/admin/NewsManager';
import LeadersManager from '../components/admin/LeadersManager';
import SettingsManager from '../components/admin/SettingsManager';
import { eventsService, newsService, leadersService } from '../lib/mockFirestoreService';
import { 
  LayoutDashboard, 
  Calendar, 
  Newspaper, 
  Users, 
  Settings, 
  Plus,
  BarChart3,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: NavigationPage) => void;
}

type DashboardTab = 'overview' | 'events' | 'news' | 'leaders' | 'settings';

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Real-time data from services
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalNews: 0,
    totalLeaders: 0,
    totalUsers: 1247 // This would come from user service in a real app
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'event', action: 'Created', item: 'Youth Summit 2024', time: '2 hours ago' },
    { id: 2, type: 'news', action: 'Published', item: 'Education Reform Update', time: '4 hours ago' },
    { id: 3, type: 'leader', action: 'Added', item: 'Dr. Sarah Mwangi', time: '1 day ago' },
    { id: 4, type: 'event', action: 'Updated', item: 'Community Town Hall', time: '2 days ago' }
  ]);

  // Set up real-time subscriptions for overview stats
  useEffect(() => {
    const unsubscribeEvents = eventsService.subscribeToEvents((events) => {
      setStats(prev => ({ ...prev, totalEvents: events.length }));
    });

    const unsubscribeNews = newsService.subscribeToNews((news) => {
      setStats(prev => ({ ...prev, totalNews: news.length }));
    });

    const unsubscribeLeaders = leadersService.subscribeToLeaders((leaders) => {
      setStats(prev => ({ ...prev, totalLeaders: leaders.length }));
    });

    return () => {
      unsubscribeEvents();
      unsubscribeNews();
      unsubscribeLeaders();
    };
  }, []);

  // Function to add recent activity (called by child components)
  const addRecentActivity = (type: string, action: string, item: string) => {
    const newActivity = {
      id: Date.now(),
      type,
      action,
      item,
      time: 'Just now'
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'leaders', label: 'Leaders', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-emerald-100">Here's what's happening with UFA today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">News Articles</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leaders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLeaders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+2 this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+156 this week</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'event' ? 'bg-blue-100' :
                  activity.type === 'news' ? 'bg-emerald-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'event' ? <Calendar className="w-5 h-5 text-blue-600" /> :
                   activity.type === 'news' ? <Newspaper className="w-5 h-5 text-emerald-600" /> :
                   <Users className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action} {activity.item}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'events':
        return <EventsManager onClose={() => {}} onActivityUpdate={addRecentActivity} />;
      case 'news':
        return <NewsManager onClose={() => {}} onActivityUpdate={addRecentActivity} />;
      case 'leaders':
        return <LeadersManager onClose={() => {}} onActivityUpdate={addRecentActivity} />;
      case 'settings':
        return <SettingsManager onClose={() => {}} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">United Future Alliance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Users className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <nav className="p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as DashboardTab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
