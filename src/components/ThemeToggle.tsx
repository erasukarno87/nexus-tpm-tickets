
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
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`transition-all duration-300 backdrop-blur-md shadow-md hover:scale-105 rounded-full w-10 h-10 ${
        isDark 
          ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/40 text-yellow-300 hover:from-yellow-500/20 hover:to-orange-500/20 hover:border-yellow-400/60 hover:shadow-yellow-400/20' 
          : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-400/40 text-blue-300 hover:from-blue-500/20 hover:to-indigo-500/20 hover:border-blue-400/60 hover:shadow-blue-400/20'
      }`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
};
