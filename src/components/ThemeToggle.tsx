
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('tpm_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      const isDarkMode = savedTheme === 'dark';
      setIsDark(isDarkMode);
      document.documentElement.classList.toggle('dark', isDarkMode);
    } else {
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Update document class
    document.documentElement.classList.toggle('dark', newTheme);
    
    // Save to localStorage
    localStorage.setItem('tpm_theme', newTheme ? 'dark' : 'light');
    
    console.log('Theme toggled to:', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="relative group">
      {/* Multi-layered glowing background effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-60 transition-all duration-700"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition-all duration-500"></div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="relative h-14 px-6 bg-gradient-to-r from-white/30 via-blue-500/15 to-purple-500/20 dark:from-slate-800/60 dark:via-blue-900/40 dark:to-purple-900/50 backdrop-blur-xl border-3 border-blue-500/40 hover:border-purple-500/60 dark:border-blue-400/50 dark:hover:border-purple-400/70 rounded-2xl text-black dark:text-white hover:bg-gradient-to-r hover:from-blue-500/25 hover:via-purple-500/25 hover:to-cyan-500/25 dark:hover:from-blue-800/50 dark:hover:via-purple-800/50 dark:hover:to-cyan-800/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-110 group overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="relative">
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-all duration-300 drop-shadow-lg group-hover:rotate-180 group-hover:scale-110" />
            ) : (
              <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-purple-500 transition-all duration-300 drop-shadow-lg group-hover:rotate-12 group-hover:scale-110" />
            )}
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
          </div>
          
          <span className="font-black text-base bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:via-cyan-500 group-hover:to-blue-500 transition-all duration-500 drop-shadow-sm">
            {isDark ? 'Terang' : 'Gelap'}
          </span>
          
          <Sparkles className="w-4 h-4 text-purple-500 opacity-70 group-hover:opacity-100 group-hover:text-cyan-400 transition-all duration-300 group-hover:animate-spin" />
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </Button>
    </div>
  );
};
