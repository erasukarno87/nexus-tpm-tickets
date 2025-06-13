
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
import { Background3D } from '@/components/Background3D';
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
  FileText
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
  requester_notes?: string;
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
  { value: 'corrective_action', label: 'Tindakan Korektif', icon: AlertTriangle, color: 'from-orange-500 to-red-500' },
  { value: 'repair', label: 'Perbaikan', icon: Wrench, color: 'from-blue-500 to-purple-500' },
  { value: 'procurement', label: 'Pengadaan', icon: Package, color: 'from-green-500 to-teal-500' },
  { value: 'support', label: 'Dukungan', icon: HelpCircle, color: 'from-purple-500 to-pink-500' },
];

const priorityOptions = [
  { value: 'low', label: 'Rendah', color: 'border-green-500 text-green-400 bg-green-500/10' },
  { value: 'medium', label: 'Sedang', color: 'border-yellow-500 text-yellow-400 bg-yellow-500/10' },
  { value: 'high', label: 'Tinggi', color: 'border-orange-500 text-orange-400 bg-orange-500/10' },
  { value: 'critical', label: 'Kritis', color: 'border-red-500 text-red-400 bg-red-500/10' },
];

export const TicketSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
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
        supabase.from('machines').select('id, machine_code, name').eq('is_active', true)
      ]);

      if (deptResult.data) setDepartments(deptResult.data);
      if (machResult.data) setMachines(machResult.data);
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
        location: '', // Removed as requested
        requester_name: data.requester_name,
        requester_department: data.requester_department,
        requester_contact: data.requester_contact,
        notes: data.requester_notes || null,
        ticket_number: '',
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
        <Background3D />
        <Card className="glass-card border-0 neon-glow relative z-10">
          <CardContent className="text-center py-12">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-3xl font-bold gradient-text mb-2">Tiket Berhasil Diajukan!</h3>
              <p className="text-gray-300 text-lg">Permintaan pemeliharaan Anda telah diterima</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass-card p-6">
                <h4 className="text-xl font-semibold text-white mb-2">Nomor Tiket</h4>
                <p className="text-2xl font-mono text-blue-400 mb-4">{submittedTicket.ticket_number}</p>
                <p className="text-sm text-gray-400">Simpan nomor ini untuk melacak permintaan Anda</p>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-xl font-semibold text-white mb-4">Kode QR</h4>
                <QRCodeGenerator 
                  value={submittedTicket.ticket_number} 
                  ticketNumber={submittedTicket.ticket_number}
                  size={150}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowSuccess(false)}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
              >
                Ajukan Tiket Lain
              </Button>
              <Button
                variant="outline"
                onClick={switchToTrackingTab}
                className="w-full h-12 glass-input border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
              >
                Lacak Tiket Ini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Background3D />
      <Card className="glass-card border-0 neon-glow relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text mb-2">
            Ajukan Permintaan Pemeliharaan
          </CardTitle>
          <p className="text-gray-400">
            Lengkapi formulir di bawah untuk meminta bantuan TPM
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Category Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-white">Jenis Permintaan</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedCategory === option.value;
                  return (
                    <div
                      key={option.value}
                      onClick={() => setValue('category', option.value as TicketCategory)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? `bg-gradient-to-r ${option.color} border-transparent text-white` 
                          : 'glass-input border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Title and Line/Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Judul Masalah *</span>
                </Label>
                <Input
                  {...register('title', { required: 'Judul wajib diisi' })}
                  className="glass-input text-white h-12"
                  placeholder="Deskripsi singkat masalah"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="machine_id" className="text-white flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Line/Area</span>
                </Label>
                <Select onValueChange={(value) => setValue('machine_id', value)}>
                  <SelectTrigger className="glass-input text-white h-12">
                    <SelectValue placeholder="Pilih Line/Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.machine_code}>
                        {machine.machine_code} - {machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Deskripsi Detail *
              </Label>
              <Textarea
                {...register('description', { required: 'Deskripsi wajib diisi' })}
                className="glass-input text-white min-h-[120px]"
                placeholder="Berikan informasi detail tentang masalah, termasuk gejala, kapan mulai terjadi, dan konteks yang relevan..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* Priority Selection - Horizontal layout */}
            <div className="space-y-4">
              <Label className="text-white">Level Prioritas</Label>
              <RadioGroup
                value={selectedPriority}
                onValueChange={(value) => setValue('priority', value as TicketPriority)}
                className="flex flex-wrap justify-center gap-4"
              >
                {priorityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className={`px-4 py-2 rounded-full border-2 ${option.color} cursor-pointer transition-all duration-200`}
                    >
                      {option.label.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Requester Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold gradient-text">Informasi Pemohon</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requester_name" className="text-white flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nama *</span>
                  </Label>
                  <Input
                    {...register('requester_name', { required: 'Nama wajib diisi' })}
                    className="glass-input text-white h-12"
                    placeholder="Nama lengkap Anda"
                  />
                  {errors.requester_name && (
                    <p className="text-red-400 text-sm">{errors.requester_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requester_department" className="text-white flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Departemen *</span>
                  </Label>
                  <Select onValueChange={(value) => setValue('requester_department', value)}>
                    <SelectTrigger className="glass-input text-white h-12">
                      <SelectValue placeholder="Pilih departemen" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.requester_department && (
                    <p className="text-red-400 text-sm">Departemen wajib dipilih</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requester_contact" className="text-white flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Kontak *</span>
                  </Label>
                  <Input
                    {...register('requester_contact', { required: 'Kontak wajib diisi' })}
                    className="glass-input text-white h-12"
                    placeholder="Telepon atau email"
                  />
                  {errors.requester_contact && (
                    <p className="text-red-400 text-sm">{errors.requester_contact.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Requester Notes */}
            <div className="space-y-2">
              <Label htmlFor="requester_notes" className="text-white">Catatan Pemohon</Label>
              <Textarea
                {...register('requester_notes')}
                className="glass-input text-white"
                placeholder="Catatan tambahan dari pemohon..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mengajukan Permintaan...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Ajukan Permintaan Pemeliharaan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
