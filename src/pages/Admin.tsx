import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { MasterData } from '@/components/MasterData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ModernBackground } from '@/components/ModernBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  LogOut,
  BarChart3,
  Database,
  Shield,
  Sparkles,
  FileText
} from 'lucide-react';
import { TicketFilters } from '@/components/admin/TicketFilters';
import { TicketCard } from '@/components/admin/TicketCard';
import { TicketDetailModal } from '@/components/admin/TicketDetailModal';
import { TicketEditModal } from '@/components/admin/TicketEditModal';

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  status: 'open' | 'in_progress' | 'pending_parts' | 'closed' | 'ditolak';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'corrective_action' | 'repair' | 'procurement' | 'support';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  line_area_name?: string;
  requester_name: string;
  requester_department: string;
  description: string;
  notes?: string;
  rejection_reason?: string;
  current_condition_image?: string;
  before_photos?: string[];
  after_photos?: string[];
}

interface Technician {
  id: string;
  name: string;
  is_active: boolean;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('tpm_admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      fetchTickets();
      fetchTechnicians();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchTickets();
    fetchTechnicians();
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

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTechnicians(data || []);
    } catch (error: any) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedTickets = data?.map(ticket => ({
        ...ticket,
        status: ticket.status as Ticket['status'],
        priority: ticket.priority as Ticket['priority'],
        category: ticket.category as Ticket['category'],
        before_photos: (ticket.before_photos as string[]) || [],
        after_photos: (ticket.after_photos as string[]) || []
      })) || [];
      
      setTickets(typedTickets);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memuat tiket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.requester_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      if (updates.status && updates.status !== 'open' && (!updates.assigned_to || updates.assigned_to === 'unassigned')) {
        toast({
          title: "Validasi Error",
          description: "Ketika status bukan 'Terbuka', tiket harus ditugaskan kepada teknisi",
          variant: "destructive",
        });
        return;
      }

      const allowedFields = ['status', 'priority', 'category', 'assigned_to', 'notes', 'rejection_reason', 'before_photos', 'after_photos', 'title', 'description', 'line_area_name', 'requester_name', 'requester_department', 'requester_contact'];
      
      const cleanUpdates = allowedFields.reduce((acc, field) => {
        if (updates[field] !== undefined && updates[field] !== null) {
          acc[field] = updates[field];
        }
        return acc;
      }, {} as any);

      const { data, error } = await supabase
        .from('tickets')
        .update(cleanUpdates)
        .eq('id', ticketId)
        .select();

      if (error) throw error;

      await supabase
        .from('ticket_logs')
        .insert({
          ticket_id: ticketId,
          action: 'Diperbarui',
          description: `Tiket diperbarui oleh admin`,
          created_by: 'Admin'
        });

      await fetchTickets();
      setEditingTicket(null);
      setIsEditModalOpen(false);
      
      toast({
        title: "Berhasil",
        description: "Tiket berhasil diperbarui",
      });
    } catch (error: any) {
      console.error('Update ticket error:', error);
      toast({
        title: "Error",
        description: `Gagal memperbarui tiket: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (ticket: Ticket) => {
    setViewingTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen">
        <ModernBackground />
        <div className="relative z-10">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <ModernBackground />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center animate-fadeIn">
            <div className="relative">
              <Settings className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-spin" />
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">Memuat Panel Admin</h2>
            <p className="text-gray-300">Menyiapkan dashboard administrasi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ModernBackground />
      
      <div className="relative z-10">
        <header className="text-center py-12 px-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-blue-400 mr-4 animate-pulse" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Panel Admin TPM
                </h1>
                <Sparkles className="w-12 h-12 text-purple-400 ml-4 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl text-gray-200 font-medium">
                Kelola dan pantau semua permintaan pemeliharaan
              </p>
              <div className="mt-4 h-1 w-40 mx-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center space-x-4 animate-slideInRight">
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 p-2 h-16 rounded-xl">
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="tickets" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Kelola Tiket
                </TabsTrigger>
                <TabsTrigger 
                  value="master-data" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
                >
                  <Database className="w-5 h-5 mr-2" />
                  Data Master
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="animate-slideInLeft">
                <Dashboard />
              </TabsContent>

              <TabsContent value="tickets" className="animate-fadeIn">
                <TicketFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                  filteredTicketsCount={filteredTickets.length}
                />

                <div className="space-y-6">
                  {filteredTickets.map((ticket, index) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      index={index}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditTicket}
                    />
                  ))}

                  {filteredTickets.length === 0 && (
                    <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 border-dashed">
                      <CardContent className="text-center py-16">
                        <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6 animate-pulse" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tidak Ada Tiket Ditemukan</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                            ? 'Coba sesuaikan filter pencarian Anda' 
                            : 'Belum ada tiket yang diajukan dalam sistem'
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="master-data" className="animate-slideInRight">
                <MasterData />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <TicketDetailModal
        ticket={viewingTicket}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingTicket(null);
        }}
      />

      <TicketEditModal
        ticket={editingTicket}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTicket(null);
        }}
        onSave={updateTicket}
        technicians={technicians}
      />
    </div>
  );
};

export default Admin;
