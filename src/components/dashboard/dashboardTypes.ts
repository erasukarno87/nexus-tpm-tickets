
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  rejectedTickets: number;
  ticketsByCategory: { [key: string]: number };
  ticketsByPriority: { [key: string]: number };
  monthlyTrend: { month: string; count: number }[];
}
