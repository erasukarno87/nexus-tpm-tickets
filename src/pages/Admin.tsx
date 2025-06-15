
import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { MasterData } from '@/components/MasterData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Database, FileText } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLoadingState } from '@/components/admin/AdminLoadingState';
import { TicketManagement } from '@/components/admin/TicketManagement';
import { ThreeBackground } from '@/components/ThreeBackground';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('tpm_admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('tpm_admin_logged_in');
    localStorage.removeItem('tpm_admin_user');
    setIsLoggedIn(false);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari panel admin.",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative">
        <ThreeBackground />
        <div className="relative z-20">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="min-h-screen relative">
      {/* 3D Animated Background */}
      <ThreeBackground />
      
      {/* Header Admin Panel */}
      <div className="relative z-20">
        <AdminHeader onLogout={handleLogout} />
      </div>

      {/* Enhanced Admin Navigation Tabs with clean styling */}
      <div className="bg-white/20 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/50 relative z-20">
        <div className="container mx-auto px-4 py-4">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 dark:bg-slate-800/30 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-1 shadow-xl">
              <TabsTrigger 
                value="dashboard"
                className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl font-semibold py-2.5 hover:scale-[1.02] data-[state=active]:border-0 hover:bg-white/10 dark:hover:bg-slate-700/30"
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Dashboard</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="tickets"
                className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl font-semibold py-2.5 hover:scale-[1.02] data-[state=active]:border-0 hover:bg-white/10 dark:hover:bg-slate-700/30"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Kelola Tiket</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="master-data"
                className="relative group data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl font-semibold py-2.5 hover:scale-[1.02] data-[state=active]:border-0 hover:bg-white/10 dark:hover:bg-slate-700/30"
              >
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Data Master</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Konten Tab */}
            <div className="py-6">
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>

              <TabsContent value="tickets">
                <TicketManagement />
              </TabsContent>

              <TabsContent value="master-data">
                <MasterData />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
