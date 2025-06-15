
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';

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

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
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
  if (filePath.startsWith('http')) {
    return filePath;
  }
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

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Deskripsi kondisi saat ini</label>
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
  );
};
