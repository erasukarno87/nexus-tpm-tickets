
import React, { useState } from 'react';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Ticket, Search, Zap, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Background */}
      <div className="particle-bg fixed inset-0 z-0"></div>
      
      {/* Admin Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={() => navigate('/admin')}
          variant="outline"
          className="glass-input border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Header */}
        <header className="text-center py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-6 text-shadow-neon">
              TPM NEXUS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
              Total Productive Maintenance Command Center
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Powered by Advanced Manufacturing Intelligence</span>
            </div>
          </div>
        </header>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 glass-card p-2 h-16">
              <TabsTrigger 
                value="submit" 
                data-value="submit"
                className="flex items-center space-x-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <Ticket className="w-5 h-5" />
                <span className="font-medium">Submit Request</span>
              </TabsTrigger>
              <TabsTrigger 
                value="track" 
                data-value="track"
                className="flex items-center space-x-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Track Ticket</span>
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

      {/* Ambient Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Index;
