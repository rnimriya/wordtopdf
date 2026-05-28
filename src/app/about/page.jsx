"use client";

import React from 'react';
import { Cpu, ShieldCheck, Heart, Users } from 'lucide-react';

function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-display">
          About Word To PDF Convertor
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          We build modern, serverless document processing tools designed to protect user privacy.
        </p>
      </div>

      {/* Main Content */}
      <div className="glass-card p-8 md:p-12 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-display">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed">
            Conventional web services monetize user documents by forcing network uploads to remote cloud servers. This exposes corporate transactions, tax records, and medical files to data leak vulnerabilities and privacy violations.
          </p>
          <p className="text-slate-400 leading-relaxed">
            At **Word To PDF Convertor**, we believe document processing should be safe and local. By leveraging cutting-edge web technologies like WebAssembly, HTML5 canvas, and local worker sandboxes, we compile and encrypt files directly in the browser. Your files never touch a server, ensuring absolute privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="flex items-start space-x-4 p-5 border border-slate-800 bg-slate-950/20 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-primary-500 border border-indigo-500/20 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Security-First Focus</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Comply with organizational regulations like HIPAA and GDPR. Every byte is processed within your local sandbox.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-5 border border-slate-800 bg-slate-950/20 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-secondary-500 border border-emerald-500/20 shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">WebAssembly Speed</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Run binary compilation algorithms directly on your computer's hardware threads for lightning-fast speeds.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-850 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500" /> Proudly built with developer freedom in mind.</span>
          <span className="mt-2 sm:mt-0 flex items-center gap-1.5"><Users className="h-4 w-4 text-primary-500" /> Used globally by privacy-conscious professionals.</span>
        </div>
      </div>

    </div>
  );
}

export default About;
