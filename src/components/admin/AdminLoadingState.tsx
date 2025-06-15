
import React from 'react';
import { Settings } from 'lucide-react';

export const AdminLoadingState: React.FC = () => {
  return (
    <div>
      <div>
        <div>
          <Settings />
          <h2>Memuat Panel Admin</h2>
          <p>Menyiapkan dashboard administrasi...</p>
        </div>
      </div>
    </div>
  );
};
