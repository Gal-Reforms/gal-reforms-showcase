import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Check, X, Quote } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.error('A citação não pode estar vazia');
      return;
    }
    onSave?.({ quote: quote.trim(), author: author.trim(), role: role.trim() });
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
      <Card className="group relative">
        <CardContent className="p-8 text-center">
          <Quote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Citação vazia</h3>
          <p className="text-muted-foreground">Adicione uma citação inspiradora ou depoimento.</p>
          
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
      <blockquote className="relative border-l-4 border-primary pl-6 py-6 bg-gradient-to-r from-muted/30 to-transparent rounded-r-lg">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1 opacity-80" />
          <div className="space-y-3">
            <p className="text-lg italic text-foreground leading-relaxed font-medium">
              "{content.quote}"
            </p>
            {(content.author || content.role) && (
              <footer className="text-sm">
                {content.author && (
                  <cite className="font-semibold text-foreground not-italic">
                    — {content.author}
                  </cite>
                )}
                {content.role && (
                  <div className="text-muted-foreground mt-1">
                    {content.role}
                  </div>
                )}
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