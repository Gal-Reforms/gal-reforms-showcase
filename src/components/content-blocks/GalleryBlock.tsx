import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Plus, X, Edit } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';

interface GalleryImage {
  url: string;
  caption?: string;
  alt?: string;
}

interface GalleryBlockProps {
  content: {
    images?: GalleryImage[];
    columns?: number;
    spacing?: 'small' | 'medium' | 'large';
  };
  isEditing?: boolean;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export const GalleryBlock = ({ content, isEditing, onSave, onCancel }: GalleryBlockProps) => {
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>(content.images || []);
  const [columns, setColumns] = useState(content.columns || 3);
  const [spacing, setSpacing] = useState(content.spacing || 'medium');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleSave = () => {
    if (onSave) {
      onSave({
        images,
        columns,
        spacing
      });
    }
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setImages(content.images || []);
    setColumns(content.columns || 3);
    setSpacing(content.spacing || 'medium');
    setIsLocalEditing(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleImageUpload = async (files: File[], insertAtIndex?: number) => {
    if (!files || files.length === 0) return;

    const targetIndex = insertAtIndex ?? images.length;
    setUploadingIndex(targetIndex);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('projects')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(data.path);

        return {
          url: publicUrl,
          alt: file.name.split('.')[0],
          caption: ''
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      const newImages = [...images];
      newImages.splice(targetIndex, 0, ...uploadedImages);
      setImages(newImages);

      toast.success(`${uploadedImages.length} imagem(ns) adicionada(s) à galeria!`);
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload das imagens');
    } finally {
      setUploadingIndex(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleImageUpload(files),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    setImages([...images, { url: '', caption: '', alt: '' }]);
  };

  const getColumnClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'small': return 'gap-2';
      case 'medium': return 'gap-4';
      case 'large': return 'gap-8';
      default: return 'gap-4';
    }
  };

  if (isEditing || isLocalEditing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Editar Galeria</h3>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>

            {/* Configurações da galeria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="columns">Número de colunas</Label>
                <select 
                  id="columns"
                  value={columns} 
                  onChange={(e) => setColumns(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value={1}>1 coluna</option>
                  <option value={2}>2 colunas</option>
                  <option value={3}>3 colunas</option>
                  <option value={4}>4 colunas</option>
                </select>
              </div>

              <div>
                <Label htmlFor="spacing">Espaçamento</Label>
                <select 
                  id="spacing"
                  value={spacing} 
                  onChange={(e) => setSpacing(e.target.value as any)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                </select>
              </div>
            </div>

            {/* Upload area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Arraste e solte imagens aqui ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                Suporta: JPEG, PNG, GIF, WebP (múltiplas imagens)
              </p>
            </div>

            {/* Lista de imagens */}
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    {image.url && (
                      <div className="w-20 h-20 flex-shrink-0">
                        <LazyImage
                          src={image.url}
                          alt={image.alt || `Imagem ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={`url-${index}`}>URL da imagem</Label>
                        <Input
                          id={`url-${index}`}
                          value={image.url}
                          onChange={(e) => updateImage(index, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`caption-${index}`}>Legenda</Label>
                        <Input
                          id={`caption-${index}`}
                          value={image.caption || ''}
                          onChange={(e) => updateImage(index, 'caption', e.target.value)}
                          placeholder="Legenda da imagem (opcional)"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`alt-${index}`}>Texto alternativo</Label>
                        <Input
                          id={`alt-${index}`}
                          value={image.alt || ''}
                          onChange={(e) => updateImage(index, 'alt', e.target.value)}
                          placeholder="Descrição da imagem para acessibilidade"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => removeImage(index)} 
                      variant="outline" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button onClick={addImageUrl} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar imagem por URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Modo de visualização
  if (!content.images || content.images.length === 0) {
    return (
      <Card className="group relative">
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Galeria vazia</h3>
          <p className="text-muted-foreground">Nenhuma imagem configurada para esta galeria.</p>
          
          {onSave && (
            <Button 
              onClick={() => setIsLocalEditing(true)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              size="sm"
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="group relative">
      <div className={`grid ${getColumnClass()} ${getSpacingClass()}`}>
        {content.images.map((image, index) => (
          <div key={index} className="space-y-2">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <LazyImage
                src={image.url}
                alt={image.alt || `Imagem da galeria ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {image.caption && (
              <p className="text-sm text-muted-foreground text-center">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {onSave && (
        <Button 
          onClick={() => setIsLocalEditing(true)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
          variant="outline"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      )}
    </div>
  );
};