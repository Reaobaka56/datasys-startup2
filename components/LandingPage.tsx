import React, { memo, useState, useRef, useEffect } from 'react';
import { PageType } from '../types';
import { Logo } from './Logo';
import { ArrowRight, Zap, Lock, BarChart3, Database, FileSpreadsheet, Layers, Users, Activity, FileText, TrendingUp, CheckCircle, Github, Twitter, Linkedin, Server, Sun, Moon } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onDemoClick: () => void;
  onNavigate: (page: PageType) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface GlassCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
  style?: React.CSSProperties;
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

// Custom Hook for Intersection Observer
const useIsVisible = (ref: React.RefObject<Element>, threshold = 0.1) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold]);

  return isIntersecting;
};

// Memoized Components
const GlassCard = memo<GlassCardProps>(({ icon, title, desc, className = '', style }) => (
  <div className={`group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`} style={style}>
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-white/10 border border-white/50 dark:border-white/10 flex items-center justify-center shadow-sm mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
));

GlassCard.displayName = 'GlassCard';

const WindowsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 88 88" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.253L.041 75.023l-.007-29.336zM40.618 6.953L87.408 0v39.997l-46.76 1.745zm.03 36.93l46.76 1.766-.026 41.738-46.744-6.574z"/>
  </svg>
);

const AppleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 384 512" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLoginClick, 
  onDemoClick, 
  onNavigate,
  darkMode, 
  toggleDarkMode 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const isFeaturesVisible = useIsVisible(featuresRef);

  const handleDemoClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onDemoClick();
    } catch (error) {
      console.error('Demo launch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  };

  const mainFeatures = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Lightning Fast",
      desc: "Zero latency. We use WebWorkers to process millions of rows without blocking your UI."
    },
    {
      icon: <Lock className="w-6 h-6 text-green-500" />,
      title: "Secure & Private",
      desc: "Client-side only. No data is sent to external servers. Your financial data stays yours."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-500" />,
      title: "Auto Visualization",
      desc: "Drag and drop a file and get beautiful, interactive charts generated automatically."
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      darkMode ? 'bg-dark-bg text-white' : 'bg-[#f0f2f5] text-gray-900'
    } overflow-x-hidden selection:bg-cyan-500/30`}>

      {/* Toast Notification */}
      {showComingSoon && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-fade-in px-6 py-3 rounded-full bg-gray-900/90 dark:bg-white/90 backdrop-blur-md shadow-2xl border border-white/10 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="font-semibold text-white dark:text-gray-900">Coming Soon!</span>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-4 px-4">
        <div className="max-w-7xl mx-auto h-16 rounded-2xl bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 flex justify-between items-center px-6">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <button onClick={handleDownloadClick} className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                <WindowsLogo className="w-3.5 h-3.5" /> 
                <span>Windows</span>
             </button>
             <button onClick={handleDownloadClick} className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                <AppleLogo className="w-3.5 h-3.5" />
                <span>Mac</span>
             </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={onLoginClick}
              className="text-sm font-semibold hover:text-cyan-600 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={handleDemoClick}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-brand text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              {isLoading ? 'Loading...' : 'Try Demo'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-md text-xs font-semibold mb-8 text-cyan-700 dark:text-cyan-300 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
            Datasys 2.0 is now live
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-slide-up text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Analytics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Reimagined.</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Process complex datasets securely in your browser. <br />
            Zero latency. Zero server uploads. 100% Privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={handleDemoClick}
              disabled={isLoading}
              className="px-8 py-4 rounded-2xl bg-gradient-brand text-white font-bold text-lg shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
            >
               Launch App <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('features')}
              className="px-8 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md hover:bg-white/80 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-lg transition-all w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>

          {/* Floating Download Buttons */}
          <div className="mt-16 flex flex-col md:flex-row justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
             <button onClick={handleDownloadClick} className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all animate-float">
                <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm">
                   <WindowsLogo className="w-6 h-6 text-cyan-600 dark:text-white" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] uppercase font-bold text-cyan-700 dark:text-gray-400 tracking-wider">Download for</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">Windows</div>
                </div>
             </button>

             <button onClick={handleDownloadClick} className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm">
                   <AppleLogo className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] uppercase font-bold text-cyan-700 dark:text-gray-400 tracking-wider">Download for</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">macOS</div>
                </div>
             </button>
          </div>

          {/* Floating Dashboard Preview */}
          <div className="mt-24 relative animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="animate-float relative z-10 rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl shadow-cyan-900/20 dark:shadow-black/50 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-xl">
               {/* UI Mockup Content */}
               <div className="aspect-[16/9] bg-gradient-to-br from-white/50 to-white/20 dark:from-white/5 dark:to-transparent relative p-6">
                  {/* Mock Charts */}
                  <div className="grid grid-cols-3 gap-4 h-full">
                      <div className="col-span-2 bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-white/20">
                          <div className="flex justify-between mb-4">
                             <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded"></div>
                             <div className="h-4 w-16 bg-green-100 text-green-600 text-[10px] flex items-center justify-center rounded-full font-bold">+14%</div>
                          </div>
                          <div className="flex items-end gap-2 h-32">
                             {[30, 50, 45, 80, 60, 90, 75].map((h, i) => (
                                 <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                             ))}
                          </div>
                      </div>
                      <div className="col-span-1 space-y-4">
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-white/20 h-1/2 flex flex-col justify-center">
                              <Users className="w-6 h-6 text-purple-500 mb-2"/>
                              <div className="text-2xl font-bold">2.4M</div>
                              <div className="text-xs text-gray-500">Active Users</div>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-white/20 h-1/3 flex items-center gap-3">
                              <CheckCircle className="text-green-500 w-5 h-5"/>
                              <div className="text-xs font-bold">System Online</div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
            <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl -z-10 rounded-[3rem]" />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <GlassCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              className="transition-all duration-500"
            />
          ))}
        </div>
      </section>

      {/* Centered Footer */}
      <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
            <div className="mb-8 scale-125">
                <Logo />
            </div>
            
            <p className="max-w-md text-gray-400 mb-12 leading-relaxed">
                Empowering teams to visualize, analyze, and understand data instantly. No servers, no delays, just insights.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 mb-16 text-sm">
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-white mb-2">Product</h4>
                    <button onClick={() => onNavigate('features')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Features</button>
                    <button onClick={() => onNavigate('integrations')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Integrations</button>
                    <button onClick={() => onNavigate('security')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Security</button>
                    <button onClick={() => onNavigate('enterprise')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Enterprise</button>
                    <button onClick={() => onNavigate('changelog')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Changelog</button>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-white mb-2">Company</h4>
                    <button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">About Us</button>
                    <button onClick={() => onNavigate('careers')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Careers</button>
                    <button onClick={() => onNavigate('blog')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Blog</button>
                    <button onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Contact</button>
                    <button onClick={() => onNavigate('partners')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Partners</button>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-white mb-2">Resources</h4>
                    <button onClick={() => onNavigate('documentation')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Documentation</button>
                    <button onClick={() => onNavigate('community')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Community</button>
                    <button onClick={() => onNavigate('help')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Help Center</button>
                    <button onClick={() => onNavigate('api')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">API Reference</button>
                    <button onClick={() => onNavigate('status')} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">Status</button>
                </div>
                 <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-white mb-2">Social</h4>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"><Twitter size={14}/> Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"><Github size={14}/> GitHub</a>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"><Linkedin size={14}/> LinkedIn</a>
                </div>
            </div>

            <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-6 text-xs text-gray-500">
                <p>&copy; 2024 Datasys Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <button className="hover:text-white transition-colors">Privacy Policy</button>
                    <button className="hover:text-white transition-colors">Terms of Service</button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};