import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { InfoPage } from './components/InfoPage';
import { Logo } from './components/Logo';
import { DataSet, User, PageType } from './types';
import { Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [dataSet, setDataSet] = useState<DataSet | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(true); // Default to Dark based on image vibe
  const [currentPage, setCurrentPage] = useState<PageType>('landing');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Routing Logic
  
  if (currentPage !== 'landing' && currentPage !== 'dashboard') {
     return (
        <InfoPage 
            page={currentPage} 
            onNavigate={setCurrentPage}
            onLogin={() => setCurrentPage('dashboard')} // Simulating login route logic
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
        />
     );
  }

  if (!user && currentPage === 'dashboard') {
      return (
          <div className={darkMode ? 'dark' : ''}>
              <LoginPage 
                  onLogin={(u) => { setUser(u); setCurrentPage('dashboard'); }}
                  onBack={() => setCurrentPage('landing')}
                  darkMode={darkMode} 
                  toggleDarkMode={() => setDarkMode(!darkMode)} 
              />
          </div>
      );
  }
  
  // Show Dashboard if user is logged in AND we are on dashboard route (or if data is loaded)
  if (user && (currentPage === 'dashboard' || dataSet)) {
      if (!dataSet) {
        return (
            <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-dark-bg text-gray-100' : 'bg-[#fafafa] text-gray-900'}`}>
                <div className="min-h-screen flex flex-col">
                   {/* Top Nav */}
                   <nav className="w-full border-b border-gray-200 dark:border-dark-border bg-white/50 dark:bg-dark-surface/50 backdrop-blur-md sticky top-0 z-50">
                     <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                        <div onClick={() => setCurrentPage('landing')} className="cursor-pointer">
                            <Logo size={24} className="text-sm" />
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <div className="h-4 w-px bg-gray-200 dark:bg-dark-border"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 border border-white/20 flex items-center justify-center text-xs font-medium text-white">
                                    {user.name.charAt(0)}
                                </div>
                                <button 
                                    onClick={() => { setUser(null); setCurrentPage('landing'); }}
                                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                     </div>
                   </nav>
                   
                   {/* Upload Content */}
                   <div className="flex-1 flex flex-col items-center justify-center p-6 animate-slide-up">
                        <div className="text-center mb-10 max-w-2xl">
                            <h1 className="text-4xl font-semibold tracking-tight mb-4 text-gray-900 dark:text-white">
                                Import your data
                            </h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
                                Upload CSV, Excel, or Documents to begin your analysis. <br/>
                                Processing is performed locally in your browser.
                            </p>
                        </div>
                        
                        <div className="w-full max-w-2xl">
                            <FileUpload onDataLoaded={setDataSet} />
                        </div>
                   </div>
                </div>
            </div>
        );
      }
      
      return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-dark-bg text-gray-100' : 'bg-[#fafafa] text-gray-900'}`}>
            <Dashboard 
                dataSet={dataSet} 
                onReset={() => setDataSet(null)} 
                onLogout={() => { setUser(null); setCurrentPage('landing'); }}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
            />
        </div>
      );
  }

  // Default Fallback: Landing Page
  return (
    <div className={darkMode ? 'dark' : ''}>
        <LandingPage 
            onLoginClick={() => setCurrentPage('dashboard')}
            onDemoClick={() => { setUser({ name: 'Guest', email: 'guest@datasys.io' }); setCurrentPage('dashboard'); }}
            onNavigate={setCurrentPage}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
        />
    </div>
  );
};

export default App;