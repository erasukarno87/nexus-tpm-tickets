
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Background3D } from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background3D />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                Sistem TPM
              </h1>
              <p className="text-xl text-gray-300">
                Total Productive Maintenance Management System
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="glass-input border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card mb-8">
              <TabsTrigger value="submit" className="data-[state=active]:bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Ajukan Permintaan
              </TabsTrigger>
              <TabsTrigger value="track" className="data-[state=active]:bg-blue-600">
                <Search className="w-4 h-4 mr-2" />
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
    </div>
  );
};

export default Index;
