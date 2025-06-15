
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit3, 
  Trash2,
  Building,
  Users,
  Settings,
  MapPin
} from 'lucide-react';
import { DepartmentForm } from './forms/DepartmentForm';
import { LineAreaForm } from './forms/LineAreaForm';
import { TechnicianForm } from './forms/TechnicianForm';

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

  // Form states - properly separated to prevent re-renders
  const [departmentName, setDepartmentName] = useState('');
  const [lineAreaName, setLineAreaName] = useState('');
  const [lineAreaDepartment, setLineAreaDepartment] = useState('none');
  const [lineAreaDescription, setLineAreaDescription] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [technicianPhone, setTechnicianPhone] = useState('');

  useEffect(() => {
    fetchAllMasterData();
  }, []);

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

  const initializeForm = (item: any = null, type: string = '') => {
    if (item && item.id) {
      // Editing existing item
      if (type === 'departments') {
        setDepartmentName(item.name || '');
      } else if (type === 'line-areas') {
        setLineAreaName(item.name || '');
        setLineAreaDepartment(item.department_id || 'none');
        setLineAreaDescription(item.description || '');
      } else if (type === 'technicians') {
        setTechnicianName(item.name || '');
        setTechnicianPhone(item.phone || '');
      }
    } else {
      // Creating new item
      if (type === 'departments') {
        setDepartmentName('');
      } else if (type === 'line-areas') {
        setLineAreaName('');
        setLineAreaDepartment('none');
        setLineAreaDescription('');
      } else if (type === 'technicians') {
        setTechnicianName('');
        setTechnicianPhone('');
      }
    }
    setEditingItem(item);
    setEditingType(type);
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

  const handleSaveDepartment = async () => {
    try {
      const data = {
        name: departmentName,
        is_active: true
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('departments')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('departments')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      resetForm();
      
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
        const { error } = await supabase
          .from('line_areas')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('line_areas')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      resetForm();
      
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
        const { error } = await supabase
          .from('technicians')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('technicians')
          .insert(data);
        if (error) throw error;
      }

      await fetchAllMasterData();
      resetForm();
      
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Settings className="w-16 h-16 mx-auto mb-4 animate-spin" />
            <p className="text-xl">Memuat data master...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Data Master TPM</h2>
        <p className="text-gray-600">Kelola data departemen, Line/Area, dan teknisi</p>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments">
            <Building className="w-4 h-4 mr-2" />
            Departemen
          </TabsTrigger>
          <TabsTrigger value="line-areas">
            <MapPin className="w-4 h-4 mr-2" />
            Line/Area
          </TabsTrigger>
          <TabsTrigger value="technicians">
            <Users className="w-4 h-4 mr-2" />
            Teknisi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Daftar Departemen</h3>
            <Button
              onClick={() => initializeForm({}, 'departments')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Departemen
            </Button>
          </div>

          {editingType === 'departments' && (
            <DepartmentForm
              name={departmentName}
              onNameChange={setDepartmentName}
              onSave={handleSaveDepartment}
              onCancel={resetForm}
            />
          )}

          <div className="grid gap-4">
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{dept.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Dibuat: {new Date(dept.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => initializeForm(dept, 'departments')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDepartment(dept.id)}
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
            <h3 className="text-xl font-semibold">Daftar Line/Area</h3>
            <Button
              onClick={() => initializeForm({}, 'line-areas')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Line/Area
            </Button>
          </div>

          {editingType === 'line-areas' && (
            <LineAreaForm
              name={lineAreaName}
              departmentId={lineAreaDepartment}
              description={lineAreaDescription}
              departments={departments}
              onNameChange={setLineAreaName}
              onDepartmentChange={setLineAreaDepartment}
              onDescriptionChange={setLineAreaDescription}
              onSave={handleSaveLineArea}
              onCancel={resetForm}
            />
          )}

          <div className="grid gap-4">
            {lineAreas.map((area) => (
              <Card key={area.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{area.name}</h4>
                      <p className="text-sm">
                        Departemen: {departments.find(d => d.id === area.department_id)?.name || 'Tidak ada'}
                      </p>
                      {area.description && (
                        <p className="text-sm mt-1">{area.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Dibuat: {new Date(area.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => initializeForm(area, 'line-areas')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteLineArea(area.id)}
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
            <h3 className="text-xl font-semibold">Daftar Teknisi</h3>
            <Button
              onClick={() => initializeForm({}, 'technicians')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Teknisi
            </Button>
          </div>

          {editingType === 'technicians' && (
            <TechnicianForm
              name={technicianName}
              phone={technicianPhone}
              onNameChange={setTechnicianName}
              onPhoneChange={setTechnicianPhone}
              onSave={handleSaveTechnician}
              onCancel={resetForm}
            />
          )}

          <div className="grid gap-4">
            {technicians.map((tech) => (
              <Card key={tech.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{tech.name}</h4>
                      {tech.phone && (
                        <p className="text-sm">{tech.phone}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Dibuat: {new Date(tech.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => initializeForm(tech, 'technicians')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTechnician(tech.id)}
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
  );
};
