
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Shield, Sparkles, Zap, Activity, Home } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="relative z-20 backdrop-blur-xl bg-gradient-to-r from-white/10 via-red-500/5 to-orange-500/10 dark:from-slate-900/30 dark:via-red-950/20 dark:to-orange-950/30 border-b border-gradient-to-r from-red-500/30 via-orange-500/30 to-yellow-500/30">
      {/* Animated glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Enhanced Admin Title Section with reduced spacing */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Glowing background for icon */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-xl shadow-2xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-gradientShift">
                  ADMIN CONTROL
                </h1>
                <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  TPM System Management Dashboard
                </span>
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Real-time Monitoring & Control</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="default"
              className="h-12 px-4 bg-gradient-to-r from-white/20 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-blue-500/30 hover:border-purple-500/50 rounded-xl text-black dark:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 group"
            >
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:via-cyan-500 group-hover:to-blue-500 transition-all duration-300">
                  Main Portal
                </span>
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </Button>
            
            <Button 
              onClick={onLogout} 
              variant="outline"
              size="default"
              className="h-12 px-4 bg-gradient-to-r from-white/20 via-red-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-orange-500/50 rounded-xl text-black dark:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:via-orange-500/20 hover:to-yellow-500/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105 group"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold text-sm bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-yellow-500 group-hover:to-red-500 transition-all duration-300">
                  Secure Logout
                </span>
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
    </header>
  );
};
