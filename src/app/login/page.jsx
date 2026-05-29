"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Invalid credentials');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-primary-600 to-red-500 shadow-lg shadow-primary-500/25 mb-2">
            <Cpu className="h-6 w-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">
            Welcome back to <span className="bg-gradient-to-r from-primary-600 to-red-500 bg-clip-text text-transparent">Word To PDF</span>
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your dashboard, usage logs, and Pro tools.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 md:p-8 space-y-6 shadow-xl border border-slate-200/60 bg-white/70 backdrop-blur-md">
          {error && (
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="glass-input text-xs pl-10 pr-4 py-3 bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input text-xs pl-10 pr-4 py-3 bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary py-3 flex items-center justify-center space-x-2 text-xs font-bold shadow-md shadow-primary-500/10 group active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="font-bold text-primary-600 hover:text-primary-700 underline transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
