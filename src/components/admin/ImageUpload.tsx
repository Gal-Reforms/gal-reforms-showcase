import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUploadProjectImage, useDeleteProjectImage } from '@/hooks/useProjectImages';
import { ProjectImage } from '@/hooks/useProjects';

interface ImageUploadProps {
  projectId: string;
  images: ProjectImage[];
  onImagesChange?: () => void;
}

export function ImageUpload({ projectId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const uploadImage = useUploadProjectImage();
  const deleteImage = useDeleteProjectImage();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!projectId) return;
    
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const orderIndex = images.length;
        await uploadImage.mutateAsync({
          file,
          projectId,
          imageType: 'gallery',
          orderIndex,
        });
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
    
    setUploading(false);
    onImagesChange?.();
  }, [projectId, images.length, uploadImage, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage.mutateAsync(imageId);
      onImagesChange?.();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const galleryImages = images.filter(img => img.image_type === 'gallery');
  const beforeImages = images.filter(img => img.image_type === 'before');
  const afterImages = images.filter(img => img.image_type === 'after');

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive 
                  ? 'Solte as imagens aqui...' 
                  : 'Arraste imagens aqui ou clique para selecionar'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos suportados: JPG, PNG, WebP
              </p>
            </div>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Enviando imagens...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Galeria ({galleryImages.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={() => handleDeleteImage(image.id)}
            />
          ))}
        </div>
      </div>

      {/* Before/After Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Antes ({beforeImages.length})</h3>
          <div className="grid grid-cols-2 gap-4">
            {beforeImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={() => handleDeleteImage(image.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Depois ({afterImages.length})</h3>
          <div className="grid grid-cols-2 gap-4">
            {afterImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={() => handleDeleteImage(image.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImageCardProps {
  image: ProjectImage;
  onDelete: () => void;
}

function ImageCard({ image, onDelete }: ImageCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <img
            src={image.image_url}
            alt={image.caption || 'Project image'}
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        {image.caption && (
          <div className="p-2">
            <p className="text-xs text-muted-foreground truncate">
              {image.caption}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}