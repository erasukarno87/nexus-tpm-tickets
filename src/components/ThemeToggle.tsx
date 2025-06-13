
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
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
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
    
    // Update CSS custom properties for theme
    if (newTheme) {
      document.documentElement.style.setProperty('--background', '222.2% 84% 4.9%');
      document.documentElement.style.setProperty('--foreground', '210% 40% 98%');
    } else {
      document.documentElement.style.setProperty('--background', '0 0% 100%');
      document.documentElement.style.setProperty('--foreground', '222.2% 84% 4.9%');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`glass-input border-gray-600 hover:border-blue-400 transition-colors ${
        isDark ? 'text-yellow-400' : 'text-blue-600'
      }`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="ml-2">{isDark ? 'Terang' : 'Gelap'}</span>
    </Button>
  );
};
