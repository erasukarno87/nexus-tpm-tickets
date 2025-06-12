
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Users, 
  FileText, 
  Search, 
  Edit3, 
  Save, 
  X,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Image
} from 'lucide-react';

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  status: 'open' | 'in_progress' | 'pending_parts' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'corrective_action' | 'repair' | 'procurement' | 'support';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  location: string;
  requester_name: string;
  requester_department: string;
  machine_id?: string;
  description: string;
  notes?: string;
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-blue-500', glow: 'shadow-blue-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500', glow: 'shadow-yellow-500/30' },
  pending_parts: { label: 'Pending Parts', color: 'bg-orange-500', glow: 'shadow-orange-500/30' },
  completed: { label: 'Completed', color: 'bg-green-500', glow: 'shadow-green-500/30' },
  closed: { label: 'Closed', color: 'bg-gray-500', glow: 'shadow-gray-500/30' },
};

const priorityConfig = {
  low: { color: 'border-green-500 text-green-400' },
  medium: { color: 'border-yellow-500 text-yellow-400' },
  high: { color: 'border-orange-500 text-orange-400' },
  critical: { color: 'border-red-500 text-red-400' },
};

const Admin = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
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
        ticket.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchQuery.toLowerCase())
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
      const { error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;

      // Add log entry
      await supabase
        .from('ticket_logs')
        .insert({
          ticket_id: ticketId,
          action: 'Updated',
          description: `Ticket updated by admin`,
          created_by: 'Admin'
        });

      await fetchTickets();
      setEditingTicket(null);
      
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-xl">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Background */}
      <div className="particle-bg fixed inset-0 z-0"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              TPM Admin Panel
            </h1>
            <p className="text-xl text-gray-300">
              Manage and monitor all maintenance requests
            </p>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <Card className="glass-card border-0 neon-glow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input text-white pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="glass-input text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending_parts">Pending Parts</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="glass-input text-white">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>Total: {filteredTickets.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="glass-card border-0 hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  {editingTicket?.id === ticket.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm">Status</label>
                          <Select 
                            value={editingTicket.status} 
                            onValueChange={(value) => setEditingTicket({...editingTicket, status: value as any})}
                          >
                            <SelectTrigger className="glass-input text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="pending_parts">Pending Parts</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-white text-sm">Assigned To</label>
                          <Input
                            value={editingTicket.assigned_to || ''}
                            onChange={(e) => setEditingTicket({...editingTicket, assigned_to: e.target.value})}
                            className="glass-input text-white"
                            placeholder="Assign technician"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white text-sm">Notes</label>
                        <Textarea
                          value={editingTicket.notes || ''}
                          onChange={(e) => setEditingTicket({...editingTicket, notes: e.target.value})}
                          className="glass-input text-white"
                          placeholder="Add notes..."
                        />
                      </div>

                      <div>
                        <label className="text-white text-sm mb-2 block">
                          <Image className="w-4 h-4 inline mr-2" />
                          After Repair Photos (Optional Evidence)
                        </label>
                        <ImageUpload
                          existingImages={Array.isArray(editingTicket.after_photos) ? editingTicket.after_photos as string[] : []}
                          onImagesChange={(images) => setEditingTicket({...editingTicket, after_photos: images})}
                          maxImages={5}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => updateTicket(ticket.id, editingTicket)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingTicket(null)}
                          className="glass-input"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold text-white">{ticket.title}</h3>
                            <Badge className={`${statusConfig[ticket.status].color} ${statusConfig[ticket.status].glow} shadow-lg border-0`}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1">{statusConfig[ticket.status].label}</span>
                            </Badge>
                          </div>
                          <p className="text-lg font-mono text-blue-400">{ticket.ticket_number}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTicket(ticket)}
                          className="glass-input border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{ticket.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <User className="w-4 h-4 text-green-400" />
                          <span>{ticket.assigned_to || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>{formatDate(ticket.created_at)}</span>
                        </div>
                        <div className={`inline-block px-2 py-1 rounded border ${priorityConfig[ticket.priority].color} text-xs`}>
                          {ticket.priority.toUpperCase()}
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-2">{ticket.description}</p>
                      
                      {/* Display after photos if available */}
                      {ticket.after_photos && Array.isArray(ticket.after_photos) && ticket.after_photos.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-white text-sm mb-2 flex items-center">
                            <Image className="w-4 h-4 mr-2" />
                            After Repair Evidence ({ticket.after_photos.length} photos)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {ticket.after_photos.map((photo: string, index: number) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`After repair ${index + 1}`}
                                className="w-full h-20 object-cover rounded border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
                                onClick={() => window.open(photo, '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        Requester: {ticket.requester_name} ({ticket.requester_department})
                        {ticket.machine_id && ` | Machine: ${ticket.machine_id}`}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredTickets.length === 0 && (
              <Card className="glass-card border-0 border-dashed">
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
                  <p className="text-gray-400">
                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'No tickets have been submitted yet'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
