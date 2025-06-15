
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
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
    <div className="min-h-screen" style={{ color: 'black' }}>
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Judul Header */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Wrench className="w-8 h-8" style={{ color: 'black' }} />
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: 'black' }}>
                    Sistem TPM
                  </h1>
                  <p className="text-lg text-gray-600 mt-1" style={{ color: 'black' }}>
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
                style={{ color: 'black' }}
              >
                <Settings className="w-4 h-4 mr-2" style={{ color: 'black' }} />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigasi Tab */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="submit" style={{ color: 'black' }}>
                  <FileText className="w-5 h-5 mr-2" style={{ color: 'black' }} />
                  Ajukan Permintaan
                </TabsTrigger>
                <TabsTrigger value="track" style={{ color: 'black' }}>
                  <Search className="w-5 h-5 mr-2" style={{ color: 'black' }} />
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

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p style={{ color: 'black' }}>
            © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
