
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
    <Card className="mb-6 border-gray-300 dark:border-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white w-4 h-4" />
            <Input
              placeholder="Cari tiket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-black dark:!text-white border-gray-300 dark:!border-white"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] text-black dark:!text-white border-gray-300 dark:!border-white">
              <SelectValue placeholder="Filter berdasarkan status" className="text-black dark:!text-white" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:!border-white">
              <SelectItem value="all" className="text-black dark:!text-white">Semua Status</SelectItem>
              <SelectItem value="open" className="text-black dark:!text-white">Terbuka</SelectItem>
              <SelectItem value="in_progress" className="text-black dark:!text-white">Sedang Proses</SelectItem>
              <SelectItem value="pending_parts" className="text-black dark:!text-white">Menunggu Suku Cadang</SelectItem>
              <SelectItem value="closed" className="text-black dark:!text-white">Selesai</SelectItem>
              <SelectItem value="ditolak" className="text-black dark:!text-white">Ditolak</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[200px] text-black dark:!text-white border-gray-300 dark:!border-white">
              <SelectValue placeholder="Filter berdasarkan prioritas" className="text-black dark:!text-white" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:!border-white">
              <SelectItem value="all" className="text-black dark:!text-white">Semua Prioritas</SelectItem>
              <SelectItem value="low" className="text-black dark:!text-white">Rendah</SelectItem>
              <SelectItem value="medium" className="text-black dark:!text-white">Sedang</SelectItem>
              <SelectItem value="high" className="text-black dark:!text-white">Tinggi</SelectItem>
              <SelectItem value="critical" className="text-black dark:!text-white">Kritis</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-black dark:!text-white">
            <Users className="w-4 h-4 text-black dark:!text-white" />
            <span className="text-black dark:!text-white">Total: {filteredTicketsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
