-- Create project_videos table
CREATE TABLE public.project_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  video_type TEXT NOT NULL DEFAULT 'youtube', -- 'youtube', 'vimeo', 'upload'
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for project_videos
CREATE POLICY "Admins can view all project videos" 
ON public.project_videos 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Project videos are publicly viewable for published projects" 
ON public.project_videos 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects 
  WHERE projects.id = project_videos.project_id 
  AND projects.published = true
));

CREATE POLICY "Admins can insert project videos" 
ON public.project_videos 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project videos" 
ON public.project_videos 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project videos" 
ON public.project_videos 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add alt_text column to project_images
ALTER TABLE public.project_images 
ADD COLUMN alt_text TEXT;