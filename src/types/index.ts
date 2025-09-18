
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
  type: 'document' | 'video' | 'article' | 'report';
  url: string;
  category: string;
  publishDate: Date;
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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export type NavigationPage = 'home' | 'about' | 'events' | 'community' | 'resources' | 'leadership' | 'donate' | 'login' | 'register' | 'admin';