import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { useUploadCoverImage, useSetProjectCoverImage } from '@/hooks/useProjectImageDetails';
import { ProjectImage } from '@/hooks/useProjects';

interface CoverImageManagerProps {
  projectId: string;
  currentCoverImage?: string;
  galleryImages: ProjectImage[];
}

export function CoverImageManager({ 
  projectId, 
  currentCoverImage, 
  galleryImages 
}: CoverImageManagerProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const uploadCover = useUploadCoverImage();
  const setCover = useSetProjectCoverImage();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadCover.mutateAsync({ file, projectId });
      event.target.value = '';
    }
  };

  const handleSetFromGallery = async (imageUrl: string) => {
    await setCover.mutateAsync({ projectId, imageUrl });
    setIsGalleryOpen(false);
  };

  const handleRemoveCover = async () => {
    await setCover.mutateAsync({ projectId, imageUrl: null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagem de Capa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Cover Preview */}
        {currentCoverImage ? (
          <div className="relative">
            <img
              src={currentCoverImage}
              alt="Capa do projeto"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveCover}
              disabled={setCover.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma capa definida</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Label htmlFor="cover-upload" className="cursor-pointer">
            <Button variant="outline" asChild disabled={uploadCover.isPending}>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Enviar Nova Capa
              </span>
            </Button>
          </Label>
          <Input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {galleryImages.length > 0 && (
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Escolher da Galeria
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Escolher Imagem da Galeria</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <Card 
                      key={image.id} 
                      className="cursor-pointer hover:ring-2 hover:ring-primary"
                      onClick={() => handleSetFromGallery(image.image_url)}
                    >
                      <CardContent className="p-2">
                        <img
                          src={image.image_url}
                          alt={image.caption || 'Imagem da galeria'}
                          className="w-full aspect-square object-cover rounded"
                        />
                        {image.caption && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {image.caption}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {currentCoverImage && (
            <Button 
              variant="destructive" 
              onClick={handleRemoveCover}
              disabled={setCover.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Capa
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}