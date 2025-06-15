
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
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
    <div>
      <header>
        <div>
          <div>
            <div>
              <Sparkles />
              <h1>
                Sistem TPM
              </h1>
              <Sparkles />
            </div>
            <p>
              Total Productive Maintenance Management System
            </p>
          </div>
          <div>
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
      </header>

      <div>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="submit">
                <FileText className="w-5 h-5 mr-2" />
                Ajukan Permintaan
              </TabsTrigger>
              <TabsTrigger value="track">
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

      <footer>
        <p>
          © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
        </p>
      </footer>
    </div>
  );
};

export default Index;
