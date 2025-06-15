
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Eye, Edit3, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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

interface TicketCardProps {
  ticket: Ticket;
  index: number;
  onViewDetails: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
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

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  index,
  onViewDetails,
  onEdit,
}) => {
  return (
    <Card 
      key={ticket.id} 
      className="bg-white/3 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700 hover:shadow-lg transition-all duration-500"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
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
            <div className="flex items-center space-x-3 p-3 bg-gray-50/30 dark:bg-gray-700 border border-gray-200/30 dark:border-gray-600 rounded-lg">
              <User className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Teknisi</p>
                <p className="text-gray-900 dark:text-white font-semibold">{ticket.assigned_to || 'Belum Ditugaskan'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50/30 dark:bg-gray-700 border border-gray-200/30 dark:border-gray-600 rounded-lg">
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

          <div className="p-4 bg-gray-50/30 dark:bg-gray-700 border border-gray-200/30 dark:border-gray-600 rounded-lg mb-4">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{ticket.description}</p>
          </div>
          
          {ticket.status === 'ditolak' && ticket.rejection_reason && (
            <div className="mt-4 p-4 bg-red-100/50 dark:bg-red-500/20 border-2 border-red-300/50 dark:border-red-500 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-bold mb-2">⚠️ Alasan Penolakan:</p>
              <p className="text-red-700 dark:text-red-300">{ticket.rejection_reason}</p>
            </div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 p-3 bg-gray-50/30 dark:bg-gray-700 border border-gray-200/30 dark:border-gray-600 rounded-lg mb-6">
            <strong>Pemohon:</strong> {ticket.requester_name} ({ticket.requester_department})
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200/30 dark:border-gray-600">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onViewDetails(ticket)}
              className="bg-white/5 dark:bg-gray-800 border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 h-12 px-6 text-base font-medium"
            >
              <Eye className="w-5 h-5 mr-2" />
              Lihat Detail
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => onEdit(ticket)}
              className="bg-white/5 dark:bg-gray-800 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 h-12 px-6 text-base font-medium"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Update Tiket
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
