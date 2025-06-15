
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Shield, Sparkles, Zap, Activity } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="relative backdrop-blur-xl bg-gradient-to-r from-white/10 via-red-500/5 to-orange-500/10 dark:from-slate-900/30 dark:via-red-950/20 dark:to-orange-950/30 border-b border-gradient-to-r from-red-500/30 via-orange-500/30 to-yellow-500/30">
      {/* Animated glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Admin Title Section with reduced spacing */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Multi-layered glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-lg opacity-30 animate-ping"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl shadow-2xl border border-red-500/30">
                <Shield className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-gradientShift">
                  ADMIN CONTROL
                </h1>
                <div className="flex space-x-1">
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
                  <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                </div>
              </div>
              
              <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  TPM System Management Dashboard
                </span>
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span>Real-time Monitoring & Control</span>
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">System Online</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Control Section */}
          <div className="flex items-center space-x-6">
            {/* Admin Stats */}
            <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-600/50">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">24/7</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="w-px h-8 bg-slate-600"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">Live</div>
                <div className="text-xs text-gray-400">Status</div>
              </div>
            </div>
            
            <ThemeToggle />
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <Button 
                onClick={onLogout} 
                className="relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 border border-red-500/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Secure Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-60" style={{animationDelay: '2s'}}></div>
      </div>
    </header>
  );
};
