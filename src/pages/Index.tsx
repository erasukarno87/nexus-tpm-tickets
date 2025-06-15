
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { GlobalBackground } from '@/components/GlobalBackground';
import { FuturisticHeader } from '@/components/FuturisticHeader';
import { FileText, Search } from 'lucide-react';

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
        <FuturisticHeader
          title="Sistem TPM"
          subtitle="Total Productive Maintenance Management System"
          showAdminButton={true}
        />

        {/* Main Content with full transparency */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <TabsList className="grid w-full grid-cols-2 mb-8 p-2 h-16 rounded-xl">
              <TabsTrigger 
                value="submit" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/90 data-[state=active]:to-purple-600/90 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
              >
                <FileText className="w-5 h-5 mr-2" />
                Ajukan Permintaan
              </TabsTrigger>
              <TabsTrigger 
                value="track" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
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
