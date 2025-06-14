
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';

interface TicketFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  filteredTicketsCount: number;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  filteredTicketsCount,
}) => {
  return (
    <Card className="bg-white/3 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700 mb-8 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Cari tiket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 dark:bg-gray-900 border border-gray-300/30 dark:border-gray-600 text-gray-900 dark:text-white pl-12 h-12 text-lg"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 dark:bg-gray-900 border border-gray-300/30 dark:border-gray-600 text-gray-900 dark:text-white h-12">
              <SelectValue placeholder="Filter berdasarkan status" />
            </SelectTrigger>
            <SelectContent className="bg-white/85 dark:bg-gray-800 border border-gray-200/30 dark:border-gray-700">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="open">Terbuka</SelectItem>
              <SelectItem value="in_progress">Sedang Proses</SelectItem>
              <SelectItem value="pending_parts">Menunggu Suku Cadang</SelectItem>
              <SelectItem value="closed">Selesai</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="bg-white/5 dark:bg-gray-900 border border-gray-300/30 dark:border-gray-600 text-gray-900 dark:text-white h-12">
              <SelectValue placeholder="Filter berdasarkan prioritas" />
            </SelectTrigger>
            <SelectContent className="bg-white/85 dark:bg-gray-800 border border-gray-200/30 dark:border-gray-700">
              <SelectItem value="all">Semua Prioritas</SelectItem>
              <SelectItem value="low">Rendah</SelectItem>
              <SelectItem value="medium">Sedang</SelectItem>
              <SelectItem value="high">Tinggi</SelectItem>
              <SelectItem value="critical">Kritis</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 bg-gradient-to-r from-blue-100/50 dark:from-blue-500/20 to-purple-100/50 dark:to-purple-500/20 rounded-lg p-3 border border-blue-200/30 dark:border-blue-500/30">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold">Total: {filteredTicketsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
