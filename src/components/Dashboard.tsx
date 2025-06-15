
import React, { useState, useEffect } from 'react';
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
import { DashboardStats } from './dashboard/dashboardTypes';
import { DashboardLoading } from './dashboard/DashboardLoading';
import { DashboardStats as StatsComponent } from './dashboard/DashboardStats';
import { DashboardCharts } from './dashboard/DashboardCharts';
import { processTicketsData } from './dashboard/dashboardUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
        const processedStats = processTicketsData(tickets);
        setStats(processedStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-8">
      <div>
        <StatsComponent stats={stats} />
        <DashboardCharts stats={stats} />
      </div>
    </div>
  );
};
