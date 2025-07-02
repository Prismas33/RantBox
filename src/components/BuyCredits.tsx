'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CREDIT_PACKAGES, formatPrice, getCreditValue } from '@/lib/pricing';
import toast from 'react-hot-toast';

export default function BuyCredits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      toast.error('Please sign in to purchase credits');
      return;
    }

    setLoading(packageId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          userId: user.uid,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Buy Credits</h1>
        <p className="text-gray-400 text-lg">
          Each credit lets you post one message. Choose your package below.
        </p>
        {user && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg inline-block">
            <p className="text-green-400 font-semibold">
              Current Credits: {user.credits}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative p-6 rounded-xl border-2 bg-gray-900 transition-all hover:scale-105 ${
              pkg.popular
                ? 'border-red-500 bg-red-950'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {formatPrice(pkg.price)}
              </div>
              <div className="text-gray-400 mb-4">
                {pkg.credits} credits
              </div>
              <div className="text-sm text-gray-500 mb-6">
                {getCreditValue(pkg)}
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading === pkg.id || !user}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  pkg.popular
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === pkg.id ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold mb-4">Why Buy Credits?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold mb-2">Better Value</h4>
            <p className="text-gray-400 text-sm">
              Bulk packages offer better value than individual posts
            </p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="font-semibold mb-2">Instant Posts</h4>
            <p className="text-gray-400 text-sm">
              No payment friction - just post when inspiration strikes
            </p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">🔐</div>
            <h4 className="font-semibold mb-2">Secure & Private</h4>
            <p className="text-gray-400 text-sm">
              Your posts remain anonymous, credits are tied to your account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
