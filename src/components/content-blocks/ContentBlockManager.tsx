import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, GripVertical, Trash2, Type, Image, Video, Quote, Columns2, Images } from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { VideoBlock } from './VideoBlock';
import { QuoteBlock } from './QuoteBlock';
import { TwoColumnsBlock } from './TwoColumnsBlock';
import { 
  useContentBlocks, 
  useCreateContentBlock, 
  useUpdateContentBlock, 
  useDeleteContentBlock,
  useUpdateContentBlocksOrder,
  ContentBlock 
} from '@/hooks/useContentBlocks';

interface ContentBlockManagerProps {
  projectId: string;
}

const blockTypeOptions = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'image', label: 'Imagem', icon: Image },
  { value: 'gallery', label: 'Galeria', icon: Images },
  { value: 'video', label: 'Vídeo', icon: Video },
  { value: 'quote', label: 'Citação', icon: Quote },
  { value: 'two_columns', label: 'Duas Colunas', icon: Columns2 },
];

const getDefaultContent = (blockType: string) => {
  switch (blockType) {
    case 'text':
      return { text: '' };
    case 'image':
      return { url: '', caption: '', alt: '' };
    case 'gallery':
      return { images: [] };
    case 'video':
      return { url: '', type: 'youtube', title: '', description: '' };
    case 'quote':
      return { quote: '', author: '', role: '' };
    case 'two_columns':
      return { 
        leftType: 'text', 
        rightType: 'text',
        leftContent: { text: '' },
        rightContent: { text: '' }
      };
    default:
      return {};
  }
};

interface SortableBlockProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
}

function SortableBlock({ block, onUpdate, onDelete }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderBlock = () => {
    switch (block.block_type) {
      case 'text':
        return (
          <TextBlock 
            content={block.content}
            onSave={(content) => onUpdate(block.id, content)}
          />
        );
      case 'image':
        return (
          <ImageBlock 
            content={block.content}
            onSave={(content) => onUpdate(block.id, content)}
          />
        );
      case 'video':
        return (
          <VideoBlock 
            content={block.content}
            onSave={(content) => onUpdate(block.id, content)}
          />
        );
      case 'quote':
        return (
          <QuoteBlock 
            content={block.content}
            onSave={(content) => onUpdate(block.id, content)}
          />
        );
      case 'two_columns':
        return (
          <TwoColumnsBlock 
            content={block.content}
            onSave={(content) => onUpdate(block.id, content)}
          />
        );
      case 'gallery':
        return (
          <div className="text-center text-muted-foreground py-8">
            Galeria (em desenvolvimento)
          </div>
        );
      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            Tipo de bloco não suportado
          </div>
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                {...attributes}
                {...listeners}
                className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium capitalize">
                {blockTypeOptions.find(opt => opt.value === block.block_type)?.label || block.block_type}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(block.id)}
              className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderBlock()}
        </CardContent>
      </Card>
    </div>
  );
}

export const ContentBlockManager = ({ projectId }: ContentBlockManagerProps) => {
  const [selectedBlockType, setSelectedBlockType] = useState<string>('');
  
  const { data: blocks = [], isLoading } = useContentBlocks(projectId);
  const createBlock = useCreateContentBlock();
  const updateBlock = useUpdateContentBlock();
  const deleteBlock = useDeleteContentBlock();
  const updateBlocksOrder = useUpdateContentBlocksOrder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddBlock = async () => {
    if (!selectedBlockType || !projectId) return;

    try {
      await createBlock.mutateAsync({
        project_id: projectId,
        block_type: selectedBlockType as any,
        content: getDefaultContent(selectedBlockType),
        order_index: blocks.length,
      });
      setSelectedBlockType('');
    } catch (error) {
      console.error('Error creating block:', error);
    }
  };

  const handleUpdateBlock = async (blockId: string, content: any) => {
    try {
      await updateBlock.mutateAsync({
        id: blockId,
        content,
      });
    } catch (error) {
      console.error('Error updating block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm('Tem certeza que deseja remover este bloco?')) {
      try {
        await deleteBlock.mutateAsync(blockId);
      } catch (error) {
        console.error('Error deleting block:', error);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      const updates = newBlocks.map((block, index) => ({
        id: block.id,
        order_index: index,
      }));

      updateBlocksOrder.mutate({ blocks: updates, projectId });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Carregando blocos de conteúdo...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteúdo da Página</CardTitle>
        <div className="flex gap-2">
          <Select value={selectedBlockType} onValueChange={setSelectedBlockType}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione o tipo de bloco" />
            </SelectTrigger>
            <SelectContent>
              {blockTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddBlock}
            disabled={!selectedBlockType || createBlock.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="space-y-2">
              <p>Nenhum bloco de conteúdo adicionado ainda.</p>
              <p className="text-sm">Selecione um tipo de bloco acima para começar.</p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onUpdate={handleUpdateBlock}
                  onDelete={handleDeleteBlock}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};