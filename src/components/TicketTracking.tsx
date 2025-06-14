import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, QrCode, Calendar, User, Clock, CheckCircle, AlertTriangle, Loader2, Eye, X } from 'lucide-react';

interface TicketStatus {
  id: string;
  ticket_number: string;
  title: string;
  status: 'open' | 'in_progress' | 'pending_parts' | 'closed' | 'ditolak';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'corrective_action' | 'repair' | 'procurement' | 'support';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  assigned_to?: string;
  line_area_name?: string;
  requester_name: string;
  requester_department: string;
  description: string;
  notes?: string;
  rejection_reason?: string;
  before_photos: string[];
  after_photos: string[];
}

interface TicketLog {
  id: string;
  action: string;
  description: string;
  created_by: string;
  created_at: string;
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

export const TicketTracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundTickets, setFoundTickets] = useState<TicketStatus[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketStatus | null>(null);
  const [ticketLogs, setTicketLogs] = useState<TicketLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Check for stored ticket number from localStorage
  useEffect(() => {
    const storedTicketNumber = localStorage.getItem('searchTicketNumber');
    if (storedTicketNumber) {
      console.log('Found stored ticket number:', storedTicketNumber);
      setSearchQuery(storedTicketNumber);
      // Clear the stored ticket number after using it
      localStorage.removeItem('searchTicketNumber');
      // Automatically search for the ticket
      setTimeout(() => {
        handleSearchWithTicketNumber(storedTicketNumber);
      }, 500); // Increased delay to ensure state is updated
    }
  }, []);

  const handleSearchWithTicketNumber = async (ticketNumber: string) => {
    setIsSearching(true);
    
    try {
      console.log('Auto-searching for ticket:', ticketNumber);
      
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .or(`ticket_number.ilike.%${ticketNumber}%,title.ilike.%${ticketNumber}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Auto-search results:', tickets);
      
      // Type casting untuk memastikan compatibility dengan interface
      const typedTickets = tickets?.map(ticket => ({
        ...ticket,
        status: ticket.status as TicketStatus['status'],
        priority: ticket.priority as TicketStatus['priority'],
        category: ticket.category as TicketStatus['category'],
        before_photos: (ticket.before_photos as string[]) || [],
        after_photos: (ticket.after_photos as string[]) || []
      })) || [];
      
      setFoundTickets(typedTickets);
      
      if (!tickets || tickets.length === 0) {
        toast({
          title: "Tidak Ada Hasil",
          description: "Tidak ditemukan tiket yang sesuai dengan kriteria pencarian",
        });
      } else {
        toast({
          title: "Tiket Ditemukan",
          description: `Ditemukan ${tickets.length} tiket yang sesuai`,
        });
      }
      
    } catch (error: any) {
      console.error('Error auto-searching tickets:', error);
      toast({
        title: "Error Pencarian",
        description: error.message || "Gagal mencari tiket. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'open': return 10;
      case 'in_progress': return 50;
      case 'pending_parts': return 75;
      case 'closed': return 100;
      case 'ditolak': return 0;
      default: return 0;
    }
  };

  const getStorageUrl = (filePath: string) => {
    // Remove the full URL if it's already a complete URL
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // Create the full storage URL for ticket-images bucket
    return `https://hmqrtiijlvbjnnspumly.supabase.co/storage/v1/object/public/ticket-images/${filePath}`;
  };

  const renderPhotos = (photos: string[] | null | undefined, title: string) => {
    console.log(`Rendering ${title}:`, photos);
    
    // Check for null, undefined, or empty array
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      console.log(`No ${title} to display`);
      return null;
    }

    return (
      <div className="mt-6">
        <label className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 block">{title}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => {
            const imageUrl = getStorageUrl(photo);
            console.log(`${title} ${index + 1} URL:`, imageUrl);
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
                  onLoad={() => {
                    console.log(`Successfully loaded ${title} image:`, imageUrl);
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Silakan masukkan nomor tiket atau kata kunci pencarian",
        variant: "destructive",
      });
      return;
    }
    
    await handleSearchWithTicketNumber(searchQuery.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'ditolak': return <X className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleViewDetails = async (ticket: TicketStatus) => {
    console.log('Selected ticket for details:', ticket);
    console.log('Before photos:', ticket.before_photos);
    console.log('After photos:', ticket.after_photos);
    
    setSelectedTicket(ticket);
    setIsModalOpen(true);
    
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
        description: "Gagal memuat detail tiket",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Interface */}
      <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Lacak Permintaan Anda
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Masukkan nomor tiket atau cari berdasarkan kata kunci
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan nomor tiket (mis. TPM-20241211-0001) atau kata kunci..."
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 h-12 pl-12 text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 text-white"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Cari
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 border-dashed hover:border-blue-400 text-gray-800 dark:text-gray-200"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Pindai Kode QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {foundTickets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Hasil Pencarian</h3>
          <div className="grid gap-4">
            {foundTickets.map((ticket) => (
              <Card key={ticket.id} className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{ticket.title}</h3>
                        <Badge 
                          className={`${statusConfig[ticket.status].color} ${statusConfig[ticket.status].glow} shadow-lg border-0 text-white`}
                        >
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{statusConfig[ticket.status].label}</span>
                        </Badge>
                      </div>
                      <p className="text-lg font-mono text-blue-600 dark:text-blue-400">{ticket.ticket_number}</p>
                    </div>
                    
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(ticket)}
                          className="bg-white dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Lihat Detail
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Detail Tiket: {selectedTicket?.title}
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Informasi lengkap tentang tiket {selectedTicket?.ticket_number}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedTicket && (
                          <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Status & Progres</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Status Saat Ini:</span>
                                    <Badge className={`${statusConfig[selectedTicket.status].color} ${statusConfig[selectedTicket.status].glow} shadow-lg border-0 text-white`}>
                                      {getStatusIcon(selectedTicket.status)}
                                      <span className="ml-1">{statusConfig[selectedTicket.status].label}</span>
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Progres Penyelesaian</span>
                                      <span className="text-gray-900 dark:text-white font-semibold">{calculateProgress(selectedTicket.status)}%</span>
                                    </div>
                                    <Progress value={calculateProgress(selectedTicket.status)} className="h-3" />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Detail</h4>
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Prioritas:</span>
                                    <span className={`font-semibold ${priorityConfig[selectedTicket.priority].color.split(' ')[1]}`}>
                                      {selectedTicket.priority.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                                    <span className="text-gray-900 dark:text-white">{categoryLabels[selectedTicket.category]}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Line/Area:</span>
                                    <span className="text-gray-900 dark:text-white">{selectedTicket.line_area_name || 'Tidak Ada'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ditugaskan Kepada:</span>
                                    <span className="text-gray-900 dark:text-white">{selectedTicket.assigned_to || 'Belum Ditugaskan'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Pemohon:</span>
                                    <span className="text-gray-900 dark:text-white">{selectedTicket.requester_name} ({selectedTicket.requester_department})</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Deskripsi kondisi saat ini</h4>
                              <p className="text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">{selectedTicket.description}</p>
                              
                              {renderPhotos(selectedTicket.before_photos, "Foto Sebelum")}
                              
                              {renderPhotos(selectedTicket.after_photos, "Foto Sesudah")}

                              {selectedTicket.notes && (
                                <>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Catatan dari Tim TPM</h4>
                                  <p className="text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">{selectedTicket.notes}</p>
                                </>
                              )}
                              {selectedTicket.rejection_reason && selectedTicket.status === 'ditolak' && (
                                <>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Alasan Penolakan</h4>
                                  <p className="text-red-700 dark:text-red-300 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">{selectedTicket.rejection_reason}</p>
                                </>
                              )}
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Linimasa Aktivitas</h4>
                              <div className="space-y-4">
                                {ticketLogs.map((entry, index) => (
                                  <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">{entry.action}</h5>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(entry.created_at)}</span>
                                      </div>
                                      <p className="text-gray-700 dark:text-gray-300 text-sm">{entry.description}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">oleh {entry.created_by}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <span>{ticket.assigned_to || 'Belum Ditugaskan'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <span>{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progres</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{calculateProgress(ticket.status)}%</span>
                    </div>
                    <Progress value={calculateProgress(ticket.status)} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className={`inline-block px-3 py-1 rounded-full border-2 ${priorityConfig[ticket.priority].color} text-sm font-medium`}>
                      PRIORITAS {ticket.priority.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{categoryLabels[ticket.category]}</span>
                  </div>

                  {ticket.status === 'ditolak' && ticket.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm font-semibold">Alasan Penolakan:</p>
                      <p className="text-red-700 dark:text-red-300 text-sm">{ticket.rejection_reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {foundTickets.length === 0 && !isSearching && (
        <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 border-dashed">
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lacak Permintaan TPM Anda</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Masukkan nomor tiket atau kata kunci untuk menemukan status permintaan pemeliharaan Anda
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
              <p>• Nomor tiket mengikuti format: TPM-YYYYMMDD-XXXX</p>
              <p>• Anda juga dapat mencari berdasarkan kata kunci deskripsi</p>
              <p>• Gunakan scanner kode QR untuk akses cepat dari perangkat mobile</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
