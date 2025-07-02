'use client';

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { Post } from '@/types';
import Link from 'next/link';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await DataService.getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLike = async (postId: string) => {
    await DataService.likePost(postId);
    loadPosts();
  };

  const handleReport = async (postId: string) => {
    if (confirm('Are you sure you want to report this post?')) {
      await DataService.reportPost(postId);
      loadPosts();
    }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    alert('Post link copied to clipboard!');
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'rant':
        return 'border-red-700 bg-red-950';
      case 'hug':
        return 'border-blue-700 bg-blue-950';
      case 'unfiltered':
        return 'border-purple-700 bg-purple-950';
      default:
        return 'border-gray-700 bg-gray-950';
    }
  };

  const getPostTypeEmoji = (type: string) => {
    switch (type) {
      case 'rant':
        return '😤';
      case 'hug':
        return '🤗';
      case 'unfiltered':
        return '🔥';
      default:
        return '💬';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 sticky top-0 bg-black z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-red-500">
            RantBox
          </Link>
          <div className="flex gap-4">
            <button
              onClick={loadPosts}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
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
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Public Feed</h1>
          <p className="text-gray-400">Anonymous posts from the community</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="text-gray-400 mt-2">Loading posts...</p>
          </div>
        )}

        {/* Posts */}
        {!isLoading && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📭</div>
                <p>No posts yet. Be the first to share something!</p>
                <Link 
                  href="/" 
                  className="mt-4 inline-block px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Create a post
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-6 rounded-xl border-2 ${getPostTypeColor(post.type)} hover:border-opacity-80 transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getPostTypeEmoji(post.type)}</span>
                      <span className="text-sm text-gray-400 capitalize">
                        {post.type}
                      </span>
                      {post.isReported && (
                        <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">
                          Reported
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(post.timestamp)}
                    </span>
                  </div>

                  <p className="text-lg mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        🔥 {post.likes}
                      </button>
                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        📤 Share
                      </button>
                    </div>
                    <button
                      onClick={() => handleReport(post.id)}
                      className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                    >
                      ⚠️ Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Post Button */}
        <div className="fixed bottom-6 right-6">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-lg transition-colors"
          >
            <span className="text-2xl">✍️</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
