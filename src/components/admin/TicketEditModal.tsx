
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Update Tiket: {editingTicket.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Perbarui informasi tiket {editingTicket.ticket_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div>
            <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Nomor Tiket</label>
            <Input
              value={editingTicket.ticket_number}
              readOnly
              className="h-12 cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nomor tiket tidak dapat diubah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Status</label>
              <Select 
                value={editingTicket.status} 
                onValueChange={(value) => setEditingTicket({...editingTicket, status: value as any})}
              >
                <SelectTrigger className="h-12">
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
                <SelectTrigger className="h-12">
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
                className="min-h-[100px]"
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
              className="min-h-[100px]"
              placeholder="Tambahkan catatan dari tim TPM..."
            />
          </div>

          <div>
            <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Upload Foto Before</label>
            <div className="p-4 glass-card rounded-lg">
              <ImageUpload
                onImagesChange={(images) => setEditingTicket({...editingTicket, before_photos: images})}
                existingImages={editingTicket.before_photos || []}
                maxImages={5}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Upload Foto After</label>
            <div className="p-4 glass-card rounded-lg">
              <ImageUpload
                onImagesChange={(images) => setEditingTicket({...editingTicket, after_photos: images})}
                existingImages={editingTicket.after_photos || []}
                maxImages={5}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 pt-6 border-t border-gray-200/30 dark:border-gray-600">
          <div className="flex justify-end space-x-4 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 px-6 text-base font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="h-12 px-6 text-base font-medium"
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
