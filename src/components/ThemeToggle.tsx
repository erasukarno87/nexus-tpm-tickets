
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

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
      {/* Glowing background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="relative h-11 px-4 bg-gradient-to-r from-white/20 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-blue-500/30 hover:border-purple-500/50 rounded-2xl text-black dark:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 group"
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300 drop-shadow-lg" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-purple-500 transition-colors duration-300 drop-shadow-lg" />
            )}
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
          </div>
          
          <span className="font-semibold text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:via-cyan-500 group-hover:to-blue-500 transition-all duration-300">
            {isDark ? 'Terang' : 'Gelap'}
          </span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
      </Button>
    </div>
  );
};
