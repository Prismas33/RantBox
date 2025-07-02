'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BuyCredits from '@/components/BuyCredits';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';

export default function BuyCreditsPage() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-red-500">
            RantBox
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <div className="text-green-400 font-semibold">
                  Credits: {user.credits}
                </div>
                <Link 
                  href="/feed" 
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Feed
                </Link>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {user ? (
          <BuyCredits />
        ) : (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="py-12">
              <div className="text-6xl mb-4">🔐</div>
              <h1 className="text-4xl font-bold mb-4">Sign In Required</h1>
              <p className="text-gray-400 text-lg mb-8">
                You need to sign in to purchase credits and start posting.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-lg font-semibold transition-colors"
              >
                Sign In to Continue
              </button>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">Why Sign Up?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="text-3xl mb-2">💳</div>
                  <h4 className="font-semibold mb-2">Secure Payments</h4>
                  <p className="text-gray-400 text-sm">
                    Your credits are safely stored and ready when you need them
                  </p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-semibold mb-2">Sync Across Devices</h4>
                  <p className="text-gray-400 text-sm">
                    Access your credits from any device, anywhere
                  </p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="text-3xl mb-2">🎭</div>
                  <h4 className="font-semibold mb-2">Stay Anonymous</h4>
                  <p className="text-gray-400 text-sm">
                    Your posts remain anonymous even with an account
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
