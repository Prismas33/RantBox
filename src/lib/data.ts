import { Post, HugMessage } from '../types';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  where,
  limit,
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';

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

export const DataService = {  // Posts
  createPost: async (content: string, type: 'rant' | 'hug' | 'unfiltered', userId?: string): Promise<Post> => {
    try {
      const filteredContent = filterContent(content);
      const newPost = {
        content: filteredContent,
        type,
        timestamp: Timestamp.now(),
        likes: 0,
        reports: 0,
        isReported: false,
        isModerated: false,
        userId: userId || null
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);
      
      return {
        id: docRef.id,
        ...newPost,
        timestamp: newPost.timestamp.toMillis()
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  },  getAllPosts: async (): Promise<Post[]> => {
    try {
      // Simplified query while index is building
      const q = query(
        collection(db, 'posts'), 
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toMillis()
      })) as Post[];
      
      // Filter out moderated posts on client side temporarily
      return posts.filter(post => !post.isModerated);
    } catch (error: any) {
      console.error('Error getting posts:', error);
      
      // If index is not ready, return empty array
      if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
        console.warn('Firestore index is building. Returning empty posts array.');
        return [];
      }
      
      return [];
    }
  },

  getAllPostsAdmin: async (): Promise<Post[]> => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toMillis()
    })) as Post[];
  },

  getPost: async (id: string): Promise<Post | null> => {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        timestamp: docSnap.data().timestamp.toMillis()
      } as Post;
    }
    return null;
  },

  likePost: async (id: string): Promise<boolean> => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        likes: increment(1)
      });
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  },

  reportPost: async (id: string): Promise<boolean> => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        reports: increment(1),
        isReported: true
      });
      return true;
    } catch (error) {
      console.error('Error reporting post:', error);
      return false;
    }
  },

  moderatePost: async (id: string, isModerated: boolean): Promise<boolean> => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        isModerated
      });
      return true;
    } catch (error) {
      console.error('Error moderating post:', error);
      return false;
    }
  },

  // User Credits
  getUserCredits: async (userId: string): Promise<number> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().credits || 0;
    }
    return 0;
  },

  updateUserCredits: async (userId: string, credits: number): Promise<boolean> => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { credits }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating credits:', error);
      return false;
    }
  },

  spendCredit: async (userId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        credits: increment(-1)
      });
      return true;
    } catch (error) {
      console.error('Error spending credit:', error);
      return false;
    }
  },

  // Hugs
  getRandomHugMessage: (): HugMessage => {
    const randomIndex = Math.floor(Math.random() * HUG_MESSAGES.length);
    return HUG_MESSAGES[randomIndex];
  },

  // Admin Statistics
  getAdminStats: async () => {
    const postsQuery = query(collection(db, 'posts'));
    const querySnapshot = await getDocs(postsQuery);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let totalReports = 0;
    let postsToday = 0;
    let reportedPosts = 0;
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalReports += data.reports || 0;
      
      if (data.timestamp.toDate() >= today) {
        postsToday++;
      }
      
      if (data.isReported) {
        reportedPosts++;
      }
    });
    
    return {
      totalPosts: querySnapshot.size,
      totalReports,
      postsToday,
      reportedPosts
    };
  }
};

// Filter offensive content
function filterContent(content: string): string {
  let filteredContent = content;
  
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredContent;
}
