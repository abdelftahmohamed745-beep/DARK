import { PortfolioItem } from '../types';

// Default portfolio data is empty as projects are dynamically loaded from Firestore
export const portfolioData: PortfolioItem[] = [];

export const CATEGORIES_MAP: Record<string, string> = {
  social: 'Social Media',
  branding: 'Branding',
  posters: 'Posters',
  logo: 'Logo Design',
};
