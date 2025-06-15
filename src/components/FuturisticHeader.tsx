
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Settings, 
  LogOut, 
  Shield,
  Zap,
  Stars,
  Orbit
} from 'lucide-react';

interface FuturisticHeaderProps {
  title: string;
  subtitle: string;
  showAdminButton?: boolean;
  showLogoutButton?: boolean;
  onLogout?: () => void;
}

export const FuturisticHeader: React.FC<FuturisticHeaderProps> = ({
  title,
  subtitle,
  showAdminButton = false,
  showLogoutButton = false,
  onLogout
}) => {
  return (
    <header className="relative text-center py-16 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-500 rounded-full animate-pulse opacity-80" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-70" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-90" style={{animationDelay: '0.5s'}}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-16 left-1/4 w-8 h-8 border border-blue-400/30 rotate-45 animate-float opacity-40"></div>
        <div className="absolute bottom-32 right-1/4 w-6 h-6 border border-purple-500/30 rounded-full animate-float opacity-50" style={{animationDelay: '3s'}}></div>
        
        {/* Animated lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
        <div className="animate-fadeIn flex-1">
          <div className="flex items-center justify-center mb-8">
            {/* Left decorative elements */}
            <div className="flex items-center mr-6 space-x-2">
              <Orbit className="w-8 h-8 text-blue-400 animate-spin" style={{animationDuration: '8s'}} />
              <Stars className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            
            {/* Main icon */}
            <div className="relative mx-4">
              <Sparkles className="w-16 h-16 text-blue-400 animate-pulse relative z-10" />
              <div className="absolute inset-0 w-16 h-16 bg-blue-400/20 rounded-full blur-lg animate-pulse"></div>
            </div>
            
            {/* Main title */}
            <h1 className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 via-cyan-400 to-pink-500 bg-clip-text text-transparent mx-8 animate-fadeIn bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite]">
              {title}
            </h1>
            
            {/* Right decorative elements */}
            <div className="flex items-center ml-6 space-x-2">
              <Zap className="w-6 h-6 text-purple-400 animate-pulse" style={{animationDelay: '0.5s'}} />
              <Shield className="w-8 h-8 text-pink-400 animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}} />
            </div>
          </div>
          
          <p className="text-xl md:text-3xl text-gray-200 dark:text-gray-200 font-medium mb-6 animate-slideInLeft" style={{animationDelay: '0.3s'}}>
            {subtitle}
          </p>
          
          {/* Enhanced decorative line */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-400 animate-pulse"></div>
            <div className="mx-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            <div className="h-px w-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
            <div className="mx-4 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-500 animate-pulse"></div>
          </div>
        </div>
        
        {/* Enhanced action buttons */}
        <div className="flex flex-col items-center space-y-4 animate-slideInRight" style={{animationDelay: '0.6s'}}>
          <div className="relative">
            <ThemeToggle />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-lg blur-sm"></div>
          </div>
          
          {showAdminButton && (
            <div className="relative">
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="info"
                className="hover:scale-110 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 shadow-lg hover:shadow-cyan-400/25"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-lg blur-sm"></div>
            </div>
          )}
          
          {showLogoutButton && onLogout && (
            <div className="relative">
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 hover:scale-110 backdrop-blur-md hover:border-red-400/80 shadow-lg hover:shadow-red-400/25"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
              <div className="absolute -inset-2 bg-gradient-to-r from-red-400/10 to-pink-500/10 rounded-lg blur-sm"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-400/50 via-purple-500/50 to-transparent blur-sm"></div>
    </header>
  );
};
