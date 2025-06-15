
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
  open: { label: 'Terbuka', color: 'status-open' },
  in_progress: { label: 'Sedang Proses', color: 'status-in-progress' },
  pending_parts: { label: 'Menunggu Suku Cadang', color: 'status-pending' },
  closed: { label: 'Selesai', color: 'status-closed' },
  ditolak: { label: 'Ditolak', color: 'status-rejected' },
};

const priorityConfig = {
  low: { color: 'priority-low' },
  medium: { color: 'priority-medium' },
  high: { color: 'priority-high' },
  critical: { color: 'priority-critical' },
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
      <label className="detail-photo-label">{title}</label>
      <div className="detail-photo-grid">
        {photos.map((photo, index) => {
          const imageUrl = getStorageUrl(photo);
          return (
            <div key={index} className="detail-photo-item">
              <img 
                src={imageUrl}
                alt={`${title} ${index + 1}`}
                className="detail-photo-image"
                onClick={() => window.open(imageUrl, '_blank')}
                onError={(e) => {
                  console.error('Error loading image:', imageUrl);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="detail-photo-overlay">
                <Eye className="detail-photo-eye-icon" />
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
      <DialogContent className="modal-content-large">
        <DialogHeader>
          <DialogTitle className="modal-title-gradient">
            Detail Tiket: {ticket.title}
          </DialogTitle>
          <DialogDescription className="modal-description">
            Informasi lengkap tentang tiket {ticket.ticket_number}
          </DialogDescription>
        </DialogHeader>
        <div className="modal-form-container">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="detail-field-label">Nomor Tiket</label>
              <p className="ticket-number">{ticket.ticket_number}</p>
            </div>
            <div>
              <label className="detail-field-label">Status</label>
              <div className="mt-1">
                <Badge className={`${statusConfig[ticket.status].color} border-0 px-3 py-1 text-white`}>
                  {getStatusIcon(ticket.status)}
                  <span className="ml-1">{statusConfig[ticket.status].label}</span>
                </Badge>
              </div>
            </div>
            <div>
              <label className="detail-field-label">Prioritas</label>
              <div className={`priority-badge ${priorityConfig[ticket.priority].color}`}>
                {ticket.priority.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="detail-field-label">Kategori</label>
              <p className="detail-field-value">{categoryLabels[ticket.category]}</p>
            </div>
            <div>
              <label className="detail-field-label">Line/Area</label>
              <p className="detail-field-value">{ticket.line_area_name || 'Tidak Ada'}</p>
            </div>
            <div>
              <label className="detail-field-label">Teknisi</label>
              <p className="detail-field-value">{ticket.assigned_to || 'Belum Ditugaskan'}</p>
            </div>
            <div>
              <label className="detail-field-label">Pemohon</label>
              <p className="detail-field-value">{ticket.requester_name}</p>
            </div>
            <div>
              <label className="detail-field-label">Departemen</label>
              <p className="detail-field-value">{ticket.requester_department}</p>
            </div>
            <div>
              <label className="detail-field-label">Tanggal Dibuat</label>
              <p className="detail-field-value">{formatDate(ticket.created_at)}</p>
            </div>
          </div>

          <div>
            <label className="detail-field-label">Deskripsi kondisi saat ini</label>
            <p className="detail-description">
              {ticket.description}
            </p>
          </div>

          {renderPhotos(ticket.before_photos, "Foto Sebelum")}
          
          {renderPhotos(ticket.after_photos, "Foto Sesudah")}

          {ticket.notes && (
            <div>
              <label className="detail-field-label">Catatan dari Tim TPM</label>
              <p className="detail-notes">
                {ticket.notes}
              </p>
            </div>
          )}

          {ticket.status === 'ditolak' && ticket.rejection_reason && (
            <div>
              <label className="detail-rejection-label">Alasan Penolakan</label>
              <p className="detail-rejection-text">
                {ticket.rejection_reason}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
