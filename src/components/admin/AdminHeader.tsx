
import React from 'react';
import { FuturisticHeader } from '@/components/FuturisticHeader';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <FuturisticHeader
      title="Panel Admin TPM"
      subtitle="Kelola dan pantau semua permintaan pemeliharaan"
      showLogoutButton={true}
      onLogout={onLogout}
    />
  );
};
