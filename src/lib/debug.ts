import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export const debugFirebase = async () => {
  console.log('🔍 Firebase Debug Information:');
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  
  try {
    // Test Firestore connection
    console.log('🔥 Testing Firestore connection...');
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    console.log('✅ Firestore connection successful');
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
  }
};

// Call debug function if in development
if (process.env.NODE_ENV === 'development') {
  debugFirebase();
}
