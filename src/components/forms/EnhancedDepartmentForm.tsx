
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Building2, Sparkles } from 'lucide-react';

interface EnhancedDepartmentFormProps {
  name: string;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EnhancedDepartmentForm: React.FC<EnhancedDepartmentFormProps> = ({
  name,
  onNameChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-60 animate-pulse" />
      
      <Card className="relative backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            Form Departemen
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Nama Departemen *
            </Label>
            <div className="relative group">
              <Input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Masukkan nama departemen"
                className="pr-12 gradient-border transition-all duration-300 focus:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={onSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
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
