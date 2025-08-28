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
import { Upload, X, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useUploadProjectImage, useDeleteProjectImage, useUpdateProjectImageOrder } from '@/hooks/useProjectImages';
import { useUpdateProjectImageDetails, useSetProjectCoverImage } from '@/hooks/useProjectImageDetails';
import { ProjectImage } from '@/hooks/useProjects';
import { toast } from 'sonner';

interface ImageUploadProps {
  projectId: string;
  images: ProjectImage[];
  currentCoverImage?: string;
  onImagesChange?: () => void;
  isTemporary?: boolean;
}

export function ImageUpload({ projectId, images, currentCoverImage, onImagesChange, isTemporary = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<'gallery' | 'before' | 'after'>('gallery');
  const uploadImage = useUploadProjectImage();
  const deleteImage = useDeleteProjectImage();
  const updateImageOrder = useUpdateProjectImageOrder();
  const updateImageDetails = useUpdateProjectImageDetails();
  const setCoverImage = useSetProjectCoverImage();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!projectId) return;
    
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const imagesOfType = images.filter(img => img.image_type === selectedImageType);
        const orderIndex = imagesOfType.length;
        
        if (isTemporary) {
          // Handle temporary upload logic here
          // For now, we'll use the regular upload but could be extended
          toast.success('Upload temporário - será associado ao salvar o projeto');
        }
        
        await uploadImage.mutateAsync({
          file,
          projectId,
          imageType: selectedImageType,
          orderIndex,
        });
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
    
    setUploading(false);
    onImagesChange?.();
  }, [projectId, images, selectedImageType, uploadImage, onImagesChange, isTemporary]);

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

  const galleryImages = images.filter(img => img.image_type === 'gallery').sort((a, b) => a.order_index - b.order_index);
  const beforeImages = images.filter(img => img.image_type === 'before').sort((a, b) => a.order_index - b.order_index);
  const afterImages = images.filter(img => img.image_type === 'after').sort((a, b) => a.order_index - b.order_index);

  const moveImage = async (imageId: string, imageType: 'gallery' | 'before' | 'after', direction: 'left' | 'right') => {
    const imagesOfType = images.filter(img => img.image_type === imageType).sort((a, b) => a.order_index - b.order_index);
    const currentIndex = imagesOfType.findIndex(img => img.id === imageId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= imagesOfType.length) return;
    
    // Swap order_index values
    const updates = [
      { id: imagesOfType[currentIndex].id, order_index: imagesOfType[newIndex].order_index },
      { id: imagesOfType[newIndex].id, order_index: imagesOfType[currentIndex].order_index }
    ];
    
    await updateImageOrder.mutateAsync(updates);
  };

  const handleSetAsCover = async (imageUrl: string) => {
    await setCoverImage.mutateAsync({ projectId, imageUrl });
  };

  return (
    <div className="space-y-6">
      {/* Image Type Selector and Upload Area */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Image Type Selector */}
          <div className="space-y-2">
            <Label>Tipo de Imagem</Label>
            <Select value={selectedImageType} onValueChange={(value: 'gallery' | 'before' | 'after') => setSelectedImageType(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallery">Galeria</SelectItem>
                <SelectItem value="before">Antes</SelectItem>
                <SelectItem value="after">Depois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Area */}
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
                Formatos suportados: JPG, PNG, WebP • Tipo: {selectedImageType === 'gallery' ? 'Galeria' : selectedImageType === 'before' ? 'Antes' : 'Depois'}
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
          {galleryImages.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              isFirst={index === 0}
              isLast={index === galleryImages.length - 1}
              isCover={currentCoverImage === image.image_url}
              onDelete={() => handleDeleteImage(image.id)}
              onMoveLeft={() => moveImage(image.id, 'gallery', 'left')}
              onMoveRight={() => moveImage(image.id, 'gallery', 'right')}
              onSetAsCover={() => handleSetAsCover(image.image_url)}
              onUpdateCaption={(caption) => updateImageDetails.mutateAsync({ imageId: image.id, caption })}
              onChangeType={(newType) => {
                const targetImages = images.filter(img => img.image_type === newType);
                const orderIndex = targetImages.length;
                updateImageDetails.mutateAsync({ imageId: image.id, imageType: newType, orderIndex });
              }}
            />
          ))}
        </div>
      </div>

      {/* Before/After Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Antes ({beforeImages.length})</h3>
          <div className="grid grid-cols-2 gap-4">
            {beforeImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                isFirst={index === 0}
                isLast={index === beforeImages.length - 1}
                isCover={currentCoverImage === image.image_url}
                onDelete={() => handleDeleteImage(image.id)}
                onMoveLeft={() => moveImage(image.id, 'before', 'left')}
                onMoveRight={() => moveImage(image.id, 'before', 'right')}
                onSetAsCover={() => handleSetAsCover(image.image_url)}
                onUpdateCaption={(caption) => updateImageDetails.mutateAsync({ imageId: image.id, caption })}
                onChangeType={(newType) => {
                  const targetImages = images.filter(img => img.image_type === newType);
                  const orderIndex = targetImages.length;
                  updateImageDetails.mutateAsync({ imageId: image.id, imageType: newType, orderIndex });
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Depois ({afterImages.length})</h3>
          <div className="grid grid-cols-2 gap-4">
            {afterImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                isFirst={index === 0}
                isLast={index === afterImages.length - 1}
                isCover={currentCoverImage === image.image_url}
                onDelete={() => handleDeleteImage(image.id)}
                onMoveLeft={() => moveImage(image.id, 'after', 'left')}
                onMoveRight={() => moveImage(image.id, 'after', 'right')}
                onSetAsCover={() => handleSetAsCover(image.image_url)}
                onUpdateCaption={(caption) => updateImageDetails.mutateAsync({ imageId: image.id, caption })}
                onChangeType={(newType) => {
                  const targetImages = images.filter(img => img.image_type === newType);
                  const orderIndex = targetImages.length;
                  updateImageDetails.mutateAsync({ imageId: image.id, imageType: newType, orderIndex });
                }}
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
  isFirst: boolean;
  isLast: boolean;
  isCover: boolean;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSetAsCover: () => void;
  onUpdateCaption: (caption: string) => void;
  onChangeType: (type: 'gallery' | 'before' | 'after') => void;
}

function ImageCard({ 
  image, 
  isFirst, 
  isLast, 
  isCover, 
  onDelete, 
  onMoveLeft, 
  onMoveRight, 
  onSetAsCover, 
  onUpdateCaption, 
  onChangeType 
}: ImageCardProps) {
  const [caption, setCaption] = useState(image.caption || '');
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  const handleSaveCaption = () => {
    onUpdateCaption(caption);
    setIsEditingCaption(false);
  };

  const handleCancelCaption = () => {
    setCaption(image.caption || '');
    setIsEditingCaption(false);
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square relative group">
          <img
            src={image.image_url}
            alt={image.caption || 'Project image'}
            className="w-full h-full object-cover"
          />
          
          {/* Cover Badge */}
          {isCover && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Crown className="h-3 w-3 mr-1" />
              Capa
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex space-x-1">
              {!isFirst && (
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={onMoveLeft}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {!isLast && (
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={onMoveRight}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              <Button variant="secondary" size="icon" className="h-8 w-8" onClick={onSetAsCover}>
                <Crown className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={onDelete}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Caption and Type Controls */}
        <div className="p-3 space-y-2">
          {/* Caption */}
          {isEditingCaption ? (
            <div className="space-y-2">
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Legenda da imagem..."
                className="text-xs"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveCaption()}
              />
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={handleSaveCaption}>
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelCaption}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors min-h-[1rem]"
              onClick={() => setIsEditingCaption(true)}
            >
              {image.caption || 'Clique para adicionar legenda'}
            </div>
          )}

          {/* Type Selector */}
          <Select value={image.image_type} onValueChange={onChangeType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gallery">Galeria</SelectItem>
              <SelectItem value="before">Antes</SelectItem>
              <SelectItem value="after">Depois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}