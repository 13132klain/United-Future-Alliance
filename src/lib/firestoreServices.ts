import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured, firebaseInitialized } from './firebase';
import { Event, NewsItem, Leader, Membership } from '../types';
import indexedDBMembershipService from './indexedDBMembershipService';
import { emailService } from './emailService';

// Mock data for fallback mode
let mockEvents: Event[] = [
  {
    id: '1',
    title: 'National Youth Summit 2024',
    description: 'A comprehensive gathering of young leaders, innovators, and changemakers from across Kenya.',
    date: new Date('2024-02-15'),
    location: 'KICC, Nairobi',
    type: 'rally',
    registrationRequired: true,
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Economic Policy Webinar',
    description: 'Digital discussion on sustainable economic growth strategies.',
    date: new Date('2024-02-20'),
    location: 'Online',
    type: 'webinar',
    registrationRequired: true,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'UFA Membership Recruitment',
    description: 'UFA will be recruiting new members to the organization',
    date: new Date('2025-09-20T17:00:00'),
    location: 'SafariPark, Nairobi',
    type: 'meeting',
    registrationRequired: true,
    image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

let mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'UFA Launches Comprehensive Education Reform Initiative',
    excerpt: 'New policy proposals aim to transform Kenya\'s education system with focus on digital literacy and vocational training.',
    content: 'Full article content here...',
    author: 'UFA Communications Team',
    publishDate: new Date('2024-01-15'),
    image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Education'
  }
];

let mockLeaders: Leader[] = [
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
  }
];

// Events Service
export const eventsService = {
  // Get all events
  async getEvents(): Promise<Event[]> {
    if (!db) {
      console.log('Firestore not configured, using mock data');
      return mockEvents;
    }
    
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      })) as Event[];
    } catch (error) {
      console.error('Error fetching events from Firestore:', error);
      console.log('Falling back to mock data');
      return mockEvents;
    }
  },

  // Get upcoming events
  async getUpcomingEvents(count: number = 5): Promise<Event[]> {
    if (!db) {
      console.log('Firestore not configured, using mock data');
      return mockEvents.slice(0, count);
    }
    
    try {
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef, 
        where('date', '>=', new Date()),
        orderBy('date', 'asc'),
        limit(count)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      })) as Event[];
    } catch (error) {
      console.error('Error fetching upcoming events from Firestore:', error);
      console.log('Falling back to mock data');
      return mockEvents.slice(0, count);
    }
  },

  // Add new event
  async addEvent(event: Omit<Event, 'id'>): Promise<string> {
    if (!db) {
      console.log('Firestore not configured, simulating add event');
      const newId = Date.now().toString();
      mockEvents.unshift({
        id: newId,
        ...event
      });
      return newId;
    }
    
    try {
      const eventsRef = collection(db, 'events');
      const docRef = await addDoc(eventsRef, {
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      console.log('Simulating add event');
      const newId = Date.now().toString();
      mockEvents.unshift({
        id: newId,
        ...event
      });
      return newId;
    }
  },

  // Update event
  async updateEvent(id: string, event: Partial<Event>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const eventRef = doc(db, 'events', id);
    await updateDoc(eventRef, {
      ...event,
      updatedAt: serverTimestamp()
    });
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
  },

  // Subscribe to events changes
  subscribeToEvents(callback: (events: Event[]) => void): () => void {
    if (!db) {
      console.warn('Firestore not initialized, using mock data');
      return () => {};
    }

    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      })) as Event[];
      
      callback(events);
    });
  },

  // Subscribe to upcoming events
  subscribeToUpcomingEvents(callback: (events: Event[]) => void, count: number = 5): () => void {
    if (!db) {
      console.warn('Firestore not initialized, using mock data');
      return () => {};
    }

    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef, 
      where('date', '>=', new Date()),
      orderBy('date', 'asc'),
      limit(count)
    );
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      })) as Event[];
      
      callback(events);
    });
  }
};

// News Service
export const newsService = {
  // Get all news
  async getNews(): Promise<NewsItem[]> {
    if (!db) {
      console.log('Firestore not configured, using mock data');
      return mockNews;
    }
    
    try {
      const newsRef = collection(db, 'news');
      const q = query(newsRef, orderBy('publishDate', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate?.toDate() || new Date()
      })) as NewsItem[];
    } catch (error) {
      console.error('Error fetching news from Firestore:', error);
      console.log('Falling back to mock data');
      return mockNews;
    }
  },

  // Get latest news
  async getLatestNews(count: number = 5): Promise<NewsItem[]> {
    if (!db) {
      console.log('Firestore not configured, using mock data');
      return mockNews.slice(0, count);
    }
    
    try {
      const newsRef = collection(db, 'news');
      const q = query(newsRef, orderBy('publishDate', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate?.toDate() || new Date()
      })) as NewsItem[];
    } catch (error) {
      console.error('Error fetching latest news from Firestore:', error);
      console.log('Falling back to mock data');
      return mockNews.slice(0, count);
    }
  },

  // Add new news article
  async addNews(news: Omit<NewsItem, 'id'>): Promise<string> {
    if (!db) {
      console.log('Firestore not configured, simulating add news');
      const newId = Date.now().toString();
      mockNews.unshift({
        id: newId,
        ...news
      });
      return newId;
    }
    
    try {
      const newsRef = collection(db, 'news');
      const docRef = await addDoc(newsRef, {
        ...news,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding news to Firestore:', error);
      console.log('Simulating add news');
      const newId = Date.now().toString();
      mockNews.unshift({
        id: newId,
        ...news
      });
      return newId;
    }
  },

  // Update news article
  async updateNews(id: string, news: Partial<NewsItem>): Promise<void> {
    if (!db) {
      console.log('Firestore not configured, simulating update news');
      const index = mockNews.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNews[index] = { ...mockNews[index], ...news };
      }
      return;
    }
    
    try {
      const newsRef = doc(db, 'news', id);
      await updateDoc(newsRef, {
        ...news,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating news in Firestore:', error);
      throw error;
    }
  },

  // Delete news article
  async deleteNews(id: string): Promise<void> {
    if (!db) {
      console.log('Firestore not configured, simulating delete news');
      mockNews = mockNews.filter(n => n.id !== id);
      return;
    }
    
    try {
      const newsRef = doc(db, 'news', id);
      await deleteDoc(newsRef);
    } catch (error) {
      console.error('Error deleting news from Firestore:', error);
      throw error;
    }
  },

  // Subscribe to news changes
  subscribeToNews(callback: (news: NewsItem[]) => void): () => void {
    if (!db) {
      console.warn('Firestore not initialized, using mock data');
      return () => {};
    }

    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('publishDate', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate?.toDate() || new Date()
      })) as NewsItem[];
      
      callback(news);
    });
  },

  // Subscribe to latest news
  subscribeToLatestNews(callback: (news: NewsItem[]) => void, count: number = 5): () => void {
    if (!db) {
      console.warn('Firestore not initialized, using mock data');
      return () => {};
    }

    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('publishDate', 'desc'), limit(count));
    
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate?.toDate() || new Date()
      })) as NewsItem[];
      
      callback(news);
    });
  }
};

// Leaders Service
export const leadersService = {
  // Get all leaders
  async getLeaders(): Promise<Leader[]> {
    if (!db) {
      console.log('Firestore not configured, using mock data');
      return mockLeaders;
    }
    
    try {
      const leadersRef = collection(db, 'leaders');
      const q = query(leadersRef, orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Leader[];
    } catch (error) {
      console.error('Error fetching leaders from Firestore:', error);
      console.log('Falling back to mock data');
      return mockLeaders;
    }
  },

  // Add new leader
  async addLeader(leader: Omit<Leader, 'id'>): Promise<string> {
    if (!db) {
      console.log('Firestore not configured, simulating add leader');
      const newId = Date.now().toString();
      mockLeaders.push({
        id: newId,
        ...leader
      });
      return newId;
    }
    
    try {
      const leadersRef = collection(db, 'leaders');
      const docRef = await addDoc(leadersRef, {
        ...leader,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding leader to Firestore:', error);
      console.log('Simulating add leader');
      const newId = Date.now().toString();
      mockLeaders.push({
        id: newId,
        ...leader
      });
      return newId;
    }
  },

  // Update leader
  async updateLeader(id: string, leader: Partial<Leader>): Promise<void> {
    if (!db) {
      console.log('Firestore not configured, simulating update leader');
      const index = mockLeaders.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeaders[index] = { ...mockLeaders[index], ...leader };
      }
      return;
    }
    
    try {
      const leaderRef = doc(db, 'leaders', id);
      await updateDoc(leaderRef, {
        ...leader,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating leader in Firestore:', error);
      throw error;
    }
  },

  // Delete leader
  async deleteLeader(id: string): Promise<void> {
    if (!db) {
      console.log('Firestore not configured, simulating delete leader');
      mockLeaders = mockLeaders.filter(l => l.id !== id);
      return;
    }
    
    try {
      const leaderRef = doc(db, 'leaders', id);
      await deleteDoc(leaderRef);
    } catch (error) {
      console.error('Error deleting leader from Firestore:', error);
      throw error;
    }
  },

  // Subscribe to leaders changes
  subscribeToLeaders(callback: (leaders: Leader[]) => void): () => void {
    if (!db) {
      console.warn('Firestore not initialized, using mock data');
      return () => {};
    }

    const leadersRef = collection(db, 'leaders');
    const q = query(leadersRef, orderBy('name', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const leaders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Leader[];
      
      callback(leaders);
    });
  }
};


// Registration ID Generator
const generateRegistrationId = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `UFA`;
  const year = currentYear.toString();
  
  try {
    if (!firebaseInitialized || !db) {
      // For IndexedDB fallback, use timestamp-based ID
      const timestamp = Date.now().toString().slice(-6);
      return `${prefix}/${timestamp}/${year}`;
    }
    
    // Get the count of existing memberships for this year
    const membershipsRef = collection(db, 'memberships');
    const q = query(membershipsRef, where('registrationId', '>=', `${prefix}/001/${year}`));
    const snapshot = await getDocs(q);
    
    // Count existing memberships for this year
    const existingCount = snapshot.docs.length;
    const nextNumber = (existingCount + 1).toString().padStart(3, '0');
    
    return `${prefix}/${nextNumber}/${year}`;
  } catch (error) {
    console.error('Error generating registration ID:', error);
    // Fallback to timestamp-based ID
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}/${timestamp}/${year}`;
  }
};

// Membership Service
export const membershipsService = {
  // Get all memberships
  async getMemberships(): Promise<Membership[]> {
    console.log('🔍 membershipsService.getMemberships called');
    console.log('🔍 db value:', db);
    console.log('🔍 isFirebaseConfigured():', isFirebaseConfigured());
    console.log('🔍 firebaseInitialized:', firebaseInitialized);
    
    if (!firebaseInitialized || !db) {
      console.log('✅ Firebase not properly initialized, using IndexedDB for memberships');
      const result = await indexedDBMembershipService.getMemberships();
      console.log('✅ IndexedDB memberships result:', result);
      return result;
    }
    
    try {
      const membershipsRef = collection(db, 'memberships');
      const q = query(membershipsRef, orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateOfBirth: doc.data().dateOfBirth?.toDate() || new Date(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
        reviewedAt: doc.data().reviewedAt?.toDate() || undefined
      })) as Membership[];
    } catch (error) {
      console.error('Error fetching memberships from Firestore:', error);
      console.log('Falling back to IndexedDB');
      return await indexedDBMembershipService.getMemberships();
    }
  },

  // Add new membership
  async addMembership(membership: Omit<Membership, 'id' | 'registrationId'>): Promise<{id: string, registrationId: string}> {
    console.log('🔍 membershipsService.addMembership called with:', membership);
    console.log('🔍 db value:', db);
    console.log('🔍 isFirebaseConfigured():', isFirebaseConfigured());
    console.log('🔍 firebaseInitialized:', firebaseInitialized);
    
    // Generate registration ID
    const registrationId = await generateRegistrationId();
    console.log('🆔 Generated registration ID:', registrationId);
    
    const membershipWithId = {
      ...membership,
      registrationId
    };
    
    if (!firebaseInitialized || !db) {
      console.log('✅ Firebase not properly initialized, using IndexedDB for membership');
      const result = await indexedDBMembershipService.addMembership(membershipWithId);
      console.log('✅ IndexedDB addMembership result:', result);
      return { id: result, registrationId };
    }
    
    try {
      const membershipsRef = collection(db, 'memberships');
      const docRef = await addDoc(membershipsRef, {
        ...membershipWithId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Membership added to Firestore with registration ID:', registrationId);
      
      // Send confirmation email
      try {
        await emailService.sendMembershipConfirmation({
          to: membership.email,
          firstName: membership.firstName,
          lastName: membership.lastName,
          registrationId: registrationId,
          applicationDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
        console.log('✅ Membership confirmation email sent');
      } catch (emailError) {
        console.error('❌ Failed to send membership confirmation email:', emailError);
        // Don't fail the membership if email fails
      }
      
      return { id: docRef.id, registrationId };
    } catch (error) {
      console.error('Error adding membership to Firestore:', error);
      console.log('Falling back to IndexedDB');
      return await indexedDBMembershipService.addMembership(membershipWithId);
    }
  },

  // Update membership
  async updateMembership(id: string, membership: Partial<Membership>): Promise<void> {
    if (!firebaseInitialized || !db) {
      console.log('Firebase not properly initialized, using IndexedDB for membership update');
      return await indexedDBMembershipService.updateMembership(id, membership);
    }
    
    try {
      const membershipRef = doc(db, 'memberships', id);
      await updateDoc(membershipRef, {
        ...membership,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating membership in Firestore:', error);
      console.log('Falling back to IndexedDB');
      return await indexedDBMembershipService.updateMembership(id, membership);
    }
  },

  // Delete membership
  async deleteMembership(id: string): Promise<void> {
    if (!firebaseInitialized || !db) {
      console.log('Firebase not properly initialized, using IndexedDB for membership deletion');
      return await indexedDBMembershipService.deleteMembership(id);
    }
    
    try {
      const membershipRef = doc(db, 'memberships', id);
      await deleteDoc(membershipRef);
    } catch (error) {
      console.error('Error deleting membership from Firestore:', error);
      console.log('Falling back to IndexedDB');
      return await indexedDBMembershipService.deleteMembership(id);
    }
  },

  // Subscribe to memberships for real-time updates
  subscribeToMemberships(callback: (memberships: Membership[]) => void): () => void {
    console.log('🔍 membershipsService.subscribeToMemberships called');
    console.log('🔍 db value:', db);
    console.log('🔍 isFirebaseConfigured():', isFirebaseConfigured());
    console.log('🔍 firebaseInitialized:', firebaseInitialized);
    
    if (!firebaseInitialized || !db) {
      console.log('✅ Firebase not properly initialized, using IndexedDB subscription');
      const unsubscribe = indexedDBMembershipService.subscribeToMemberships(callback);
      console.log('✅ IndexedDB subscription set up, unsubscribe function:', unsubscribe);
      return unsubscribe;
    }
    
    const membershipsRef = collection(db, 'memberships');
    const q = query(membershipsRef, orderBy('submittedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberships = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateOfBirth: doc.data().dateOfBirth?.toDate() || new Date(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
        reviewedAt: doc.data().reviewedAt?.toDate() || undefined
      })) as Membership[];
      
      callback(memberships);
    });
    
    return unsubscribe;
  }
};
