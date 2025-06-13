import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { MasterData } from '@/components/MasterData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Background3D } from '@/components/Background3D';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  LogOut,
  BarChart3,
  Database
} from 'lucide-react';

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
  location: string;
  requester_name: string;
  requester_department: string;
  machine_id?: string;
  description: string;
  notes?: string;
  rejection_reason?: string;
}

interface Technician {
  id: string;
  name: string;
  email?: string;
  specialty?: string;
  is_active: boolean;
}

const statusConfig = {
  open: { label: 'Terbuka', color: 'bg-blue-500', glow: 'shadow-blue-500/30' },
  in_progress: { label: 'Sedang Proses', color: 'bg-yellow-500', glow: 'shadow-yellow-500/30' },
  pending_parts: { label: 'Menunggu Suku Cadang', color: 'bg-orange-500', glow: 'shadow-orange-500/30' },
  closed: { label: 'Selesai', color: 'bg-green-500', glow: 'shadow-green-500/30' },
  ditolak: { label: 'Ditolak', color: 'bg-red-500', glow: 'shadow-red-500/30' },
};

const priorityConfig = {
  low: { color: 'border-green-500 text-green-400' },
  medium: { color: 'border-yellow-500 text-yellow-400' },
  high: { color: 'border-orange-500 text-orange-400' },
  critical: { color: 'border-red-500 text-red-400' },
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
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
      
      // Type casting untuk memastikan compatibility dengan interface
      const typedTickets = data?.map(ticket => ({
        ...ticket,
        status: ticket.status as Ticket['status'],
        priority: ticket.priority as Ticket['priority'],
        category: ticket.category as Ticket['category']
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
      
      toast({
        title: "Berhasil",
        description: "Tiket berhasil diperbarui",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memperbarui tiket",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen">
        <Background3D />
        <div className="relative z-10">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <Background3D />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center">
            <Settings className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-white text-xl">Memuat Panel Admin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background3D />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                Panel Admin TPM
              </h1>
              <p className="text-xl text-gray-300">
                Kelola dan pantau semua permintaan pemeliharaan
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="glass-input border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-card mb-8">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Kelola Tiket
              </TabsTrigger>
              <TabsTrigger value="master-data" className="data-[state=active]:bg-blue-600">
                <Database className="w-4 h-4 mr-2" />
                Data Master
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            <TabsContent value="tickets">
              {/* Filters and Search */}
              <Card className="glass-card border-0 neon-glow mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Cari tiket..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input text-white pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="glass-input text-white">
                        <SelectValue placeholder="Filter berdasarkan status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="open">Terbuka</SelectItem>
                        <SelectItem value="in_progress">Sedang Proses</SelectItem>
                        <SelectItem value="pending_parts">Menunggu Suku Cadang</SelectItem>
                        <SelectItem value="closed">Selesai</SelectItem>
                        <SelectItem value="ditolak">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="glass-input text-white">
                        <SelectValue placeholder="Filter berdasarkan prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Prioritas</SelectItem>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="critical">Kritis</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>Total: {filteredTickets.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets List */}
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
                                  <SelectItem value="open">Terbuka</SelectItem>
                                  <SelectItem value="in_progress">Sedang Proses</SelectItem>
                                  <SelectItem value="pending_parts">Menunggu Suku Cadang</SelectItem>
                                  <SelectItem value="closed">Selesai</SelectItem>
                                  <SelectItem value="ditolak">Ditolak</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="text-white text-sm">Ditugaskan Kepada</label>
                              <Select 
                                value={editingTicket.assigned_to || ''} 
                                onValueChange={(value) => setEditingTicket({...editingTicket, assigned_to: value})}
                              >
                                <SelectTrigger className="glass-input text-white">
                                  <SelectValue placeholder="Pilih teknisi" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">Belum Ditugaskan</SelectItem>
                                  {technicians.map((tech) => (
                                    <SelectItem key={tech.id} value={tech.name}>
                                      {tech.name} {tech.specialty && `(${tech.specialty})`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {editingTicket.status === 'ditolak' && (
                            <div>
                              <label className="text-white text-sm">Alasan Penolakan *</label>
                              <Textarea
                                value={editingTicket.rejection_reason || ''}
                                onChange={(e) => setEditingTicket({...editingTicket, rejection_reason: e.target.value})}
                                className="glass-input text-white"
                                placeholder="Masukkan alasan penolakan..."
                                required
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-white text-sm">Catatan Admin</label>
                            <Textarea
                              value={editingTicket.notes || ''}
                              onChange={(e) => setEditingTicket({...editingTicket, notes: e.target.value})}
                              className="glass-input text-white"
                              placeholder="Tambahkan catatan admin..."
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => updateTicket(ticket.id, editingTicket)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Simpan
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingTicket(null)}
                              className="glass-input"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Batal
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
                              <span>{ticket.assigned_to || 'Belum Ditugaskan'}</span>
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
                          
                          {ticket.status === 'ditolak' && ticket.rejection_reason && (
                            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                              <p className="text-red-400 text-sm font-semibold">Alasan Penolakan:</p>
                              <p className="text-red-300 text-sm">{ticket.rejection_reason}</p>
                            </div>
                          )}

                          <div className="text-xs text-gray-500 mt-2">
                            Pemohon: {ticket.requester_name} ({ticket.requester_department})
                            {ticket.machine_id && ` | Mesin: ${ticket.machine_id}`}
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
                      <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Tiket Ditemukan</h3>
                      <p className="text-gray-400">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                          ? 'Coba sesuaikan filter Anda' 
                          : 'Belum ada tiket yang diajukan'
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
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
