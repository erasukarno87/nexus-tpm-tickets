
import React from 'react';
import { ModernBackground } from '@/components/ModernBackground';
import { Settings } from 'lucide-react';

export const AdminLoadingScreen: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <ModernBackground />
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center animate-fadeIn">
          <div className="relative">
            <Settings className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-spin" />
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Memuat Panel Admin
          </h2>
          <p className="text-gray-300">Menyiapkan dashboard administrasi...</p>
        </div>
      </div>
    </div>
  );
};
