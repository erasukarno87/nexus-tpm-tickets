
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
      size="sm"
      onClick={toggleTheme}
      className="glass-input border-gray-600 hover:border-blue-400 transition-colors text-white border-white/20 hover:text-white"
    >
      {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
      <span className="ml-2 text-white">{isDark ? 'Terang' : 'Gelap'}</span>
    </Button>
  );
};
