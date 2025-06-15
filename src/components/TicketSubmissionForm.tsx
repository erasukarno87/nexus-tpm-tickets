
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { ImageUpload } from '@/components/ImageUpload';
import { 
  Wrench, 
  AlertTriangle, 
  Package, 
  HelpCircle, 
  CheckCircle, 
  Loader2,
  User,
  Building,
  Phone,
  Settings,
  FileText,
  Send,
  Camera,
  MapPin,
  Sparkles
} from 'lucide-react';

type TicketCategory = 'corrective_action' | 'repair' | 'procurement' | 'support';
type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

interface TicketFormData {
  category: TicketCategory;
  title: string;
  description: string;
  priority: TicketPriority;
  requester_name: string;
  requester_department: string;
  requester_contact: string;
  line_area_id: string;
}

interface Department {
  id: string;
  name: string;
}

interface LineArea {
  id: string;
  name: string;
  description?: string;
  department_id: string;
}

const categoryOptions = [
  { value: 'corrective_action', label: 'Tindakan Korektif', icon: AlertTriangle, description: 'Perbaikan untuk mencegah masalah berulang' },
  { value: 'repair', label: 'Perbaikan', icon: Wrench, description: 'Perbaikan kerusakan mesin atau peralatan' },
  { value: 'procurement', label: 'Pengadaan', icon: Package, description: 'Permintaan suku cadang atau material' },
  { value: 'support', label: 'Dukungan', icon: HelpCircle, description: 'Bantuan teknis dan konsultasi' },
];

const priorityOptions = [
  { value: 'low', label: 'Rendah', description: 'Tidak mengganggu produksi' },
  { value: 'medium', label: 'Sedang', description: 'Berpotensi mengganggu produksi' },
  { value: 'high', label: 'Tinggi', description: 'Mengganggu produksi secara signifikan' },
  { value: 'critical', label: 'Kritis', description: 'Menghentikan produksi' },
];

export const TicketSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lineAreas, setLineAreas] = useState<LineArea[]>([]);
  const [filteredLineAreas, setFilteredLineAreas] = useState<LineArea[]>([]);
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TicketFormData>({
    defaultValues: {
      priority: 'medium',
      category: 'repair'
    }
  });

  const selectedCategory = watch('category');
  const selectedPriority = watch('priority');
  const selectedDepartment = watch('requester_department');

  useEffect(() => {
    fetchMasterData();
  }, []);

  // Filter line areas when department changes
  useEffect(() => {
    if (selectedDepartment && departments.length > 0) {
      const selectedDept = departments.find(dept => dept.name === selectedDepartment);
      if (selectedDept) {
        const filtered = lineAreas.filter(area => area.department_id === selectedDept.id);
        setFilteredLineAreas(filtered);
        // Reset line area selection when department changes
        setValue('line_area_id', '');
      }
    } else {
      setFilteredLineAreas([]);
    }
  }, [selectedDepartment, departments, lineAreas, setValue]);

  const fetchMasterData = async () => {
    try {
      console.log('Fetching master data...');
      
      const { data: deptResult, error: deptError } = await supabase
        .from('departments')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      console.log('Department result:', deptResult, deptError);

      if (deptError) {
        console.error('Error fetching departments:', deptError);
      } else {
        console.log('Departments data:', deptResult);
        setDepartments(deptResult || []);
      }

      const { data: lineAreaResult, error: lineAreaError } = await supabase
        .from('line_areas')
        .select('id, name, description, department_id')
        .eq('is_active', true)
        .order('name');

      console.log('Line area result:', lineAreaResult, lineAreaError);

      if (lineAreaError) {
        console.error('Error fetching line areas:', lineAreaError);
      } else {
        console.log('Line areas data:', lineAreaResult);
        setLineAreas(lineAreaResult || []);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data master",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Mengirim tiket:', data);
      
      // Find selected line area
      const selectedLineArea = lineAreas.find(area => area.id === data.line_area_id);
      
      const insertData = {
        category: data.category,
        title: data.title,
        description: data.description,
        priority: data.priority,
        requester_name: data.requester_name,
        requester_department: data.requester_department,
        requester_contact: data.requester_contact || '',
        line_area_id: data.line_area_id,
        line_area_name: selectedLineArea?.name || '',
        notes: null,
        ticket_number: '',
        before_photos: beforeImages,
      };

      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Tiket dibuat:', ticket);

      await supabase
        .from('ticket_logs')
        .insert({
          ticket_id: ticket.id,
          action: 'Dibuat',
          description: 'Tiket diajukan oleh tim produksi',
          created_by: data.requester_name
        });

      setSubmittedTicket(ticket);
      setShowSuccess(true);
      reset();
      setBeforeImages([]);
      
      toast({
        title: "Berhasil!",
        description: `Tiket ${ticket.ticket_number} berhasil diajukan.`,
      });

    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengajukan tiket. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToTrackingTab = () => {
    setShowSuccess(false);
    setSubmittedTicket(null);
    
    if (submittedTicket) {
      localStorage.setItem('searchTicketNumber', submittedTicket.ticket_number);
    }
    
    const event = new CustomEvent('switchToTrackingTab', {
      detail: { ticketNumber: submittedTicket?.ticket_number }
    });
    window.dispatchEvent(event);
  };

  if (showSuccess && submittedTicket) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Tiket Berhasil Diajukan!</h3>
          <p className="text-gray-600 mb-6">Permintaan pemeliharaan Anda telah diterima dan sedang diproses</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 border rounded">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <h4 className="font-bold mb-2">Nomor Tiket</h4>
              <p className="text-xl font-mono text-blue-600 mb-2">{submittedTicket.ticket_number}</p>
              <p className="text-sm text-gray-600">Simpan nomor ini untuk melacak status permintaan Anda</p>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-bold mb-4">Kode QR</h4>
              <QRCodeGenerator 
                value={submittedTicket.ticket_number} 
                ticketNumber={submittedTicket.ticket_number}
                size={120}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Ajukan Tiket Lain
            </Button>
            <Button
              variant="outline"
              onClick={switchToTrackingTab}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Lacak Tiket Ini
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Enhanced Header Card - positioned at the very top with minimal spacing */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/85 dark:from-slate-900/95 dark:via-blue-950/90 dark:to-purple-950/85 backdrop-blur-xl border-2 border-blue-500/30 dark:border-blue-400/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-blue-500/50 dark:hover:border-blue-400/60 mb-2">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30"></div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <CardHeader className="relative text-center py-3 px-8">
          {/* Enhanced title with gradient and effects - no icon */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradientShift">
                Ajukan Permintaan Pemeliharaan
              </CardTitle>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                Lengkapi formulir di bawah untuk meminta bantuan 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> TPM</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                Tim kami akan segera memproses permintaan Anda dengan prioritas tinggi
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
          </div>
          <div className="absolute top-6 right-8">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-40"></div>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-50"></div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Jenis Permintaan */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Jenis Permintaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedCategory === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => setValue('category', option.value as TicketCategory)}
                    className={`p-4 rounded border cursor-pointer ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="w-6 h-6" />
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Informasi Pemohon */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informasi Pemohon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requester_name">Nama *</Label>
                <Input
                  {...register('requester_name', { required: 'Nama wajib diisi' })}
                  placeholder="Nama lengkap Anda"
                />
                {errors.requester_name && (
                  <p className="text-red-500 text-sm">{errors.requester_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester_contact">Kontak</Label>
                <Input
                  {...register('requester_contact')}
                  placeholder="Telepon atau email (opsional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester_department">Departemen *</Label>
                <Select onValueChange={(value) => setValue('requester_department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Memuat departemen...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.requester_department && (
                  <p className="text-red-500 text-sm">Departemen wajib dipilih</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="line_area_id">Line/Area *</Label>
                <Select 
                  onValueChange={(value) => setValue('line_area_id', value)}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedDepartment ? "Pilih line/area" : "Pilih departemen terlebih dahulu"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLineAreas.length > 0 ? (
                      filteredLineAreas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))
                    ) : selectedDepartment ? (
                      <SelectItem value="no-areas" disabled>
                        Tidak ada line/area untuk departemen ini
                      </SelectItem>
                    ) : (
                      <SelectItem value="select-dept" disabled>
                        Pilih departemen terlebih dahulu
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.line_area_id && (
                  <p className="text-red-500 text-sm">Line/Area wajib dipilih</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Judul Masalah */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Judul Masalah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Deskripsi singkat masalah *</Label>
              <Input
                {...register('title', { required: 'Judul wajib diisi' })}
                placeholder="Deskripsi singkat masalah"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Foto Kondisi Sekarang */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Foto Kondisi Sekarang (Opsional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded border">
              <ImageUpload
                onImagesChange={setBeforeImages}
                existingImages={beforeImages}
                maxImages={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Deskripsi Kondisi */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Deskripsi Kondisi Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Detail kondisi dan masalah *</Label>
              <Textarea
                {...register('description', { required: 'Deskripsi wajib diisi' })}
                className="min-h-[120px]"
                placeholder="Berikan informasi detail tentang masalah, termasuk gejala, kapan mulai terjadi, dan konteks yang relevan..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Level Prioritas */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Level Prioritas</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedPriority}
              onValueChange={(value) => setValue('priority', value as TicketPriority)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 p-3 rounded border cursor-pointer"
                  >
                    <div className="font-semibold">{option.label.toUpperCase()}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="mb-2">
          <CardContent className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengajukan Permintaan...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Ajukan Permintaan Pemeliharaan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
