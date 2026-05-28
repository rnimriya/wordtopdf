import React from 'react';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="relative">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full border-t-primary-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Loading tool...</p>
    </div>
  );
}

export default LoadingSpinner;
