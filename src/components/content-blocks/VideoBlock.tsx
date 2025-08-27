import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit3, Check, X, Play, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoBlockProps {
  content: {
    url: string;
    type: 'youtube' | 'vimeo' | 'upload';
    title?: string;
    description?: string;
  };
  isEditing?: boolean;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export const VideoBlock = ({ content, isEditing = false, onSave, onCancel }: VideoBlockProps) => {
  const [url, setUrl] = useState(content.url || '');
  const [type, setType] = useState<'youtube' | 'vimeo' | 'upload'>(content.type || 'youtube');
  const [title, setTitle] = useState(content.title || '');
  const [description, setDescription] = useState(content.description || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const extractVideoId = (url: string, type: 'youtube' | 'vimeo') => {
    if (type === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    } else if (type === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const getEmbedUrl = (url: string, type: 'youtube' | 'vimeo') => {
    const videoId = extractVideoId(url, type);
    if (!videoId) return url;
    
    if (type === 'youtube') {
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (type === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleSave = () => {
    if (!url) {
      toast.error('URL do vídeo é obrigatória');
      return;
    }

    let finalUrl = url;
    if (type !== 'upload') {
      finalUrl = getEmbedUrl(url, type);
      if (!extractVideoId(url, type)) {
        toast.error('URL do vídeo inválida');
        return;
      }
    }

    onSave?.({ url: finalUrl, type, title, description });
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setUrl(content.url || '');
    setType(content.type || 'youtube');
    setTitle(content.title || '');
    setDescription(content.description || '');
    setIsLocalEditing(false);
    onCancel?.();
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `content-blocks/videos/${crypto.randomUUID()}.${fileExt}`;

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
      setType('upload');
      toast.success('Vídeo enviado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar vídeo');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024 // 100MB max
  });

  if (isEditing || isLocalEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bloco de Vídeo</h4>
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
              } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                {uploading 
                  ? 'Enviando vídeo...' 
                  : isDragActive 
                  ? 'Solte o vídeo aqui...' 
                  : 'Arraste um vídeo ou clique para selecionar'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, AVI, MKV, WebM (máx. 100MB)
              </p>
            </div>

            {/* Video Type */}
            <div className="space-y-2">
              <Label>Tipo de Vídeo</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="upload">Upload Direto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label>URL do Vídeo</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  type === 'youtube' 
                    ? 'https://www.youtube.com/watch?v=...' 
                    : type === 'vimeo'
                    ? 'https://vimeo.com/...'
                    : 'https://exemplo.com/video.mp4'
                }
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Título (opcional)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do vídeo..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do vídeo..."
                rows={2}
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
          <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Vídeo vazio</h3>
          <p className="text-muted-foreground">Nenhum vídeo configurado para este bloco.</p>
          
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
      <div className="space-y-3">
        {content.title && (
          <h3 className="text-lg font-semibold">{content.title}</h3>
        )}
        
        <div className="aspect-video bg-muted rounded overflow-hidden">
          {content.type === 'upload' ? (
            <video
              src={content.url}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <iframe
              src={content.url}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
        {content.description && (
          <p className="text-sm text-muted-foreground">{content.description}</p>
        )}
      </div>
      
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