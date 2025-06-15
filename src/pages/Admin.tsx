
import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { ModernBackground } from '@/components/ModernBackground';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLoadingScreen } from '@/components/admin/AdminLoadingScreen';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    return <AdminLoadingScreen />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ModernBackground />
      
      <div className="relative z-10">
        <AdminHeader onLogout={handleLogout} />

        <div className="max-w-6xl mx-auto px-4 pb-12">
          <AdminTabs
            tickets={tickets}
            technicians={technicians}
            onUpdateTicket={updateTicket}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
