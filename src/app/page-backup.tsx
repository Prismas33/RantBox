'use client';

import { useState } from 'react';
import { DataService } from '@/lib/data';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'rant' | 'hug' | 'unfiltered' | null>(null);
  const [content, setContent] = useState('');
  const [hugMessage, setHugMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (type: 'rant' | 'hug' | 'unfiltered') => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await DataService.createPost(content, type);
      
      setContent('');
      setShowSuccess(true);
      setActiveTab(null);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRandomHug = () => {
    const randomHug = DataService.getRandomHugMessage();
    setHugMessage(randomHug.message);
    setContent(randomHug.message);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-500">RantBox</h1>
          <div className="flex gap-4">
            <Link 
              href="/feed" 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Public Feed
            </Link>
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg text-center">
            <p className="text-green-300">Your post has been published! 🎉</p>
          </div>
        )}

        {/* Main Buttons */}
        {!activeTab && (
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold mb-12">
              What do you need right now?
            </h2>
            
            <div className="grid gap-6 max-w-2xl mx-auto">
              {/* Rant Button */}
              <button
                onClick={() => setActiveTab('rant')}
                className="group p-8 bg-red-900 hover:bg-red-800 border-2 border-red-700 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">😤</div>
                <h3 className="text-2xl font-bold mb-2">Release the Rage</h3>
                <p className="text-gray-300">Get it all out. No judgment here.</p>
              </button>

              {/* Hug Button */}
              <button
                onClick={() => setActiveTab('hug')}
                className="group p-8 bg-blue-900 hover:bg-blue-800 border-2 border-blue-700 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">🤗</div>
                <h3 className="text-2xl font-bold mb-2">Give Me a Hug</h3>
                <p className="text-gray-300">Need some love? We got you.</p>
              </button>

              {/* Unfiltered Button */}
              <button
                onClick={() => setActiveTab('unfiltered')}
                className="group p-8 bg-purple-900 hover:bg-purple-800 border-2 border-purple-700 rounded-xl transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold mb-2">Be Savage</h3>
                <p className="text-gray-300">Go wild. No names though.</p>
                <p className="text-gray-400 text-sm mt-2">⚠️ Anything goes, except names</p>
              </button>
            </div>
          </div>
        )}

        {/* Rant Form */}
        {activeTab === 'rant' && (
          <div className="max-w-2xl mx-auto bg-red-950 p-6 rounded-xl border border-red-800">
            <h3 className="text-2xl font-bold mb-4 text-red-400">Let it all out!</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's pissing you off? Type it all here..."
              className="w-full h-40 p-4 bg-black border border-red-700 rounded-lg resize-none text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">{content.length}/500</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit('rant')}
                  disabled={!content.trim() || isSubmitting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Posting...' : 'Let it rip! 🔥'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hug Form */}
        {activeTab === 'hug' && (
          <div className="max-w-2xl mx-auto bg-blue-950 p-6 rounded-xl border border-blue-800">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Spread some love!</h3>
            
            <div className="mb-6">
              <button
                onClick={getRandomHug}
                className="w-full p-4 bg-blue-900 hover:bg-blue-800 border border-blue-700 rounded-lg transition-colors"
              >
                🎲 Get a random hug message
              </button>
            </div>

            {hugMessage && (
              <div className="mb-4 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <p className="text-blue-200">{hugMessage}</p>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Or write your own positive message..."
              className="w-full h-32 p-4 bg-black border border-blue-700 rounded-lg resize-none text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              maxLength={500}
            />

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">{content.length}/500</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit('hug')}
                  disabled={!content.trim() || isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Send hugs! 🤗'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unfiltered Form */}
        {activeTab === 'unfiltered' && (
          <div className="max-w-2xl mx-auto bg-purple-950 p-6 rounded-xl border border-purple-800">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">No filter zone!</h3>
            <div className="mb-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⚠️ <strong>Warning:</strong> This is the unfiltered zone. Say whatever you want, but NO NAMES allowed.
              </p>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Go completely wild here... but remember, no names!"
              className="w-full h-40 p-4 bg-black border border-purple-700 rounded-lg resize-none text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">{content.length}/500</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit('unfiltered')}
                  disabled={!content.trim() || isSubmitting}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Posting...' : 'Go savage! 💀'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
