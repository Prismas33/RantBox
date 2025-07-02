'use client';

import { useState, useEffect } from 'react';
import { DataService } from '@/lib/data';
import { Post } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string);
    }
  }, [params.id]);
  const loadPost = async (postId: string) => {
    setIsLoading(true);
    try {
      const foundPost = await DataService.getPost(postId);
      if (foundPost && !foundPost.isModerated) {
        setPost(foundPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLike = async () => {
    if (post) {
      await DataService.likePost(post.id);
      loadPost(post.id);
    }
  };

  const handleReport = async () => {
    if (post && confirm('Are you sure you want to report this post?')) {
      await DataService.reportPost(post.id);
      loadPost(post.id);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
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
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-red-500">
            RantBox
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/feed" 
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Back to Feed
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="text-gray-400 mt-2">Loading post...</p>
          </div>
        )}

        {/* Not Found */}
        {notFound && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>            <p className="text-gray-400 mb-6">
              This post does not exist or has been removed.
            </p>
            <Link 
              href="/feed" 
              className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
            >
              Back to Feed
            </Link>
          </div>
        )}

        {/* Post */}
        {post && !isLoading && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-400 mb-2">Shared Post</h1>
              <p className="text-gray-500">Anonymous post from RantBox</p>
            </div>

            <div
              className={`p-8 rounded-xl border-2 ${getPostTypeColor(post.type)} hover:border-opacity-80 transition-all`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getPostTypeEmoji(post.type)}</span>
                  <div>
                    <span className="text-lg text-gray-300 capitalize block">
                      {post.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(post.timestamp)}
                    </span>
                  </div>
                  {post.isReported && (
                    <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">
                      Reported
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xl mb-6 leading-relaxed">{post.content}</p>

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    🔥 {post.likes}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    📤 Share
                  </button>
                </div>
                <button
                  onClick={handleReport}
                  className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                >
                  ⚠️ Report
                </button>
              </div>
            </div>

            {/* Related Actions */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Want to share your thoughts too?</h3>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Create Your Own Post
                </Link>
                <Link
                  href="/feed"
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  See More Posts
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
