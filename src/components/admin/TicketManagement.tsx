
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';
import { TicketFilters } from './TicketFilters';
import { TicketCard } from './TicketCard';
import { TicketDetailModal } from './TicketDetailModal';
import { TicketEditModal } from './TicketEditModal';

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

export const TicketManagement: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

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

  return (
    <>
      <TicketFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        filteredTicketsCount={filteredTickets.length}
      />

      <div>
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
          <Card>
            <CardContent>
              <FileText />
              <h3>Tidak Ada Tiket Ditemukan</h3>
              <p>
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Coba sesuaikan filter pencarian Anda' 
                  : 'Belum ada tiket yang diajukan dalam sistem'
                }
              </p>
            </CardContent>
          </Card>
        )}
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
    </>
  );
};
