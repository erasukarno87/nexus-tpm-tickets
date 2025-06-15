
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { MasterData } from '@/components/MasterData';
import { AdminTicketManagement } from './AdminTicketManagement';
import { 
  BarChart3,
  Database,
  FileText
} from 'lucide-react';

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

interface AdminTabsProps {
  tickets: Ticket[];
  technicians: Technician[];
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<void>;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({
  tickets,
  technicians,
  onUpdateTicket
}) => {
  return (
    <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 p-2 h-16 rounded-xl">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="tickets" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
          >
            <FileText className="w-5 h-5 mr-2" />
            Kelola Tiket
          </TabsTrigger>
          <TabsTrigger 
            value="master-data" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 h-12 text-lg font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm rounded-lg hover:scale-105"
          >
            <Database className="w-5 h-5 mr-2" />
            Data Master
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="animate-slideInLeft">
          <Dashboard />
        </TabsContent>

        <TabsContent value="tickets" className="animate-fadeIn">
          <AdminTicketManagement
            tickets={tickets}
            technicians={technicians}
            onUpdateTicket={onUpdateTicket}
          />
        </TabsContent>

        <TabsContent value="master-data" className="animate-slideInRight">
          <MasterData />
        </TabsContent>
      </Tabs>
    </div>
  );
};
