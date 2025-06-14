
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Settings,
  MapPin
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  rejectedTickets: number;
  ticketsByCategory: { [key: string]: number };
  ticketsByPriority: { [key: string]: number };
  monthlyTrend: { month: string; count: number }[];
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
    rejectedTickets: 0,
    ticketsByCategory: {},
    ticketsByPriority: {},
    monthlyTrend: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*');

      if (error) throw error;

      if (tickets) {
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

        setStats({
          totalTickets,
          openTickets,
          inProgressTickets,
          closedTickets,
          rejectedTickets,
          ticketsByCategory,
          ticketsByPriority,
          monthlyTrend
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusData = {
    labels: ['Terbuka', 'Sedang Proses', 'Selesai', 'Ditolak'],
    datasets: [
      {
        data: [stats.openTickets, stats.inProgressTickets, stats.closedTickets, stats.rejectedTickets],
        backgroundColor: [
          '#3B82F6', // blue
          '#F59E0B', // yellow
          '#10B981', // green
          '#EF4444', // red
        ],
        borderWidth: 2,
        borderColor: '#1F2937',
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(stats.ticketsByCategory).map(category => {
      const categoryMap: { [key: string]: string } = {
        'corrective_action': 'Tindakan Korektif',
        'repair': 'Perbaikan',
        'procurement': 'Pengadaan',
        'support': 'Dukungan'
      };
      return categoryMap[category] || category;
    }),
    datasets: [
      {
        label: 'Jumlah Tiket',
        data: Object.values(stats.ticketsByCategory),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const trendData = {
    labels: stats.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Tiket per Bulan',
        data: stats.monthlyTrend.map(item => item.count),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#374151', // Changed for light mode compatibility
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#374151', // Changed for light mode compatibility
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.1)', // Changed for light mode compatibility
        },
      },
      y: {
        ticks: {
          color: '#374151', // Changed for light mode compatibility
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.1)', // Changed for light mode compatibility
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#374151', // Changed for light mode compatibility
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-800 dark:text-white text-xl">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tiket</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
                </div>
                <ClipboardList className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Tiket Terbuka</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.openTickets}</p>
                </div>
                <Clock className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Sedang Proses</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgressTickets}</p>
                </div>
                <Settings className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Selesai</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.closedTickets}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Status Tiket</CardTitle>
            </CardHeader>
            <CardContent>
              <Doughnut data={statusData} options={doughnutOptions} />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Tiket per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={categoryData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Tren Tiket (6 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={trendData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
