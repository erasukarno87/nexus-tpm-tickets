
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlobalBackground } from '@/components/GlobalBackground';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, Sparkles } from 'lucide-react';

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
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <GlobalBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header with enhanced styling */}
        <header className="text-center py-12 px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-12 h-12 text-blue-400 mr-4 animate-pulse" />
                <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Sistem TPM
                </h1>
                <Sparkles className="w-12 h-12 text-purple-400 ml-4 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-200 font-medium">
                Total Productive Maintenance Management System
              </p>
              <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center space-y-4 animate-slideInRight">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-white transition-all duration-300 hover:scale-105 dark:border-blue-500/50 dark:text-blue-400 bg-transparent backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content with enhanced animations and transparency */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="animate-fadeIn page-container p-8" style={{ animationDelay: '0.3s' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200/30 dark:border-white/10 mb-8 p-2 h-16">
                <TabsTrigger 
                  value="submit" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-800 dark:text-gray-200 backdrop-blur-sm"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ajukan Permintaan
                </TabsTrigger>
                <TabsTrigger 
                  value="track" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/80 data-[state=active]:to-blue-600/80 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-800 dark:text-gray-200 backdrop-blur-sm"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Lacak Tiket
                </TabsTrigger>
              </TabsList>

              <TabsContent value="submit" className="animate-slideInLeft">
                <TicketSubmissionForm />
              </TabsContent>

              <TabsContent value="track" className="animate-slideInRight">
                <TicketTracking />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 px-4 relative">
          <p className="text-gray-400 text-sm relative z-10">
            © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
