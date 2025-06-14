
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
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Nama Line/Area *</Label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama Line/Area"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Departemen</Label>
            <Select 
              value={departmentId} 
              onValueChange={onDepartmentChange}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
          <Label className="text-gray-900 dark:text-white">Deskripsi</Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[80px]"
            placeholder="Masukkan deskripsi Line/Area"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
