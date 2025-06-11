
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, User, Building, Phone, MapPin, Zap, AlertTriangle, Camera, FileText } from 'lucide-react';

const ticketSchema = z.object({
  type: z.enum(['corrective_action', 'repair', 'procurement', 'support']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  machineId: z.string().min(1, 'Machine/Equipment ID is required'),
  location: z.string().min(1, 'Location is required'),
  requesterName: z.string().min(2, 'Name is required'),
  requesterDepartment: z.string().min(1, 'Department is required'),
  requesterContact: z.string().min(10, 'Valid contact number is required'),
  notes: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const ticketTypes = [
  { value: 'corrective_action', label: 'Corrective Action', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
  { value: 'repair', label: 'Repair Request', icon: '⚡', color: 'from-orange-500 to-red-500' },
  { value: 'procurement', label: 'Procurement', icon: '📦', color: 'from-green-500 to-emerald-500' },
  { value: 'support', label: 'Support Request', icon: '💬', color: 'from-purple-500 to-pink-500' },
];

const priorityLevels = [
  { value: 'low', label: 'Low Priority', color: 'from-green-400 to-green-600', glow: 'shadow-green-500/50' },
  { value: 'medium', label: 'Medium Priority', color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/50' },
  { value: 'high', label: 'High Priority', color: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/50' },
  { value: 'critical', label: 'Critical', color: 'from-red-500 to-red-700', glow: 'shadow-red-500/50' },
];

const locations = [
  'Production Line A', 'Production Line B', 'Production Line C',
  'Assembly Area 1', 'Assembly Area 2', 'Quality Control',
  'Packaging Department', 'Warehouse', 'Maintenance Shop',
  'Utilities', 'Office Area', 'Other'
];

export const TicketSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      type: undefined,
      priority: 'medium',
      title: '',
      description: '',
      machineId: '',
      location: '',
      requesterName: '',
      requesterDepartment: '',
      requesterContact: '',
      notes: '',
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock ticket number
    const ticketNumber = `TPM-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    toast({
      title: "🎉 Ticket Submitted Successfully!",
      description: `Your ticket ${ticketNumber} has been created and assigned to the TPM team.`,
      duration: 5000,
    });

    // Reset form
    form.reset();
    setSelectedPhotos([]);
    setIsSubmitting(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedPhotos(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="glass-card border-0 neon-glow">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold gradient-text mb-2">
          Submit Maintenance Request
        </CardTitle>
        <p className="text-gray-400">
          Report issues, request repairs, or get support for your equipment
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Ticket Type Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Request Type
              </h3>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ticketTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`
                              p-6 rounded-xl cursor-pointer transition-all duration-300 border-2
                              ${field.value === type.value 
                                ? `bg-gradient-to-r ${type.color} border-white shadow-lg scale-105` 
                                : 'glass-card border-gray-600 hover:border-blue-400 hover:scale-102'
                              }
                            `}
                            onClick={() => field.onChange(type.value)}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">{type.icon}</div>
                              <h4 className="font-semibold text-white">{type.label}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-400" />
                Request Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-gray-300">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glass-input text-white placeholder-gray-400 h-12" 
                          placeholder="Brief description of the issue..."
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="machineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Machine/Equipment ID *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            className="glass-input text-white placeholder-gray-400 h-12 scan-line" 
                            placeholder="e.g., PROD-LINE-A-001"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Location *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-input text-white h-12">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {locations.map((location) => (
                            <SelectItem key={location} value={location} className="text-white hover:bg-gray-800">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                                {location}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="glass-input text-white placeholder-gray-400 min-h-32" 
                        placeholder="Provide detailed information about the issue, including what happened, when it occurred, and any error messages..."
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-gray-400">
                      <FormMessage className="text-red-400" />
                      <span>{field.value?.length || 0} characters</span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Priority Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                Priority Level
              </h3>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {priorityLevels.map((priority) => (
                          <div
                            key={priority.value}
                            className={`
                              p-4 rounded-xl cursor-pointer transition-all duration-300 border-2
                              ${field.value === priority.value 
                                ? `bg-gradient-to-r ${priority.color} border-white shadow-lg ${priority.glow} shadow-lg scale-105` 
                                : 'glass-card border-gray-600 hover:border-blue-400'
                              }
                            `}
                            onClick={() => field.onChange(priority.value)}
                          >
                            <div className="text-center">
                              <h4 className="font-semibold text-white text-sm">{priority.label}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Requester Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-400" />
                Requester Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="requesterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            {...field} 
                            className="glass-input text-white placeholder-gray-400 h-12 pl-10" 
                            placeholder="Your full name"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requesterDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Department *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            {...field} 
                            className="glass-input text-white placeholder-gray-400 h-12 pl-10" 
                            placeholder="Your department"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requesterContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Contact Number *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            {...field} 
                            className="glass-input text-white placeholder-gray-400 h-12 pl-10" 
                            placeholder="Your phone number"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Camera className="w-5 h-5 mr-2 text-pink-400" />
                Photos (Optional)
              </h3>
              
              <div className="glass-card p-8 border-2 border-dashed border-gray-600 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Upload photos of the issue</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700"
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {selectedPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative glass-card p-2">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </Button>
                      <p className="text-xs text-gray-400 mt-1 truncate">{photo.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="glass-input text-white placeholder-gray-400" 
                      placeholder="Any additional information that might be helpful..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 border-0 neon-glow transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Submit TPM Request
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
