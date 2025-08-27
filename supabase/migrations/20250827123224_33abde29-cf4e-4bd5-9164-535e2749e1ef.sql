-- Create project content blocks table
CREATE TABLE public.project_content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('text', 'image', 'gallery', 'video', 'quote', 'two_columns')),
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_content_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies for content blocks
CREATE POLICY "Admins can view all project content blocks" 
ON public.project_content_blocks 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert project content blocks" 
ON public.project_content_blocks 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project content blocks" 
ON public.project_content_blocks 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project content blocks" 
ON public.project_content_blocks 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Project content blocks are publicly viewable for published projects" 
ON public.project_content_blocks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM projects 
    WHERE projects.id = project_content_blocks.project_id 
    AND projects.published = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_content_blocks_updated_at
BEFORE UPDATE ON public.project_content_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_project_content_blocks_project_id ON public.project_content_blocks(project_id);
CREATE INDEX idx_project_content_blocks_order ON public.project_content_blocks(project_id, order_index);