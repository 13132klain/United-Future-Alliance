import { Event, NewsItem, Resource, Leader } from '../types';

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'UFA Annual General Meeting 2024',
    description: 'Join us for our annual general meeting to discuss our progress and future plans.',
    date: new Date('2024-12-15'),
    location: 'Nairobi, Kenya',
    type: 'meeting',
    registrationRequired: true
  },
  {
    id: '2',
    title: 'Community Outreach Program',
    description: 'Volunteer with us to make a difference in local communities.',
    date: new Date('2024-12-20'),
    location: 'Various Locations',
    type: 'volunteer',
    registrationRequired: false
  },
  {
    id: '3',
    title: 'Youth Leadership Summit',
    description: 'Empowering the next generation of Kenyan leaders.',
    date: new Date('2024-12-25'),
    location: 'KICC, Nairobi',
    type: 'rally',
    registrationRequired: true
  }
];

// Mock data for news
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'UFA Launches New Community Initiative',
    excerpt: 'We are excited to announce our new community outreach program aimed at supporting local families.',
    content: 'Full article content here...',
    author: 'UFA Team',
    publishDate: new Date('2024-12-01'),
    image: '/api/placeholder/400/250',
    category: 'announcement'
  },
  {
    id: '2',
    title: 'Annual Report 2024 Released',
    excerpt: 'Our comprehensive annual report showcases the impact we have made in communities across Kenya.',
    content: 'Full article content here...',
    author: 'UFA Board',
    publishDate: new Date('2024-11-28'),
    image: '/api/placeholder/400/250',
    category: 'report'
  },
  {
    id: '3',
    title: 'Partnership with Local NGOs',
    excerpt: 'UFA announces new partnerships to expand our community impact.',
    content: 'Full article content here...',
    author: 'UFA Team',
    publishDate: new Date('2024-11-25'),
    image: '/api/placeholder/400/250',
    category: 'partnership'
  }
];

// Mock data for leaders
const mockLeaders: Leader[] = [
  {
    id: '1',
    name: 'John Mwangi',
    position: 'Chairman',
    email: 'john.mwangi@ufa.org',
    phone: '+254 700 000 001',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johnmwangi',
      twitter: 'https://twitter.com/johnmwangi'
    }
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    position: 'Secretary',
    email: 'mary.wanjiku@ufa.org',
    phone: '+254 700 000 002',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marywanjiku',
      facebook: 'https://facebook.com/marywanjiku'
    }
  }
];

// Mock data for resources
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'UFA Constitution',
    description: 'Our official constitution and governing documents.',
    type: 'document',
    url: '#',
    category: 'governance',
    publishDate: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Community Guidelines',
    description: 'Guidelines for community engagement and participation.',
    type: 'document',
    url: '#',
    category: 'community',
    publishDate: new Date('2024-02-01')
  }
];

// Events Service
export const eventsService = {
  async getUpcomingEvents(limitCount: number = 6): Promise<Event[]> {
    console.log('Using mock events data');
    return mockEvents.slice(0, limitCount);
  },

  async getAllEvents(): Promise<Event[]> {
    console.log('Using mock events data');
    return mockEvents;
  },

  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    console.log('Mock: Creating event', event);
    const newEvent: Event = {
      id: Date.now().toString(),
      ...event
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<boolean> {
    console.log('Mock: Updating event', id, updates);
    const index = mockEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...updates };
      return true;
    }
    return false;
  },

  async deleteEvent(id: string): Promise<boolean> {
    console.log('Mock: Deleting event', id);
    const index = mockEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
      return true;
    }
    return false;
  },

  subscribeToUpcomingEvents(callback: (events: Event[]) => void, limitCount: number = 6) {
    console.log('Mock: Setting up events subscription');
    // Simulate real-time updates by calling callback immediately
    callback(mockEvents.slice(0, limitCount));
    
    // Return a mock unsubscribe function
    return () => {
      console.log('Mock: Unsubscribing from events');
    };
  },

  subscribeToAllEvents(callback: (events: Event[]) => void) {
    console.log('Mock: Setting up all events subscription');
    callback(mockEvents);
    
    return () => {
      console.log('Mock: Unsubscribing from all events');
    };
  }
};

// News Service
export const newsService = {
  async getLatestNews(limitCount: number = 3): Promise<NewsItem[]> {
    console.log('Using mock news data');
    return mockNews.slice(0, limitCount);
  },

  async getAllNews(): Promise<NewsItem[]> {
    console.log('Using mock news data');
    return mockNews;
  },

  async createNewsArticle(news: Omit<NewsItem, 'id'>): Promise<NewsItem> {
    console.log('Mock: Creating news article', news);
    const newNews: NewsItem = {
      id: Date.now().toString(),
      ...news
    };
    mockNews.push(newNews);
    return newNews;
  },

  async updateNews(id: string, updates: Partial<NewsItem>): Promise<boolean> {
    console.log('Mock: Updating news', id, updates);
    const index = mockNews.findIndex(news => news.id === id);
    if (index !== -1) {
      mockNews[index] = { ...mockNews[index], ...updates };
      return true;
    }
    return false;
  },

  async deleteNews(id: string): Promise<boolean> {
    console.log('Mock: Deleting news', id);
    const index = mockNews.findIndex(news => news.id === id);
    if (index !== -1) {
      mockNews.splice(index, 1);
      return true;
    }
    return false;
  },

  subscribeToLatestNews(callback: (news: NewsItem[]) => void, limitCount: number = 3) {
    console.log('Mock: Setting up news subscription');
    callback(mockNews.slice(0, limitCount));
    
    return () => {
      console.log('Mock: Unsubscribing from news');
    };
  }
};

// Leaders Service
export const leadersService = {
  async getAllLeaders(): Promise<Leader[]> {
    console.log('Using mock leaders data');
    return mockLeaders;
  },

  async createLeader(leader: Omit<Leader, 'id'>): Promise<Leader> {
    console.log('Mock: Creating leader', leader);
    const newLeader: Leader = {
      id: Date.now().toString(),
      ...leader
    };
    mockLeaders.push(newLeader);
    return newLeader;
  },

  async updateLeader(id: string, updates: Partial<Leader>): Promise<boolean> {
    console.log('Mock: Updating leader', id, updates);
    const index = mockLeaders.findIndex(leader => leader.id === id);
    if (index !== -1) {
      mockLeaders[index] = { ...mockLeaders[index], ...updates };
      return true;
    }
    return false;
  },

  async deleteLeader(id: string): Promise<boolean> {
    console.log('Mock: Deleting leader', id);
    const index = mockLeaders.findIndex(leader => leader.id === id);
    if (index !== -1) {
      mockLeaders.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Resources Service
export const resourcesService = {
  async getFeaturedResources(): Promise<Resource[]> {
    console.log('Using mock resources data');
    return mockResources;
  },

  async getAllResources(): Promise<Resource[]> {
    console.log('Using mock resources data');
    return mockResources;
  },

  async createResource(resource: Omit<Resource, 'id'>): Promise<Resource> {
    console.log('Mock: Creating resource', resource);
    const newResource: Resource = {
      id: Date.now().toString(),
      ...resource
    };
    mockResources.push(newResource);
    return newResource;
  },

  async updateResource(id: string, updates: Partial<Resource>): Promise<boolean> {
    console.log('Mock: Updating resource', id, updates);
    const index = mockResources.findIndex(resource => resource.id === id);
    if (index !== -1) {
      mockResources[index] = { ...mockResources[index], ...updates };
      return true;
    }
    return false;
  },

  async deleteResource(id: string): Promise<boolean> {
    console.log('Mock: Deleting resource', id);
    const index = mockResources.findIndex(resource => resource.id === id);
    if (index !== -1) {
      mockResources.splice(index, 1);
      return true;
    }
    return false;
  }
};
