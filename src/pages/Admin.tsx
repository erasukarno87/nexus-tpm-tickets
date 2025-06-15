
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
      <div>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div>
      <AdminHeader onLogout={handleLogout} />

      <div>
        <div>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList>
              <TabsTrigger value="dashboard">
                <BarChart3 className="w-5 h-5 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tickets">
                <FileText className="w-5 h-5 mr-2" />
                Kelola Tiket
              </TabsTrigger>
              <TabsTrigger value="master-data">
                <Database className="w-5 h-5 mr-2" />
                Data Master
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            <TabsContent value="tickets">
              <TicketManagement />
            </TabsContent>

            <TabsContent value="master-data">
              <MasterData />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
