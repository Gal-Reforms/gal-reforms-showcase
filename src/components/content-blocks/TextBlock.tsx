import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Edit3, Check, X } from 'lucide-react';

interface TextBlockProps {
  content: {
    text: string;
  };
  isEditing?: boolean;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export const TextBlock = ({ content, isEditing = false, onSave, onCancel }: TextBlockProps) => {
  const [text, setText] = useState(content.text || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  const handleSave = () => {
    onSave?.({ text });
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setText(content.text || '');
    setIsLocalEditing(false);
    onCancel?.();
  };

  if (isEditing || isLocalEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bloco de Texto</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
          <RichTextEditor
            value={text}
            onChange={setText}
            placeholder="Digite o texto do bloco..."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="group relative">
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content.text || 'Texto vazio' }}
      />
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