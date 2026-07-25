export type PortfolioCategory = 'all' | 'social' | 'branding' | 'posters' | 'logo';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'social' | 'branding' | 'posters' | 'logo';
  categoryLabel?: string;
  image: string;
  images?: string[];
  description: string;
  client?: string;
  year?: string;
  tools?: string[];
  features?: string[];
  published?: boolean;
  order?: number;
  createdAt?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating?: number;
  imageUrl?: string;
  status?: 'published' | 'draft';
  createdAt?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleAr?: string;
  iconName: string;
  shortDesc: string;
  features: string[];
  popular?: boolean;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeText: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  logoStyle?: string;
  message: string;
}

export interface LogoStyleOption {
  id: string;
  label: string;
  labelAr: string;
  desc: string;
}

export interface OrderRequest {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  serviceType: string;
  logoStyle?: string;
  quantity?: number;
  expressDelivery?: boolean;
  includeSourceFiles?: boolean;
  notes?: string;
  status?: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt?: number;
}
