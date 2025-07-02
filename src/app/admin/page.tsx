'use client';

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { Post, AdminStats } from '@/types';
import Link from 'next/link';

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'reported' | 'moderated'>('all');

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setIsLoading(true);
    try {
      const allPosts = await DataService.getAllPostsAdmin();
      const adminStats = await DataService.getAdminStats();
      setPosts(allPosts);
      setStats(adminStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = (postId: string, isModerated: boolean) => {
    DataService.moderatePost(postId, isModerated);
    loadData();
  };

  const getFilteredPosts = () => {
    switch (filter) {
      case 'reported':
        return posts.filter(post => post.isReported);
      case 'moderated':
        return posts.filter(post => post.isModerated);
      default:
        return posts;
    }
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
    return new Date(timestamp).toLocaleString();
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 sticky top-0 bg-black z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-red-500">
            RantBox Admin
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/feed" 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Public Feed
            </Link>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-1">Total Posts</h3>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-1">Posts Today</h3>
              <p className="text-2xl font-bold text-green-400">{stats.postsToday}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-1">Reported Posts</h3>
              <p className="text-2xl font-bold text-yellow-400">{stats.reportedPosts}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-1">Total Reports</h3>
              <p className="text-2xl font-bold text-red-400">{stats.totalReports}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button
              onClick={() => setFilter('reported')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'reported' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Reported ({posts.filter(p => p.isReported).length})
            </button>
            <button
              onClick={() => setFilter('moderated')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'moderated' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Moderated ({posts.filter(p => p.isModerated).length})
            </button>
          </div>
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📭</div>
                <p>No posts found for the selected filter.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`p-6 rounded-xl border-2 ${getPostTypeColor(post.type)} ${
                    post.isModerated ? 'opacity-50' : ''
                  } hover:border-opacity-80 transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getPostTypeEmoji(post.type)}</span>
                      <span className="text-sm text-gray-400 capitalize">
                        {post.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {post.id}
                      </span>
                      {post.isReported && (
                        <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">
                          Reported ({post.reports})
                        </span>
                      )}
                      {post.isModerated && (
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                          Moderated
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(post.timestamp)}
                      </div>
                      <div className="text-sm text-gray-400">
                        🔥 {post.likes} likes
                      </div>
                    </div>
                  </div>

                  <p className="text-lg mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {!post.isModerated ? (
                        <button
                          onClick={() => handleModerate(post.id, true)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                        >
                          🚫 Hide Post
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(post.id, false)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                        >
                          ✅ Restore Post
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      Characters: {post.content.length}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
