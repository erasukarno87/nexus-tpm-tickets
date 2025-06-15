
import React from 'react';
import { TrendingUp } from 'lucide-react';

export const DashboardLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <TrendingUp className="h-8 w-8 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-600">Memuat dashboard...</p>
      </div>
    </div>
  );
};
