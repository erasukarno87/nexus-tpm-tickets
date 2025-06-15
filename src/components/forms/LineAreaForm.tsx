
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
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nama Line/Area *</Label>
              <Input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Masukkan nama Line/Area"
              />
            </div>
            <div>
              <Label>Departemen</Label>
              <Select 
                value={departmentId} 
                onValueChange={onDepartmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
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
            <Label>Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Masukkan deskripsi Line/Area"
            />
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
