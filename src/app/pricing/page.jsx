"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Sparkles, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState('monthly'); // 'monthly' or 'yearly'
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [error, setError] = useState('');

  // Example Stripe price IDs (mock or real configured in env)
  const priceIds = {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_mock_monthly_999',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_mock_yearly_7999',
  };

  const handleSubscribe = async (priceId) => {
    if (!session) {
      // Redirect to sign up first so customer mapping is correct
      router.push(`/signup?redirect=pricing`);
      return;
    }

    setLoadingPriceId(priceId);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      if (data.url) {
        router.push(data.url);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoadingPriceId(null);
    }
  };

  const plans = [
    {
      name: 'Free (Guest)',
      price: '$0',
      description: 'Quick local conversions without signing up.',
      features: [
        '3 conversions per day',
        'Up to 10 MB file sizes',
        'Local browser Wasm processing',
        'Basic tools (Merge, Rotate, Split)',
        'No server uploads',
      ],
      buttonText: 'Start Converting',
      buttonHref: '/',
      isPopular: false,
    },
    {
      name: 'Free (Registered)',
      price: '$0',
      description: 'Create an account for slightly higher daily limits.',
      features: [
        '5 conversions per day',
        'Up to 20 MB file sizes',
        'Conversion history log',
        'Priority client-side queues',
        'Requires free signup',
      ],
      buttonText: session ? 'Already Signed Up' : 'Create Free Account',
      buttonHref: session ? '/dashboard' : '/signup',
      isPopular: false,
    },
    {
      name: 'Pro Subscription',
      price: billingInterval === 'monthly' ? '$9.99' : '$6.66',
      billingPeriod: billingInterval === 'monthly' ? '/ month' : '/ month, billed yearly',
      description: 'Access advanced utilities, bulk scaling, and real AI tools.',
      features: [
        'Unlimited daily conversions',
        'Up to 250 MB file sizes',
        'Access to Pro tools (PDF OCR)',
        'Functional AI Chat & Summarization',
        'Dedicated high-speed conversion',
        'Priority email customer support',
      ],
      buttonText: session?.user?.subscriptionStatus === 'active' ? 'Manage Billing' : 'Upgrade to Pro',
      onClick: () => handleSubscribe(billingInterval === 'monthly' ? priceIds.monthly : priceIds.yearly),
      isPopular: true,
      priceId: billingInterval === 'monthly' ? priceIds.monthly : priceIds.yearly,
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900 leading-tight">
          Flexible Plans for <br />
          <span className="bg-gradient-to-r from-primary-600 via-red-500 to-primary-500 bg-clip-text text-transparent">Every Document Need</span>
        </h1>
        <p className="text-sm md:text-base text-slate-650 leading-relaxed">
          Unlock unlimited conversions, larger file capacities, advanced local OCR, and integrated AI assistant chat nodes.
        </p>

        {/* Interval Selector Toggle */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner mt-4">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              billingInterval === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center space-x-1 ${
              billingInterval === 'yearly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Yearly Billing</span>
            <span className="text-[9px] bg-red-100 text-red-650 px-1.5 py-0.5 rounded-md font-bold scale-95">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-sm font-semibold max-w-lg mx-auto flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan, idx) => (
          <article
            key={plan.name}
            className={`relative flex flex-col justify-between p-6 md:p-8 rounded-2xl border transition-all duration-300 bg-white ${
              plan.isPopular
                ? 'border-primary-400 ring-2 ring-primary-500/10 shadow-xl shadow-primary-500/5 -translate-y-2 hover:-translate-y-3'
                : 'border-slate-200 hover:border-slate-350 hover:shadow-lg hover:-translate-y-1 shadow-sm'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1 select-none">
                <Sparkles className="h-3 w-3" />
                <span>Best Value</span>
              </span>
            )}

            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900">{plan.name}</h3>
              <p className="text-xs text-slate-500 mt-2 min-h-[32px]">{plan.description}</p>

              {/* Price Details */}
              <div className="mt-5 flex items-baseline text-slate-900 border-b border-slate-150 pb-5">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">{plan.price}</span>
                <span className="ml-1 text-xs text-slate-500 font-medium">{plan.billingPeriod || ''}</span>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mr-3 border border-emerald-150">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-650 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-8">
              {plan.onClick ? (
                <button
                  onClick={plan.onClick}
                  disabled={loadingPriceId !== null}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    plan.isPopular
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/15'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                  } disabled:opacity-50`}
                >
                  {loadingPriceId === plan.priceId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={plan.buttonHref || '/'}
                  className="block text-center w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors"
                >
                  {plan.buttonText}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Trust Copy */}
      <section className="bg-slate-50/60 border border-slate-200/70 p-6 rounded-2xl text-center max-w-4xl mx-auto space-y-3">
        <h3 className="font-display font-bold text-slate-900 text-base">Zero-Risk Client-Side Sandboxing</h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Regardless of the plan, all PDF conversions continue to run locally inside your browser memory cache. We do not upload your documents to servers for conversion, ensuring absolute privacy compliance.
        </p>
      </section>

    </div>
  );
}
