-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  location TEXT,
  description TEXT,
  cover_image TEXT,
  client TEXT,
  completion_date DATE,
  area_sqm INTEGER,
  budget_range TEXT,
  materials JSONB,
  features TEXT[],
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project images table
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('gallery', 'before', 'after')),
  caption TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Projects are publicly viewable when published" 
ON public.projects 
FOR SELECT 
USING (published = true);

CREATE POLICY "Project images are publicly viewable for published projects" 
ON public.project_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_images.project_id 
    AND projects.published = true
  )
);

-- Create storage policies
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects');

-- Create indexes for better performance
CREATE INDEX idx_projects_published ON public.projects(published);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX idx_project_images_type_order ON public.project_images(project_id, image_type, order_index);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.projects (title, slug, category, location, description, cover_image, client, completion_date, area_sqm, budget_range, materials, features, published) VALUES
('Reforma Completa Apartamento Moderno', 'reforma-apartamento-moderno', 'Reforma Residencial', 'Barcelona, Espanha', 'Transformação completa de apartamento de 120m² com design contemporâneo, utilizando materiais premium e acabamentos de luxo.', '/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png', 'Família Rodriguez', '2024-01-15', 120, '€80.000 - €100.000', '{"pisos": "Parquet de carvalho", "cozinha": "Mármore Carrara", "banheiros": "Porcelanato importado"}', ARRAY['Cozinha integrada', 'Banheiro com banheira', 'Closet personalizado', 'Iluminação LED'], true),
('Construção Casa Mediterrânea', 'construcao-casa-mediterranea', 'Construção Nova', 'Costa Brava, Espanha', 'Casa de luxo com 300m² inspirada na arquitetura mediterrânea, com piscina infinita e vista para o mar.', '/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png', 'Sr. Martinez', '2023-11-20', 300, '€300.000 - €400.000', '{"exterior": "Pedra natural", "interior": "Mármore travertino", "cobertura": "Telha cerâmica"}', ARRAY['Piscina infinita', 'Terraço panorâmico', 'Garagem dupla', 'Sistema domótica'], true);

-- Insert sample project images
INSERT INTO public.project_images (project_id, image_url, image_type, caption, order_index) 
SELECT p.id, '/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png', 'gallery', 'Vista geral da obra finalizada', 1
FROM public.projects p WHERE p.slug = 'reforma-apartamento-moderno';

INSERT INTO public.project_images (project_id, image_url, image_type, caption, order_index) 
SELECT p.id, '/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png', 'before', 'Estado original da cozinha', 1
FROM public.projects p WHERE p.slug = 'reforma-apartamento-moderno';

INSERT INTO public.project_images (project_id, image_url, image_type, caption, order_index) 
SELECT p.id, '/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png', 'after', 'Cozinha após reforma completa', 1
FROM public.projects p WHERE p.slug = 'reforma-apartamento-moderno';