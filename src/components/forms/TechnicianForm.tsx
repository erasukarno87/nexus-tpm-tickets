
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
    <Card className="technician-form-card">
      <CardContent className="technician-form-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="form-label">Nama Teknisi *</Label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="technician-form-input"
              placeholder="Masukkan nama teknisi"
            />
          </div>
          <div>
            <Label className="form-label">Telepon</Label>
            <Input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="technician-form-input"
              placeholder="Masukkan nomor telepon"
            />
          </div>
        </div>
        <div className="technician-form-actions">
          <Button
            onClick={onSave}
            className="btn-save"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="btn-cancel"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
