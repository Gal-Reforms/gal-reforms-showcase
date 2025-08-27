import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Check, X, Quote } from 'lucide-react';

interface QuoteBlockProps {
  content: {
    quote: string;
    author?: string;
    role?: string;
  };
  isEditing?: boolean;
  onSave?: (content: any) => void;
  onCancel?: () => void;
}

export const QuoteBlock = ({ content, isEditing = false, onSave, onCancel }: QuoteBlockProps) => {
  const [quote, setQuote] = useState(content.quote || '');
  const [author, setAuthor] = useState(content.author || '');
  const [role, setRole] = useState(content.role || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  const handleSave = () => {
    if (!quote.trim()) {
      return;
    }
    onSave?.({ quote, author, role });
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setQuote(content.quote || '');
    setAuthor(content.author || '');
    setRole(content.role || '');
    setIsLocalEditing(false);
    onCancel?.();
  };

  if (isEditing || isLocalEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bloco de Citação</h4>
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

          <div className="space-y-4">
            {/* Quote */}
            <div className="space-y-2">
              <Label>Citação</Label>
              <Textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Digite a citação..."
                rows={3}
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label>Autor (opcional)</Label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do autor..."
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Cargo/Função (opcional)</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Cargo ou função do autor..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content.quote) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Quote className="w-12 h-12 mx-auto mb-2" />
        Citação não configurada
      </div>
    );
  }

  return (
    <div className="group relative">
      <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted/30 rounded-r-lg">
        <div className="flex items-start gap-3">
          <Quote className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="text-lg italic text-foreground leading-relaxed">
              "{content.quote}"
            </p>
            {(content.author || content.role) && (
              <footer className="text-sm text-muted-foreground">
                {content.author && <span className="font-medium">— {content.author}</span>}
                {content.role && <span className="ml-2">{content.role}</span>}
              </footer>
            )}
          </div>
        </div>
      </blockquote>
      
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