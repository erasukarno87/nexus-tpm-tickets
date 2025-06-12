
import React, { useState } from 'react';
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
import { 
  Wrench, 
  AlertTriangle, 
  Package, 
  HelpCircle, 
  Upload, 
  CheckCircle, 
  Loader2,
  User,
  Building,
  Phone,
  MapPin,
  Settings,
  FileText,
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
  location: string;
  requester_name: string;
  requester_department: string;
  requester_contact: string;
  notes?: string;
}

const categoryOptions = [
  { value: 'corrective_action', label: 'Corrective Action', icon: AlertTriangle, color: 'from-orange-500 to-red-500' },
  { value: 'repair', label: 'Repair', icon: Wrench, color: 'from-blue-500 to-purple-500' },
  { value: 'procurement', label: 'Procurement', icon: Package, color: 'from-green-500 to-teal-500' },
  { value: 'support', label: 'Support', icon: HelpCircle, color: 'from-purple-500 to-pink-500' },
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'border-green-500 text-green-400 bg-green-500/10' },
  { value: 'medium', label: 'Medium', color: 'border-yellow-500 text-yellow-400 bg-yellow-500/10' },
  { value: 'high', label: 'High', color: 'border-orange-500 text-orange-400 bg-orange-500/10' },
  { value: 'critical', label: 'Critical', color: 'border-red-500 text-red-400 bg-red-500/10' },
];

const locationOptions = [
  'Production Line A',
  'Production Line B',
  'Assembly Area 1',
  'Assembly Area 2',
  'Packaging Department',
  'Quality Control',
  'Warehouse',
  'Maintenance Shop',
  'Loading Dock',
  'Office Area',
];

export const TicketSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TicketFormData>({
    defaultValues: {
      priority: 'medium',
      category: 'repair'
    }
  });

  const selectedCategory = watch('category');
  const selectedPriority = watch('priority');

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting ticket:', data);
      
      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert([{
          category: data.category,
          title: data.title,
          description: data.description,
          priority: data.priority,
          machine_id: data.machine_id || null,
          location: data.location,
          requester_name: data.requester_name,
          requester_department: data.requester_department,
          requester_contact: data.requester_contact,
          notes: data.notes || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Ticket created:', ticket);

      // Create initial log entry
      await supabase
        .from('ticket_logs')
        .insert([{
          ticket_id: ticket.id,
          action: 'Created',
          description: 'Ticket submitted by production team',
          created_by: data.requester_name
        }]);

      setSubmittedTicket(ticket);
      setShowSuccess(true);
      reset();
      
      toast({
        title: "Success!",
        description: `Ticket ${ticket.ticket_number} has been submitted successfully.`,
      });

    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess && submittedTicket) {
    return (
      <Card className="glass-card border-0 neon-glow">
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold gradient-text mb-2">Ticket Submitted Successfully!</h3>
            <p className="text-gray-300 text-lg">Your maintenance request has been received</p>
          </div>

          <div className="glass-card p-6 mb-6 max-w-md mx-auto">
            <h4 className="text-xl font-semibold text-white mb-2">Ticket Number</h4>
            <p className="text-2xl font-mono text-blue-400 mb-4">{submittedTicket.ticket_number}</p>
            <p className="text-sm text-gray-400">Save this number for tracking your request</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
            >
              Submit Another Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Switch to tracking tab
                const trackingTab = document.querySelector('[value="track"]') as HTMLElement;
                trackingTab?.click();
              }}
              className="w-full h-12 glass-input border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              Track This Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0 neon-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold gradient-text mb-2">
          Submit Maintenance Request
        </CardTitle>
        <p className="text-gray-400">
          Complete the form below to request TPM assistance
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Category Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-white">Request Type</Label>
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

          {/* Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Issue Title *</span>
              </Label>
              <Input
                {...register('title', { required: 'Title is required' })}
                className="glass-input text-white h-12"
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="machine_id" className="text-white flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Machine/Equipment ID</span>
              </Label>
              <Input
                {...register('machine_id')}
                className="glass-input text-white h-12"
                placeholder="e.g., LINE-A-001, PACK-002"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Detailed Description *
            </Label>
            <Textarea
              {...register('description', { required: 'Description is required' })}
              className="glass-input text-white min-h-[120px]"
              placeholder="Provide detailed information about the issue, including symptoms, when it started, and any relevant context..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Priority and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-white">Priority Level</Label>
              <RadioGroup
                value={selectedPriority}
                onValueChange={(value) => setValue('priority', value as TicketPriority)}
                className="space-y-2"
              >
                {priorityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className={`px-3 py-1 rounded-full border-2 ${option.color} cursor-pointer transition-all duration-200`}
                    >
                      {option.label.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Location/Area *</span>
              </Label>
              <Select onValueChange={(value) => setValue('location', value)}>
                <SelectTrigger className="glass-input text-white h-12">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-red-400 text-sm">Location is required</p>
              )}
            </div>
          </div>

          {/* Requester Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Requester Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requester_name" className="text-white flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Name *</span>
                </Label>
                <Input
                  {...register('requester_name', { required: 'Name is required' })}
                  className="glass-input text-white h-12"
                  placeholder="Your full name"
                />
                {errors.requester_name && (
                  <p className="text-red-400 text-sm">{errors.requester_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester_department" className="text-white flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Department *</span>
                </Label>
                <Input
                  {...register('requester_department', { required: 'Department is required' })}
                  className="glass-input text-white h-12"
                  placeholder="e.g., Production, Quality"
                />
                {errors.requester_department && (
                  <p className="text-red-400 text-sm">{errors.requester_department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester_contact" className="text-white flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Contact *</span>
                </Label>
                <Input
                  {...register('requester_contact', { required: 'Contact is required' })}
                  className="glass-input text-white h-12"
                  placeholder="Phone or email"
                />
                {errors.requester_contact && (
                  <p className="text-red-400 text-sm">{errors.requester_contact.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Additional Notes</Label>
            <Textarea
              {...register('notes')}
              className="glass-input text-white"
              placeholder="Any additional information that might be helpful..."
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
                Submitting Request...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Maintenance Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
