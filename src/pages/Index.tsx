
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
    <div className="index-page-container">
      <GlobalBackground />
      
      <div className="index-content">
        <header className="index-header">
          <div className="index-header-content">
            <div className="index-title-section">
              <div className="index-title-wrapper">
                <Sparkles className="index-sparkle-left" />
                <h1 className="index-main-title">
                  Sistem TPM
                </h1>
                <Sparkles className="index-sparkle-right" />
              </div>
              <p className="index-subtitle">
                Total Productive Maintenance Management System
              </p>
              <div className="index-title-divider"></div>
            </div>
            <div className="index-controls">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="admin-panel-button"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </header>

        <div className="index-main-content">
          <div className="index-tabs-container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="index-tabs-list">
                <TabsTrigger 
                  value="submit" 
                  className="index-tab-trigger-submit"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ajukan Permintaan
                </TabsTrigger>
                <TabsTrigger 
                  value="track" 
                  className="index-tab-trigger-track"
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

        <footer className="index-footer">
          <p className="index-footer-text">
            © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
