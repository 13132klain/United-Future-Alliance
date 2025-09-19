import React from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import LeadershipPage from './pages/LeadershipPage';
import ResourcesPage from './pages/ResourcesPage';
import DonationPage from './pages/DonationPage';
import MembershipPage from './pages/MembershipPage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationPage } from './types';

function App() {
  const [currentPage, setCurrentPage] = React.useState<NavigationPage>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'events':
        return <EventsPage />;
      case 'leadership':
        return <LeadershipPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'donate':
        return <DonationPage />;
      case 'membership':
        return <MembershipPage onNavigate={setCurrentPage} />;
      case 'login':
        return <AuthPage mode="login" onNavigate={setCurrentPage} />;
      case 'register':
        return <AuthPage mode="register" onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'about':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">About UFA</h1>
                <p className="text-xl text-gray-600">Learn more about our mission, vision, and commitment to Kenya's future.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  The United Future Alliance was founded in 2024 by a diverse group of Kenyan leaders, activists, and citizens 
                  who shared a common vision: to build a more inclusive, progressive, and sustainable Kenya for all.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe that through unity, innovation, and collective action, we can address the challenges facing our 
                  nation and create opportunities for every Kenyan to thrive. Our movement is built on the principles of 
                  transparency, accountability, and citizen participation in governance.
                </p>
              </div>
            </div>
          </div>
        );
      case 'community':
        return <CommunityPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
        />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;