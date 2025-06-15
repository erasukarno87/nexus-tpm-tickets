
import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { MasterData } from '@/components/MasterData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ModernBackground } from '@/components/ModernBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
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
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  LogOut,
  BarChart3,
  Database,
  Shield,
  Sparkles,
  Eye
} from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';

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

const categoryLabels = {
  corrective_action: 'Tindakan Korektif',
  repair: 'Perbaikan',
  procurement: 'Pengadaan',
  support: 'Dukungan'
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
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      // Validation: If status is not 'open', assigned_to must be selected
      if (updates.status && updates.status !== 'open' && (!updates.assigned_to || updates.assigned_to === 'unassigned')) {
        toast({
          title: "Validasi Error",
          description: "Ketika status bukan 'Terbuka', tiket harus ditugaskan kepada teknisi",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating ticket with ID:', ticketId);
      console.log('Updates:', updates);

      // Remove undefined/null values and ensure proper data types
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      console.log('Clean updates:', cleanUpdates);

      const { data, error } = await supabase
        .from('tickets')
        .update(cleanUpdates)
        .eq('id', ticketId)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update successful:', data);

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

  const getStorageUrl = (filePath: string) => {
    // Remove the full URL if it's already a complete URL
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // Create the full storage URL for ticket-images bucket
    return `https://hmqrtiijlvbjnnspumly.supabase.co/storage/v1/object/public/ticket-images/${filePath}`;
  };

  const renderPhotos = (photos: string[] | null, title: string) => {
    if (!photos || photos.length === 0) return null;

    return (
      <div>
        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{title}</label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => {
            const imageUrl = getStorageUrl(photo);
            return (
              <div key={index} className="relative group">
                <img 
                  src={imageUrl}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open(imageUrl, '_blank')}
                  onError={(e) => {
                    console.error('Error loading image:', imageUrl);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Enhanced Header */}
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
            <div className="flex flex-col items-center space-y-4 animate-slideInRight">
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

        {/* Main Content with enhanced styling */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 mb-8 p-2 h-16">
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-800 dark:text-gray-200"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="tickets" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-800 dark:text-gray-200"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Kelola Tiket
                </TabsTrigger>
                <TabsTrigger 
                  value="master-data" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-800 dark:text-gray-200"
                >
                  <Database className="w-5 h-5 mr-2" />
                  Data Master
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="animate-slideInLeft">
                <Dashboard />
              </TabsContent>

              <TabsContent value="tickets" className="animate-fadeIn">
                {/* Enhanced Filters and Search */}
                <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 mb-8 shadow-lg">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <Input
                          placeholder="Cari tiket..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pl-12 h-12 text-lg"
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-12">
                          <SelectValue placeholder="Filter berdasarkan status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="open">Terbuka</SelectItem>
                          <SelectItem value="in_progress">Sedang Proses</SelectItem>
                          <SelectItem value="pending_parts">Menunggu Suku Cadang</SelectItem>
                          <SelectItem value="closed">Selesai</SelectItem>
                          <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-12">
                          <SelectValue placeholder="Filter berdasarkan prioritas" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <SelectItem value="all">Semua Prioritas</SelectItem>
                          <SelectItem value="low">Rendah</SelectItem>
                          <SelectItem value="medium">Sedang</SelectItem>
                          <SelectItem value="high">Tinggi</SelectItem>
                          <SelectItem value="critical">Kritis</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 bg-gradient-to-r from-blue-100 dark:from-blue-500/20 to-purple-100 dark:to-purple-500/20 rounded-lg p-3 border border-blue-200 dark:border-blue-500/30">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold">Total: {filteredTickets.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Tickets List */}
                <div className="space-y-6">
                  {filteredTickets.map((ticket, index) => (
                    <Card 
                      key={ticket.id} 
                      className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-500"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        {/* Enhanced View Mode */}
                        <div>
                          <div className="flex items-start justify-between mb-6">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{ticket.title}</h3>
                                <Badge className={`${statusConfig[ticket.status].color} ${statusConfig[ticket.status].glow} shadow-lg border-0 px-3 py-1 text-white`}>
                                  {getStatusIcon(ticket.status)}
                                  <span className="ml-2 font-semibold">{statusConfig[ticket.status].label}</span>
                                </Badge>
                              </div>
                              <p className="text-lg font-mono text-blue-600 dark:text-blue-400 font-bold">{ticket.ticket_number}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                              <User className="w-5 h-5 text-green-500 dark:text-green-400" />
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Teknisi</p>
                                <p className="text-gray-900 dark:text-white font-semibold">{ticket.assigned_to || 'Belum Ditugaskan'}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                              <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Dibuat</p>
                                <p className="text-gray-900 dark:text-white font-semibold text-xs">{formatDate(ticket.created_at)}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-center p-3">
                              <div className={`px-4 py-2 rounded-full border-2 ${priorityConfig[ticket.priority].color} text-sm font-bold`}>
                                PRIORITAS {ticket.priority.toUpperCase()}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mb-4">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{ticket.description}</p>
                          </div>
                          
                          {ticket.status === 'ditolak' && ticket.rejection_reason && (
                            <div className="mt-4 p-4 bg-red-100 dark:bg-red-500/20 border-2 border-red-300 dark:border-red-500 rounded-lg">
                              <p className="text-red-600 dark:text-red-400 text-sm font-bold mb-2">⚠️ Alasan Penolakan:</p>
                              <p className="text-red-700 dark:text-red-300">{ticket.rejection_reason}</p>
                            </div>
                          )}

                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mb-6">
                            <strong>Pemohon:</strong> {ticket.requester_name} ({ticket.requester_department})
                          </div>

                          {/* Buttons moved to bottom with proper size */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  onClick={() => setViewingTicket(ticket)}
                                  className="bg-white dark:bg-gray-800 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 h-12 px-6 text-base font-medium"
                                >
                                  <Eye className="w-5 h-5 mr-2" />
                                  Lihat Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Detail Tiket: {ticket.title}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                                    Informasi lengkap tentang tiket {ticket.ticket_number}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Nomor Tiket</label>
                                      <p className="text-lg font-mono text-blue-600 dark:text-blue-400">{ticket.ticket_number}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                                      <div className="mt-1">
                                        <Badge className={`${statusConfig[ticket.status].color} text-white`}>
                                          {getStatusIcon(ticket.status)}
                                          <span className="ml-1">{statusConfig[ticket.status].label}</span>
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Prioritas</label>
                                      <div className={`mt-1 inline-block px-3 py-1 rounded-full border-2 ${priorityConfig[ticket.priority].color} text-sm font-bold`}>
                                        {ticket.priority.toUpperCase()}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Kategori</label>
                                      <p className="text-gray-900 dark:text-white">{categoryLabels[ticket.category]}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Line/Area</label>
                                      <p className="text-gray-900 dark:text-white">{ticket.line_area_name || 'Tidak Ada'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Teknisi</label>
                                      <p className="text-gray-900 dark:text-white">{ticket.assigned_to || 'Belum Ditugaskan'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Pemohon</label>
                                      <p className="text-gray-900 dark:text-white">{ticket.requester_name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Departemen</label>
                                      <p className="text-gray-900 dark:text-white">{ticket.requester_department}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tanggal Dibuat</label>
                                      <p className="text-gray-900 dark:text-white">{formatDate(ticket.created_at)}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Deskripsi</label>
                                    <p className="text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mt-2">
                                      {ticket.description}
                                    </p>
                                  </div>

                                  {renderPhotos(ticket.before_photos, "Foto Sebelum")}
                                  
                                  {renderPhotos(ticket.after_photos, "Foto Sesudah")}

                                  {ticket.notes && (
                                    <div>
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Catatan dari Tim TPM</label>
                                      <p className="text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mt-2">
                                        {ticket.notes}
                                      </p>
                                    </div>
                                  )}

                                  {ticket.status === 'ditolak' && ticket.rejection_reason && (
                                    <div>
                                      <label className="text-sm font-semibold text-red-600 dark:text-red-400">Alasan Penolakan</label>
                                      <p className="text-red-700 dark:text-red-300 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg mt-2">
                                        {ticket.rejection_reason}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Update Ticket Modal */}
                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  onClick={() => {
                                    setEditingTicket(ticket);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="bg-white dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 h-12 px-6 text-base font-medium"
                                >
                                  <Edit3 className="w-5 h-5 mr-2" />
                                  Update Tiket
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Update Tiket: {editingTicket?.title}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                                    Perbarui informasi tiket {editingTicket?.ticket_number}
                                  </DialogDescription>
                                </DialogHeader>

                                {editingTicket && (
                                  <div className="space-y-6 mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Status</label>
                                        <Select 
                                          value={editingTicket.status} 
                                          onValueChange={(value) => setEditingTicket({...editingTicket, status: value as any})}
                                        >
                                          <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-12">
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
                                        <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Ditugaskan Kepada</label>
                                        <Select 
                                          value={editingTicket.assigned_to || 'unassigned'} 
                                          onValueChange={(value) => setEditingTicket({...editingTicket, assigned_to: value === 'unassigned' ? undefined : value})}
                                        >
                                          <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-12">
                                            <SelectValue placeholder="Pilih teknisi" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="unassigned">Belum Ditugaskan</SelectItem>
                                            {technicians.map((tech) => (
                                              <SelectItem key={tech.id} value={tech.name}>
                                                {tech.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    {editingTicket.status === 'ditolak' && (
                                      <div>
                                        <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Alasan Penolakan *</label>
                                        <Textarea
                                          value={editingTicket.rejection_reason || ''}
                                          onChange={(e) => setEditingTicket({...editingTicket, rejection_reason: e.target.value})}
                                          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[100px]"
                                          placeholder="Masukkan alasan penolakan..."
                                          required
                                        />
                                      </div>
                                    )}

                                    <div>
                                      <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Catatan dari Tim TPM</label>
                                      <Textarea
                                        value={editingTicket.notes || ''}
                                        onChange={(e) => setEditingTicket({...editingTicket, notes: e.target.value})}
                                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[100px]"
                                        placeholder="Tambahkan catatan dari tim TPM..."
                                      />
                                    </div>

                                    {/* Upload Foto Before */}
                                    <div>
                                      <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Upload Foto Before</label>
                                      <ImageUpload
                                        onImagesChange={(images) => setEditingTicket({...editingTicket, before_photos: images})}
                                        existingImages={editingTicket.before_photos || []}
                                        maxImages={5}
                                      />
                                    </div>

                                    {/* Upload Foto After */}
                                    <div>
                                      <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Upload Foto After</label>
                                      <ImageUpload
                                        onImagesChange={(images) => setEditingTicket({...editingTicket, after_photos: images})}
                                        existingImages={editingTicket.after_photos || []}
                                        maxImages={5}
                                      />
                                    </div>
                                  </div>
                                )}

                                <DialogFooter className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                  <div className="flex justify-end space-x-4 w-full">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditingTicket(null);
                                        setIsEditModalOpen(false);
                                      }}
                                      className="bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-500 hover:text-white transition-all duration-300"
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Close
                                    </Button>
                                    <Button
                                      onClick={() => editingTicket && updateTicket(ticket.id, editingTicket)}
                                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 text-white"
                                    >
                                      <Save className="w-4 h-4 mr-2" />
                                      Simpan Perubahan
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
    </div>
  );
};

export default Admin;
