

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';

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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 720p)
        let { width, height } = img;
        const maxWidth = 1280;
        const maxHeight = 720;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
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
    const newImages: string[] = [];

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

        // Validate file size (max 10MB before compression)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File terlalu besar",
            description: `${file.name} lebih besar dari 10MB`,
            variant: "destructive",
          });
          continue;
        }

        // Compress image
        const compressedImage = await compressImage(file);
        newImages.push(compressedImage);
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);

      if (newImages.length > 0) {
        toast({
          title: "Berhasil",
          description: `${newImages.length} gambar berhasil diunggah dan dikompres`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload gagal",
        description: "Gagal mengunggah gambar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
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
          className="glass-input text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading || images.length >= maxImages}
          className="glass-input border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Mengunggah...' : 'Upload'}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Kondisi saat ini ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
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
        <div className="text-center py-8 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Belum ada gambar yang diunggah</p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {images.length}/{maxImages} gambar • Maks 10MB per gambar • Format: JPG, PNG, GIF • Otomatis dikompres ke 720p
      </p>
    </div>
  );
};

