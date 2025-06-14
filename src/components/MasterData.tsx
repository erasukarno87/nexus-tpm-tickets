import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Settings
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
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

export const MasterData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllMasterData();
  }, []);

  const fetchAllMasterData = async () => {
    try {
      const [deptResult, techResult] = await Promise.all([
        supabase.from('departments').select('*').order('name'),
        supabase.from('technicians').select('*').order('name')
      ]);

      if (deptResult.data) setDepartments(deptResult.data);
      if (techResult.data) setTechnicians(techResult.data);
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
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveDepartment({
              name: editingItem?.name,
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
            <Label className="text-gray-900 dark:text-white">Spesialisasi</Label>
            <Input
              value={editingItem?.specialty || ''}
              onChange={(e) => setEditingItem({...editingItem, specialty: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan spesialisasi"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleSaveTechnician({
              name: editingItem?.name,
              email: editingItem?.email || null,
              phone: editingItem?.phone || null,
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
          <p className="text-gray-600 dark:text-gray-400">Kelola data departemen dan teknisi</p>
        </div>

        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <TabsTrigger value="departments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <Building className="w-4 h-4 mr-2" />
              Departemen
            </TabsTrigger>
            <TabsTrigger value="technicians" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              Teknisi
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
        </Tabs>
      </div>
    </div>
  );
};
