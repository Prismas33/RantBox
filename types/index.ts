export interface Post {
  id: string;
  content: string;
  type: 'rant' | 'hug' | 'unfiltered';
  timestamp: number;
  likes: number;
  reports: number;
  isReported: boolean;
  isModerated: boolean;
}

export interface HugMessage {
  id: string;
  message: string;
}

export type PostType = 'rant' | 'hug' | 'unfiltered';

export interface AdminStats {
  totalPosts: number;
  totalReports: number;
  postsToday: number;
  reportedPosts: number;
}
