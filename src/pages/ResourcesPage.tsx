import React from 'react';
import { FileText, Video, BookOpen, Download, ExternalLink, Search, X, Eye, Mail, CheckCircle, MessageSquare, Globe } from 'lucide-react';
import { Resource } from '../types';
import { actualIEBCService, RealIEBCVoterData } from '../lib/actualIEBCService';
import { localOpportunitiesService, LocationSearchResult } from '../lib/localOpportunitiesService';
import { indexedDBFileStorageService } from '../lib/indexedDBFileStorageService';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedResource, setSelectedResource] = React.useState<Resource | null>(null);
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [showCivicEducationModal, setShowCivicEducationModal] = React.useState(false);
  const [showResearchModal, setShowResearchModal] = React.useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = React.useState(false);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterSuccess, setNewsletterSuccess] = React.useState(false);
  const [showConstitutionModal, setShowConstitutionModal] = React.useState(false);
  const [showVoterEducationModal, setShowVoterEducationModal] = React.useState(false);
  const [showParticipationModal, setShowParticipationModal] = React.useState(false);
  const [showDigitalCitizenshipModal, setShowDigitalCitizenshipModal] = React.useState(false);
  const [showConstitutionQuiz, setShowConstitutionQuiz] = React.useState(false);
  const [quizAnswers, setQuizAnswers] = React.useState<{[key: string]: string}>({});
  const [quizScore, setQuizScore] = React.useState<number | null>(null);
  const [showRegistrationCheck, setShowRegistrationCheck] = React.useState(false);
  const [registrationResult, setRegistrationResult] = React.useState<RealIEBCVoterData | null>(null);
  const [showActionToolkit, setShowActionToolkit] = React.useState(false);
  const [showLocalOpportunities, setShowLocalOpportunities] = React.useState(false);
  const [localOpportunities, setLocalOpportunities] = React.useState<LocationSearchResult | null>(null);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = React.useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = React.useState('');
  const [selectedOpportunityType, setSelectedOpportunityType] = React.useState<'all' | 'government' | 'community' | 'volunteer' | 'events'>('all');
  const [counties, setCounties] = React.useState<string[]>([]);
  const [constituencies, setConstituencies] = React.useState<string[]>([]);
  const [wards, setWards] = React.useState<string[]>([]);
  const [selectedCounty, setSelectedCounty] = React.useState('');
  const [selectedConstituency, setSelectedConstituency] = React.useState('');
  const [selectedWard, setSelectedWard] = React.useState('');
  const [showRegistrationForm, setShowRegistrationForm] = React.useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<any>(null);
  const [registrationForm, setRegistrationForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    interests: [] as string[],
    availability: '',
    message: ''
  });
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [opportunityRegistrationResult, setOpportunityRegistrationResult] = React.useState<{ success: boolean; message: string; confirmationCode?: string } | null>(null);
  const [searchDebounce, setSearchDebounce] = React.useState<NodeJS.Timeout | null>(null);
  const [showDigitalGuide, setShowDigitalGuide] = React.useState(false);
  const [showDigitalLiteracyTest, setShowDigitalLiteracyTest] = React.useState(false);
  const [digitalTestAnswers, setDigitalTestAnswers] = React.useState<{[key: string]: string}>({});
  const [digitalTestScore, setDigitalTestScore] = React.useState<number | null>(null);
  const [isTakingTest, setIsTakingTest] = React.useState(false);
  const [showEconomicStudies, setShowEconomicStudies] = React.useState(false);
  const [showSocialPolicy, setShowSocialPolicy] = React.useState(false);
  const [showEnvironmentalReports, setShowEnvironmentalReports] = React.useState(false);
  const [showGovernanceTransparency, setShowGovernanceTransparency] = React.useState(false);
  const [selectedResearch, setSelectedResearch] = React.useState<any>(null);
  const [showResearchPreview, setShowResearchPreview] = React.useState(false);

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Kenya 2030 Vision: UFA Policy Framework',
      description: 'Comprehensive policy document outlining UFA\'s strategic approach to achieving sustainable development goals by 2030.',
      type: 'document',
      url: '#',
      category: 'Policy',
      publishDate: new Date('2024-01-15'),
      uploadedBy: 'UFA Research Team'
    },
    {
      id: '2',
      title: 'Youth Unemployment Solutions - Research Report',
      description: 'In-depth analysis of youth unemployment challenges in Kenya with practical solutions and implementation strategies.',
      type: 'report',
      url: '#',
      category: 'Research',
      publishDate: new Date('2024-01-10'),
      uploadedBy: 'UFA Research Team'
    },
    {
      id: '3',
      title: 'Community Organizing Toolkit',
      description: 'Step-by-step guide for grassroots organizers looking to mobilize their communities for positive change.',
      type: 'document',
      url: '#',
      category: 'Organizing',
      publishDate: new Date('2024-01-08'),
      uploadedBy: 'UFA Community Team'
    },
    {
      id: '4',
      title: 'Understanding Kenya\'s Constitution - Video Series',
      description: 'Educational video series breaking down key constitutional provisions and citizen rights in accessible language.',
      type: 'video',
      url: '#',
      category: 'Education',
      publishDate: new Date('2024-01-05'),
      uploadedBy: 'UFA Education Team'
    },
    {
      id: '5',
      title: 'Climate Action Plan for Kenya',
      description: 'UFA\'s comprehensive strategy for addressing climate change impacts and promoting environmental sustainability.',
      type: 'document',
      url: '#',
      category: 'Environment',
      publishDate: new Date('2024-01-03'),
      uploadedBy: 'UFA Environment Team'
    },
    {
      id: '6',
      title: 'Women in Leadership: Breaking Barriers',
      description: 'Research article examining challenges faced by women in political leadership and pathways for improvement.',
      type: 'article',
      url: '#',
      category: 'Gender',
      publishDate: new Date('2023-12-28'),
      uploadedBy: 'UFA Gender Team'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'Policy', label: 'Policy Papers' },
    { id: 'Research', label: 'Research Reports' },
    { id: 'Education', label: 'Educational Content' },
    { id: 'Organizing', label: 'Organizing Tools' },
    { id: 'Environment', label: 'Environmental' },
    { id: 'Gender', label: 'Gender & Equality' }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'article': return BookOpen;
      case 'report': return FileText;
      default: return FileText;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-600';
      case 'video': return 'bg-red-100 text-red-600';
      case 'article': return 'bg-green-100 text-green-600';
      case 'report': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (resource: Resource) => {
    setSelectedResource(resource);
    setShowDownloadModal(true);
  };

  const handlePreview = (resource: Resource) => {
    setSelectedResource(resource);
    setShowPreviewModal(true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setShowNewsletterModal(false);
        setNewsletterEmail('');
        setNewsletterSuccess(false);
      }, 3000);
    }
  };

  const constitutionQuiz = [
    {
      id: '1',
      question: 'When was the Constitution of Kenya 2010 promulgated?',
      options: ['August 27, 2010', 'August 4, 2010', 'August 15, 2010', 'August 20, 2010'],
      correct: 'August 27, 2010'
    },
    {
      id: '2',
      question: 'How many chapters does the Constitution of Kenya 2010 have?',
      options: ['16', '18', '20', '22'],
      correct: '18'
    },
    {
      id: '3',
      question: 'Which chapter of the Constitution contains the Bill of Rights?',
      options: ['Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6'],
      correct: 'Chapter 4'
    },
    {
      id: '4',
      question: 'How many counties does Kenya have according to the Constitution?',
      options: ['45', '46', '47', '48'],
      correct: '47'
    },
    {
      id: '5',
      question: 'What is the official name of Kenya according to the Constitution?',
      options: ['Republic of Kenya', 'Kenya Republic', 'United Republic of Kenya', 'Kenya'],
      correct: 'Republic of Kenya'
    }
  ];

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    constitutionQuiz.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        score++;
      }
    });
    setQuizScore(score);
  };

  const handleDownloadConstitution = async () => {
    try {
      const files = await indexedDBFileStorageService.getFilesByCategory('constitution');
      if (files.length > 0) {
        const result = await indexedDBFileStorageService.downloadFile(files[0].id);
        if (result.success) {
          // Download is automatically triggered by the service
          console.log('Constitution guide downloaded successfully');
        } else {
          alert('Constitution guide not available for download.');
        }
      } else {
        alert('No constitution guide available. Please contact admin.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDownloadVoterGuide = async () => {
    try {
      const files = await indexedDBFileStorageService.getFilesByCategory('voterGuide');
      if (files.length > 0) {
        const result = await indexedDBFileStorageService.downloadFile(files[0].id);
        if (result.success) {
          // Download is automatically triggered by the service
          console.log('Voter guide downloaded successfully');
        } else {
          alert('Voter guide not available for download.');
        }
      } else {
        alert('No voter guide available. Please contact admin.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDownloadActionToolkit = () => {
    setShowActionToolkit(true);
  };

  const handleFindLocalOpportunities = () => {
    setShowLocalOpportunities(true);
    loadLocalOpportunities();
  };

  // Load initial data
  React.useEffect(() => {
    loadCounties();
  }, []);

  const loadCounties = async () => {
    try {
      const countiesList = await localOpportunitiesService.getCounties();
      setCounties(countiesList);
    } catch (error) {
      console.error('Failed to load counties:', error);
    }
  };

  const loadLocalOpportunities = async () => {
    setIsLoadingOpportunities(true);
    try {
      const opportunities = await localOpportunitiesService.getAllOpportunities();
      setLocalOpportunities(opportunities);
    } catch (error) {
      console.error('Failed to load local opportunities:', error);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  const handleLocationSearch = async () => {
    // Clear previous debounce
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    // Set up new debounced search
    const debouncedSearch = setTimeout(async () => {
      setIsLoadingOpportunities(true);
      try {
        const filters = {
          county: selectedCounty || undefined,
          constituency: selectedConstituency || undefined,
          ward: selectedWard || undefined,
          type: selectedOpportunityType !== 'all' ? selectedOpportunityType : undefined
        };

        const results = await localOpportunitiesService.searchByLocation(
          locationSearchQuery.trim(), 
          filters
        );
        setLocalOpportunities(results);
      } catch (error) {
        console.error('Failed to search opportunities:', error);
      } finally {
        setIsLoadingOpportunities(false);
      }
    }, 500);

    setSearchDebounce(debouncedSearch);
  };

  // Auto-search when filters change
  React.useEffect(() => {
    if (selectedCounty || selectedConstituency || selectedWard || selectedOpportunityType !== 'all') {
      handleLocationSearch();
    }
  }, [selectedCounty, selectedConstituency, selectedWard, selectedOpportunityType]);

  const handleCountyChange = async (county: string) => {
    setSelectedCounty(county);
    setSelectedConstituency('');
    setSelectedWard('');
    setWards([]);
    
    if (county) {
      try {
        const constituenciesList = await localOpportunitiesService.getConstituencies(county);
        setConstituencies(constituenciesList);
      } catch (error) {
        console.error('Failed to load constituencies:', error);
      }
    } else {
      setConstituencies([]);
    }
  };

  const handleConstituencyChange = async (constituency: string) => {
    setSelectedConstituency(constituency);
    setSelectedWard('');
    
    if (constituency) {
      try {
        const wardsList = await localOpportunitiesService.getWards(constituency);
        setWards(wardsList);
      } catch (error) {
        console.error('Failed to load wards:', error);
      }
    } else {
      setWards([]);
    }
  };

  const handleRegisterForOpportunity = async (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setShowRegistrationForm(true);
    setOpportunityRegistrationResult(null);
    
    // Pre-fill form with opportunity details
    setRegistrationForm(prev => ({
      ...prev,
      name: '',
      email: '',
      phone: '',
      idNumber: '',
      interests: [],
      availability: '',
      message: `I am interested in ${opportunity.title}`
    }));
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOpportunity) return;
    
    setIsRegistering(true);
    setOpportunityRegistrationResult(null);
    
    try {
      const result = await localOpportunitiesService.registerForOpportunity(
        selectedOpportunity.id, 
        selectedOpportunity.type || 'event',
        {
          name: registrationForm.name,
          email: registrationForm.email,
          phone: registrationForm.phone,
          idNumber: registrationForm.idNumber,
          interests: registrationForm.interests,
          availability: registrationForm.availability
        }
      );
      
      setOpportunityRegistrationResult(result);
      
      if (result.success) {
        // Send email notification
        await localOpportunitiesService.sendEmailNotification(
          registrationForm.email,
          `Registration Confirmation - ${selectedOpportunity.title}`,
          `Dear ${registrationForm.name},\n\nThank you for registering for "${selectedOpportunity.title}".\n\nConfirmation Code: ${result.confirmationCode}\n\nYou will receive further details via email.\n\nBest regards,\nUFA Team`
        );
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setOpportunityRegistrationResult({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAddToCalendar = async (event: any) => {
    try {
      const result = await localOpportunitiesService.addToCalendar({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description
      });
      
      if (result.success && result.calendarUrl) {
        window.open(result.calendarUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to add to calendar:', error);
      alert('Failed to add to calendar. Please try again.');
    }
  };

  // Digital Literacy Test Questions
  const digitalLiteracyTest = [
    {
      id: 'dl-1',
      question: 'What is the most secure way to create a password?',
      options: ['Use your name and birth year', 'Use a combination of letters, numbers, and symbols', 'Use the same password for all accounts', 'Use your pet\'s name'],
      correct: 'Use a combination of letters, numbers, and symbols'
    },
    {
      id: 'dl-2',
      question: 'What should you do if you receive a suspicious email asking for personal information?',
      options: ['Reply with the information', 'Delete the email immediately', 'Forward it to friends', 'Click on any links in the email'],
      correct: 'Delete the email immediately'
    },
    {
      id: 'dl-3',
      question: 'What is two-factor authentication (2FA)?',
      options: ['Using two different passwords', 'A security method requiring two forms of verification', 'Having two email accounts', 'Using two different devices'],
      correct: 'A security method requiring two forms of verification'
    },
    {
      id: 'dl-4',
      question: 'What is the best practice for sharing information on social media?',
      options: ['Share everything publicly', 'Only share with close friends', 'Be selective and consider privacy settings', 'Share personal details freely'],
      correct: 'Be selective and consider privacy settings'
    },
    {
      id: 'dl-5',
      question: 'What should you do if you encounter cyberbullying?',
      options: ['Respond with more bullying', 'Ignore it completely', 'Report it and block the user', 'Share it with others'],
      correct: 'Report it and block the user'
    },
    {
      id: 'dl-6',
      question: 'What is phishing?',
      options: ['A type of fish', 'A legitimate business email', 'A fraudulent attempt to steal personal information', 'A social media platform'],
      correct: 'A fraudulent attempt to steal personal information'
    },
    {
      id: 'dl-7',
      question: 'What is the purpose of a VPN?',
      options: ['To make your internet faster', 'To protect your online privacy and security', 'To download files faster', 'To access blocked websites only'],
      correct: 'To protect your online privacy and security'
    },
    {
      id: 'dl-8',
      question: 'What should you do before clicking on a link in an email?',
      options: ['Click immediately', 'Hover over it to see the actual URL', 'Forward it to others first', 'Reply to the sender'],
      correct: 'Hover over it to see the actual URL'
    },
    {
      id: 'dl-9',
      question: 'What is digital citizenship?',
      options: ['Being a citizen of a digital country', 'Responsible use of technology and online behavior', 'Having multiple online accounts', 'Using only digital devices'],
      correct: 'Responsible use of technology and online behavior'
    },
    {
      id: 'dl-10',
      question: 'What is the best way to verify information you find online?',
      options: ['Trust the first source you find', 'Check multiple reliable sources', 'Only use social media', 'Believe everything you read'],
      correct: 'Check multiple reliable sources'
    }
  ];

  const handleDigitalTestAnswer = (questionId: string, answer: string) => {
    setDigitalTestAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleDigitalTestSubmit = () => {
    setIsTakingTest(true);
    
    // Simulate test processing
    setTimeout(() => {
      let correctAnswers = 0;
      digitalLiteracyTest.forEach(question => {
        if (digitalTestAnswers[question.id] === question.correct) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / digitalLiteracyTest.length) * 100);
      setDigitalTestScore(score);
      setIsTakingTest(false);
    }, 2000);
  };

  const handleDownloadDigitalGuide = async () => {
    try {
      const files = await indexedDBFileStorageService.getFilesByCategory('digitalGuide');
      if (files.length > 0) {
        const result = await indexedDBFileStorageService.downloadFile(files[0].id);
        if (result.success) {
          // Download is automatically triggered by the service
          console.log('Digital guide downloaded successfully');
        } else {
          alert('Digital guide not available for download.');
        }
      } else {
        // Fallback to modal if no file is uploaded
        setShowDigitalGuide(true);
      }
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to modal on error
      setShowDigitalGuide(true);
    }
  };

  const handleTakeDigitalTest = () => {
    setShowDigitalLiteracyTest(true);
    setDigitalTestAnswers({});
    setDigitalTestScore(null);
  };

  // Research Library Data
  const economicStudies = [
    {
      id: 'eco-1',
      title: 'Kenya\'s Economic Transformation: 2020-2030',
      author: 'Dr. Sarah Mwangi, UFA Research Institute',
      date: '2024-01-15',
      type: 'Comprehensive Study',
      pages: 156,
      downloads: 2847,
      description: 'An in-depth analysis of Kenya\'s economic growth trajectory, focusing on key sectors driving transformation and policy recommendations for sustainable development.',
      topics: ['Economic Growth', 'Policy Analysis', 'Sector Development', 'Sustainable Development'],
      fileSize: '8.2 MB',
      language: 'English'
    },
    {
      id: 'eco-2',
      title: 'Digital Economy Impact on Rural Communities',
      author: 'Prof. James Kiprop, University of Nairobi',
      date: '2024-01-10',
      type: 'Research Report',
      pages: 89,
      downloads: 1923,
      description: 'Examining how digital technologies are transforming rural economies and creating new opportunities for inclusive growth.',
      topics: ['Digital Economy', 'Rural Development', 'Technology Adoption', 'Inclusive Growth'],
      fileSize: '5.7 MB',
      language: 'English'
    },
    {
      id: 'eco-3',
      title: 'Youth Employment in the Gig Economy',
      author: 'Dr. Mary Wanjiku, UFA Policy Center',
      date: '2024-01-05',
      type: 'Policy Brief',
      pages: 45,
      downloads: 3456,
      description: 'Analysis of youth participation in Kenya\'s growing gig economy and policy recommendations for worker protection.',
      topics: ['Youth Employment', 'Gig Economy', 'Worker Rights', 'Policy Recommendations'],
      fileSize: '3.1 MB',
      language: 'English'
    }
  ];

  const socialPolicyResearch = [
    {
      id: 'soc-1',
      title: 'Universal Healthcare Implementation in Kenya',
      author: 'Dr. Peter Kimani, Health Policy Institute',
      date: '2024-01-20',
      type: 'Policy Analysis',
      pages: 134,
      downloads: 4123,
      description: 'Comprehensive evaluation of Kenya\'s Universal Health Coverage program, challenges, and recommendations for improvement.',
      topics: ['Healthcare Policy', 'Universal Coverage', 'Health Equity', 'Implementation Challenges'],
      fileSize: '7.8 MB',
      language: 'English'
    },
    {
      id: 'soc-2',
      title: 'Education Quality and Access in Marginalized Communities',
      author: 'Dr. Grace Akinyi, Education Research Center',
      date: '2024-01-18',
      type: 'Research Study',
      pages: 112,
      downloads: 2789,
      description: 'Investigating educational disparities and proposing solutions for equitable access to quality education.',
      topics: ['Education Policy', 'Access to Education', 'Quality Improvement', 'Marginalized Communities'],
      fileSize: '6.4 MB',
      language: 'English'
    },
    {
      id: 'soc-3',
      title: 'Social Protection Programs Effectiveness',
      author: 'Prof. David Ochieng, Social Policy Institute',
      date: '2024-01-12',
      type: 'Evaluation Report',
      pages: 98,
      downloads: 2156,
      description: 'Assessment of Kenya\'s social protection programs and their impact on poverty reduction and social inclusion.',
      topics: ['Social Protection', 'Poverty Reduction', 'Program Evaluation', 'Social Inclusion'],
      fileSize: '5.9 MB',
      language: 'English'
    }
  ];

  const environmentalReports = [
    {
      id: 'env-1',
      title: 'Climate Change Adaptation Strategies for Agriculture',
      author: 'Dr. Jane Muthoni, Environmental Research Institute',
      date: '2024-01-25',
      type: 'Environmental Assessment',
      pages: 167,
      downloads: 3245,
      description: 'Comprehensive analysis of climate change impacts on Kenyan agriculture and adaptation strategies for farmers.',
      topics: ['Climate Change', 'Agriculture', 'Adaptation Strategies', 'Environmental Policy'],
      fileSize: '9.1 MB',
      language: 'English'
    },
    {
      id: 'env-2',
      title: 'Renewable Energy Transition in Kenya',
      author: 'Dr. Michael Karanja, Energy Policy Center',
      date: '2024-01-22',
      type: 'Energy Report',
      pages: 145,
      downloads: 2891,
      description: 'Analysis of Kenya\'s renewable energy sector growth and policy recommendations for sustainable energy transition.',
      topics: ['Renewable Energy', 'Energy Policy', 'Sustainability', 'Green Economy'],
      fileSize: '8.3 MB',
      language: 'English'
    },
    {
      id: 'env-3',
      title: 'Water Resource Management and Conservation',
      author: 'Dr. Susan Wanjala, Water Resources Institute',
      date: '2024-01-16',
      type: 'Resource Assessment',
      pages: 123,
      downloads: 2567,
      description: 'Evaluation of Kenya\'s water resources and recommendations for sustainable water management practices.',
      topics: ['Water Management', 'Resource Conservation', 'Sustainability', 'Environmental Policy'],
      fileSize: '7.2 MB',
      language: 'English'
    }
  ];

  const governanceTransparency = [
    {
      id: 'gov-1',
      title: 'Digital Governance and E-Government Implementation',
      author: 'Dr. Robert Mutua, Governance Institute',
      date: '2024-01-28',
      type: 'Governance Study',
      pages: 178,
      downloads: 3678,
      description: 'Analysis of Kenya\'s digital governance initiatives and their impact on public service delivery and transparency.',
      topics: ['Digital Governance', 'E-Government', 'Public Service Delivery', 'Transparency'],
      fileSize: '9.8 MB',
      language: 'English'
    },
    {
      id: 'gov-2',
      title: 'Anti-Corruption Measures and Public Trust',
      author: 'Dr. Elizabeth Nyong\'o, Transparency Research Center',
      date: '2024-01-24',
      type: 'Transparency Report',
      pages: 156,
      downloads: 4123,
      description: 'Evaluation of anti-corruption initiatives and their effectiveness in building public trust in government institutions.',
      topics: ['Anti-Corruption', 'Public Trust', 'Institutional Reform', 'Accountability'],
      fileSize: '8.7 MB',
      language: 'English'
    },
    {
      id: 'gov-3',
      title: 'Devolution and County Government Performance',
      author: 'Prof. John Mwangi, Devolution Studies Center',
      date: '2024-01-19',
      type: 'Performance Analysis',
      pages: 189,
      downloads: 2987,
      description: 'Comprehensive assessment of devolution implementation and county government performance across Kenya.',
      topics: ['Devolution', 'County Governments', 'Performance Evaluation', 'Local Governance'],
      fileSize: '10.2 MB',
      language: 'English'
    }
  ];

  const handleResearchPreview = (research: any) => {
    setSelectedResearch(research);
    setShowResearchPreview(true);
  };

  const handleResearchDownload = async (research: any) => {
    try {
      // For now, show alert since research data is mock
      // In a real implementation, this would fetch from Firebase
      alert(`Downloading: ${research.title}\nFile size: ${research.fileSize}\nAuthor: ${research.author}`);
      
      // TODO: Implement real research download when research files are uploaded to Firebase
      // const files = await fileStorageService.getFilesByCategory('research');
      // const researchFile = files.find(f => f.originalName.includes(research.title));
      // if (researchFile) {
      //   const result = await fileStorageService.downloadFile(researchFile.id);
      //   if (result.success && result.downloadURL) {
      //     window.open(result.downloadURL, '_blank');
      //   }
      // }
    } catch (error) {
      console.error('Research download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleViewStudies = (category: string) => {
    switch(category) {
      case 'economic':
        setShowEconomicStudies(true);
        break;
      case 'social':
        setShowSocialPolicy(true);
        break;
      case 'environmental':
        setShowEnvironmentalReports(true);
        break;
      case 'governance':
        setShowGovernanceTransparency(true);
        break;
    }
  };

  const handleCheckRegistration = () => {
    setShowRegistrationCheck(true);
    setRegistrationResult(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Resources & Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive collection of policy papers, research reports, educational materials, 
            and organizing tools to stay informed and engaged.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredResources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource.type);
            return (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  {/* Resource Type Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getResourceColor(resource.type)}`}>
                      <ResourceIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>

                  {/* Resource Title & Description */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Publish Date */}
                  <p className="text-sm text-gray-500 mb-6">
                    Published: {resource.publishDate.toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleDownload(resource)}
                      className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={() => handlePreview(resource)}
                      className="border-2 border-blue-500 text-blue-600 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filters.</p>
          </div>
        )}

        {/* Educational Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Civic Education */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Civic Education Hub</h2>
            <p className="text-gray-600 mb-6">
              Learn about your rights, responsibilities, and how to participate effectively in Kenya's democracy.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Understanding the Constitution
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Voter Education Materials
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Citizen Participation Guides
              </li>
            </ul>
            <button 
              onClick={() => setShowCivicEducationModal(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Explore Civic Education
            </button>
          </div>

          {/* Research Library */}
          <div className="bg-gradient-to-br from-green-50 to-red-50 p-8 rounded-2xl border border-green-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Research Library</h2>
            <p className="text-gray-600 mb-6">
              Access in-depth research on Kenya's development challenges and evidence-based solutions.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Economic Development Studies
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Social Policy Research
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Environmental Impact Reports
              </li>
            </ul>
            <button 
              onClick={() => setShowResearchModal(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Browse Research
            </button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-br from-red-600 to-blue-700 text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest resources, research, and educational materials 
            delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <button 
              onClick={() => setShowNewsletterModal(true)}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Download Resource</h3>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedResource.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{selectedResource.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded">{selectedResource.type}</span>
                <span>•</span>
                <span>{selectedResource.category}</span>
                <span>•</span>
                <span>{selectedResource.publishDate.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  // Simulate download
                  alert(`Downloading: ${selectedResource.title}`);
                  setShowDownloadModal(false);
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Now
              </button>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Resource Preview</h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{selectedResource.title}</h4>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <span className="capitalize bg-gray-100 px-3 py-1 rounded-full">{selectedResource.type}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedResource.category}</span>
                <span>Published: {selectedResource.publishDate.toLocaleDateString()}</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">{selectedResource.description}</p>
                {selectedResource.type === 'document' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-3">Document Preview</h5>
                    <p className="text-gray-600 text-sm">
                      This is a preview of the document content. The full document contains detailed information, 
                      charts, and comprehensive analysis. Click "Download" to access the complete resource.
                    </p>
                  </div>
                )}
                {selectedResource.type === 'video' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-3">Video Preview</h5>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Video preview would be displayed here</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedResource.type === 'report' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-3">Report Summary</h5>
                    <p className="text-gray-600 text-sm">
                      This research report contains comprehensive analysis, data visualizations, 
                      and evidence-based recommendations. The full report includes detailed methodology, 
                      findings, and implementation strategies.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleDownload(selectedResource);
                  }}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Full Resource
                </button>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Civic Education Modal */}
      {showCivicEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Civic Education Hub</h3>
              <button 
                onClick={() => setShowCivicEducationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Learn about your rights, responsibilities, and how to participate effectively in Kenya's democracy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Understanding the Constitution',
                    description: 'Comprehensive guide to Kenya\'s constitution, your rights, and how the government works.',
                    resources: ['Constitution Guide', 'Rights & Responsibilities', 'Government Structure']
                  },
                  {
                    title: 'Voter Education Materials',
                    description: 'Everything you need to know about voting, elections, and making informed choices.',
                    resources: ['Voting Process', 'Candidate Information', 'Election Calendar']
                  },
                  {
                    title: 'Citizen Participation Guides',
                    description: 'How to engage with your government, participate in public consultations, and make your voice heard.',
                    resources: ['Public Participation', 'Community Organizing', 'Advocacy Tools']
                  },
                  {
                    title: 'Digital Citizenship',
                    description: 'Responsible use of technology, social media, and digital platforms for civic engagement.',
                    resources: ['Online Safety', 'Digital Rights', 'Social Media Guidelines']
                  }
                ].map((section, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{section.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                    <div className="space-y-2">
                      {section.resources.map((resource, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{resource}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setShowCivicEducationModal(false);
                        if (index === 0) setShowConstitutionModal(true);
                        else if (index === 1) setShowVoterEducationModal(true);
                        else if (index === 2) setShowParticipationModal(true);
                        else if (index === 3) setShowDigitalCitizenshipModal(true);
                      }}
                      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Access Materials
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Research Library Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Research Library</h3>
              <button 
                onClick={() => setShowResearchModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Access in-depth research on Kenya's development challenges and evidence-based solutions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Economic Development Studies',
                    description: 'Research on economic growth, job creation, and sustainable development strategies.',
                    studies: ['Youth Employment Analysis', 'SME Growth Factors', 'Digital Economy Impact']
                  },
                  {
                    title: 'Social Policy Research',
                    description: 'Studies on education, healthcare, social protection, and community development.',
                    studies: ['Education Access', 'Healthcare Delivery', 'Social Safety Nets']
                  },
                  {
                    title: 'Environmental Impact Reports',
                    description: 'Climate change, environmental protection, and sustainable resource management.',
                    studies: ['Climate Adaptation', 'Renewable Energy', 'Conservation Strategies']
                  },
                  {
                    title: 'Governance & Transparency',
                    description: 'Research on public administration, corruption prevention, and institutional reform.',
                    studies: ['Public Service Delivery', 'Anti-Corruption Measures', 'Digital Governance']
                  }
                ].map((section, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{section.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                    <div className="space-y-2">
                      {section.studies.map((study, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{study}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setShowResearchModal(false);
                        if (index === 0) handleViewStudies('economic');
                        else if (index === 1) handleViewStudies('social');
                        else if (index === 2) handleViewStudies('environmental');
                        else if (index === 3) handleViewStudies('governance');
                      }}
                      className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      View Studies
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscription Modal */}
      {showNewsletterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Subscribe to Newsletter</h3>
              <button 
                onClick={() => setShowNewsletterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {newsletterSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Successfully Subscribed!</h4>
                <p className="text-gray-600">
                  Thank you for subscribing to our newsletter. You'll receive the latest resources and updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests (Optional)</label>
                  <div className="space-y-2">
                    {['Policy Updates', 'Research Reports', 'Event Notifications', 'Educational Content'].map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Subscribe
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewsletterModal(false)}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Constitution Guide Modal */}
      {showConstitutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Understanding the Constitution</h3>
              <button 
                onClick={() => setShowConstitutionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Comprehensive guide to Kenya's constitution, your rights, and how the government works.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📜 Constitution Guide</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• History and development of Kenya's constitution</li>
                    <li>• Key constitutional principles and values</li>
                    <li>• Structure of government (Executive, Legislature, Judiciary)</li>
                    <li>• Devolution and county governments</li>
                    <li>• Constitutional amendment process</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">⚖️ Rights & Responsibilities</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Bill of Rights and fundamental freedoms</li>
                    <li>• Economic, social, and cultural rights</li>
                    <li>• Citizen responsibilities and duties</li>
                    <li>• How to protect and claim your rights</li>
                    <li>• Legal remedies and redress mechanisms</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🏛️ Government Structure</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Executive branch and presidential powers</li>
                    <li>• Parliament and legislative process</li>
                    <li>• Judiciary and court system</li>
                    <li>• Independent commissions and offices</li>
                    <li>• County governments and devolution</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📚 Learning Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Constitution of Kenya 2010 (Full text)</li>
                    <li>• Simplified constitution guide</li>
                    <li>• Constitutional case studies</li>
                    <li>• Interactive constitution quiz</li>
                    <li>• Video explanations and tutorials</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={handleDownloadConstitution}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Download Constitution Guide
                </button>
                <button 
                  onClick={() => {
                    setShowConstitutionModal(false);
                    setShowConstitutionQuiz(true);
                    setQuizAnswers({});
                    setQuizScore(null);
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Take Constitution Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voter Education Modal */}
      {showVoterEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Voter Education Materials</h3>
              <button 
                onClick={() => setShowVoterEducationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Everything you need to know about voting, elections, and making informed choices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🗳️ Voting Process</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• How to register as a voter</li>
                    <li>• Voter registration requirements</li>
                    <li>• Where and when to vote</li>
                    <li>• What to bring on election day</li>
                    <li>• Step-by-step voting procedure</li>
                    <li>• Special voting arrangements</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">👥 Candidate Information</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• How to research candidates</li>
                    <li>• Understanding candidate manifestos</li>
                    <li>• Evaluating candidate track records</li>
                    <li>• Party policies and positions</li>
                    <li>• Candidate debate guidelines</li>
                    <li>• Fact-checking resources</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📅 Election Calendar</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Important election dates</li>
                    <li>• Registration deadlines</li>
                    <li>• Campaign periods</li>
                    <li>• Voting day schedule</li>
                    <li>• Results announcement timeline</li>
                    <li>• Electoral dispute resolution</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📖 Educational Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Voter education videos</li>
                    <li>• Interactive voting simulator</li>
                    <li>• Election terminology guide</li>
                    <li>• Frequently asked questions</li>
                    <li>• Contact information for IEBC</li>
                    <li>• Electoral laws and regulations</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={handleDownloadVoterGuide}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Download Voter Guide
                </button>
                <button 
                  onClick={handleCheckRegistration}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Check Registration Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Participation Modal */}
      {showParticipationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Citizen Participation Guides</h3>
              <button 
                onClick={() => setShowParticipationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                How to engage with your government, participate in public consultations, and make your voice heard.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🏛️ Public Participation</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Public participation principles</li>
                    <li>• How to attend public meetings</li>
                    <li>• Submitting public comments</li>
                    <li>• Participating in budget hearings</li>
                    <li>• Accessing government information</li>
                    <li>• Filing petitions and complaints</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🤝 Community Organizing</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Starting a community group</li>
                    <li>• Organizing community meetings</li>
                    <li>• Building coalitions</li>
                    <li>• Mobilizing for action</li>
                    <li>• Working with local leaders</li>
                    <li>• Sustaining community engagement</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📢 Advocacy Tools</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Writing effective letters</li>
                    <li>• Meeting with officials</li>
                    <li>• Using social media for advocacy</li>
                    <li>• Organizing peaceful protests</li>
                    <li>• Working with the media</li>
                    <li>• Building public support</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📋 Action Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Template letters and petitions</li>
                    <li>• Contact directory for officials</li>
                    <li>• Meeting planning guides</li>
                    <li>• Media outreach templates</li>
                    <li>• Legal rights and protections</li>
                    <li>• Success stories and case studies</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={handleDownloadActionToolkit}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Download Action Toolkit
                </button>
                <button 
                  onClick={handleFindLocalOpportunities}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Find Local Opportunities
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Citizenship Modal */}
      {showDigitalCitizenshipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Digital Citizenship</h3>
              <button 
                onClick={() => setShowDigitalCitizenshipModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Responsible use of technology, social media, and digital platforms for civic engagement.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🔒 Online Safety</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Protecting personal information</li>
                    <li>• Recognizing online threats</li>
                    <li>• Secure password practices</li>
                    <li>• Two-factor authentication</li>
                    <li>• Safe browsing habits</li>
                    <li>• Reporting cybercrimes</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">⚖️ Digital Rights</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Freedom of expression online</li>
                    <li>• Privacy rights and data protection</li>
                    <li>• Access to information</li>
                    <li>• Digital divide and inclusion</li>
                    <li>• Net neutrality principles</li>
                    <li>• Digital rights advocacy</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📱 Social Media Guidelines</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Responsible social media use</li>
                    <li>• Fact-checking information</li>
                    <li>• Combating misinformation</li>
                    <li>• Building positive online communities</li>
                    <li>• Digital etiquette and respect</li>
                    <li>• Managing online reputation</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🌐 Digital Engagement</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Online civic participation</li>
                    <li>• Digital advocacy campaigns</li>
                    <li>• E-government services</li>
                    <li>• Online petitions and consultations</li>
                    <li>• Digital literacy skills</li>
                    <li>• Technology for social good</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={handleDownloadDigitalGuide}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                >
                  Download Digital Guide
                </button>
                <button 
                  onClick={handleTakeDigitalTest}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Take Digital Literacy Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Constitution Quiz Modal */}
      {showConstitutionQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Constitution of Kenya Quiz</h3>
              <button 
                onClick={() => setShowConstitutionQuiz(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {quizScore === null ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Test your knowledge of the Constitution of Kenya 2010. Answer all 5 questions to get your score.
                  </p>
                  
                  <div className="space-y-6">
                    {constitutionQuiz.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-3">
                          {question.options.map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={quizAnswers[question.id] === option}
                                onChange={() => handleQuizAnswer(question.id, option)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-3 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 justify-center mt-8">
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== constitutionQuiz.length}
                      className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                    <button 
                      onClick={() => setShowConstitutionQuiz(false)}
                      className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-blue-600">{quizScore}/{constitutionQuiz.length}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {quizScore === constitutionQuiz.length ? 'Perfect Score! 🎉' : 
                     quizScore >= 4 ? 'Great Job! 👍' : 
                     quizScore >= 3 ? 'Good Effort! 👏' : 'Keep Learning! 📚'}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    You scored {quizScore} out of {constitutionQuiz.length} questions correctly.
                    {quizScore < constitutionQuiz.length && ' Review the Constitution guide to improve your knowledge!'}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {constitutionQuiz.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg text-left">
                        <p className="font-semibold text-gray-900 mb-2">Question {index + 1}: {question.question}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            quizAnswers[question.id] === question.correct 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Your answer: {quizAnswers[question.id] || 'Not answered'}
                          </span>
                          {quizAnswers[question.id] !== question.correct && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              Correct: {question.correct}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => {
                        setQuizScore(null);
                        setQuizAnswers({});
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Retake Quiz
                    </button>
                    <button 
                      onClick={() => setShowConstitutionQuiz(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Registration Status Check Modal */}
      {showRegistrationCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Check Voter Registration Status</h3>
              <button 
                onClick={() => {
                  setShowRegistrationCheck(false);
                  setRegistrationResult(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {!registrationResult ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Important Notice</h4>
                    <p className="text-sm text-blue-800">
                      This application cannot access real IEBC data directly for security and privacy reasons. 
                      For accurate voter registration verification, please use the official IEBC methods below.
                    </p>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    To check your real voter registration status, please use one of the official IEBC verification methods below.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Official IEBC Verification Methods</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-2">IEBC Official Portal</h5>
                            <p className="text-sm text-gray-600 mb-3">
                              Visit the official IEBC voter verification portal to check your registration status with your real data.
                            </p>
                            <button
                              onClick={() => window.open(actualIEBCService.getIEBCPortalURL(), '_blank')}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open IEBC Portal
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-2">SMS Service</h5>
                            <p className="text-sm text-gray-600 mb-3">
                              Send your National ID number to 70000 to receive your registration details via SMS.
                            </p>
                            <button
                              onClick={() => {
                                const smsText = actualIEBCService.getSMSInstructions();
                                alert(smsText);
                              }}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Get SMS Instructions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 className="font-semibold text-yellow-900 mb-2">Why can't this app check my registration directly?</h5>
                      <p className="text-sm text-yellow-800">
                        For security and privacy reasons, IEBC does not allow third-party applications to access voter registration data directly. 
                        This protects your personal information and ensures data integrity. The official IEBC methods above are the only way to get accurate, real-time voter registration information.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowRegistrationCheck(false)}
                      className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      registrationResult.status === 'Registered' ? 'bg-green-100' : 
                      registrationResult.status === 'Pending Verification' ? 'bg-yellow-100' :
                      registrationResult.status === 'Not Found' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <span className={`text-3xl ${
                        registrationResult.status === 'Registered' ? 'text-green-600' : 
                        registrationResult.status === 'Pending Verification' ? 'text-yellow-600' :
                        registrationResult.status === 'Not Found' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {registrationResult.status === 'Registered' ? '✓' : 
                         registrationResult.status === 'Pending Verification' ? '⏳' :
                         registrationResult.status === 'Not Found' ? '✗' : '⚠'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {registrationResult.status === 'Registered' ? 'Registration Confirmed!' : 
                       registrationResult.status === 'Pending Verification' ? 'Registration Pending' :
                       registrationResult.status === 'Not Found' ? 'Registration Not Found' : 'Error Occurred'}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {registrationResult.status === 'Registered' 
                        ? 'You are successfully registered to vote.' 
                        : registrationResult.status === 'Pending Verification'
                        ? 'Your registration is being processed.'
                        : registrationResult.status === 'Not Found'
                        ? 'No registration found for this ID number.'
                        : registrationResult.error || 'An error occurred while checking your registration.'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      <span>Data source:</span>
                      <span className="font-medium">
                        {registrationResult.source === 'IEBC_PORTAL' ? 'IEBC Portal' :
                         registrationResult.source === 'IEBC_API' ? 'IEBC API' :
                         registrationResult.source === 'IEBC_SMS' ? 'IEBC SMS' : 'Error'}
                      </span>
                    </div>
                    {registrationResult.isRealData && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>✓ Real IEBC Data:</strong> This information was retrieved from the official IEBC voter registration database.
                        </p>
                      </div>
                    )}
                    {!registrationResult.isRealData && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Service Unavailable:</strong> Unable to connect to IEBC services. Please use the official IEBC methods for accurate verification.
                        </p>
                      </div>
                    )}
                  </div>

                  {(registrationResult.status === 'Registered' || registrationResult.status === 'Pending Verification') && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h5 className="font-semibold text-gray-900 mb-4">Registration Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registrationResult.name && (
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium text-gray-900">{registrationResult.name}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">ID Number</p>
                          <p className="font-medium text-gray-900">{registrationResult.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className={`font-medium ${
                            registrationResult.status === 'Registered' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {registrationResult.status}
                          </p>
                        </div>
                        {registrationResult.registrationDate && (
                          <div>
                            <p className="text-sm text-gray-600">Registration Date</p>
                            <p className="font-medium text-gray-900">{registrationResult.registrationDate}</p>
                          </div>
                        )}
                        {registrationResult.pollingStation && (
                          <div>
                            <p className="text-sm text-gray-600">Polling Station</p>
                            <p className="font-medium text-gray-900">{registrationResult.pollingStation}</p>
                          </div>
                        )}
                        {registrationResult.ward && (
                          <div>
                            <p className="text-sm text-gray-600">Ward</p>
                            <p className="font-medium text-gray-900">{registrationResult.ward}</p>
                          </div>
                        )}
                        {registrationResult.constituency && (
                          <div>
                            <p className="text-sm text-gray-600">Constituency</p>
                            <p className="font-medium text-gray-900">{registrationResult.constituency}</p>
                          </div>
                        )}
                        {registrationResult.county && (
                          <div>
                            <p className="text-sm text-gray-600">County</p>
                            <p className="font-medium text-gray-900">{registrationResult.county}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {registrationResult.status === 'Registered' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h6 className="font-semibold text-green-800 mb-2">Important Reminders</h6>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Bring your National ID on election day</li>
                        <li>• Arrive at your polling station early</li>
                        <li>• Follow all COVID-19 safety protocols</li>
                        <li>• Contact IEBC if you have any questions</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setOpportunityRegistrationResult(null);
                      }}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      Check Another ID
                    </button>
                    <button
                      onClick={() => setShowRegistrationCheck(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Toolkit Modal */}
      {showActionToolkit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Action Toolkit</h3>
              <button 
                onClick={() => setShowActionToolkit(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Download comprehensive resources to help you engage in civic action and community organizing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📝 Template Documents</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Letter to government officials</li>
                    <li>• Petition templates</li>
                    <li>• Meeting request letters</li>
                    <li>• Press release templates</li>
                    <li>• Community survey forms</li>
                  </ul>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm">
                    Download Templates
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📋 Planning Guides</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Community meeting planning</li>
                    <li>• Campaign strategy guide</li>
                    <li>• Budget planning templates</li>
                    <li>• Timeline and milestone tracking</li>
                    <li>• Risk assessment forms</li>
                  </ul>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm">
                    Download Guides
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📞 Contact Directory</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• National government contacts</li>
                    <li>• County government officials</li>
                    <li>• Ward representatives</li>
                    <li>• Media contacts</li>
                    <li>• Civil society organizations</li>
                  </ul>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm">
                    Download Directory
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">⚖️ Legal Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Constitutional rights guide</li>
                    <li>• Freedom of information act</li>
                    <li>• Public participation laws</li>
                    <li>• Legal aid contacts</li>
                    <li>• Rights violation reporting</li>
                  </ul>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm">
                    Download Legal Guide
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-green-900 mb-3">Complete Action Toolkit</h4>
                <p className="text-sm text-green-800 mb-4">
                  Download the complete action toolkit containing all resources in one comprehensive package.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">File size: 15.2 MB</p>
                    <p className="text-sm text-gray-600">Last updated: January 2024</p>
                  </div>
                  <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    Download Complete Toolkit
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowActionToolkit(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local Opportunities Modal */}
      {showLocalOpportunities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Find Local Opportunities</h3>
              <button 
                onClick={() => setShowLocalOpportunities(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Discover local civic engagement opportunities in your area and connect with like-minded community members.
              </p>
              
              {/* Search and Filter Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-blue-900 mb-4">Search Opportunities</h4>
                
                {/* Location Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                    <select
                      value={selectedCounty}
                      onChange={(e) => handleCountyChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select County</option>
                      {counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Constituency</label>
                    <select
                      value={selectedConstituency}
                      onChange={(e) => handleConstituencyChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!selectedCounty}
                    >
                      <option value="">Select Constituency</option>
                      {constituencies.map(constituency => (
                        <option key={constituency} value={constituency}>{constituency}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ward</label>
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!selectedConstituency}
                    >
                      <option value="">Select Ward</option>
                      {wards.map(ward => (
                        <option key={ward} value={ward}>{ward}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Text Search */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Search by location, organization, or keywords..."
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleLocationSearch}
                    disabled={isLoadingOpportunities}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isLoadingOpportunities ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {/* Filter by Type */}
                <div className="flex flex-wrap gap-2">
                  {['all', 'government', 'community', 'volunteer', 'events'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedOpportunityType(type as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedOpportunityType === type
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Section */}
              {isLoadingOpportunities ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading opportunities...</span>
                </div>
              ) : localOpportunities ? (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-semibold text-green-600">{localOpportunities.totalResults}</span> opportunities
                      {locationSearchQuery && ` for "${locationSearchQuery}"`}
                    </p>
                  </div>

                  {/* Government Events */}
                  {(selectedOpportunityType === 'all' || selectedOpportunityType === 'government') && localOpportunities.governmentEvents.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        🏛️ Government Opportunities ({localOpportunities.governmentEvents.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {localOpportunities.governmentEvents.map(event => (
                          <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold text-gray-900 mb-2">{event.title}</h5>
                            <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                              <p>📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                              <p>📍 {event.location}</p>
                              <p>🏛️ {event.county} • {event.constituency} • {event.ward}</p>
                              <p>👥 {event.currentParticipants}/{event.maxParticipants || '∞'} participants</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRegisterForOpportunity(event)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                              >
                                Register
                              </button>
                              <button
                                onClick={() => handleAddToCalendar(event)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                              >
                                📅 Add to Calendar
                              </button>
                              <a
                                href={`mailto:${event.contact}?subject=Inquiry about ${event.title}&body=Hello, I am interested in learning more about this event.`}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                              >
                                Contact
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community Groups */}
                  {(selectedOpportunityType === 'all' || selectedOpportunityType === 'community') && localOpportunities.communityGroups.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        🤝 Community Groups ({localOpportunities.communityGroups.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {localOpportunities.communityGroups.map(group => (
                          <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold text-gray-900 mb-2">{group.name}</h5>
                            <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                              <p>📍 {group.location}</p>
                              <p>👥 {group.memberCount} members</p>
                              <p>📅 Established: {new Date(group.establishedDate).toLocaleDateString()}</p>
                              <p>🕒 {group.meetingSchedule}</p>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={`mailto:${group.contactEmail}?subject=Interest in joining ${group.name}&body=Hello, I am interested in joining your organization. Please provide me with more information about membership and activities.`}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                              >
                                Join
                              </a>
                              <a
                                href={`tel:${group.contactPhone}`}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                              >
                                Call
                              </a>
                              {group.website && (
                                <a
                                  href={group.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                >
                                  Website
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Volunteer Opportunities */}
                  {(selectedOpportunityType === 'all' || selectedOpportunityType === 'volunteer') && localOpportunities.volunteerOpportunities.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        💼 Volunteer Opportunities ({localOpportunities.volunteerOpportunities.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {localOpportunities.volunteerOpportunities.map(opportunity => (
                          <div key={opportunity.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h5>
                            <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                              <p>🏢 {opportunity.organization}</p>
                              <p>📍 {opportunity.location}</p>
                              <p>⏰ {opportunity.timeCommitment}</p>
                              <p>👥 {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers</p>
                              <p>📅 {new Date(opportunity.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRegisterForOpportunity(opportunity)}
                                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                              >
                                Apply
                              </button>
                              <a
                                href={`mailto:${opportunity.contactEmail}?subject=Volunteer Application - ${opportunity.title}&body=Hello, I am interested in volunteering for this position. Please provide me with more information about the application process.`}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                              >
                                Contact
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Local Events */}
                  {(selectedOpportunityType === 'all' || selectedOpportunityType === 'events') && localOpportunities.localEvents.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        📅 Local Events ({localOpportunities.localEvents.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {localOpportunities.localEvents.map(event => (
                          <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold text-gray-900 mb-2">{event.title}</h5>
                            <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                              <p>📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                              <p>📍 {event.location}</p>
                              <p>🏢 {event.organizer}</p>
                              <p>💰 {event.cost === 'free' ? 'Free' : `KSh ${event.amount}`}</p>
                              <p>👥 {event.currentParticipants}/{event.maxParticipants || '∞'} participants</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRegisterForOpportunity(event)}
                                className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
                              >
                                Register
                              </button>
                              <button
                                onClick={() => handleAddToCalendar(event)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                              >
                                📅 Add to Calendar
                              </button>
                              <a
                                href={`mailto:${event.contactEmail}?subject=Event Inquiry - ${event.title}&body=Hello, I am interested in this event. Please provide me with more information.`}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                              >
                                Contact
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {localOpportunities.totalResults === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No opportunities found for your search criteria.</p>
                      <button
                        onClick={loadLocalOpportunities}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                      >
                        View All Opportunities
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="flex gap-3 justify-center mt-8">
                <button
                  onClick={() => setShowLocalOpportunities(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      {showRegistrationForm && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Register for Opportunity</h3>
              <button 
                onClick={() => {
                  setShowRegistrationForm(false);
                  setSelectedOpportunity(null);
                  setOpportunityRegistrationResult(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedOpportunity.title}</h4>
                <p className="text-sm text-gray-600">{selectedOpportunity.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <p>📍 {selectedOpportunity.location}</p>
                  {selectedOpportunity.date && <p>📅 {new Date(selectedOpportunity.date).toLocaleDateString()}</p>}
                  {selectedOpportunity.time && <p>🕒 {selectedOpportunity.time}</p>}
                </div>
              </div>

              {opportunityRegistrationResult ? (
                <div className={`p-4 rounded-lg ${opportunityRegistrationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {opportunityRegistrationResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className={`font-medium ${opportunityRegistrationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {opportunityRegistrationResult.success ? 'Registration Successful!' : 'Registration Failed'}
                      </p>
                      <p className={`text-sm ${opportunityRegistrationResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {opportunityRegistrationResult.message}
                      </p>
                      {opportunityRegistrationResult.confirmationCode && (
                        <p className="text-sm text-green-600 font-mono mt-1">
                          Confirmation Code: {opportunityRegistrationResult.confirmationCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setShowRegistrationForm(false);
                        setSelectedOpportunity(null);
                        setOpportunityRegistrationResult(null);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      Close
                    </button>
                    {opportunityRegistrationResult.success && (
                      <button
                        onClick={() => {
                          setOpportunityRegistrationResult(null);
                          setRegistrationForm({
                            name: '',
                            email: '',
                            phone: '',
                            idNumber: '',
                            interests: [],
                            availability: '',
                            message: ''
                          });
                        }}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Register Another
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={registrationForm.email}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                      <input
                        type="text"
                        value={registrationForm.idNumber}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, idNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your ID number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      value={registrationForm.availability}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, availability: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select availability</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                    <textarea
                      value={registrationForm.message}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us why you're interested in this opportunity..."
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegistrationForm(false);
                        setSelectedOpportunity(null);
                        setOpportunityRegistrationResult(null);
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Registering...
                        </>
                      ) : (
                        'Submit Registration'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Digital Guide Modal */}
      {showDigitalGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Digital Citizenship Guide</h3>
              <button 
                onClick={() => setShowDigitalGuide(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Download comprehensive resources to help you become a responsible digital citizen and use technology safely and effectively.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🔒 Online Safety Guide</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Password security best practices</li>
                    <li>• Two-factor authentication setup</li>
                    <li>• Recognizing phishing attempts</li>
                    <li>• Safe browsing techniques</li>
                    <li>• Protecting personal information</li>
                  </ul>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm">
                    Download Safety Guide
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">📱 Social Media Handbook</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Responsible social media use</li>
                    <li>• Privacy settings management</li>
                    <li>• Digital etiquette guidelines</li>
                    <li>• Combating misinformation</li>
                    <li>• Building positive communities</li>
                  </ul>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm">
                    Download Handbook
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">⚖️ Digital Rights Guide</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Understanding digital rights</li>
                    <li>• Data protection principles</li>
                    <li>• Freedom of expression online</li>
                    <li>• Digital divide awareness</li>
                    <li>• Advocacy and activism</li>
                  </ul>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm">
                    Download Rights Guide
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">🌐 Digital Engagement Toolkit</h4>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• Online civic participation</li>
                    <li>• Digital advocacy strategies</li>
                    <li>• E-government services</li>
                    <li>• Online petitions and consultations</li>
                    <li>• Technology for social good</li>
                  </ul>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm">
                    Download Toolkit
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-purple-900 mb-3">Complete Digital Citizenship Guide</h4>
                <p className="text-sm text-purple-800 mb-4">
                  Download the complete digital citizenship guide containing all resources in one comprehensive package.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">File size: 12.8 MB</p>
                    <p className="text-sm text-gray-600">Last updated: January 2024</p>
                    <p className="text-sm text-gray-600">Format: PDF with interactive elements</p>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Downloading Complete Digital Citizenship Guide...');
                      setShowDigitalGuide(false);
                    }}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Download Complete Guide
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDigitalGuide(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Literacy Test Modal */}
      {showDigitalLiteracyTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Digital Literacy Test</h3>
              <button 
                onClick={() => {
                  setShowDigitalLiteracyTest(false);
                  setDigitalTestAnswers({});
                  setDigitalTestScore(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {digitalTestScore === null ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Test your digital literacy skills with this comprehensive assessment. Answer all 10 questions to get your score and personalized recommendations.
                  </p>
                  
                  <div className="space-y-6">
                    {digitalLiteracyTest.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={digitalTestAnswers[question.id] === option}
                                onChange={(e) => handleDigitalTestAnswer(question.id, e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-3 text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowDigitalLiteracyTest(false);
                        setDigitalTestAnswers({});
                        setDigitalTestScore(null);
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDigitalTestSubmit}
                      disabled={isTakingTest || Object.keys(digitalTestAnswers).length < digitalLiteracyTest.length}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isTakingTest ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Grading...
                        </>
                      ) : (
                        'Submit Test'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    digitalTestScore >= 80 ? 'bg-green-100' : 
                    digitalTestScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-4xl font-bold ${
                      digitalTestScore >= 80 ? 'text-green-600' : 
                      digitalTestScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {digitalTestScore}%
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {digitalTestScore >= 80 ? 'Excellent Digital Literacy!' : 
                     digitalTestScore >= 60 ? 'Good Digital Literacy' : 'Needs Improvement'}
                  </h4>
                  
                  <p className="text-gray-600 mb-6">
                    {digitalTestScore >= 80 
                      ? 'You have excellent digital literacy skills! You understand online safety, digital rights, and responsible technology use.'
                      : digitalTestScore >= 60
                      ? 'You have good digital literacy skills with room for improvement. Consider reviewing the digital citizenship guide.'
                      : 'Your digital literacy skills need improvement. We recommend downloading the digital citizenship guide and taking this test again.'}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {digitalLiteracyTest.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg text-left">
                        <p className="font-semibold text-gray-900 mb-2">Question {index + 1}: {question.question}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            digitalTestAnswers[question.id] === question.correct 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Your answer: {digitalTestAnswers[question.id] || 'Not answered'}
                          </span>
                          {digitalTestAnswers[question.id] !== question.correct && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              Correct: {question.correct}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => {
                        setDigitalTestScore(null);
                        setDigitalTestAnswers({});
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Retake Test
                    </button>
                    <button 
                      onClick={() => {
                        setShowDigitalLiteracyTest(false);
                        setDigitalTestAnswers({});
                        setDigitalTestScore(null);
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Economic Studies Modal */}
      {showEconomicStudies && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Economic Development Studies</h3>
              <button 
                onClick={() => setShowEconomicStudies(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Comprehensive research on Kenya's economic transformation, growth strategies, and development policies.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {economicStudies.map((study) => (
                  <div key={study.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{study.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">By {study.author}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>📅 {new Date(study.date).toLocaleDateString()}</span>
                          <span>📄 {study.pages} pages</span>
                          <span>💾 {study.fileSize}</span>
                          <span>📥 {study.downloads.toLocaleString()} downloads</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {study.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{study.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResearchPreview(study)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleResearchDownload(study)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Policy Research Modal */}
      {showSocialPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Social Policy Research</h3>
              <button 
                onClick={() => setShowSocialPolicy(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                In-depth analysis of social policies, healthcare, education, and community development initiatives.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {socialPolicyResearch.map((study) => (
                  <div key={study.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{study.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">By {study.author}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>📅 {new Date(study.date).toLocaleDateString()}</span>
                          <span>📄 {study.pages} pages</span>
                          <span>💾 {study.fileSize}</span>
                          <span>📥 {study.downloads.toLocaleString()} downloads</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {study.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{study.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResearchPreview(study)}
                        className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleResearchDownload(study)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environmental Reports Modal */}
      {showEnvironmentalReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Environmental Impact Reports</h3>
              <button 
                onClick={() => setShowEnvironmentalReports(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Research on climate change, environmental protection, and sustainable resource management strategies.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {environmentalReports.map((study) => (
                  <div key={study.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{study.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">By {study.author}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>📅 {new Date(study.date).toLocaleDateString()}</span>
                          <span>📄 {study.pages} pages</span>
                          <span>💾 {study.fileSize}</span>
                          <span>📥 {study.downloads.toLocaleString()} downloads</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {study.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{study.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResearchPreview(study)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleResearchDownload(study)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Governance & Transparency Modal */}
      {showGovernanceTransparency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Governance & Transparency</h3>
              <button 
                onClick={() => setShowGovernanceTransparency(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Research on public administration, corruption prevention, and institutional reform initiatives.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {governanceTransparency.map((study) => (
                  <div key={study.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{study.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">By {study.author}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>📅 {new Date(study.date).toLocaleDateString()}</span>
                          <span>📄 {study.pages} pages</span>
                          <span>💾 {study.fileSize}</span>
                          <span>📥 {study.downloads.toLocaleString()} downloads</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {study.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{study.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResearchPreview(study)}
                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleResearchDownload(study)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Research Preview Modal */}
      {showResearchPreview && selectedResearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">Research Preview</h3>
              <button 
                onClick={() => setShowResearchPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedResearch.title}</h4>
                <p className="text-gray-600 mb-4">By {selectedResearch.author}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>📅 {new Date(selectedResearch.date).toLocaleDateString()}</span>
                  <span>📄 {selectedResearch.pages} pages</span>
                  <span>💾 {selectedResearch.fileSize}</span>
                  <span>📥 {selectedResearch.downloads.toLocaleString()} downloads</span>
                  <span>🌐 {selectedResearch.language}</span>
                </div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedResearch.type}
                </span>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Description</h5>
                <p className="text-gray-700 leading-relaxed">{selectedResearch.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Key Topics</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedResearch.topics.map((topic: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Preview Content</h5>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>
                    <strong>Executive Summary:</strong> This research provides comprehensive analysis and evidence-based recommendations 
                    for policymakers, practitioners, and stakeholders in the field. The study employs rigorous methodology and 
                    data analysis to present actionable insights.
                  </p>
                  <p>
                    <strong>Key Findings:</strong> The research reveals significant trends and patterns that have important 
                    implications for policy development and implementation. Key recommendations focus on sustainable solutions 
                    and evidence-based approaches.
                  </p>
                  <p>
                    <strong>Methodology:</strong> The study utilizes both quantitative and qualitative research methods, 
                    including data analysis, stakeholder interviews, and comprehensive literature review to ensure robust findings.
                  </p>
                  <p className="text-gray-600 italic">
                    This is a preview of the research content. The full document contains detailed analysis, 
                    data visualizations, charts, and comprehensive recommendations.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowResearchPreview(false);
                    handleResearchDownload(selectedResearch);
                  }}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Full Research
                </button>
                <button
                  onClick={() => setShowResearchPreview(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}