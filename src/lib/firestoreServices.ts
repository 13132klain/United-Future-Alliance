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
import { db } from './firebase';
import { Event, NewsItem, Leader } from '../types';

// Events Service
export const eventsService = {
  // Get all events
  async getEvents(): Promise<Event[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    })) as Event[];
  },

  // Get upcoming events
  async getUpcomingEvents(count: number = 5): Promise<Event[]> {
    if (!db) throw new Error('Firestore not initialized');
    
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
  },

  // Add new event
  async addEvent(event: Omit<Event, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...event,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
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
    if (!db) throw new Error('Firestore not initialized');
    
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('publishDate', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishDate: doc.data().publishDate?.toDate() || new Date()
    })) as NewsItem[];
  },

  // Get latest news
  async getLatestNews(count: number = 5): Promise<NewsItem[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('publishDate', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishDate: doc.data().publishDate?.toDate() || new Date()
    })) as NewsItem[];
  },

  // Add new news article
  async addNews(news: Omit<NewsItem, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const newsRef = collection(db, 'news');
    const docRef = await addDoc(newsRef, {
      ...news,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // Update news article
  async updateNews(id: string, news: Partial<NewsItem>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const newsRef = doc(db, 'news', id);
    await updateDoc(newsRef, {
      ...news,
      updatedAt: serverTimestamp()
    });
  },

  // Delete news article
  async deleteNews(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const newsRef = doc(db, 'news', id);
    await deleteDoc(newsRef);
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
    if (!db) throw new Error('Firestore not initialized');
    
    const leadersRef = collection(db, 'leaders');
    const q = query(leadersRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Leader[];
  },

  // Add new leader
  async addLeader(leader: Omit<Leader, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const leadersRef = collection(db, 'leaders');
    const docRef = await addDoc(leadersRef, {
      ...leader,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  // Update leader
  async updateLeader(id: string, leader: Partial<Leader>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const leaderRef = doc(db, 'leaders', id);
    await updateDoc(leaderRef, {
      ...leader,
      updatedAt: serverTimestamp()
    });
  },

  // Delete leader
  async deleteLeader(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    
    const leaderRef = doc(db, 'leaders', id);
    await deleteDoc(leaderRef);
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
