
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
  Settings,
  MapPin
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface LineArea {
  id: string;
  name: string;
  department_id?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface Technician {
  id: string;
  name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export const MasterData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lineAreas, setLineAreas] = useState<LineArea[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // State untuk form data - direct state management
  const [departmentName, setDepartmentName] = useState('');
  const [lineAreaName, setLineAreaName] = useState('');
  const [lineAreaDepartment, setLineAreaDepartment] = useState('none');
  const [lineAreaDescription, setLineAreaDescription] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [technicianPhone, setTechnicianPhone] = useState('');

  useEffect(() => {
    fetchAllMasterData();
  }, []);

  // Reset form data ketika editing type berubah
  useEffect(() => {
    if (editingItem) {
      if (editingType === 'departments') {
        setDepartmentName(editingItem.name || '');
      } else if (editingType === 'line-areas') {
        setLineAreaName(editingItem.name || '');
        setLineAreaDepartment(editingItem.department_id || 'none');
        setLineAreaDescription(editingItem.description || '');
      } else if (editingType === 'technicians') {
        setTechnicianName(editingItem.name || '');
        setTechnicianPhone(editingItem.phone || '');
      }
    } else {
      // Reset all form data when not editing
      setDepartmentName('');
      setLineAreaName('');
      setLineAreaDepartment('none');
      setLineAreaDescription('');
      setTechnicianName('');
      setTechnicianPhone('');
    }
  }, [editingItem, editingType]);

  const fetchAllMasterData = async () => {
    try {
      const [deptResult, lineAreaResult, techResult] = await Promise.all([
        supabase.from('departments').select('*').order('name'),
        supabase.from('line_areas').select('*').order('name'),
        supabase.from('technicians').select('*').order('name')
      ]);

      if (deptResult.data) setDepartments(deptResult.data);
      if (lineAreaResult.data) setLineAreas(lineAreaResult.data);
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

  const handleSaveDepartment = async () => {
    try {
      const data = {
        name: departmentName,
        is_active: true
      };

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
      setDepartmentName('');
      
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

  const handleSaveLineArea = async () => {
    try {
      const data = {
        name: lineAreaName,
        department_id: lineAreaDepartment === "none" ? null : lineAreaDepartment,
        description: lineAreaDescription || null,
        is_active: true
      };

      if (editingItem?.id) {
        // Update
        const { error } = await supabase
          .from('line_areas')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('line_areas')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      setEditingItem(null);
      setEditingType('');
      setLineAreaName('');
      setLineAreaDepartment('none');
      setLineAreaDescription('');
      
      toast({
        title: "Berhasil!",
        description: "Data Line/Area berhasil disimpan.",
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

  const handleSaveTechnician = async () => {
    try {
      const data = {
        name: technicianName,
        phone: technicianPhone || null,
        is_active: true
      };

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
      setTechnicianName('');
      setTechnicianPhone('');
      
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

  const handleDeleteLineArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('line_areas')
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

  const resetForm = () => {
    setEditingItem(null);
    setEditingType('');
    setDepartmentName('');
    setLineAreaName('');
    setLineAreaDepartment('none');
    setLineAreaDescription('');
    setTechnicianName('');
    setTechnicianPhone('');
  };

  const DepartmentForm = () => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-gray-900 dark:text-white">Nama Departemen *</Label>
          <Input
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder="Masukkan nama departemen"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleSaveDepartment}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LineAreaForm = () => (
    <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-900 dark:text-white">Nama Line/Area *</Label>
            <Input
              value={lineAreaName}
              onChange={(e) => setLineAreaName(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama Line/Area"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Departemen</Label>
            <Select 
              value={lineAreaDepartment} 
              onValueChange={setLineAreaDepartment}
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
            value={lineAreaDescription}
            onChange={(e) => setLineAreaDescription(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[80px]"
            placeholder="Masukkan deskripsi Line/Area"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleSaveLineArea}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
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
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nama teknisi"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-white">Telepon</Label>
            <Input
              value={technicianPhone}
              onChange={(e) => setTechnicianPhone(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Masukkan nomor telepon"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleSaveTechnician}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
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
          <p className="text-gray-600 dark:text-gray-400">Kelola data departemen, Line/Area, dan teknisi</p>
        </div>

        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
            <TabsTrigger value="departments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <Building className="w-4 h-4 mr-2" />
              Departemen
            </TabsTrigger>
            <TabsTrigger value="line-areas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              Line/Area
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
                onClick={() => { 
                  setEditingItem({ name: '' }); 
                  setEditingType('departments'); 
                  setDepartmentName('');
                }}
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
                          onClick={() => { 
                            setEditingItem(dept); 
                            setEditingType('departments'); 
                            setDepartmentName(dept.name);
                          }}
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

          <TabsContent value="line-areas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar Line/Area</h3>
              <Button
                onClick={() => { 
                  setEditingItem({ name: '', department_id: 'none', description: '' }); 
                  setEditingType('line-areas'); 
                  setLineAreaName('');
                  setLineAreaDepartment('none');
                  setLineAreaDescription('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Line/Area
              </Button>
            </div>

            {editingType === 'line-areas' && <LineAreaForm />}

            <div className="grid gap-4">
              {lineAreas.map((area) => (
                <Card key={area.id} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{area.name}</h4>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Departemen: {departments.find(d => d.id === area.department_id)?.name || 'Tidak ada'}
                        </p>
                        {area.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{area.description}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Dibuat: {new Date(area.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { 
                            setEditingItem(area); 
                            setEditingType('line-areas'); 
                            setLineAreaName(area.name);
                            setLineAreaDepartment(area.department_id || 'none');
                            setLineAreaDescription(area.description || '');
                          }}
                          className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLineArea(area.id)}
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
                onClick={() => { 
                  setEditingItem({ name: '', phone: '' }); 
                  setEditingType('technicians'); 
                  setTechnicianName('');
                  setTechnicianPhone('');
                }}
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
                        {tech.phone && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{tech.phone}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Dibuat: {new Date(tech.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { 
                            setEditingItem(tech); 
                            setEditingType('technicians'); 
                            setTechnicianName(tech.name);
                            setTechnicianPhone(tech.phone || '');
                          }}
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
