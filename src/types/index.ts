export type PostType = 'rant' | 'hug' | 'unfiltered';

export interface Post {
  id: string;
  content: string;
  type: PostType;
  timestamp: number;
  likes: number;
  reports: number;
  isReported: boolean;
  isModerated: boolean;
  userId?: string | null; // Optional for anonymous posts
}

export interface HugMessage {
  id: string;
  message: string;
}

export interface AdminStats {
  totalPosts: number;
  totalReports: number;
  postsToday: number;
  reportedPosts: number;
}

export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  credits: number;
  isAdmin: boolean;
  createdAt: number;
  lastLoginAt: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  popular?: boolean;
}

export interface PaymentSession {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  stripeSessionId?: string;
  createdAt: number;
}
