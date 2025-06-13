
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Building,
  Users,
  MapPin,
  Settings
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface Technician {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department_id?: string;
  specialty?: string;
  is_active: boolean;
  created_at: string;
}

interface Location {
  id: string;
  name: string;
  description?: string;
  department_id?: string;
  is_active: boolean;
  created_at: string;
}

interface Machine {
  id: string;
  machine_code: string;
  name: string;
  location_id?: string;
  department_id?: string;
  model?: string;
  manufacturer?: string;
  is_active: boolean;
  created_at: string;
}

export const MasterData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllMasterData();
  }, []);

  const fetchAllMasterData = async () => {
    try {
      const [deptResult, techResult, locResult, machResult] = await Promise.all([
        supabase.from('departments').select('*').order('name'),
        supabase.from('technicians').select('*').order('name'),
        supabase.from('locations').select('*').order('name'),
        supabase.from('machines').select('*').order('machine_code')
      ]);

      if (deptResult.data) setDepartments(deptResult.data);
      if (techResult.data) setTechnicians(techResult.data);
      if (locResult.data) setLocations(locResult.data);
      if (machResult.data) setMachines(machResult.data);
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data master",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDepartment = async (data: any) => {
    try {
      if (editingItem?.id) {
        // Update
        const { error } = await supabase
          .from('departments')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('departments')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      setEditingItem(null);
      setEditingType('');
      
      toast({
        title: "Berhasil!",
        description: "Data departemen berhasil disimpan.",
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleSaveTechnician = async (data: any) => {
    try {
      if (editingItem?.id) {
        // Update
        const { error } = await supabase
          .from('technicians')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('technicians')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      setEditingItem(null);
      setEditingType('');
      
      toast({
        title: "Berhasil!",
        description: "Data teknisi berhasil disimpan.",
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchAllMasterData();
      
      toast({
        title: "Berhasil!",
        description: "Data berhasil dihapus.",
      });
    } catch (error: any) {
      console.error('Error deleting data:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchAllMasterData();
      
      toast({
        title: "Berhasil!",
        description: "Data berhasil dihapus.",
      });
    } catch (error: any) {
      console.error('Error deleting data:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  const DepartmentForm = () => (
    <Card className="glass-card border-0">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-white">Nama Departemen *</Label>
          <Input
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
            className="glass-input text-white"
            placeholder="Masukkan nama departemen"
          />
        </div>
        <div>
          <Label className="text-white">Deskripsi</Label>
          <Textarea
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
            className="glass-input text-white"
            placeholder="Masukkan deskripsi departemen"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveDepartment({
              name: editingItem?.name,
              description: editingItem?.description || null,
              is_active: true
            })}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => { setEditingItem(null); setEditingType(''); }}
            className="glass-input"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TechnicianForm = () => (
    <Card className="glass-card border-0">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Nama Teknisi *</Label>
            <Input
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              className="glass-input text-white"
              placeholder="Masukkan nama teknisi"
            />
          </div>
          <div>
            <Label className="text-white">Email</Label>
            <Input
              value={editingItem?.email || ''}
              onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
              className="glass-input text-white"
              placeholder="Masukkan email"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Telepon</Label>
            <Input
              value={editingItem?.phone || ''}
              onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
              className="glass-input text-white"
              placeholder="Masukkan nomor telepon"
            />
          </div>
          <div>
            <Label className="text-white">Departemen</Label>
            <Select value={editingItem?.department_id || ''} onValueChange={(value) => setEditingItem({...editingItem, department_id: value})}>
              <SelectTrigger className="glass-input text-white">
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-white">Spesialisasi</Label>
          <Input
            value={editingItem?.specialty || ''}
            onChange={(e) => setEditingItem({...editingItem, specialty: e.target.value})}
            className="glass-input text-white"
            placeholder="Masukkan spesialisasi"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveTechnician({
              name: editingItem?.name,
              email: editingItem?.email || null,
              phone: editingItem?.phone || null,
              department_id: editingItem?.department_id || null,
              specialty: editingItem?.specialty || null,
              is_active: true
            })}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => { setEditingItem(null); setEditingType(''); }}
            className="glass-input"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-xl">Memuat data master...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Data Master TPM</h2>
        <p className="text-gray-400">Kelola data departemen, teknisi, lokasi, dan mesin</p>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="departments" className="data-[state=active]:bg-blue-600">
            <Building className="w-4 h-4 mr-2" />
            Departemen
          </TabsTrigger>
          <TabsTrigger value="technicians" className="data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4 mr-2" />
            Teknisi
          </TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-blue-600">
            <MapPin className="w-4 h-4 mr-2" />
            Lokasi
          </TabsTrigger>
          <TabsTrigger value="machines" className="data-[state=active]:bg-blue-600">
            <Settings className="w-4 h-4 mr-2" />
            Mesin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Daftar Departemen</h3>
            <Button
              onClick={() => { setEditingItem({}); setEditingType('departments'); }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Departemen
            </Button>
          </div>

          {editingType === 'departments' && <DepartmentForm />}

          <div className="grid gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{dept.name}</h4>
                      <p className="text-gray-400 text-sm">{dept.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Dibuat: {new Date(dept.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingItem(dept); setEditingType('departments'); }}
                        className="glass-input border-blue-500 text-blue-400"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="glass-input border-red-500 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Daftar Teknisi</h3>
            <Button
              onClick={() => { setEditingItem({}); setEditingType('technicians'); }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Teknisi
            </Button>
          </div>

          {editingType === 'technicians' && <TechnicianForm />}

          <div className="grid gap-4">
            {technicians.map((tech) => (
              <Card key={tech.id} className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{tech.name}</h4>
                      <p className="text-gray-400 text-sm">{tech.email}</p>
                      <p className="text-gray-400 text-sm">{tech.phone}</p>
                      <p className="text-blue-400 text-sm">{tech.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Dept: {departments.find(d => d.id === tech.department_id)?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingItem(tech); setEditingType('technicians'); }}
                        className="glass-input border-blue-500 text-blue-400"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTechnician(tech.id)}
                        className="glass-input border-red-500 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="text-center p-8">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Tab Lokasi - Implementasi serupa dengan Departemen</p>
          </div>
        </TabsContent>

        <TabsContent value="machines" className="space-y-4">
          <div className="text-center p-8">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Tab Mesin - Implementasi serupa dengan Teknisi</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
