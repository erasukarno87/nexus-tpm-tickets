
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/utils/imageUtils';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImagesChange, 
  existingImages = [], 
  maxImages = 5 
}) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading compressed file to Supabase Storage:', filePath);

      const { data, error } = await supabase.storage
        .from('ticket-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('ticket-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Terlalu banyak gambar",
        description: `Maksimal ${maxImages} gambar diperbolehkan`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "File tidak valid",
            description: `${file.name} bukan file gambar`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File terlalu besar",
            description: `${file.name} lebih besar dari 10MB`,
            variant: "destructive",
          });
          continue;
        }

        console.log(`Compressing image: ${file.name}, original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        
        // Compress image before upload
        const compressedFile = await compressImage(file, 720, 0.8);
        
        console.log(`Compressed image: ${compressedFile.name}, new size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

        // Upload compressed image to Supabase Storage
        const imageUrl = await uploadToSupabase(compressedFile);
        if (imageUrl) {
          newImageUrls.push(imageUrl);
        } else {
          toast({
            title: "Upload gagal",
            description: `Gagal mengunggah ${file.name}`,
            variant: "destructive",
          });
        }
      }

      if (newImageUrls.length > 0) {
        const updatedImages = [...images, ...newImageUrls];
        setImages(updatedImages);
        onImagesChange(updatedImages);

        toast({
          title: "Berhasil",
          description: `${newImageUrls.length} gambar berhasil dikompres dan diunggah ke Supabase Storage`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload gagal",
        description: "Gagal mengunggah gambar ke storage",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Extract file path from URL for deletion
    if (imageUrl.includes('/ticket-images/')) {
      try {
        const urlParts = imageUrl.split('/ticket-images/');
        const filePath = urlParts[1];
        console.log('Deleting file from storage:', filePath);
        
        const { error } = await supabase.storage
          .from('ticket-images')
          .remove([filePath]);
        
        if (error) {
          console.error('Error deleting file:', error);
        }
      } catch (error) {
        console.error('Error parsing file path for deletion:', error);
      }
    }

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading || images.length >= maxImages}
          className="bg-white dark:bg-gray-800 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Mengunggah...' : 'Upload'}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Kondisi saat ini ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  console.error('Error loading image:', imageUrl);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Belum ada gambar yang diunggah</p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {images.length}/{maxImages} gambar • Maks 10MB per gambar • Format: JPG, PNG, GIF • Dikompres ke lebar maks 720px • Disimpan di Supabase Storage
      </p>
    </div>
  );
};
