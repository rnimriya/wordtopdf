"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Lock, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Missing token. Please request a new reset link.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(data.message);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>Invalid or missing reset token.</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed text-center">
          The link you followed is invalid or has expired. Please request a new password reset link.
        </p>
        <Link 
          href="/forgot-password" 
          className="block text-center w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
        >
          Request Reset Link
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-xs font-medium flex items-start gap-2.5 text-left animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block font-bold">Success!</span>
              <span>{success}</span>
            </div>
          </div>
          
          <Link 
            href="/login" 
            className="block text-center w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary-500/10"
          >
            Sign In with New Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-700">New Password</label>
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
                placeholder="At least 8 characters"
                className="glass-input text-xs pl-10 pr-4 py-3 bg-white"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="glass-input text-xs pl-10 pr-4 py-3 bg-white"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full glass-button-primary py-3 flex items-center justify-center space-x-2 text-xs font-bold shadow-md shadow-primary-500/10 group active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Resetting password...</span>
              </>
            ) : (
              <>
                <span>Change Password</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-primary-600 to-red-500 shadow-lg shadow-primary-500/25 mb-2">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">
            Reset password
          </h2>
          <p className="text-xs text-slate-500">
            Type and confirm a strong, secure new password for your account.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 md:p-8 space-y-6 shadow-xl border border-slate-200/60 bg-white/70 backdrop-blur-md">
          {/* Suspense is required for useSearchParams inside App Router */}
          <Suspense fallback={
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto mb-2" />
              <span className="text-xs text-slate-500">Loading reset token...</span>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Return to{' '}
            <Link 
              href="/login" 
              className="font-bold text-primary-600 hover:text-primary-700 underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
