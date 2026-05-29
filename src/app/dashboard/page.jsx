"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Sparkles, Check, Loader2, Cpu, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  const fetchUsage = async () => {
    try {
      setLoadingUsage(true);
      const res = await fetch('/api/usage/check');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check usage');
      setUsage(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load usage statistics.');
    } finally {
      setLoadingUsage(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUsage();
    }
  }, [session]);

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      if (data.url) {
        router.push(data.url);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to redirect to billing management.');
      setLoadingPortal(false);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading dashboard session...</p>
        </div>
      </div>
    );
  }

  const isPro = session?.user?.subscriptionStatus === 'active';
  const limitValue = isPro ? 'Unlimited' : 5;
  const countValue = usage ? usage.count : 0;
  const percentUsed = isPro ? 0 : Math.min(100, (countValue / 5) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      
      {/* Welcome Banner */}
      <section className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="absolute right-0 top-0 w-[40%] h-full opacity-10 bg-radial-gradient from-primary-400 to-transparent pointer-events-none"></div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Hello, {session.user.name || 'User'}!
          </h2>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Welcome to your secure client-side workspace. Convert, annotate, and organize your PDF files with full privacy protection.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-500 to-red-500">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Tier</span>
            <span className="font-display font-extrabold text-sm text-white">
              {isPro ? 'Pro Subscription' : 'Free Account'}
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-sm font-semibold flex items-center gap-3">
          <span>{error}</span>
          <button onClick={fetchUsage} className="text-xs underline font-bold hover:text-rose-700">Retry</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand Card: Usage Progress */}
        <div className="md:col-span-7 glass-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-150 pb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Daily Conversion Meter</h3>
            <button 
              onClick={fetchUsage} 
              disabled={loadingUsage}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-500 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingUsage ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingUsage ? (
            <div className="space-y-4 py-8 animate-pulse text-center">
              <div className="h-2.5 bg-slate-200 rounded-full w-48 mx-auto"></div>
              <div className="h-8 bg-slate-200 rounded-lg w-32 mx-auto"></div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Usage</span>
                <span className="text-3xl font-extrabold tracking-tight font-display text-slate-900 block">
                  {isPro ? 'Unlimited' : `${countValue} / ${limitValue}`}
                </span>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  {isPro 
                    ? "Your Pro plan grants you infinite document operations every single day." 
                    : `You have used ${countValue} of your 5 free registered conversions today. Reset happens at midnight.`
                  }
                </p>
              </div>

              {/* Progress Ring / Bar Visual */}
              {!isPro && (
                <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
                  <svg className="transform -rotate-95 w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="url(#gradient)" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * percentUsed) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e11d48" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-extrabold text-slate-800">{percentUsed.toFixed(0)}%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Used</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upgrade Banner for Free Users */}
          {!isPro && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-indigo-50 border border-slate-100 flex items-start gap-4 shadow-inner">
              <Zap className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs text-slate-900">Out of limits? Go Unlimited.</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upgrade to Pro for $9.99/mo to get unlimited sizes up to 250MB, real client AI chat modules, and multi-file processing pipelines.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 gap-1 pt-1"
                >
                  <span>View Pricing Options</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Hand Card: Settings & Subscription Details */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Subscription and Billing Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 border-b border-slate-150 pb-3">
              Subscription & Billing
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-medium text-slate-650">
                <span>Account Email:</span>
                <span className="font-bold text-slate-850">{session.user.email}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-650">
                <span>Plan Level:</span>
                <span className="font-bold text-slate-850 uppercase tracking-wider">{isPro ? 'Pro Sub' : 'Free Registered'}</span>
              </div>
              
              {isPro && session.user.stripePriceId && (
                <div className="flex justify-between text-xs font-medium text-slate-650">
                  <span>Price ID Type:</span>
                  <span className="font-bold text-slate-850 truncate max-w-[150px]">{session.user.stripePriceId}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleManageBilling}
              disabled={loadingPortal}
              className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loadingPortal ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading Stripe...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>{isPro ? 'Manage Payment Setup' : 'Activate Pro Subscription'}</span>
                </>
              )}
            </button>
          </div>

          {/* Secure compliance badge */}
          <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-700 text-xs font-medium flex items-start gap-3">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="block font-bold">HIPAA & GDPR Sandbox Compliant</span>
              <p className="text-[10px] text-emerald-600/80 leading-relaxed">
                Word To PDF executes WebAssembly operations inside your local client sandboxed environment. Your files are not captured or mirrored.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
