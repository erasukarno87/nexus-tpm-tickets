
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

interface LineAreaFormProps {
  name: string;
  departmentId: string;
  description: string;
  departments: Department[];
  onNameChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const LineAreaForm: React.FC<LineAreaFormProps> = ({
  name,
  departmentId,
  description,
  departments,
  onNameChange,
  onDepartmentChange,
  onDescriptionChange,
  onSave,
  onCancel
}) => {
  return (
    <Card className="linearea-form-card">
      <CardContent className="linearea-form-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="form-label">Nama Line/Area *</Label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="linearea-form-input"
              placeholder="Masukkan nama Line/Area"
            />
          </div>
          <div>
            <Label className="form-label">Departemen</Label>
            <Select 
              value={departmentId} 
              onValueChange={onDepartmentChange}
            >
              <SelectTrigger className="linearea-form-select">
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent className="linearea-form-select-content">
                <SelectItem value="none">Tidak ada departemen</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="form-label">Deskripsi</Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="linearea-form-textarea"
            placeholder="Masukkan deskripsi Line/Area"
          />
        </div>
        <div className="linearea-form-actions">
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
