
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Shield, Sparkles } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header>
      <div>
        <div>
          <div>
            <Shield />
            <h1>Panel Admin TPM</h1>
            <Sparkles />
          </div>
          <p>Kelola dan pantau semua permintaan pemeliharaan</p>
        </div>
        <div>
          <ThemeToggle />
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>
    </header>
  );
};
