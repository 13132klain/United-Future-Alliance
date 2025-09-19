import { Event, NewsItem, Leader, Resource, Donation, DonationCampaign, Membership } from '../types';

// Subscriber arrays for real-time updates
let eventSubscribers: ((events: Event[]) => void)[] = [];
let newsSubscribers: ((news: NewsItem[]) => void)[] = [];
let leaderSubscribers: ((leaders: Leader[]) => void)[] = [];
let resourceSubscribers: ((resources: Resource[]) => void)[] = [];
let donationSubscribers: ((donations: Donation[]) => void)[] = [];
let campaignSubscribers: ((campaigns: DonationCampaign[]) => void)[] = [];
let membershipSubscribers: ((memberships: Membership[]) => void)[] = [];

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

let mockDonations: Donation[] = [
  {
    id: '1',
    amount: 5000,
    currency: 'KES',
    donorName: 'John Mwangi',
    donorEmail: 'john.mwangi@email.com',
    donorPhone: '+254712345678',
    isAnonymous: false,
    campaign: 'Education for All',
    message: 'Supporting education initiatives in rural areas',
    paymentMethod: 'mobile_money',
    status: 'completed',
    transactionId: 'TXN_001_2024',
    createdAt: new Date('2024-01-15'),
    processedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    amount: 10000,
    currency: 'KES',
    donorName: 'Anonymous',
    donorEmail: 'anonymous@email.com',
    isAnonymous: true,
    campaign: 'Healthcare Access',
    message: 'Keep up the great work!',
    paymentMethod: 'card',
    status: 'completed',
    transactionId: 'TXN_002_2024',
    createdAt: new Date('2024-01-20'),
    processedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    amount: 2500,
    currency: 'KES',
    donorName: 'Mary Wanjiku',
    donorEmail: 'mary.wanjiku@email.com',
    donorPhone: '+254723456789',
    isAnonymous: false,
    campaign: 'Infrastructure Development',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    createdAt: new Date('2024-02-01')
  }
];

let mockCampaigns: DonationCampaign[] = [
  {
    id: '1',
    title: 'Education for All',
    description: 'Supporting digital literacy and educational infrastructure in rural Kenya. Help us provide tablets, internet connectivity, and training for students and teachers.',
    targetAmount: 5000000,
    currentAmount: 1250000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'education',
    featured: true
  },
  {
    id: '2',
    title: 'Healthcare Access',
    description: 'Improving healthcare access in underserved communities. Funding mobile clinics, medical equipment, and community health worker training.',
    targetAmount: 3000000,
    currentAmount: 850000,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-11-30'),
    isActive: true,
    image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'healthcare',
    featured: true
  },
  {
    id: '3',
    title: 'Infrastructure Development',
    description: 'Building sustainable infrastructure including roads, water systems, and renewable energy projects in rural communities.',
    targetAmount: 10000000,
    currentAmount: 2100000,
    startDate: new Date('2024-02-01'),
    isActive: true,
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'infrastructure',
    featured: false
  },
  {
    id: '4',
    title: 'Emergency Relief Fund',
    description: 'Supporting communities affected by natural disasters and emergencies with immediate relief and long-term recovery assistance.',
    targetAmount: 2000000,
    currentAmount: 450000,
    startDate: new Date('2024-01-01'),
    isActive: true,
    image: 'https://images.pexels.com/photos/6646877/pexels-photo-6646877.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'emergency',
    featured: false
  }
];

let mockMemberships: Membership[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Mwangi',
    email: 'john.mwangi@email.com',
    phone: '+254712345678',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male',
    county: 'Nairobi',
    constituency: 'Westlands',
    ward: 'Parklands',
    occupation: 'Software Engineer',
    organization: 'Tech Solutions Ltd',
    interests: ['Technology', 'Education', 'Youth Development'],
    motivation: 'I want to contribute to Kenya\'s digital transformation and help bridge the technology gap in rural areas.',
    howDidYouHear: 'Social Media',
    isVolunteer: true,
    volunteerAreas: ['Technology Training', 'Event Organization'],
    status: 'approved',
    submittedAt: new Date('2024-01-10'),
    reviewedAt: new Date('2024-01-12'),
    reviewedBy: 'Dr. Sarah Mwangi'
  },
  {
    id: '2',
    firstName: 'Mary',
    lastName: 'Wanjiku',
    email: 'mary.wanjiku@email.com',
    phone: '+254723456789',
    dateOfBirth: new Date('1985-08-22'),
    gender: 'female',
    county: 'Kiambu',
    constituency: 'Thika Town',
    occupation: 'Teacher',
    organization: 'Thika Primary School',
    interests: ['Education', 'Women Empowerment', 'Community Development'],
    motivation: 'As an educator, I believe in the power of quality education to transform communities and want to be part of UFA\'s education initiatives.',
    howDidYouHear: 'Friend Recommendation',
    isVolunteer: true,
    volunteerAreas: ['Education Programs', 'Community Outreach'],
    status: 'pending',
    submittedAt: new Date('2024-02-01')
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

// Donations Service
export const donationsService = {
  async getDonations(): Promise<Donation[]> {
    console.log('Using mock donations data');
    return [...mockDonations];
  },

  async addDonation(donation: Omit<Donation, 'id'>): Promise<string> {
    console.log('Adding mock donation:', donation);
    const newId = Date.now().toString();
    const newDonation: Donation = {
      id: newId,
      ...donation
    };
    mockDonations.unshift(newDonation);
    
    // Notify all subscribers
    donationSubscribers.forEach(callback => callback([...mockDonations]));
    
    return newId;
  },

  async updateDonation(id: string, donation: Partial<Donation>): Promise<void> {
    console.log('Updating mock donation:', id, donation);
    const index = mockDonations.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDonations[index] = { ...mockDonations[index], ...donation };
      
      // Notify all subscribers
      donationSubscribers.forEach(callback => callback([...mockDonations]));
    }
  },

  async deleteDonation(id: string): Promise<void> {
    console.log('Deleting mock donation:', id);
    mockDonations = mockDonations.filter(d => d.id !== id);
    
    // Notify all subscribers
    donationSubscribers.forEach(callback => callback([...mockDonations]));
  },

  subscribeToDonations(callback: (donations: Donation[]) => void): () => void {
    console.log('Setting up mock donations subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockDonations]);
    
    // Store callback for future updates
    donationSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock donations');
      const index = donationSubscribers.indexOf(callback);
      if (index > -1) {
        donationSubscribers.splice(index, 1);
      }
    };
  }
};

// Donation Campaigns Service
export const campaignsService = {
  async getCampaigns(): Promise<DonationCampaign[]> {
    console.log('Using mock campaigns data');
    return [...mockCampaigns];
  },

  async getActiveCampaigns(): Promise<DonationCampaign[]> {
    console.log('Using mock active campaigns data');
    return [...mockCampaigns].filter(c => c.isActive);
  },

  async getFeaturedCampaigns(): Promise<DonationCampaign[]> {
    console.log('Using mock featured campaigns data');
    return [...mockCampaigns].filter(c => c.featured && c.isActive);
  },

  async addCampaign(campaign: Omit<DonationCampaign, 'id'>): Promise<string> {
    console.log('Adding mock campaign:', campaign);
    const newId = Date.now().toString();
    const newCampaign: DonationCampaign = {
      id: newId,
      ...campaign
    };
    mockCampaigns.unshift(newCampaign);
    
    // Notify all subscribers
    campaignSubscribers.forEach(callback => callback([...mockCampaigns]));
    
    return newId;
  },

  async updateCampaign(id: string, campaign: Partial<DonationCampaign>): Promise<void> {
    console.log('Updating mock campaign:', id, campaign);
    const index = mockCampaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCampaigns[index] = { ...mockCampaigns[index], ...campaign };
      
      // Notify all subscribers
      campaignSubscribers.forEach(callback => callback([...mockCampaigns]));
    }
  },

  async deleteCampaign(id: string): Promise<void> {
    console.log('Deleting mock campaign:', id);
    mockCampaigns = mockCampaigns.filter(c => c.id !== id);
    
    // Notify all subscribers
    campaignSubscribers.forEach(callback => callback([...mockCampaigns]));
  },

  async updateCampaignAmount(id: string, amount: number): Promise<void> {
    console.log('Updating campaign amount:', id, amount);
    const index = mockCampaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCampaigns[index].currentAmount += amount;
      
      // Notify all subscribers
      campaignSubscribers.forEach(callback => callback([...mockCampaigns]));
    }
  },

  subscribeToCampaigns(callback: (campaigns: DonationCampaign[]) => void): () => void {
    console.log('Setting up mock campaigns subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockCampaigns]);
    
    // Store callback for future updates
    campaignSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock campaigns');
      const index = campaignSubscribers.indexOf(callback);
      if (index > -1) {
        campaignSubscribers.splice(index, 1);
      }
    };
  }
};

// Membership Service
export const membershipService = {
  async getMemberships(): Promise<Membership[]> {
    console.log('Using mock memberships data');
    return [...mockMemberships];
  },

  async addMembership(membership: Omit<Membership, 'id'>): Promise<string> {
    console.log('Adding mock membership:', membership);
    const newId = Date.now().toString();
    const newMembership: Membership = {
      id: newId,
      ...membership
    };
    mockMemberships.unshift(newMembership);
    
    // Notify all subscribers
    membershipSubscribers.forEach(callback => callback([...mockMemberships]));
    
    return newId;
  },

  async updateMembership(id: string, membership: Partial<Membership>): Promise<void> {
    console.log('Updating mock membership:', id, membership);
    const index = mockMemberships.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMemberships[index] = { ...mockMemberships[index], ...membership };
      
      // Notify all subscribers
      membershipSubscribers.forEach(callback => callback([...mockMemberships]));
    }
  },

  async deleteMembership(id: string): Promise<void> {
    console.log('Deleting mock membership:', id);
    mockMemberships = mockMemberships.filter(m => m.id !== id);
    
    // Notify all subscribers
    membershipSubscribers.forEach(callback => callback([...mockMemberships]));
  },

  subscribeToMemberships(callback: (memberships: Membership[]) => void): () => void {
    console.log('Setting up mock memberships subscription');
    // Simulate real-time updates by calling callback immediately
    callback([...mockMemberships]);
    
    // Store callback for future updates
    membershipSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from mock memberships');
      const index = membershipSubscribers.indexOf(callback);
      if (index > -1) {
        membershipSubscribers.splice(index, 1);
      }
    };
  }
};
