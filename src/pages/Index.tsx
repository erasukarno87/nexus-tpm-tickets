
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThreeBackground } from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, Wrench, Sparkles, Zap, Star, Cpu } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced 3D Animated Background */}
      <ThreeBackground />
      
      {/* Ultra Futuristic Header */}
      <header className="relative z-20 backdrop-blur-2xl bg-gradient-to-r from-white/5 via-blue-500/10 to-purple-500/15 dark:from-slate-900/40 dark:via-blue-950/30 dark:to-purple-950/40 border-b-2 border-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40">
        {/* Multiple animated glow lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        <div className="absolute top-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
        
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Mega Enhanced Title Section */}
            <div className="flex items-center space-x-5">
              <div className="relative group">
                {/* Multi-layered glowing backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-4 rounded-2xl shadow-2xl border-2 border-blue-400/40 group-hover:border-purple-400/60 transition-all duration-300 group-hover:scale-110">
                  <Wrench className="w-8 h-8 text-white drop-shadow-2xl group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-70"></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradientShift bg-size-200 drop-shadow-lg">
                    TPM NEXUS
                  </h1>
                  <div className="flex space-x-2">
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                    <Star className="w-5 h-5 text-purple-500 animate-pulse" />
                    <Cpu className="w-5 h-5 text-cyan-500 animate-bounce" />
                  </div>
                </div>
                
                <p className="text-lg font-bold text-gray-600 dark:text-gray-300">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    Advanced Manufacturing Maintenance System
                  </span>
                </p>
                
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <span className="font-semibold">Powered by AI & Future Technology</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
                
                {/* Enhanced Status indicator */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-3 py-1 rounded-xl border border-green-500/30">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-bold">System Online</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-slate-500/10 px-2 py-1 rounded">
                    v3.0 NEXUS
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex items-center space-x-6">
              {/* Futuristic Stats Display */}
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
                  <div className="text-xl font-black text-purple-400 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</div>
                  <div className="text-xs text-gray-400 font-semibold">Powered</div>
                </div>
              </div>
              
              <ThemeToggle />
              
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <Button 
                  onClick={() => window.location.href = '/admin'}
                  className="relative bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 hover:from-slate-700 hover:via-gray-700 hover:to-slate-800 text-white border-2 border-slate-600/50 hover:border-gray-500/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-slate-500/30"
                >
                  <Settings className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced bottom glow lines */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
        <div className="absolute bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40"></div>
      </header>

      {/* Ultra Enhanced Navigation Tabs */}
      <div className="relative z-20 backdrop-blur-2xl bg-gradient-to-r from-white/5 via-blue-500/10 to-purple-500/15 dark:from-slate-900/30 dark:via-blue-950/25 dark:to-purple-950/30 border-b-2 border-blue-500/30 dark:border-blue-400/40">
        <div className="container mx-auto px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-10 bg-gradient-to-r from-white/20 via-blue-500/15 to-purple-500/25 dark:from-slate-800/50 dark:via-slate-700/40 dark:to-slate-800/50 backdrop-blur-2xl border-3 border-gradient-to-r from-blue-500/50 via-purple-500/40 to-cyan-500/50 dark:border-blue-400/50 rounded-3xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-700 relative overflow-hidden h-24">
                {/* Animated background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-gradientShift rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-45deg from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                <TabsTrigger 
                  value="submit" 
                  className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/60 text-black dark:text-white transition-all duration-700 rounded-2xl font-black text-lg py-5 px-10 hover:scale-[1.03] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-blue-500/25 hover:via-blue-400/20 hover:to-blue-500/25 dark:hover:from-blue-800/40 dark:hover:via-blue-700/35 dark:hover:to-blue-800/40 overflow-hidden h-full flex items-center justify-center min-w-0 mx-3 border-2 border-blue-500/30 data-[state=active]:border-blue-400/60"
                >
                  {/* Multi-layered active state glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-cyan-400/15 to-blue-400/30 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-cyan-600/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  <div className="flex items-center space-x-4 relative z-10 w-full justify-center">
                    <FileText className="w-7 h-7 transition-all duration-700 group-hover:scale-125 group-data-[state=active]:drop-shadow-xl group-hover:rotate-12 flex-shrink-0" />
                    <span className="bg-gradient-to-r group-data-[state=active]:from-white group-data-[state=active]:to-blue-100 bg-clip-text font-black text-xl whitespace-nowrap drop-shadow-lg">Submit Request</span>
                  </div>
                  
                  {/* Enhanced shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="track" 
                  className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/60 text-black dark:text-white transition-all duration-700 rounded-2xl font-black text-lg py-5 px-10 hover:scale-[1.03] data-[state=active]:border-0 hover:bg-gradient-to-r hover:from-purple-500/25 hover:via-purple-400/20 hover:to-purple-500/25 dark:hover:from-purple-800/40 dark:hover:via-purple-700/35 dark:hover:to-purple-800/40 overflow-hidden h-full flex items-center justify-center min-w-0 mx-3 border-2 border-purple-500/30 data-[state=active]:border-purple-400/60"
                >
                  {/* Multi-layered active state glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/15 to-purple-400/30 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/10 to-cyan-600/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  <div className="flex items-center space-x-4 relative z-10 w-full justify-center">
                    <Search className="w-7 h-7 transition-all duration-700 group-hover:scale-125 group-data-[state=active]:drop-shadow-xl group-hover:rotate-12 flex-shrink-0" />
                    <span className="bg-gradient-to-r group-data-[state=active]:from-white group-data-[state=active]:to-purple-100 bg-clip-text font-black text-xl whitespace-nowrap drop-shadow-lg">Track Ticket</span>
                  </div>
                  
                  {/* Enhanced shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Content with animations */}
              <div className="py-8">
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

      {/* Ultra Enhanced Footer */}
      <footer className="relative z-20 mt-20 backdrop-blur-2xl bg-gradient-to-r from-white/5 via-blue-500/10 to-purple-500/15 dark:from-slate-900/30 dark:via-blue-950/25 dark:to-purple-950/30 border-t-2 border-gradient-to-r from-blue-500/30 to-purple-500/30">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
        <div className="absolute top-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40"></div>
        <div className="container mx-auto px-8 py-10 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-spin" />
            <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
              © 2024 <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent font-black text-2xl">TPM NEXUS</span> - Advanced Manufacturing Maintenance System
            </p>
            <Star className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
            Powered by Future Technology & AI Innovation
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
