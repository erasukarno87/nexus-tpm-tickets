
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Shield, Sparkles } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Judul Header */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Panel Admin TPM
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Kelola dan pantau semua permintaan pemeliharaan
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>
          
          {/* Kontrol Header */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              onClick={onLogout} 
              variant="outline"
              className="text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
