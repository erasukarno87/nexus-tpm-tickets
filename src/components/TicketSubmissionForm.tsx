
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
import { ModernBackground } from '@/components/ModernBackground';
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
  Sparkles,
  Send,
  Camera
} from 'lucide-react';

type TicketCategory = 'corrective_action' | 'repair' | 'procurement' | 'support';
type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

interface TicketFormData {
  category: TicketCategory;
  title: string;
  description: string;
  priority: TicketPriority;
  machine_id?: string;
  requester_name: string;
  requester_department: string;
  requester_contact: string;
}

interface Department {
  id: string;
  name: string;
}

interface Machine {
  id: string;
  machine_code: string;
  name: string;
}

const categoryOptions = [
  { value: 'corrective_action', label: 'Tindakan Korektif', icon: AlertTriangle, color: 'from-orange-500 to-red-500', description: 'Perbaikan untuk mencegah masalah berulang' },
  { value: 'repair', label: 'Perbaikan', icon: Wrench, color: 'from-blue-500 to-purple-500', description: 'Perbaikan kerusakan mesin atau peralatan' },
  { value: 'procurement', label: 'Pengadaan', icon: Package, color: 'from-green-500 to-teal-500', description: 'Permintaan suku cadang atau material' },
  { value: 'support', label: 'Dukungan', icon: HelpCircle, color: 'from-purple-500 to-pink-500', description: 'Bantuan teknis dan konsultasi' },
];

const priorityOptions = [
  { value: 'low', label: 'Rendah', color: 'border-green-500 text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10', description: 'Tidak mengganggu produksi' },
  { value: 'medium', label: 'Sedang', color: 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-500/10', description: 'Berpotensi mengganggu produksi' },
  { value: 'high', label: 'Tinggi', color: 'border-orange-500 text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10', description: 'Mengganggu produksi secara signifikan' },
  { value: 'critical', label: 'Kritis', color: 'border-red-500 text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10', description: 'Menghentikan produksi' },
];

export const TicketSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
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

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [deptResult, machResult] = await Promise.all([
        supabase.from('departments').select('id, name').eq('is_active', true),
        supabase.from('line_areas').select('id, name').eq('is_active', true)
      ]);

      if (deptResult.data) setDepartments(deptResult.data);
      if (machResult.data) {
        // Transform data to include machine_code
        const transformedMachines = machResult.data.map(item => ({
          id: item.id,
          machine_code: item.id, // Using id as machine_code for now
          name: item.name
        }));
        setMachines(transformedMachines);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Mengirim tiket:', data);
      
      const insertData = {
        category: data.category,
        title: data.title,
        description: data.description,
        priority: data.priority,
        machine_id: data.machine_id || null,
        location: '',
        requester_name: data.requester_name,
        requester_department: data.requester_department,
        requester_contact: data.requester_contact,
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
    
    const trackingTab = document.querySelector('[data-value="track"]') as HTMLElement;
    if (trackingTab) {
      trackingTab.click();
      
      setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder*="nomor tiket"]') as HTMLInputElement;
        if (searchInput && submittedTicket) {
          searchInput.value = submittedTicket.ticket_number;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 100);
    }
  };

  if (showSuccess && submittedTicket) {
    return (
      <div className="relative min-h-screen">
        <ModernBackground />
        <Card className="glass-card border-0 neon-glow relative z-10">
          <CardContent className="text-center py-16">
            <div className="mb-8 animate-fadeIn">
              <div className="relative">
                <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6 animate-pulse" />
                <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin opacity-30"></div>
              </div>
              <h3 className="text-4xl font-bold gradient-text mb-4">Tiket Berhasil Diajukan!</h3>
              <p className="text-gray-200 text-xl">Permintaan pemeliharaan Anda telah diterima dan sedang diproses</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="glass-card p-8 neon-glow">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-4">Nomor Tiket</h4>
                <p className="text-3xl font-mono text-blue-400 mb-6 font-bold">{submittedTicket.ticket_number}</p>
                <p className="text-gray-300">Simpan nomor ini untuk melacak status permintaan Anda</p>
              </div>

              <div className="glass-card p-8 neon-glow">
                <h4 className="text-2xl font-bold text-white mb-6">Kode QR</h4>
                <QRCodeGenerator 
                  value={submittedTicket.ticket_number} 
                  ticketNumber={submittedTicket.ticket_number}
                  size={180}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowSuccess(false)}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Ajukan Tiket Lain
              </Button>
              <Button
                variant="outline"
                onClick={switchToTrackingTab}
                className="w-full h-14 text-lg glass-input border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Settings className="w-5 h-5 mr-2" />
                Lacak Tiket Ini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <ModernBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="text-center pb-8 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-blue-600 mr-4" />
              <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white">
                Ajukan Permintaan Pemeliharaan
              </CardTitle>
              <Sparkles className="w-12 h-12 text-purple-600 ml-4" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-xl">
              Lengkapi formulir di bawah untuk meminta bantuan TPM
            </p>
            <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
          </CardHeader>

          <CardContent className="px-8 pb-8 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Enhanced Category Selection */}
              <div className="space-y-6">
                <Label className="text-2xl font-bold text-black dark:text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-blue-600" />
                  Jenis Permintaan
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedCategory === option.value;
                    return (
                      <div
                        key={option.value}
                        onClick={() => setValue('category', option.value as TicketCategory)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                          isSelected 
                            ? `bg-gradient-to-r ${option.color} border-transparent text-white shadow-xl` 
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-black dark:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4 mb-3">
                          <Icon className="w-8 h-8" />
                          <span className="font-bold text-lg">{option.label}</span>
                        </div>
                        <p className="text-sm opacity-90">{option.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Requester Information - Moved before Title and Line/Area */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-black dark:text-white flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-600" />
                  Informasi Pemohon
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="requester_name" className="text-black dark:text-white flex items-center space-x-2 font-semibold">
                      <User className="w-4 h-4" />
                      <span>Nama *</span>
                    </Label>
                    <Input
                      {...register('requester_name', { required: 'Nama wajib diisi' })}
                      className="bg-white dark:bg-gray-700 text-black dark:text-white h-14 text-lg border-gray-300 dark:border-gray-600"
                      placeholder="Nama lengkap Anda"
                    />
                    {errors.requester_name && (
                      <p className="text-red-500 text-sm">{errors.requester_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="requester_department" className="text-black dark:text-white flex items-center space-x-2 font-semibold">
                      <Building className="w-4 h-4" />
                      <span>Departemen *</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('requester_department', value)}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 text-black dark:text-white h-14 text-lg border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Pilih departemen" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name} className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.requester_department && (
                      <p className="text-red-500 text-sm">Departemen wajib dipilih</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="requester_contact" className="text-black dark:text-white flex items-center space-x-2 font-semibold">
                      <Phone className="w-4 h-4" />
                      <span>Kontak *</span>
                    </Label>
                    <Input
                      {...register('requester_contact', { required: 'Kontak wajib diisi' })}
                      className="bg-white dark:bg-gray-700 text-black dark:text-white h-14 text-lg border-gray-300 dark:border-gray-600"
                      placeholder="Telepon atau email"
                    />
                    {errors.requester_contact && (
                      <p className="text-red-500 text-sm">{errors.requester_contact.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Title and Line/Area - Moved after Requester Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-black dark:text-white flex items-center space-x-2 text-lg font-semibold">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Judul Masalah *</span>
                  </Label>
                  <Input
                    {...register('title', { required: 'Judul wajib diisi' })}
                    className="bg-white dark:bg-gray-700 text-black dark:text-white h-14 text-lg border-gray-300 dark:border-gray-600"
                    placeholder="Deskripsi singkat masalah"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="machine_id" className="text-black dark:text-white flex items-center space-x-2 text-lg font-semibold">
                    <Settings className="w-5 h-5 text-green-600" />
                    <span>Line/Area</span>
                  </Label>
                  <Select onValueChange={(value) => setValue('machine_id', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 text-black dark:text-white h-14 text-lg border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Pilih Line/Area" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id} className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload Section - Moved before Description */}
              <div className="space-y-6">
                <Label className="text-black dark:text-white text-lg font-semibold flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-blue-600" />
                  Foto Kondisi Sekarang (Opsional)
                </Label>
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600">
                  <ImageUpload
                    onImagesChange={setBeforeImages}
                    existingImages={beforeImages}
                    maxImages={5}
                  />
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-black dark:text-white text-lg font-semibold">
                  Deskripsi Detail *
                </Label>
                <Textarea
                  {...register('description', { required: 'Deskripsi wajib diisi' })}
                  className="bg-white dark:bg-gray-700 text-black dark:text-white min-h-[150px] text-lg border-gray-300 dark:border-gray-600"
                  placeholder="Berikan informasi detail tentang masalah, termasuk gejala, kapan mulai terjadi, dan konteks yang relevan..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              {/* Enhanced Priority Selection */}
              <div className="space-y-6">
                <Label className="text-black dark:text-white text-lg font-semibold">Level Prioritas</Label>
                <RadioGroup
                  value={selectedPriority}
                  onValueChange={(value) => setValue('priority', value as TicketPriority)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {priorityOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} className="w-5 h-5" />
                      <Label
                        htmlFor={option.value}
                        className={`flex-1 px-6 py-4 rounded-xl border-2 ${option.color} cursor-pointer transition-all duration-300 hover:scale-105`}
                      >
                        <div className="font-bold text-lg">{option.label.toUpperCase()}</div>
                        <div className="text-sm opacity-80">{option.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 text-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Mengajukan Permintaan...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-3" />
                    Ajukan Permintaan Pemeliharaan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
