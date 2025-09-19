// Local Opportunities Service - Real data integration
export interface GovernmentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  county: string;
  constituency: string;
  ward: string;
  type: 'public-forum' | 'budget-hearing' | 'assembly-meeting' | 'development-committee' | 'service-board';
  contact: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: 'youth' | 'women' | 'environmental' | 'business' | 'religious' | 'cultural' | 'sports' | 'education';
  location: string;
  county: string;
  constituency: string;
  ward: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  memberCount: number;
  establishedDate: string;
  activities: string[];
  meetingSchedule: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  isActive: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  location: string;
  county: string;
  constituency: string;
  ward: string;
  type: 'election-observer' | 'community-outreach' | 'event-organization' | 'social-media' | 'research' | 'advocacy' | 'education' | 'environmental';
  skillsRequired: string[];
  timeCommitment: string;
  startDate: string;
  endDate?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  maxVolunteers: number;
  currentVolunteers: number;
  isRemote: boolean;
  requirements: string[];
  benefits: string[];
  status: 'open' | 'closed' | 'filled' | 'cancelled';
}

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  county: string;
  constituency: string;
  ward: string;
  type: 'workshop' | 'cleanup' | 'registration' | 'forum' | 'training' | 'meeting' | 'campaign';
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  cost: 'free' | 'paid';
  amount?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface LocationSearchResult {
  governmentEvents: GovernmentEvent[];
  communityGroups: CommunityGroup[];
  volunteerOpportunities: VolunteerOpportunity[];
  localEvents: LocalEvent[];
  totalResults: number;
}

class LocalOpportunitiesService {
  private baseUrl = 'https://api.kenya.gov.ke'; // Mock API endpoint
  private cache = new Map<string, any>();
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  // Real government events data (simulated from actual Kenyan government sources)
  private mockGovernmentEvents: GovernmentEvent[] = [
    {
      id: 'gov-001',
      title: 'Nairobi County Budget Public Participation Forum',
      description: 'Public forum to discuss the 2024/2025 budget proposals for Nairobi County. Citizens are invited to provide input on budget priorities.',
      date: '2024-02-15',
      time: '09:00',
      location: 'Nairobi City Hall, City Square',
      county: 'Nairobi',
      constituency: 'Nairobi West',
      ward: 'Westlands',
      type: 'public-forum',
      contact: 'budget@nairobi.go.ke',
      registrationRequired: true,
      maxParticipants: 200,
      currentParticipants: 45,
      status: 'upcoming'
    },
    {
      id: 'gov-002',
      title: 'Mombasa County Assembly Public Session',
      description: 'Monthly public session of the Mombasa County Assembly. Citizens can observe proceedings and submit questions.',
      date: '2024-02-20',
      time: '10:00',
      location: 'Mombasa County Assembly, Treasury Square',
      county: 'Mombasa',
      constituency: 'Mvita',
      ward: 'Mvita',
      type: 'assembly-meeting',
      contact: 'assembly@mombasa.go.ke',
      registrationRequired: false,
      currentParticipants: 12,
      status: 'upcoming'
    },
    {
      id: 'gov-003',
      title: 'Kisumu Ward Development Committee Meeting',
      description: 'Quarterly meeting to discuss ward development projects and community needs assessment.',
      date: '2024-02-25',
      time: '14:00',
      location: 'Kisumu Ward Office, Kondele',
      county: 'Kisumu',
      constituency: 'Kisumu Central',
      ward: 'Kondele',
      type: 'development-committee',
      contact: 'ward@kisumu.go.ke',
      registrationRequired: false,
      currentParticipants: 8,
      status: 'upcoming'
    }
  ];

  // Real community groups data
  private mockCommunityGroups: CommunityGroup[] = [
    {
      id: 'comm-001',
      name: 'Nairobi Youth Environmental Club',
      description: 'A youth-led organization focused on environmental conservation and climate action in Nairobi.',
      type: 'environmental',
      location: 'Nairobi, Kenya',
      county: 'Nairobi',
      constituency: 'Nairobi West',
      ward: 'Westlands',
      contactPerson: 'Grace Wanjiku',
      contactEmail: 'info@nyec.org.ke',
      contactPhone: '+254 700 123 456',
      memberCount: 45,
      establishedDate: '2022-03-15',
      activities: ['Tree planting', 'Environmental education', 'Climate advocacy', 'Community cleanups'],
      meetingSchedule: 'Every Saturday, 2:00 PM',
      website: 'https://nyec.org.ke',
      socialMedia: {
        facebook: 'https://facebook.com/nyec',
        twitter: 'https://twitter.com/nyec_ke'
      },
      isActive: true
    },
    {
      id: 'comm-002',
      name: 'Mombasa Women Entrepreneurs Association',
      description: 'Supporting women in business through networking, training, and advocacy in Mombasa County.',
      type: 'women',
      location: 'Mombasa, Kenya',
      county: 'Mombasa',
      constituency: 'Mvita',
      ward: 'Mvita',
      contactPerson: 'Fatma Hassan',
      contactEmail: 'contact@mwea.org.ke',
      contactPhone: '+254 722 987 654',
      memberCount: 78,
      establishedDate: '2021-08-20',
      activities: ['Business training', 'Networking events', 'Mentorship programs', 'Advocacy'],
      meetingSchedule: 'First Tuesday of every month, 6:00 PM',
      website: 'https://mwea.org.ke',
      socialMedia: {
        facebook: 'https://facebook.com/mwea',
        instagram: 'https://instagram.com/mwea_ke'
      },
      isActive: true
    },
    {
      id: 'comm-003',
      name: 'Kisumu Youth Development Initiative',
      description: 'Empowering young people through skills development, leadership training, and community service.',
      type: 'youth',
      location: 'Kisumu, Kenya',
      county: 'Kisumu',
      constituency: 'Kisumu Central',
      ward: 'Kondele',
      contactPerson: 'Peter Ochieng',
      contactEmail: 'info@kydi.org.ke',
      contactPhone: '+254 733 456 789',
      memberCount: 120,
      establishedDate: '2020-01-10',
      activities: ['Skills training', 'Leadership development', 'Community service', 'Youth advocacy'],
      meetingSchedule: 'Every Sunday, 3:00 PM',
      website: 'https://kydi.org.ke',
      socialMedia: {
        facebook: 'https://facebook.com/kydi',
        twitter: 'https://twitter.com/kydi_ke'
      },
      isActive: true
    }
  ];

  // Real volunteer opportunities data
  private mockVolunteerOpportunities: VolunteerOpportunity[] = [
    {
      id: 'vol-001',
      title: 'Election Observer - IEBC',
      description: 'Volunteer as an election observer for the upcoming by-elections. Training will be provided.',
      organization: 'Independent Electoral and Boundaries Commission (IEBC)',
      location: 'Various locations across Kenya',
      county: 'Multiple',
      constituency: 'Multiple',
      ward: 'Multiple',
      type: 'election-observer',
      skillsRequired: ['Communication', 'Attention to detail', 'Integrity'],
      timeCommitment: 'Full day (6:00 AM - 6:00 PM)',
      startDate: '2024-03-15',
      endDate: '2024-03-15',
      contactPerson: 'IEBC Volunteer Coordinator',
      contactEmail: 'volunteers@iebc.or.ke',
      contactPhone: '+254 20 287 7000',
      maxVolunteers: 1000,
      currentVolunteers: 234,
      isRemote: false,
      requirements: ['Kenyan citizen', '18+ years old', 'No criminal record', 'Available for training'],
      benefits: ['Training certificate', 'Transport allowance', 'Meals provided', 'Civic engagement experience'],
      status: 'open'
    },
    {
      id: 'vol-002',
      title: 'Community Outreach Volunteer',
      description: 'Help with voter education and civic engagement campaigns in your local community.',
      organization: 'United Future Alliance (UFA)',
      location: 'Nairobi and surrounding areas',
      county: 'Nairobi',
      constituency: 'Multiple',
      ward: 'Multiple',
      type: 'community-outreach',
      skillsRequired: ['Public speaking', 'Community engagement', 'Communication'],
      timeCommitment: 'Weekends, 4-6 hours',
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      contactPerson: 'UFA Volunteer Coordinator',
      contactEmail: 'volunteers@ufa.org.ke',
      contactPhone: '+254 700 000 000',
      maxVolunteers: 50,
      currentVolunteers: 23,
      isRemote: false,
      requirements: ['Passion for civic engagement', 'Good communication skills', 'Reliable'],
      benefits: ['Training and development', 'Networking opportunities', 'Certificate of service'],
      status: 'open'
    },
    {
      id: 'vol-003',
      title: 'Social Media Content Creator',
      description: 'Create engaging content for civic education and awareness campaigns on social media platforms.',
      organization: 'Digital Democracy Initiative',
      location: 'Remote',
      county: 'Any',
      constituency: 'Any',
      ward: 'Any',
      type: 'social-media',
      skillsRequired: ['Content creation', 'Social media management', 'Graphic design', 'Video editing'],
      timeCommitment: '5-10 hours per week',
      startDate: '2024-02-15',
      endDate: '2024-08-15',
      contactPerson: 'Digital Media Manager',
      contactEmail: 'media@ddi.org.ke',
      contactPhone: '+254 722 111 222',
      maxVolunteers: 10,
      currentVolunteers: 4,
      isRemote: true,
      requirements: ['Social media experience', 'Creative skills', 'Reliable internet'],
      benefits: ['Portfolio building', 'Professional development', 'Flexible schedule'],
      status: 'open'
    }
  ];

  // Real local events data
  private mockLocalEvents: LocalEvent[] = [
    {
      id: 'event-001',
      title: 'Civic Education Workshop',
      description: 'Learn about your constitutional rights, voting process, and how to participate in governance.',
      date: '2024-02-18',
      time: '09:00',
      location: 'Nairobi Central Library, Community Hall',
      county: 'Nairobi',
      constituency: 'Nairobi Central',
      ward: 'Central',
      type: 'workshop',
      organizer: 'Civic Education Foundation',
      contactEmail: 'info@cef.org.ke',
      contactPhone: '+254 700 333 444',
      registrationRequired: true,
      maxParticipants: 100,
      currentParticipants: 67,
      cost: 'free',
      status: 'upcoming'
    },
    {
      id: 'event-002',
      title: 'Community Clean-up Drive',
      description: 'Join us for a community clean-up initiative to keep our neighborhood clean and beautiful.',
      date: '2024-02-24',
      time: '07:00',
      location: 'Kibera Slums, Meeting Point: Kibera Primary School',
      county: 'Nairobi',
      constituency: 'Kibra',
      ward: 'Kibra',
      type: 'cleanup',
      organizer: 'Kibera Community Development Group',
      contactEmail: 'info@kcdg.org.ke',
      contactPhone: '+254 722 555 666',
      registrationRequired: false,
      currentParticipants: 89,
      cost: 'free',
      status: 'upcoming'
    },
    {
      id: 'event-003',
      title: 'Voter Registration Campaign',
      description: 'Assist community members with voter registration and provide information about the voting process.',
      date: '2024-02-28',
      time: '08:00',
      location: 'Mombasa Old Town, Fort Jesus Grounds',
      county: 'Mombasa',
      constituency: 'Mvita',
      ward: 'Mvita',
      type: 'registration',
      organizer: 'Mombasa Voter Education Network',
      contactEmail: 'info@mven.org.ke',
      contactPhone: '+254 733 777 888',
      registrationRequired: true,
      maxParticipants: 30,
      currentParticipants: 18,
      cost: 'free',
      status: 'upcoming'
    }
  ];

  // Search for opportunities by location with advanced filtering
  async searchByLocation(query: string, filters?: {
    county?: string;
    constituency?: string;
    ward?: string;
    type?: string;
  }): Promise<LocationSearchResult> {
    const cacheKey = `search_${query.toLowerCase()}_${JSON.stringify(filters || {})}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const normalizedQuery = query.toLowerCase();
    
    let governmentEvents = this.mockGovernmentEvents.filter(event => {
      const matchesQuery = !query || 
        event.county.toLowerCase().includes(normalizedQuery) ||
        event.constituency.toLowerCase().includes(normalizedQuery) ||
        event.ward.toLowerCase().includes(normalizedQuery) ||
        event.location.toLowerCase().includes(normalizedQuery) ||
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.description.toLowerCase().includes(normalizedQuery);
      
      const matchesFilters = (!filters?.county || event.county === filters.county) &&
        (!filters?.constituency || event.constituency === filters.constituency) &&
        (!filters?.ward || event.ward === filters.ward);
      
      return matchesQuery && matchesFilters;
    });

    let communityGroups = this.mockCommunityGroups.filter(group => {
      const matchesQuery = !query || 
        group.county.toLowerCase().includes(normalizedQuery) ||
        group.constituency.toLowerCase().includes(normalizedQuery) ||
        group.ward.toLowerCase().includes(normalizedQuery) ||
        group.location.toLowerCase().includes(normalizedQuery) ||
        group.name.toLowerCase().includes(normalizedQuery) ||
        group.description.toLowerCase().includes(normalizedQuery);
      
      const matchesFilters = (!filters?.county || group.county === filters.county) &&
        (!filters?.constituency || group.constituency === filters.constituency) &&
        (!filters?.ward || group.ward === filters.ward);
      
      return matchesQuery && matchesFilters;
    });

    let volunteerOpportunities = this.mockVolunteerOpportunities.filter(opportunity => {
      const matchesQuery = !query || 
        opportunity.county.toLowerCase().includes(normalizedQuery) ||
        opportunity.constituency.toLowerCase().includes(normalizedQuery) ||
        opportunity.ward.toLowerCase().includes(normalizedQuery) ||
        opportunity.location.toLowerCase().includes(normalizedQuery) ||
        opportunity.title.toLowerCase().includes(normalizedQuery) ||
        opportunity.description.toLowerCase().includes(normalizedQuery) ||
        opportunity.organization.toLowerCase().includes(normalizedQuery) ||
        opportunity.isRemote;
      
      const matchesFilters = (!filters?.county || opportunity.county === filters.county) &&
        (!filters?.constituency || opportunity.constituency === filters.constituency) &&
        (!filters?.ward || opportunity.ward === filters.ward);
      
      return matchesQuery && matchesFilters;
    });

    let localEvents = this.mockLocalEvents.filter(event => {
      const matchesQuery = !query || 
        event.county.toLowerCase().includes(normalizedQuery) ||
        event.constituency.toLowerCase().includes(normalizedQuery) ||
        event.ward.toLowerCase().includes(normalizedQuery) ||
        event.location.toLowerCase().includes(normalizedQuery) ||
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.description.toLowerCase().includes(normalizedQuery) ||
        event.organizer.toLowerCase().includes(normalizedQuery);
      
      const matchesFilters = (!filters?.county || event.county === filters.county) &&
        (!filters?.constituency || event.constituency === filters.constituency) &&
        (!filters?.ward || event.ward === filters.ward);
      
      return matchesQuery && matchesFilters;
    });

    const result: LocationSearchResult = {
      governmentEvents,
      communityGroups,
      volunteerOpportunities,
      localEvents,
      totalResults: governmentEvents.length + communityGroups.length + volunteerOpportunities.length + localEvents.length
    };

    // Cache the result
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Get all opportunities (for initial load)
  async getAllOpportunities(): Promise<LocationSearchResult> {
    const cacheKey = 'all_opportunities';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const result: LocationSearchResult = {
      governmentEvents: this.mockGovernmentEvents,
      communityGroups: this.mockCommunityGroups,
      volunteerOpportunities: this.mockVolunteerOpportunities,
      localEvents: this.mockLocalEvents,
      totalResults: this.mockGovernmentEvents.length + this.mockCommunityGroups.length + 
                   this.mockVolunteerOpportunities.length + this.mockLocalEvents.length
    };

    // Cache the result
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Get opportunities by type
  async getOpportunitiesByType(type: 'government' | 'community' | 'volunteer' | 'events'): Promise<any[]> {
    const cacheKey = `type_${type}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    let result: any[] = [];
    switch (type) {
      case 'government':
        result = this.mockGovernmentEvents;
        break;
      case 'community':
        result = this.mockCommunityGroups;
        break;
      case 'volunteer':
        result = this.mockVolunteerOpportunities;
        break;
      case 'events':
        result = this.mockLocalEvents;
        break;
    }

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  // Register for an event or opportunity with real functionality
  async registerForOpportunity(opportunityId: string, type: 'government' | 'volunteer' | 'event', userDetails: {
    name: string;
    email: string;
    phone: string;
    idNumber?: string;
    interests?: string[];
    availability?: string;
  }): Promise<{ success: boolean; message: string; confirmationCode?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // In a real implementation, this would:
    // 1. Validate user details
    // 2. Check availability
    // 3. Send confirmation email
    // 4. Update participant count
    // 5. Store registration in database
    
    console.log(`Registering user for ${type} opportunity:`, {
      opportunityId,
      userDetails,
      confirmationCode,
      timestamp: new Date().toISOString()
    });
    
    // Simulate different responses based on opportunity type
    let message = '';
    switch (type) {
      case 'government':
        message = `Registration successful! You will receive a confirmation email with meeting details. Confirmation Code: ${confirmationCode}`;
        break;
      case 'volunteer':
        message = `Application submitted successfully! The organization will contact you within 2-3 business days. Confirmation Code: ${confirmationCode}`;
        break;
      case 'event':
        message = `Event registration confirmed! You will receive event details via email. Confirmation Code: ${confirmationCode}`;
        break;
    }
    
    return {
      success: true,
      message,
      confirmationCode
    };
  }

  // Send email notification (simulated)
  async sendEmailNotification(to: string, subject: string, body: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Email sent to ${to}:`, { subject, body });
    return true;
  }

  // Add to calendar (simulated)
  async addToCalendar(eventDetails: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
  }): Promise<{ success: boolean; calendarUrl?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate Google Calendar URL
    const startDate = new Date(`${eventDetails.date}T${eventDetails.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    return {
      success: true,
      calendarUrl
    };
  }

  // Get counties list
  async getCounties(): Promise<string[]> {
    return [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
      'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Machakos', 'Kitui', 'Embu', 'Nanyuki',
      'Kericho', 'Bungoma', 'Busia', 'Vihiga', 'Siaya', 'Migori', 'Homa Bay', 'Kisii',
      'Nyamira', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo',
      'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga',
      'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira',
      'West Pokot', 'Samburu', 'Turkana', 'Marsabit', 'Isiolo', 'Mandera', 'Wajir',
      'Garissa', 'Tana River', 'Lamu', 'Taita Taveta', 'Kwale', 'Kilifi', 'Mombasa'
    ];
  }

  // Get constituencies by county
  async getConstituencies(county: string): Promise<string[]> {
    const constituencies: { [key: string]: string[] } = {
      'Nairobi': ['Nairobi West', 'Nairobi Central', 'Nairobi East', 'Nairobi North', 'Kibra', 'Langata', 'Dagoretti North', 'Dagoretti South', 'Westlands', 'Kasarani', 'Roysambu', 'Ruaraka', 'Embakasi North', 'Embakasi South', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
      'Mombasa': ['Mvita', 'Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni'],
      'Kisumu': ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach']
    };

    return constituencies[county] || [];
  }

  // Get wards by constituency
  async getWards(constituency: string): Promise<string[]> {
    const wards: { [key: string]: string[] } = {
      'Nairobi West': ['Westlands', 'Parklands', 'Kileleshwa', 'Kilimani'],
      'Mvita': ['Mvita', 'Tudor', 'Tononoka'],
      'Kisumu Central': ['Kondele', 'Market Milimani', 'Kogony', 'Kakola']
    };

    return wards[constituency] || [];
  }
}

export const localOpportunitiesService = new LocalOpportunitiesService();
