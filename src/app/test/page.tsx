'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing Firebase connection...');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('Testing Firebase connection...');
        
        // Try to get posts from Firestore
        const postsRef = collection(db, 'posts');
        const snapshot = await getDocs(postsRef);
        
        console.log('Firestore query successful!');
        setStatus('✅ Firebase connection successful!');
        
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(postsData);
        console.log('Posts loaded:', postsData.length);
          } catch (error) {
        console.error('Firebase connection error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setStatus(`❌ Firebase connection failed: ${errorMessage}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Firebase Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">Connection Status:</h2>
        <p className="text-lg">{status}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Posts Count:</h2>
        <p className="text-lg">{posts.length} posts found</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Environment Variables:</h2>
        <ul className="space-y-2">
          <li>Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>Firebase Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</li>
          <li>Firebase Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
          <li>Firebase Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}</li>
          <li>Firebase Messaging Sender ID: {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'}</li>
          <li>Firebase App ID: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>

      {posts.length > 0 && (
        <div>
          <h2 className="text-xl mb-4">Recent Posts:</h2>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="bg-gray-800 p-4 rounded">
                <p className="text-sm text-gray-400">ID: {post.id}</p>
                <p className="text-sm text-gray-400">Type: {post.type}</p>
                <p className="text-sm text-gray-400">Timestamp: {post.timestamp?.seconds ? new Date(post.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
                <p className="mt-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
