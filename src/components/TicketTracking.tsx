
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, QrCode, Calendar, User, MapPin, Clock, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react';

interface TicketStatus {
  id: string;
  ticket_number: string;
  title: string;
  status: 'open' | 'in_progress' | 'pending_parts' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'corrective_action' | 'repair' | 'procurement' | 'support';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  assigned_to?: string;
  location: string;
  requester_name: string;
  requester_department: string;
  machine_id?: string;
  description: string;
  notes?: string;
}

interface TicketLog {
  id: string;
  action: string;
  description: string;
  created_by: string;
  created_at: string;
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

export const TicketTracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundTickets, setFoundTickets] = useState<TicketStatus[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketStatus | null>(null);
  const [ticketLogs, setTicketLogs] = useState<TicketLog[]>([]);
  const { toast } = useToast();

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'open': return 10;
      case 'in_progress': return 50;
      case 'pending_parts': return 75;
      case 'completed': return 100;
      case 'closed': return 100;
      default: return 0;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a ticket number or search term",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      console.log('Searching for:', searchQuery);
      
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .or(`ticket_number.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%,machine_id.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', tickets);
      setFoundTickets(tickets || []);
      
      if (!tickets || tickets.length === 0) {
        toast({
          title: "No Results",
          description: "No tickets found matching your search criteria",
        });
      }
      
    } catch (error: any) {
      console.error('Error searching tickets:', error);
      toast({
        title: "Search Error",
        description: error.message || "Failed to search tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewDetails = async (ticket: TicketStatus) => {
    setSelectedTicket(ticket);
    
    try {
      const { data: logs, error } = await supabase
        .from('ticket_logs')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching logs:', error);
        throw error;
      }

      setTicketLogs(logs || []);
    } catch (error: any) {
      console.error('Error fetching ticket logs:', error);
      toast({
        title: "Error",
        description: "Failed to load ticket details",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Interface */}
      <Card className="glass-card border-0 neon-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text mb-2">
            Track Your Request
          </CardTitle>
          <p className="text-gray-400">
            Enter your ticket number or search by keywords
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter ticket number (e.g., TPM-20241211-0001) or search terms..."
                className="glass-input text-white placeholder-gray-400 h-12 pl-12 text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="glass-input border-dashed hover:border-blue-400"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {foundTickets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Search Results</h3>
          <div className="grid gap-4">
            {foundTickets.map((ticket) => (
              <Card key={ticket.id} className="glass-card border-0 hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-white">{ticket.title}</h3>
                        <Badge 
                          className={`${statusConfig[ticket.status].color} ${statusConfig[ticket.status].glow} shadow-lg border-0`}
                        >
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{statusConfig[ticket.status].label}</span>
                        </Badge>
                      </div>
                      <p className="text-lg font-mono text-blue-400">{ticket.ticket_number}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(ticket)}
                      className="glass-input border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-semibold">{calculateProgress(ticket.status)}%</span>
                    </div>
                    <Progress value={calculateProgress(ticket.status)} className="h-2" />
                  </div>

                  <div className={`inline-block px-3 py-1 rounded-full border-2 ${priorityConfig[ticket.priority].color} text-sm font-medium mt-4`}>
                    {ticket.priority.toUpperCase()} PRIORITY
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Ticket View Modal */}
      {selectedTicket && (
        <Card className="glass-card border-0 neon-glow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl gradient-text">{selectedTicket.title}</CardTitle>
                <p className="text-lg font-mono text-blue-400 mt-1">{selectedTicket.ticket_number}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(null)}
                className="glass-input"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Status & Progress</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Status:</span>
                    <Badge className={`${statusConfig[selectedTicket.status].color} ${statusConfig[selectedTicket.status].glow} shadow-lg border-0`}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1">{statusConfig[selectedTicket.status].label}</span>
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Completion Progress</span>
                      <span className="text-white font-semibold">{calculateProgress(selectedTicket.status)}%</span>
                    </div>
                    <Progress value={calculateProgress(selectedTicket.status)} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Priority:</span>
                    <span className={`font-semibold ${priorityConfig[selectedTicket.priority].color.split(' ')[1]}`}>
                      {selectedTicket.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{selectedTicket.category.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{selectedTicket.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Machine ID:</span>
                    <span className="text-white">{selectedTicket.machine_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned To:</span>
                    <span className="text-white">{selectedTicket.assigned_to || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Requester:</span>
                    <span className="text-white">{selectedTicket.requester_name} ({selectedTicket.requester_department})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Description</h4>
              <p className="text-gray-300 p-4 glass-card rounded-lg">{selectedTicket.description}</p>
              {selectedTicket.notes && (
                <>
                  <h4 className="text-lg font-semibold text-white">Additional Notes</h4>
                  <p className="text-gray-300 p-4 glass-card rounded-lg">{selectedTicket.notes}</p>
                </>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Activity Timeline</h4>
              <div className="space-y-4">
                {ticketLogs.map((entry, index) => (
                  <div key={entry.id} className="flex items-start space-x-4 p-4 glass-card rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-white">{entry.action}</h5>
                        <span className="text-sm text-gray-400">{formatDate(entry.created_at)}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{entry.description}</p>
                      <p className="text-xs text-gray-500 mt-1">by {entry.created_by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {foundTickets.length === 0 && !isSearching && (
        <Card className="glass-card border-0 border-dashed">
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Track Your TPM Request</h3>
            <p className="text-gray-400 mb-4">
              Enter your ticket number or search terms to find your maintenance request status
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Ticket numbers follow the format: TPM-YYYYMMDD-XXXX</p>
              <p>• You can also search by machine ID, location, or description keywords</p>
              <p>• Use the QR code scanner for quick access from mobile devices</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
