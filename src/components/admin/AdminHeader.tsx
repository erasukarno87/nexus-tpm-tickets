
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Shield, Sparkles, Zap, Activity, Star, Cpu } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="relative backdrop-blur-2xl bg-gradient-to-r from-white/5 via-red-500/10 to-orange-500/15 dark:from-slate-900/40 dark:via-red-950/30 dark:to-orange-950/40 border-b-2 border-gradient-to-r from-red-500/40 via-orange-500/40 to-yellow-500/40">
      {/* Multiple animated glow lines at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
      <div className="absolute top-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70"></div>
      
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Mega Enhanced Admin Title Section */}
          <div className="flex items-center space-x-5">
            <div className="relative group">
              {/* Multi-layered glowing backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 p-4 rounded-2xl shadow-2xl border-2 border-red-500/40 group-hover:border-orange-400/60 transition-all duration-300 group-hover:scale-110">
                <Shield className="w-8 h-8 text-white drop-shadow-2xl group-hover:rotate-12 transition-transform duration-300" />
              </div>
              {/* Floating particles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-400 rounded-full animate-bounce opacity-80"></div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-gradientShift bg-size-200 drop-shadow-lg">
                  ADMIN CONTROL
                </h1>
                <div className="flex space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                  <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                  <Star className="w-5 h-5 text-orange-500 animate-bounce" />
                </div>
              </div>
              
              <p className="text-lg font-bold text-gray-600 dark:text-gray-300">
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  TPM System Management Dashboard
                </span>
              </p>
              
              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                <span className="font-semibold">Real-time Monitoring & Control</span>
                <Cpu className="w-4 h-4 text-red-500 animate-spin" />
              </div>
              
              {/* Enhanced status indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-3 py-1 rounded-xl border border-green-500/30">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-bold">System Online</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-red-500/10 px-2 py-1 rounded border border-red-500/30">
                  ADMIN v2.0
                </div>
              </div>
            </div>
          </div>
          
          {/* Ultra Enhanced Control Section */}
          <div className="flex items-center space-x-6">
            {/* Futuristic Admin Stats */}
            <div className="hidden md:flex items-center space-x-6 px-6 py-3 bg-gradient-to-r from-slate-800/60 via-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl border-2 border-slate-600/60 shadow-xl">
              <div className="text-center">
                <div className="text-xl font-black text-green-400 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-xs text-gray-400 font-semibold">Active</div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
              <div className="text-center">
                <div className="text-xl font-black text-blue-400 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Live</div>
                <div className="text-xs text-gray-400 font-semibold">Status</div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
              <div className="text-center">
                <div className="text-xl font-black text-red-400 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">CTRL</div>
                <div className="text-xs text-gray-400 font-semibold">Panel</div>
              </div>
            </div>
            
            <ThemeToggle />
            
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
              <Button 
                onClick={onLogout} 
                className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 text-white shadow-2xl hover:shadow-3xl hover:shadow-red-500/50 transition-all duration-500 border-2 border-red-500/40 hover:border-orange-400/60 group-hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Secure Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced animated bottom borders */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60"></div>
      <div className="absolute bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-40"></div>
      
      {/* Enhanced floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-60" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-50" style={{animationDelay: '0.5s'}}></div>
      </div>
    </header>
  );
};
