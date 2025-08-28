import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit3, Check, X, Columns2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TwoColumnsBlockProps {
  content: {
    leftType: 'text' | 'image';
    rightType: 'text' | 'image';
    leftContent: {
      text?: string;
      imageUrl?: string;
      imageCaption?: string;
    };
    rightContent: {
      text?: string;
      imageUrl?: string;
      imageCaption?: string;
    };
  };
  isEditing?: boolean;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export const TwoColumnsBlock = ({ content, isEditing = false, onSave, onCancel }: TwoColumnsBlockProps) => {
  const [leftType, setLeftType] = useState<'text' | 'image'>(content.leftType || 'text');
  const [rightType, setRightType] = useState<'text' | 'image'>(content.rightType || 'text');
  const [leftContent, setLeftContent] = useState(content.leftContent || {});
  const [rightContent, setRightContent] = useState(content.rightContent || {});
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [uploading, setUploading] = useState<'left' | 'right' | null>(null);

  const handleSave = () => {
    onSave?.({
      leftType,
      rightType,
      leftContent,
      rightContent,
    });
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setLeftType(content.leftType || 'text');
    setRightType(content.rightType || 'text');
    setLeftContent(content.leftContent || {});
    setRightContent(content.rightContent || {});
    setIsLocalEditing(false);
    onCancel?.();
  };

  const handleImageUpload = async (file: File, side: 'left' | 'right') => {
    setUploading(side);

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

      if (side === 'left') {
        setLeftContent(prev => ({ ...prev, imageUrl: publicUrl }));
      } else {
        setRightContent(prev => ({ ...prev, imageUrl: publicUrl }));
      }

      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(null);
    }
  };

  const createDropzone = (side: 'left' | 'right') => 
    useDropzone({
      onDrop: (files) => files[0] && handleImageUpload(files[0], side),
      accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
      multiple: false
    });

  const leftDropzone = createDropzone('left');
  const rightDropzone = createDropzone('right');

  if (isEditing || isLocalEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bloco de Duas Colunas</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={!!uploading}>
                <Check className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo da Coluna Esquerda</Label>
                <Select value={leftType} onValueChange={(value: any) => setLeftType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {leftType === 'text' ? (
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <RichTextEditor
                    value={leftContent.text || ''}
                    onChange={(value) => setLeftContent(prev => ({ ...prev, text: value }))}
                    placeholder="Digite o texto da coluna esquerda..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <div
                    {...leftDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      leftDropzone.isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    } ${uploading === 'left' ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input {...leftDropzone.getInputProps()} />
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {uploading === 'left' ? 'Enviando...' : 'Upload de imagem'}
                    </p>
                  </div>
                  
                  <Input
                    value={leftContent.imageUrl || ''}
                    onChange={(e) => setLeftContent(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Ou cole uma URL da imagem..."
                  />
                  
                  {leftContent.imageUrl && (
                    <img src={leftContent.imageUrl} alt="" className="w-full h-32 object-cover rounded" />
                  )}
                  
                  <Input
                    value={leftContent.imageCaption || ''}
                    onChange={(e) => setLeftContent(prev => ({ ...prev, imageCaption: e.target.value }))}
                    placeholder="Legenda da imagem (opcional)"
                  />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo da Coluna Direita</Label>
                <Select value={rightType} onValueChange={(value: any) => setRightType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {rightType === 'text' ? (
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <RichTextEditor
                    value={rightContent.text || ''}
                    onChange={(value) => setRightContent(prev => ({ ...prev, text: value }))}
                    placeholder="Digite o texto da coluna direita..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <div
                    {...rightDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      rightDropzone.isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    } ${uploading === 'right' ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input {...rightDropzone.getInputProps()} />
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {uploading === 'right' ? 'Enviando...' : 'Upload de imagem'}
                    </p>
                  </div>
                  
                  <Input
                    value={rightContent.imageUrl || ''}
                    onChange={(e) => setRightContent(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Ou cole uma URL da imagem..."
                  />
                  
                  {rightContent.imageUrl && (
                    <img src={rightContent.imageUrl} alt="" className="w-full h-32 object-cover rounded" />
                  )}
                  
                  <Input
                    value={rightContent.imageCaption || ''}
                    onChange={(e) => setRightContent(prev => ({ ...prev, imageCaption: e.target.value }))}
                    placeholder="Legenda da imagem (opcional)"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = (!leftContent.text && !leftContent.imageUrl) && 
                  (!rightContent.text && !rightContent.imageUrl);
  
  if (isEmpty) {
    return (
      <Card className="group relative">
        <CardContent className="p-8 text-center">
          <Columns2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Duas colunas vazias</h3>
          <p className="text-muted-foreground">Configure o conteúdo das colunas esquerda e direita.</p>
          
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div>
          {leftType === 'text' && leftContent.text ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: leftContent.text }}
            />
          ) : leftType === 'image' && leftContent.imageUrl ? (
            <figure>
              <img 
                src={leftContent.imageUrl} 
                alt={leftContent.imageCaption || ''} 
                className="w-full rounded-lg"
              />
              {leftContent.imageCaption && (
                <figcaption className="text-sm text-muted-foreground mt-2">
                  {leftContent.imageCaption}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Coluna esquerda vazia
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {rightType === 'text' && rightContent.text ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: rightContent.text }}
            />
          ) : rightType === 'image' && rightContent.imageUrl ? (
            <figure>
              <img 
                src={rightContent.imageUrl} 
                alt={rightContent.imageCaption || ''} 
                className="w-full rounded-lg"
              />
              {rightContent.imageCaption && (
                <figcaption className="text-sm text-muted-foreground mt-2">
                  {rightContent.imageCaption}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Coluna direita vazia
            </div>
          )}
        </div>
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