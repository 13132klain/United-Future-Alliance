import { Event, NewsItem, Leader } from '../types';

// Mock data
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
  async getEvents(): Promise<Event[]> {
    console.log('Using mock events data');
    return [...mockEvents];
  },

  async getUpcomingEvents(count: number = 5): Promise<Event[]> {
    console.log('Using mock upcoming events data');
    return [...mockEvents].slice(0, count);
  },

  async addEvent(event: Omit<Event, 'id'>): Promise<string> {
    console.log('Adding mock event:', event);
    const newId = Date.now().toString();
    const newEvent: Event = {
      id: newId,
      ...event
    };
    mockEvents.unshift(newEvent);
    return newId;
  },

  async updateEvent(id: string, event: Partial<Event>): Promise<void> {
    console.log('Updating mock event:', id, event);
    const index = mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...event };
    }
  },

  async deleteEvent(id: string): Promise<void> {
    console.log('Deleting mock event:', id);
    mockEvents = mockEvents.filter(e => e.id !== id);
  },

  subscribeToEvents(callback: (events: Event[]) => void): () => void {
    console.log('Setting up mock events subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockEvents]);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock events');
    };
  },

  subscribeToUpcomingEvents(callback: (events: Event[]) => void, count: number = 5): () => void {
    console.log('Setting up mock upcoming events subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockEvents].slice(0, count));
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock upcoming events');
    };
  }
};

// News Service
export const newsService = {
  async getNews(): Promise<NewsItem[]> {
    console.log('Using mock news data');
    return [...mockNews];
  },

  async getLatestNews(count: number = 5): Promise<NewsItem[]> {
    console.log('Using mock latest news data');
    return [...mockNews].slice(0, count);
  },

  async addNews(news: Omit<NewsItem, 'id'>): Promise<string> {
    console.log('Adding mock news:', news);
    const newId = Date.now().toString();
    const newNews: NewsItem = {
      id: newId,
      ...news
    };
    mockNews.unshift(newNews);
    return newId;
  },

  async updateNews(id: string, news: Partial<NewsItem>): Promise<void> {
    console.log('Updating mock news:', id, news);
    const index = mockNews.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNews[index] = { ...mockNews[index], ...news };
    }
  },

  async deleteNews(id: string): Promise<void> {
    console.log('Deleting mock news:', id);
    mockNews = mockNews.filter(n => n.id !== id);
  },

  subscribeToNews(callback: (news: NewsItem[]) => void): () => void {
    console.log('Setting up mock news subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockNews]);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock news');
    };
  },

  subscribeToLatestNews(callback: (news: NewsItem[]) => void, count: number = 5): () => void {
    console.log('Setting up mock latest news subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockNews].slice(0, count));
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock latest news');
    };
  }
};

// Leaders Service
export const leadersService = {
  async getLeaders(): Promise<Leader[]> {
    console.log('Using mock leaders data');
    return [...mockLeaders];
  },

  async addLeader(leader: Omit<Leader, 'id'>): Promise<string> {
    console.log('Adding mock leader:', leader);
    const newId = Date.now().toString();
    const newLeader: Leader = {
      id: newId,
      ...leader
    };
    mockLeaders.push(newLeader);
    return newId;
  },

  async updateLeader(id: string, leader: Partial<Leader>): Promise<void> {
    console.log('Updating mock leader:', id, leader);
    const index = mockLeaders.findIndex(l => l.id === id);
    if (index !== -1) {
      mockLeaders[index] = { ...mockLeaders[index], ...leader };
    }
  },

  async deleteLeader(id: string): Promise<void> {
    console.log('Deleting mock leader:', id);
    mockLeaders = mockLeaders.filter(l => l.id !== id);
  },

  subscribeToLeaders(callback: (leaders: Leader[]) => void): () => void {
    console.log('Setting up mock leaders subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockLeaders]);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock leaders');
    };
  }
};
