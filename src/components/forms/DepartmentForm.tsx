
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface DepartmentFormProps {
  name: string;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  name,
  onNameChange,
  onSave,
  onCancel
}) => {
  return (
    <Card className="department-form-card">
      <CardContent className="department-form-content">
        <div>
          <Label className="form-label">Nama Departemen *</Label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="department-form-input"
            placeholder="Masukkan nama departemen"
          />
        </div>
        <div className="department-form-actions">
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
