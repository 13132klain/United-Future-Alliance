
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'rally' | 'meeting' | 'webinar' | 'fundraiser';
  image?: string;
  registrationRequired: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  image?: string;
  category: string;
}

export interface Leader {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'article' | 'report' | 'image' | 'presentation' | 'spreadsheet';
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  category: string;
  publishDate: Date;
  uploadedBy: string;
  downloadCount?: number;
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  category: string;
  endDate: Date;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  isAnonymous: boolean;
  campaign?: string;
  message?: string;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  image?: string;
  category: 'general' | 'education' | 'healthcare' | 'infrastructure' | 'emergency';
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface Membership {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  county: string;
  constituency: string;
  ward?: string;
  occupation: string;
  organization?: string;
  interests: string[];
  motivation: string;
  howDidYouHear: string;
  isVolunteer: boolean;
  volunteerAreas?: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export type NavigationPage = 'home' | 'about' | 'events' | 'community' | 'resources' | 'leadership' | 'donate' | 'membership' | 'login' | 'register' | 'admin' | 'profile';