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
  line_area?: string;
  is_active: boolean;
  created_at: string;
}

interface Machine {
  id: string;
  machine_code: string;
  name: string;
  location_id?: string;
  department_id?: string;
  line_area?: string;
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

  const handleSaveLocation = async (data: any) => {
    try {
      if (editingItem?.id) {
        // Update
        const { error } = await supabase
          .from('locations')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('locations')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      setEditingItem(null);
      setEditingType('');
      
      toast({
        title: "Berhasil!",
        description: "Data lokasi berhasil disimpan.",
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

  const handleSaveMachine = async (data: any) => {
    try {
      if (editingItem?.id) {
        // Update
        const { error } = await supabase
          .from('machines')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('machines')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      setEditingItem(null);
      setEditingType('');
      
      toast({
        title: "Berhasil!",
        description: "Data mesin berhasil disimpan.",
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

  const handleDeleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
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

  const handleDeleteMachine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('machines')
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
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-gray-900 dark:text-white">Nama Departemen *</Label>
          <Input
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Masukkan nama departemen"
          />
        </div>
        <div>
          <Label className="text-gray-900 dark:text-white">Deskripsi</Label>
          <Textarea
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => { setEditingItem(null); setEditingType(''); }}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TechnicianForm = () => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Nama Teknisi *</Label>
            <Input
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama teknisi"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Email</Label>
            <Input
              value={editingItem?.email || ''}
              onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan email"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Telepon</Label>
            <Input
              value={editingItem?.phone || ''}
              onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nomor telepon"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Departemen</Label>
            <Select value={editingItem?.department_id || ''} onValueChange={(value) => setEditingItem({...editingItem, department_id: value})}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
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
          <Label className="text-gray-900 dark:text-white">Spesialisasi</Label>
          <Input
            value={editingItem?.specialty || ''}
            onChange={(e) => setEditingItem({...editingItem, specialty: e.target.value})}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => { setEditingItem(null); setEditingType(''); }}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LocationForm = () => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Nama Lokasi *</Label>
            <Input
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama lokasi"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Line/Area *</Label>
            <Input
              value={editingItem?.line_area || ''}
              onChange={(e) => setEditingItem({...editingItem, line_area: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan line/area (contoh: Line A, Area 1)"
            />
          </div>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-white">Departemen</Label>
          <Select value={editingItem?.department_id || ''} onValueChange={(value) => setEditingItem({...editingItem, department_id: value})}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Pilih departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Tidak ada departemen</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-white">Deskripsi</Label>
          <Textarea
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Masukkan deskripsi lokasi"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveLocation({
              name: editingItem?.name,
              line_area: editingItem?.line_area,
              department_id: editingItem?.department_id === 'unassigned' ? null : editingItem?.department_id,
              description: editingItem?.description || null,
              is_active: true
            })}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => { setEditingItem(null); setEditingType(''); }}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const MachineForm = () => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Kode Mesin *</Label>
            <Input
              value={editingItem?.machine_code || ''}
              onChange={(e) => setEditingItem({...editingItem, machine_code: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan kode mesin"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Nama Mesin *</Label>
            <Input
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama mesin"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Line/Area *</Label>
            <Input
              value={editingItem?.line_area || ''}
              onChange={(e) => setEditingItem({...editingItem, line_area: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan line/area (contoh: Line A, Area 1)"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Lokasi</Label>
            <Select value={editingItem?.location_id || ''} onValueChange={(value) => setEditingItem({...editingItem, location_id: value})}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Pilih lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Tidak ada lokasi</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name} {loc.line_area && `(${loc.line_area})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Model</Label>
            <Input
              value={editingItem?.model || ''}
              onChange={(e) => setEditingItem({...editingItem, model: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan model mesin"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Manufaktur</Label>
            <Input
              value={editingItem?.manufacturer || ''}
              onChange={(e) => setEditingItem({...editingItem, manufacturer: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama manufaktur"
            />
          </div>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-white">Departemen</Label>
          <Select value={editingItem?.department_id || ''} onValueChange={(value) => setEditingItem({...editingItem, department_id: value})}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Pilih departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Tidak ada departemen</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveMachine({
              machine_code: editingItem?.machine_code,
              name: editingItem?.name,
              line_area: editingItem?.line_area,
              location_id: editingItem?.location_id === 'unassigned' ? null : editingItem?.location_id,
              department_id: editingItem?.department_id === 'unassigned' ? null : editingItem?.department_id,
              model: editingItem?.model || null,
              manufacturer: editingItem?.manufacturer || null,
              is_active: true
            })}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={() => { setEditingItem(null); setEditingType(''); }}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Settings className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-800 dark:text-white text-xl">Memuat data master...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Data Master TPM</h2>
          <p className="text-gray-600 dark:text-gray-400">Kelola data departemen, teknisi, lokasi, dan mesin</p>
        </div>

        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <TabsTrigger value="departments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <Building className="w-4 h-4 mr-2" />
              Departemen
            </TabsTrigger>
            <TabsTrigger value="technicians" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              Teknisi
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              Lokasi
            </TabsTrigger>
            <TabsTrigger value="machines" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Mesin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar Departemen</h3>
              <Button
                onClick={() => { setEditingItem({}); setEditingType('departments'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Departemen
              </Button>
            </div>

            {editingType === 'departments' && <DepartmentForm />}

            <div className="grid gap-4">
              {departments.map((dept) => (
                <Card key={dept.id} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{dept.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{dept.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Dibuat: {new Date(dept.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingItem(dept); setEditingType('departments'); }}
                          className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar Teknisi</h3>
              <Button
                onClick={() => { setEditingItem({}); setEditingType('technicians'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Teknisi
              </Button>
            </div>

            {editingType === 'technicians' && <TechnicianForm />}

            <div className="grid gap-4">
              {technicians.map((tech) => (
                <Card key={tech.id} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{tech.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{tech.email}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{tech.phone}</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">{tech.specialty}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Dept: {departments.find(d => d.id === tech.department_id)?.name || 'N/A'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingItem(tech); setEditingType('technicians'); }}
                          className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTechnician(tech.id)}
                          className="border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar Lokasi</h3>
              <Button
                onClick={() => { setEditingItem({}); setEditingType('locations'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Lokasi
              </Button>
            </div>

            {editingType === 'locations' && <LocationForm />}

            <div className="grid gap-4">
              {locations.map((location) => (
                <Card key={location.id} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{location.name}</h4>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">{location.line_area}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{location.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Dept: {departments.find(d => d.id === location.department_id)?.name || 'N/A'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingItem(location); setEditingType('locations'); }}
                          className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLocation(location.id)}
                          className="border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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

          <TabsContent value="machines" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar Mesin</h3>
              <Button
                onClick={() => { setEditingItem({}); setEditingType('machines'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Mesin
              </Button>
            </div>

            {editingType === 'machines' && <MachineForm />}

            <div className="grid gap-4">
              {machines.map((machine) => (
                <Card key={machine.id} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{machine.name}</h4>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-mono">{machine.machine_code}</p>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">{machine.line_area}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{machine.model} - {machine.manufacturer}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Lokasi: {locations.find(l => l.id === machine.location_id)?.name || 'N/A'} | 
                          Dept: {departments.find(d => d.id === machine.department_id)?.name || 'N/A'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingItem(machine); setEditingType('machines'); }}
                          className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMachine(machine.id)}
                          className="border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
        </Tabs>
      </div>
    </div>
  );
};
