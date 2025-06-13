import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketSubmissionForm } from '@/components/TicketSubmissionForm';
import { TicketTracking } from '@/components/TicketTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Background3D } from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background3D />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header with enhanced styling */}
        <header className="text-center py-12 px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-12 h-12 text-blue-400 mr-4 animate-pulse" />
                <h1 className="text-4xl md:text-7xl font-bold gradient-text text-glow">
                  Sistem TPM
                </h1>
                <Sparkles className="w-12 h-12 text-purple-400 ml-4 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl text-gray-200 text-shadow-lg font-medium">
                Total Productive Maintenance Management System
              </p>
              <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center space-y-4 animate-slideInRight">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="glass-input border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content with enhanced animations */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <Tabs defaultValue="submit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-card mb-8 p-2 h-16">
                <TabsTrigger 
                  value="submit" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ajukan Permintaan
                </TabsTrigger>
                <TabsTrigger 
                  value="track" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold"
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

        {/* Footer with floating elements */}
        <footer className="text-center py-8 px-4 relative">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 animate-float-complex"
                style={{
                  left: `${10 + i * 12}%`,
                  bottom: `${Math.random() * 50}px`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm relative z-10">
            © 2024 TPM Nexus - Advanced Manufacturing Maintenance System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;