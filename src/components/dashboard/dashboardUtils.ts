
import { DashboardStats } from './dashboardTypes';

export const processTicketsData = (tickets: any[]): DashboardStats => {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  const rejectedTickets = tickets.filter(t => t.status === 'ditolak').length;

  // Group by category
  const ticketsByCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Group by priority
  const ticketsByPriority = tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Monthly trend (last 6 months)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    const count = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.created_at);
      return ticketDate.getMonth() === date.getMonth() && 
             ticketDate.getFullYear() === date.getFullYear();
    }).length;
    monthlyTrend.push({ month: monthStr, count });
  }

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    closedTickets,
    rejectedTickets,
    ticketsByCategory,
    ticketsByPriority,
    monthlyTrend
  };
};

export const getCategoryLabel = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'corrective_action': 'Tindakan Korektif',
    'repair': 'Perbaikan',
    'procurement': 'Pengadaan',
    'support': 'Dukungan'
  };
  return categoryMap[category] || category;
};
