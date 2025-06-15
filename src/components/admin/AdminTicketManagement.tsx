
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TicketFilters } from '@/components/admin/TicketFilters';
import { TicketCard } from '@/components/admin/TicketCard';
import { TicketDetailModal } from '@/components/admin/TicketDetailModal';
import { TicketEditModal } from '@/components/admin/TicketEditModal';
import { FileText } from 'lucide-react';

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

interface AdminTicketManagementProps {
  tickets: Ticket[];
  technicians: Technician[];
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<void>;
}

export const AdminTicketManagement: React.FC<AdminTicketManagementProps> = ({
  tickets,
  technicians,
  onUpdateTicket
}) => {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

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

  const handleViewDetails = (ticket: Ticket) => {
    setViewingTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };

  const handleSaveTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    await onUpdateTicket(ticketId, updates);
    setEditingTicket(null);
    setIsEditModalOpen(false);
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
        onSave={handleSaveTicket}
        technicians={technicians}
      />
    </>
  );
};
