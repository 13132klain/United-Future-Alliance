import React from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import CursorTrail from './components/CursorTrail';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
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
        return <AboutPage />;
      case 'community':
        return <CommunityPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <CursorTrail />
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