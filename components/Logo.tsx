import React from 'react';

export const Logo: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 32 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brandGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" stroke="url(#brandGradient)" strokeWidth="3" strokeLinejoin="round" fill="rgba(6, 182, 212, 0.1)"/>
          <path d="M20 4V20M20 20L4 12M20 20L36 12M20 36V20" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="3" fill="white" />
        </svg>
      </div>
      <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
        Data<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">sys</span>
      </span>
    </div>
  );
};