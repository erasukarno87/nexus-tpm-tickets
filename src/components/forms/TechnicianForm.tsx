
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface TechnicianFormProps {
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TechnicianForm: React.FC<TechnicianFormProps> = ({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSave,
  onCancel
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nama Teknisi *</Label>
              <Input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Masukkan nama teknisi"
              />
            </div>
            <div>
              <Label>Telepon</Label>
              <Input
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="Masukkan nomor telepon"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
