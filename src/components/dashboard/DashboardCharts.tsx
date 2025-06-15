
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Doughnut } from 'react-chartjs-2';
import { DashboardStats } from './dashboardTypes';
import { getCategoryLabel } from './dashboardUtils';

interface DashboardChartsProps {
  stats: DashboardStats;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const statusData = {
    labels: ['Terbuka', 'Sedang Proses', 'Selesai', 'Ditolak'],
    datasets: [
      {
        data: [stats.openTickets, stats.inProgressTickets, stats.closedTickets, stats.rejectedTickets],
        backgroundColor: [
          '#3B82F6',
          '#F59E0B',
          '#10B981',
          '#EF4444',
        ],
        borderWidth: 2,
        borderColor: '#1F2937',
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(stats.ticketsByCategory).map(category => getCategoryLabel(category)),
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
          color: '#374151',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#374151',
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#374151',
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#374151',
        },
      },
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Status Tiket</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={statusData} options={doughnutOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiket per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={categoryData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Tiket (6 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={trendData} options={chartOptions} />
        </CardContent>
      </Card>
    </>
  );
};
