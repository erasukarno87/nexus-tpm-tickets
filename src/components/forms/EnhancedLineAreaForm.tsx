
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Factory, FileText, Building, Sparkles } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

interface EnhancedLineAreaFormProps {
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

export const EnhancedLineAreaForm: React.FC<EnhancedLineAreaFormProps> = ({
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
    <div className="relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-60 animate-pulse" />
      
      <Card className="relative backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Factory className="w-5 h-5" />
            </div>
            Form Line/Area
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                Nama Line/Area *
              </Label>
              <div className="relative group">
                <Input
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Masukkan nama Line/Area"
                  className="pr-12 gradient-border transition-all duration-300 focus:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                  <Factory className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                Departemen
              </Label>
              <div className="relative group">
                <Select value={departmentId} onValueChange={onDepartmentChange}>
                  <SelectTrigger className="gradient-border transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 focus:scale-[1.02]">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-pink-500 opacity-60" />
                      <SelectValue placeholder="Pilih departemen" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl border-white/20">
                    <SelectItem value="none" className="hover:bg-purple-500/20">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        Tidak ada departemen
                      </div>
                    </SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="hover:bg-purple-500/20">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full" />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Deskripsi
            </Label>
            <div className="relative group">
              <Textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Masukkan deskripsi Line/Area"
                className="gradient-border transition-all duration-300 focus:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 min-h-[100px]"
              />
              <div className="absolute right-3 top-3 opacity-30 group-focus-within:opacity-100 transition-opacity">
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={onSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 btn-outline border-2 hover:bg-red-500/10 hover:border-red-500/50 hover:scale-105 transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
