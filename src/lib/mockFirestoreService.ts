import { Event, NewsItem, Leader, Resource } from '../types';

// Subscriber arrays for real-time updates
let eventSubscribers: ((events: Event[]) => void)[] = [];
let newsSubscribers: ((news: NewsItem[]) => void)[] = [];
let leaderSubscribers: ((leaders: Leader[]) => void)[] = [];
let resourceSubscribers: ((resources: Resource[]) => void)[] = [];

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

let mockResources: Resource[] = [
  {
    id: '1',
    title: 'UFA Policy Framework 2024',
    description: 'Comprehensive policy framework outlining UFA\'s vision for Kenya\'s future development.',
    type: 'document',
    url: '/resources/ufa-policy-framework-2024.pdf',
    fileName: 'ufa-policy-framework-2024.pdf',
    fileSize: 2048576, // 2MB
    mimeType: 'application/pdf',
    category: 'Policy',
    publishDate: new Date('2024-01-15'),
    uploadedBy: 'Dr. Sarah Mwangi',
    downloadCount: 1247
  },
  {
    id: '2',
    title: 'Education Reform Presentation',
    description: 'Detailed presentation on proposed education reforms and digital literacy initiatives.',
    type: 'presentation',
    url: '/resources/education-reform-presentation.pptx',
    fileName: 'education-reform-presentation.pptx',
    fileSize: 5242880, // 5MB
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'Education',
    publishDate: new Date('2024-01-20'),
    uploadedBy: 'UFA Education Team',
    downloadCount: 892
  },
  {
    id: '3',
    title: 'Economic Development Report',
    description: 'Quarterly report on economic development initiatives and progress tracking.',
    type: 'report',
    url: '/resources/economic-development-q1-2024.pdf',
    fileName: 'economic-development-q1-2024.pdf',
    fileSize: 3145728, // 3MB
    mimeType: 'application/pdf',
    category: 'Economy',
    publishDate: new Date('2024-02-01'),
    uploadedBy: 'UFA Economic Team',
    downloadCount: 654
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
    console.log('Mock events after adding:', mockEvents);
    console.log('Notifying', eventSubscribers.length, 'subscribers');
    
    // Notify all subscribers
    eventSubscribers.forEach(callback => callback([...mockEvents]));
    
    return newId;
  },

  async updateEvent(id: string, event: Partial<Event>): Promise<void> {
    console.log('Updating mock event:', id, event);
    const index = mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...event };
      
      // Notify all subscribers
      eventSubscribers.forEach(callback => callback([...mockEvents]));
    }
  },

  async deleteEvent(id: string): Promise<void> {
    console.log('Deleting mock event:', id);
    mockEvents = mockEvents.filter(e => e.id !== id);
    
    // Notify all subscribers
    eventSubscribers.forEach(callback => callback([...mockEvents]));
  },

  subscribeToEvents(callback: (events: Event[]) => void): () => void {
    console.log('Setting up mock events subscription, current events:', mockEvents);
    // Simulate real-time updates by calling callback immediately
    callback([...mockEvents]);
    
    // Store callback for future updates
    eventSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock events');
      const index = eventSubscribers.indexOf(callback);
      if (index > -1) {
        eventSubscribers.splice(index, 1);
      }
    };
  },

  subscribeToUpcomingEvents(callback: (events: Event[]) => void, count: number = 5): () => void {
    console.log('Setting up mock upcoming events subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockEvents].slice(0, count));
    
    // Create a wrapper callback that slices the events
    const wrappedCallback = (events: Event[]) => {
      callback(events.slice(0, count));
    };
    
    // Store wrapped callback for future updates
    eventSubscribers.push(wrappedCallback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock upcoming events');
      const index = eventSubscribers.indexOf(wrappedCallback);
      if (index > -1) {
        eventSubscribers.splice(index, 1);
      }
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
    
    // Notify all subscribers
    newsSubscribers.forEach(callback => callback([...mockNews]));
    
    return newId;
  },

  async updateNews(id: string, news: Partial<NewsItem>): Promise<void> {
    console.log('Updating mock news:', id, news);
    const index = mockNews.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNews[index] = { ...mockNews[index], ...news };
      
      // Notify all subscribers
      newsSubscribers.forEach(callback => callback([...mockNews]));
    }
  },

  async deleteNews(id: string): Promise<void> {
    console.log('Deleting mock news:', id);
    mockNews = mockNews.filter(n => n.id !== id);
    
    // Notify all subscribers
    newsSubscribers.forEach(callback => callback([...mockNews]));
  },

  subscribeToNews(callback: (news: NewsItem[]) => void): () => void {
    console.log('Setting up mock news subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockNews]);
    
    // Store callback for future updates
    newsSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock news');
      const index = newsSubscribers.indexOf(callback);
      if (index > -1) {
        newsSubscribers.splice(index, 1);
      }
    };
  },

  subscribeToLatestNews(callback: (news: NewsItem[]) => void, count: number = 5): () => void {
    console.log('Setting up mock latest news subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockNews].slice(0, count));
    
    // Create a wrapper callback that slices the news
    const wrappedCallback = (news: NewsItem[]) => {
      callback(news.slice(0, count));
    };
    
    // Store wrapped callback for future updates
    newsSubscribers.push(wrappedCallback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock latest news');
      const index = newsSubscribers.indexOf(wrappedCallback);
      if (index > -1) {
        newsSubscribers.splice(index, 1);
      }
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
    
    // Notify all subscribers
    leaderSubscribers.forEach(callback => callback([...mockLeaders]));
    
    return newId;
  },

  async updateLeader(id: string, leader: Partial<Leader>): Promise<void> {
    console.log('Updating mock leader:', id, leader);
    const index = mockLeaders.findIndex(l => l.id === id);
    if (index !== -1) {
      mockLeaders[index] = { ...mockLeaders[index], ...leader };
      
      // Notify all subscribers
      leaderSubscribers.forEach(callback => callback([...mockLeaders]));
    }
  },

  async deleteLeader(id: string): Promise<void> {
    console.log('Deleting mock leader:', id);
    mockLeaders = mockLeaders.filter(l => l.id !== id);
    
    // Notify all subscribers
    leaderSubscribers.forEach(callback => callback([...mockLeaders]));
  },

  subscribeToLeaders(callback: (leaders: Leader[]) => void): () => void {
    console.log('Setting up mock leaders subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockLeaders]);
    
    // Store callback for future updates
    leaderSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock leaders');
      const index = leaderSubscribers.indexOf(callback);
      if (index > -1) {
        leaderSubscribers.splice(index, 1);
      }
    };
  }
};

// Resources Service
export const resourcesService = {
  async getResources(): Promise<Resource[]> {
    console.log('Using mock resources data');
    return [...mockResources];
  },

  async addResource(resource: Omit<Resource, 'id'>): Promise<string> {
    console.log('Adding mock resource:', resource);
    const newId = Date.now().toString();
    const newResource: Resource = {
      id: newId,
      ...resource
    };
    mockResources.unshift(newResource);
    
    // Notify all subscribers
    resourceSubscribers.forEach(callback => callback([...mockResources]));
    
    return newId;
  },

  async updateResource(id: string, resource: Partial<Resource>): Promise<void> {
    console.log('Updating mock resource:', id, resource);
    const index = mockResources.findIndex(r => r.id === id);
    if (index !== -1) {
      mockResources[index] = { ...mockResources[index], ...resource };
      
      // Notify all subscribers
      resourceSubscribers.forEach(callback => callback([...mockResources]));
    }
  },

  async deleteResource(id: string): Promise<void> {
    console.log('Deleting mock resource:', id);
    mockResources = mockResources.filter(r => r.id !== id);
    
    // Notify all subscribers
    resourceSubscribers.forEach(callback => callback([...mockResources]));
  },

  async incrementDownloadCount(id: string): Promise<void> {
    console.log('Incrementing download count for resource:', id);
    const index = mockResources.findIndex(r => r.id === id);
    if (index !== -1) {
      mockResources[index].downloadCount = (mockResources[index].downloadCount || 0) + 1;
      
      // Notify all subscribers
      resourceSubscribers.forEach(callback => callback([...mockResources]));
    }
  },

  subscribeToResources(callback: (resources: Resource[]) => void): () => void {
    console.log('Setting up mock resources subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockResources]);
    
    // Store callback for future updates
    resourceSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock resources');
      const index = resourceSubscribers.indexOf(callback);
      if (index > -1) {
        resourceSubscribers.splice(index, 1);
      }
    };
  }
};
