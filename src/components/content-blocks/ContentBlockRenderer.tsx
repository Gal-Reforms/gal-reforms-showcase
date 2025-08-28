import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { VideoBlock } from './VideoBlock';
import { QuoteBlock } from './QuoteBlock';
import { TwoColumnsBlock } from './TwoColumnsBlock';
import { GalleryBlock } from './GalleryBlock';
import { ContentBlock } from '@/hooks/useContentBlocks';

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
}

export const ContentBlockRenderer = ({ blocks }: ContentBlockRendererProps) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <div key={block.id} className="animate-in fade-in-50 duration-500">
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

const renderBlock = (block: ContentBlock) => {
  switch (block.block_type) {
    case 'text':
      return <TextBlock content={block.content} />;
      
    case 'image':
      return <ImageBlock content={block.content} />;
      
    case 'video':
      return <VideoBlock content={block.content} />;
      
    case 'quote':
      return <QuoteBlock content={block.content} />;
      
    case 'two_columns':
      return <TwoColumnsBlock content={block.content} />;
      
    case 'gallery':
      return <GalleryBlock content={block.content} />;
      
    default:
      console.warn(`Unknown block type: ${block.block_type}`);
      return (
        <div className="text-center text-muted-foreground py-4">
          <p>Tipo de conteúdo não suportado: {block.block_type}</p>
        </div>
      );
  }
};