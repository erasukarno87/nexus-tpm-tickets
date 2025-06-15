
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Wrench className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Sistem TPM
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Total Productive Maintenance Management System
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="submit" className="text-lg py-3">
                <FileText className="w-5 h-5 mr-2" />
                Ajukan Permintaan
              </TabsTrigger>
              <TabsTrigger value="track" className="text-lg py-3">
                <Search className="w-5 h-5 mr-2" />
                Lacak Tiket
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submit">
              <TicketSubmissionForm />
            </TabsContent>

            <TabsContent value="track">
              <TicketTracking />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <footer className="bg-white dark:bg-gray-800 border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
