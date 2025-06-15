
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThreeBackground } from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, Wrench } from 'lucide-react';

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
      
      {/* Header with reduced background opacity */}
      <header className="bg-white/70 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-white relative z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Judul Header */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Wrench className="w-8 h-8 text-black dark:text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-black dark:text-white">
                    Sistem TPM
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-white mt-1">
                    Total Productive Maintenance Management System
                  </p>
                </div>
              </div>
            </div>
            
            {/* Kontrol Header */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="text-black dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="w-4 h-4 mr-2 text-black dark:text-white" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigasi Tab with reduced background opacity */}
      <div className="bg-white/70 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-white relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/80 dark:bg-gray-800">
                <TabsTrigger 
                  value="submit" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-black dark:text-white"
                >
                  <FileText className="w-5 h-5 mr-2 text-black dark:text-white" />
                  Ajukan Permintaan
                </TabsTrigger>
                <TabsTrigger 
                  value="track" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-black dark:text-white"
                >
                  <Search className="w-5 h-5 mr-2 text-black dark:text-white" />
                  Lacak Tiket
                </TabsTrigger>
              </TabsList>

              {/* Konten Tab */}
              <div className="py-6">
                <TabsContent value="submit">
                  <TicketSubmissionForm />
                </TabsContent>

                <TabsContent value="track">
                  <TicketTracking />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer with reduced background opacity */}
      <footer className="bg-white/70 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-white mt-16 relative z-20">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-black dark:text-white">
            © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
