
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThreeBackground } from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, Wrench, Sparkles, Zap } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('submit');

  useEffect(() => {
    const handleSwitchToTracking = (event: CustomEvent) => {
      console.log('Switching to tracking tab with ticket:', event.detail.ticketNumber);
      setActiveTab('track');
    };

    window.addEventListener('switchToTrackingTab', handleSwitchToTracking as EventListener);

    return () => {
      window.removeEventListener('switchToTrackingTab', handleSwitchToTracking as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* 3D Animated Background */}
      <ThreeBackground />
      
      {/* Futuristic Header with reduced padding */}
      <header className="relative z-20 backdrop-blur-xl bg-gradient-to-r from-white/10 via-blue-500/5 to-purple-500/10 dark:from-slate-900/30 dark:via-blue-950/20 dark:to-purple-950/30 border-b border-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30">
        {/* Animated glow line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Enhanced Title Section with reduced spacing */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Glowing background for icon */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-2xl">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradientShift">
                    TPM NEXUS
                  </h1>
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Advanced Manufacturing Maintenance System
                  </span>
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>Powered by AI & Modern Technology</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <Button
                  onClick={() => window.location.href = '/admin'}
                  className="relative bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white border border-slate-600 hover:border-blue-500/50 transition-all duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      </header>

      {/* Enhanced Navigation Tabs with proper sizing */}
      <div className="relative z-20 backdrop-blur-xl bg-gradient-to-r from-white/5 via-blue-500/5 to-purple-500/5 dark:from-slate-900/20 dark:via-blue-950/15 dark:to-purple-950/20 border-b border-blue-500/20 dark:border-blue-400/30">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-white/30 via-blue-500/10 to-purple-500/20 dark:from-slate-800/40 dark:via-slate-700/30 dark:to-slate-800/40 backdrop-blur-xl border-2 border-gradient-to-r from-blue-500/40 via-purple-500/30 to-cyan-500/40 dark:border-blue-400/40 rounded-2xl p-2 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden h-16">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-gradientShift rounded-2xl"></div>
                
                <TabsTrigger 
                  value="submit" 
                  className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/50 text-black dark:text-white transition-all duration-500 rounded-xl font-bold text-base py-4 px-6 hover:scale-[1.02] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-blue-400/15 hover:to-blue-500/20 dark:hover:from-blue-800/30 dark:hover:via-blue-700/25 dark:hover:to-blue-800/30 overflow-hidden h-full flex items-center justify-center min-w-0"
                >
                  {/* Active state glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/10 to-blue-400/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  <div className="flex items-center space-x-3 relative z-10 w-full justify-center">
                    <FileText className="w-5 h-5 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:drop-shadow-lg flex-shrink-0" />
                    <span className="bg-gradient-to-r group-data-[state=active]:from-white group-data-[state=active]:to-blue-100 bg-clip-text font-semibold whitespace-nowrap">Submit Request</span>
                  </div>
                  
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="track" 
                  className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/50 text-black dark:text-white transition-all duration-500 rounded-xl font-bold text-base py-4 px-6 hover:scale-[1.02] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-purple-400/15 hover:to-purple-500/20 dark:hover:from-purple-800/30 dark:hover:via-purple-700/25 dark:hover:to-purple-800/30 overflow-hidden h-full flex items-center justify-center min-w-0"
                >
                  {/* Active state glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/10 to-purple-400/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  <div className="flex items-center space-x-3 relative z-10 w-full justify-center">
                    <Search className="w-5 h-5 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:drop-shadow-lg flex-shrink-0" />
                    <span className="bg-gradient-to-r group-data-[state=active]:from-white group-data-[state=active]:to-purple-100 bg-clip-text font-semibold whitespace-nowrap">Track Ticket</span>
                  </div>
                  
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </TabsTrigger>
              </TabsList>

              {/* Content */}
              <div className="py-6">
                <TabsContent value="submit" className="animate-slideInUp">
                  <TicketSubmissionForm />
                </TabsContent>

                <TabsContent value="track" className="animate-slideInUp">
                  <TicketTracking />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-20 mt-16 backdrop-blur-xl bg-gradient-to-r from-white/5 via-blue-500/5 to-purple-500/5 dark:from-slate-900/20 dark:via-blue-950/15 dark:to-purple-950/20 border-t border-gradient-to-r from-blue-500/20 to-purple-500/20">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            © 2024 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">TPM NEXUS</span> - Advanced Manufacturing Maintenance System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
