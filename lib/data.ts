import { Post, HugMessage } from '../types';

// Banned words filter
const BANNED_WORDS = [
  // Common names
  'john', 'mary', 'charles', 'anna', 'peter', 'richard', 'teresa',
  // Offensive content
  'nigger', 'faggot', 'retard', 'bitch', 'asshole',
  // Threats
  'kill', 'die', 'suicide', 'bomb', 'violence'
];

// Predefined hug messages
export const HUG_MESSAGES: HugMessage[] = [
  { id: '1', message: 'Everything will be okay. Take a deep breath and believe in yourself! 🤗' },
  { id: '2', message: 'You\'re going through a tough time, but you\'re stronger than you think! 💪' },
  { id: '3', message: 'Today might not be your day, but tomorrow is a new opportunity! ✨' },
  { id: '4', message: 'Remember: even the strongest storms eventually pass! 🌈' },
  { id: '5', message: 'You are unique and worth so much! Don\'t let anyone tell you otherwise! ❤️' },
  { id: '6', message: 'A big virtual hug for you! You deserve all the happiness! 🫂' },
  { id: '7', message: 'Bad days also help us appreciate the good ones that will come! 🌅' },
  { id: '8', message: 'It\'s okay to feel this way. You\'re human and that\'s normal! 🌸' }
];

// Simulate in-memory database
let posts: Post[] = [];
let postIdCounter = 1;

export const DataService = {
  // Posts
  createPost: (content: string, type: 'rant' | 'hug' | 'unfiltered'): Post => {
    const newPost: Post = {
      id: String(postIdCounter++),
      content: filterContent(content),
      type,
      timestamp: Date.now(),
      likes: 0,
      reports: 0,
      isReported: false,
      isModerated: false
    };
    posts.unshift(newPost); // Add at beginning (most recent first)
    return newPost;
  },

  getAllPosts: (): Post[] => {
    return posts.filter(post => !post.isModerated);
  },

  getAllPostsAdmin: (): Post[] => {
    return posts;
  },

  getPost: (id: string): Post | undefined => {
    return posts.find(post => post.id === id);
  },

  likePost: (id: string): boolean => {
    const post = posts.find(p => p.id === id);
    if (post) {
      post.likes++;
      return true;
    }
    return false;
  },

  reportPost: (id: string): boolean => {
    const post = posts.find(p => p.id === id);
    if (post) {
      post.reports++;
      post.isReported = true;
      return true;
    }
    return false;
  },

  moderatePost: (id: string, isModerated: boolean): boolean => {
    const post = posts.find(p => p.id === id);
    if (post) {
      post.isModerated = isModerated;
      return true;
    }
    return false;
  },

  // Hugs
  getRandomHugMessage: (): HugMessage => {
    const randomIndex = Math.floor(Math.random() * HUG_MESSAGES.length);
    return HUG_MESSAGES[randomIndex];
  },

  // Admin Statistics
  getAdminStats: () => {
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);
    
    return {
      totalPosts: posts.length,
      totalReports: posts.reduce((sum, post) => sum + post.reports, 0),
      postsToday: posts.filter(post => post.timestamp >= today).length,
      reportedPosts: posts.filter(post => post.isReported).length
    };
  }
};

// Filter offensive content
function filterContent(content: string): string {
  let filteredContent = content.toLowerCase();
  
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredContent;
}

// Initial data for demonstration
posts = [
  {
    id: '1',
    content: 'I\'m so fed up with this situation at work! The boss only knows how to order around and never recognizes our effort!',
    type: 'rant',
    timestamp: Date.now() - 120000,
    likes: 15,
    reports: 0,
    isReported: false,
    isModerated: false
  },
  {
    id: '2',
    content: 'I woke up today with incredible energy! Thank you life for another day!',
    type: 'hug',
    timestamp: Date.now() - 300000,
    likes: 8,
    reports: 0,
    isReported: false,
    isModerated: false
  },
  {
    id: '3',
    content: 'This society is rotten! Nobody cares about anything or anyone!',
    type: 'unfiltered',
    timestamp: Date.now() - 600000,
    likes: 23,
    reports: 2,
    isReported: true,
    isModerated: false
  }
];

postIdCounter = 4;
