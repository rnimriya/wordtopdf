import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowRight } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-red-50 p-6 rounded-full inline-block mb-4">
        <FileQuestion className="h-16 w-16 text-[#E74C3C]" strokeWidth={1.5} />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
          Whoops! It looks like the PDF tool you are looking for doesn't exist, was moved, or the link is broken.
        </p>
      </div>

      <div className="pt-4">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bg-[#E74C3C] hover:bg-[#D43B2B] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
