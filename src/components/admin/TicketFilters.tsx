
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
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="search-icon-filter" />
            <Input
              placeholder="Cari tiket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="filter-select">
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
            <SelectTrigger className="filter-select">
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

          <div className="filter-counter">
            <Users className="filter-counter-icon" />
            <span className="filter-counter-text">Total: {filteredTicketsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
