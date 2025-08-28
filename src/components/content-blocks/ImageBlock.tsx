import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Check, X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageBlockProps {
  content: {
    url: string;
    caption?: string;
    alt?: string;
  };
  isEditing?: boolean;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export const ImageBlock = ({ content, isEditing = false, onSave, onCancel }: ImageBlockProps) => {
  const [url, setUrl] = useState(content.url || '');
  const [caption, setCaption] = useState(content.caption || '');
  const [alt, setAlt] = useState(content.alt || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = () => {
    if (!url) {
      toast.error('URL da imagem é obrigatória');
      return;
    }
    onSave?.({ url, caption, alt });
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setUrl(content.url || '');
    setCaption(content.caption || '');
    setAlt(content.alt || '');
    setIsLocalEditing(false);
    onCancel?.();
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `content-blocks/${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(fileName);

      setUrl(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  if (isEditing || isLocalEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bloco de Imagem</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={uploading}>
                <Check className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive 
                  ? 'Solte a imagem aqui...' 
                  : 'Arraste uma imagem ou clique para selecionar'
                }
              </p>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {/* Preview */}
            {url && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <img src={url} alt="Preview" className="max-w-full h-48 object-cover rounded" />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label>Legenda (opcional)</Label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Legenda da imagem..."
                rows={2}
              />
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label>Texto Alternativo (opcional)</Label>
              <Input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Descrição da imagem para acessibilidade..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content.url) {
    return (
      <Card className="group relative">
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Imagem vazia</h3>
          <p className="text-muted-foreground">Nenhuma imagem configurada para este bloco.</p>
          
          {onSave && (
            <Button 
              onClick={() => setIsLocalEditing(true)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              size="sm"
              variant="outline"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="group relative">
      <figure>
        <img 
          src={content.url} 
          alt={content.alt || content.caption || 'Imagem do projeto'} 
          className="w-full rounded-lg"
        />
        {content.caption && (
          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
            {content.caption}
          </figcaption>
        )}
      </figure>
      {onSave && (
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsLocalEditing(true)}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};