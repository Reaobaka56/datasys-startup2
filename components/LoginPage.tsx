import React, { useState } from 'react';
import { User } from '../types';
import { Logo } from './Logo';
import { ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ email: email, name: email.split('@')[0] || 'User' });
    }, 1000);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-4 transition-colors duration-300 ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      
      <button 
        onClick={onBack} 
        className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
            <Logo size={48} className="mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                required
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-brand hover:shadow-lg hover:shadow-cyan-500/30 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>

        <div className="text-center mt-8">
            <button onClick={toggleDarkMode} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                Switch to {darkMode ? 'Light' : 'Dark'} Mode
            </button>
        </div>
      </div>
    </div>
  );
};