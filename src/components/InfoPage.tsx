import React, { useEffect } from 'react';
import { PageType } from '../types';
import { Logo } from './Logo';
import { ArrowLeft, CheckCircle, Shield, Globe, Users, FileText, Server, Code, Sun, Moon } from 'lucide-react';

interface InfoPageProps {
  page: PageType;
  onNavigate: (page: PageType) => void;
  onLogin: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Content dictionary
const PAGE_CONTENT: Record<string, { title: string; icon: any; subtitle: string; content: React.ReactNode }> = {
  features: {
    title: "Features",
    icon: <CheckCircle className="w-8 h-8 text-cyan-500" />,
    subtitle: "Everything you need to analyze data.",
    content: (
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <h3 className="font-bold text-xl mb-2">Local Processing</h3>
          <p className="text-gray-600 dark:text-gray-400">Process files up to 2GB directly in your browser using WebAssembly and WebWorkers.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <h3 className="font-bold text-xl mb-2">Auto-Visualization</h3>
          <p className="text-gray-600 dark:text-gray-400">Instantly generate Line, Bar, Scatter, and Area charts from your numeric data.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <h3 className="font-bold text-xl mb-2">Regression Models</h3>
            <p className="text-gray-600 dark:text-gray-400">Built-in Machine Learning algorithms to predict future trends based on historical data.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <h3 className="font-bold text-xl mb-2">Statistical Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">Perform T-Tests, Correlations, and descriptive statistics with one click.</p>
        </div>
      </div>
    )
  },
  security: {
    title: "Security",
    icon: <Shield className="w-8 h-8 text-cyan-500" />,
    subtitle: "Your data never leaves your device.",
    content: (
        <div className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
                Datasys takes a radically different approach to security. Instead of encrypting your data in transit to our servers, we simply <strong>don't send it anywhere</strong>.
            </p>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent border border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold mb-4">Architecture</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"/> Client-side execution engine</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"/> No database storage of user datasets</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"/> GDPR & HIPAA Compliant by design</li>
                </ul>
            </div>
        </div>
    )
  },
  about: {
    title: "About Us",
    icon: <Users className="w-8 h-8 text-cyan-500" />,
    subtitle: "We're building the future of decentralized analytics.",
    content: (
        <div className="space-y-6">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in 2024, Datasys was born from a frustration with sluggish, server-dependent BI tools. We believe that modern devices are powerful enough to handle heavy analytics loads without the latency of the cloud.
            </p>
            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-white/5 w-full flex items-center justify-center">
                 <p className="text-gray-500 font-medium">Team Photo Placeholder</p>
            </div>
        </div>
    )
  },
  api: {
    title: "API Reference",
    icon: <Code className="w-8 h-8 text-cyan-500" />,
    subtitle: "Integrate Datasys into your workflow.",
    content: (
        <div className="space-y-4">
             <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto text-sm font-mono text-gray-300 border border-gray-800">
                <p className="text-gray-500 mb-2">// Initialize Datasys Embedded</p>
                <p><span className="text-purple-400">import</span> {'{ Datasys }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@datasys/core'</span>;</p>
                <br/>
                <p><span className="text-purple-400">const</span> analytics = <span className="text-purple-400">new</span> Datasys({'{'}</p>
                <p className="pl-4">mode: <span className="text-green-400">'local'</span>,</p>
                <p className="pl-4">memoryLimit: <span className="text-orange-400">4096</span></p>
                <p>{'})'};</p>
             </div>
             <p className="text-gray-600 dark:text-gray-400 mt-4">Full documentation is available for Enterprise customers.</p>
        </div>
    )
  },
  status: {
    title: "System Status",
    icon: <Server className="w-8 h-8 text-cyan-500" />,
    subtitle: "Real-time performance metrics.",
    content: (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
                    <span className="font-bold text-green-800 dark:text-green-400">All Systems Operational</span>
                </div>
                <span className="text-sm text-green-700 dark:text-green-500">Updated 1m ago</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
                 {[1,2,3].map(i => (
                     <div key={i} className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        <div className="text-xs text-gray-500 uppercase mb-1">Region US-East-{i}</div>
                        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[98%]"/>
                        </div>
                        <div className="text-right text-xs mt-1 text-gray-500">99.99% Uptime</div>
                     </div>
                 ))}
            </div>
        </div>
    )
  }
};

export const InfoPage: React.FC<InfoPageProps> = ({ page, onNavigate, onLogin, darkMode, toggleDarkMode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const data = PAGE_CONTENT[page] || {
    title: page.charAt(0).toUpperCase() + page.slice(1),
    icon: <FileText className="w-8 h-8 text-cyan-500" />,
    subtitle: "Information about " + page,
    content: <p className="text-gray-600 dark:text-gray-400">This page is under construction. Please check back later.</p>
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-bg text-white' : 'bg-[#f0f2f5] text-gray-900'}`}>
       {/* Nav */}
       <nav className="fixed w-full z-50 top-4 px-4">
        <div className="max-w-7xl mx-auto h-16 rounded-2xl bg-white/70 dark:bg-dark-surface/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg flex justify-between items-center px-6">
          <div className="cursor-pointer" onClick={() => onNavigate('landing')}>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
             <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <button onClick={onLogin} className="px-4 py-2 bg-gradient-brand text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                Login
             </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
            <button onClick={() => onNavigate('landing')} className="flex items-center text-sm text-gray-500 hover:text-cyan-500 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>

            <div className="animate-slide-up">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
                    {data.icon}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-12">{data.subtitle}</p>

                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-white/10 shadow-xl">
                    {data.content}
                </div>
            </div>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-12 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-white/10 mt-12">
        <p>&copy; 2024 Datasys Inc. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
             <button onClick={() => onNavigate('contact')} className="hover:text-cyan-500">Contact</button>
             <button onClick={() => onNavigate('privacy' as PageType)} className="hover:text-cyan-500">Privacy</button>
             <button onClick={() => onNavigate('terms' as PageType)} className="hover:text-cyan-500">Terms</button>
        </div>
      </footer>
    </div>
  );
};