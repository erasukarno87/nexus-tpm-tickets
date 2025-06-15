
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ImageUpload';
import { Save, X } from 'lucide-react';

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

interface TicketEditModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticketId: string, updates: Partial<Ticket>) => void;
  technicians: Technician[];
}

export const TicketEditModal: React.FC<TicketEditModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onSave,
  technicians,
}) => {
  const [editingTicket, setEditingTicket] = React.useState<Ticket | null>(null);

  React.useEffect(() => {
    if (ticket) {
      setEditingTicket({ ...ticket });
    }
  }, [ticket]);

  const handleSave = () => {
    if (editingTicket) {
      onSave(editingTicket.id, editingTicket);
    }
  };

  if (!editingTicket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content-large">
        <DialogHeader>
          <DialogTitle className="modal-title-gradient">
            Update Tiket: {editingTicket.title}
          </DialogTitle>
          <DialogDescription className="modal-description">
            Perbarui informasi tiket {editingTicket.ticket_number}
          </DialogDescription>
        </DialogHeader>

        <div className="modal-form-container">
          <div>
            <label className="form-label">Nomor Tiket</label>
            <Input
              value={editingTicket.ticket_number}
              readOnly
              className="readonly-input"
            />
            <p className="form-helper-text">Nomor tiket tidak dapat diubah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Status</label>
              <Select 
                value={editingTicket.status} 
                onValueChange={(value) => setEditingTicket({...editingTicket, status: value as any})}
              >
                <SelectTrigger className="form-select">
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
              <label className="form-label">Ditugaskan Kepada</label>
              <Select 
                value={editingTicket.assigned_to || 'unassigned'} 
                onValueChange={(value) => setEditingTicket({...editingTicket, assigned_to: value === 'unassigned' ? undefined : value})}
              >
                <SelectTrigger className="form-select">
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
              <label className="form-label">Alasan Penolakan *</label>
              <Textarea
                value={editingTicket.rejection_reason || ''}
                onChange={(e) => setEditingTicket({...editingTicket, rejection_reason: e.target.value})}
                className="form-textarea"
                placeholder="Masukkan alasan penolakan..."
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Catatan dari Tim TPM</label>
            <Textarea
              value={editingTicket.notes || ''}
              onChange={(e) => setEditingTicket({...editingTicket, notes: e.target.value})}
              className="form-textarea"
              placeholder="Tambahkan catatan dari tim TPM..."
            />
          </div>

          <div>
            <label className="form-label">Upload Foto Before</label>
            <div className="image-upload-container">
              <ImageUpload
                onImagesChange={(images) => setEditingTicket({...editingTicket, before_photos: images})}
                existingImages={editingTicket.before_photos || []}
                maxImages={5}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Upload Foto After</label>
            <div className="image-upload-container">
              <ImageUpload
                onImagesChange={(images) => setEditingTicket({...editingTicket, after_photos: images})}
                existingImages={editingTicket.after_photos || []}
                maxImages={5}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="modal-footer">
          <div className="modal-button-group">
            <Button
              variant="outline"
              onClick={onClose}
              className="modal-button-secondary"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="modal-button-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
