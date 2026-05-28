import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-display">
          Contact Us
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Have questions or feedback? Drop us a line and we'll reply as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info (5 Cols) */}
        <div className="md:col-span-5 glass-card p-6 md:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-slate-800 pb-4">
            Support Info
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-slate-300">
              <Mail className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-white">Email Address</h4>
                <a href="mailto:contact@wordtopdfconvertor.in" className="text-xs text-slate-400 hover:text-white transition-colors">
                  contact@wordtopdfconvertor.in
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-slate-300">
              <MessageSquare className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-white">FAQ Help</h4>
                <p className="text-xs text-slate-400">
                  Read page bottom sections for helpful step-by-step documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <form onSubmit={handleSubmit} className="md:col-span-7 glass-card p-6 md:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-slate-800 pb-4">
            Send Message
          </h3>

          {submitted ? (
            <div className="p-6 text-center space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 animate-in zoom-in-95 duration-200">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 w-fit mx-auto border border-emerald-500/20">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-white text-md">Message Sent!</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Thank you for contacting us. We'll review your inquiry and get back to you shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="John Doe"
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="john@example.com"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter your inquiry..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !message}
                className="w-full glass-button-primary flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
                <span>Send Message</span>
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}

export default Contact;
