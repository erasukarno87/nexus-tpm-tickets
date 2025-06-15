
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
      
      {/* Header Admin Panel with reduced background opacity */}
      <div className="relative z-20">
        <AdminHeader onLogout={handleLogout} />
      </div>

      {/* Navigasi Tab with reduced background opacity */}
      <div className="bg-white/70 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 relative z-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger 
                value="dashboard"
                className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-300"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="tickets"
                className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-300"
              >
                <FileText className="w-5 h-5 mr-2" />
                Kelola Tiket
              </TabsTrigger>
              <TabsTrigger 
                value="master-data"
                className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-300"
              >
                <Database className="w-5 h-5 mr-2" />
                Data Master
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
