"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Mail, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setSuccess('');
    setError('');
    setDevResetUrl('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request password reset');
      }

      setSuccess(data.message);
      
      // If we are in local testing and a resetUrl is returned, capture it to make test easy
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-primary-600 to-red-500 shadow-lg shadow-primary-500/25 mb-2">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">
            Forgot password?
          </h2>
          <p className="text-xs text-slate-500">
            Enter your email and we'll help you reset your account password.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 md:p-8 space-y-6 shadow-xl border border-slate-200/60 bg-white/70 backdrop-blur-md">
          {error && (
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block font-bold">Request Success!</span>
                  <span>{success}</span>
                </div>
              </div>

              {/* Development testing helper */}
              {devResetUrl && (
                <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 text-slate-700 text-xs space-y-2 animate-in zoom-in-95 duration-200">
                  <span className="block font-bold text-amber-700">🔧 Developer Mock Testing Mode</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Normally, this link is emailed. Click below to reset your password immediately:
                  </p>
                  <Link 
                    href={devResetUrl}
                    className="block text-center py-2 px-3 bg-white hover:bg-slate-50 border border-slate-250 text-primary-600 font-bold rounded-lg transition-colors truncate"
                  >
                    Reset Password Now
                  </Link>
                </div>
              )}

              <Link 
                href="/login" 
                className="block text-center w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full glass-button-primary py-3 flex items-center justify-center space-x-2 text-xs font-bold shadow-md shadow-primary-500/10 group active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending reset request...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Remembered password?{' '}
            <Link 
              href="/login" 
              className="font-bold text-primary-600 hover:text-primary-700 underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
