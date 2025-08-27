-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Add category_id to projects table (optional reference)
ALTER TABLE public.projects ADD COLUMN category_id UUID REFERENCES public.categories(id);

-- Create index for better performance
CREATE INDEX idx_projects_category_id ON public.projects(category_id);

-- Create trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint to project_images (with cascade delete)
ALTER TABLE public.project_images 
ADD CONSTRAINT fk_project_images_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categories
CREATE POLICY "Categories are publicly viewable" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON public.categories
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories" ON public.categories
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories" ON public.categories
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS Policies for projects
DROP POLICY IF EXISTS "Projects are publicly viewable when published" ON public.projects;

CREATE POLICY "Projects are publicly viewable when published" ON public.projects
    FOR SELECT USING (published = true);

CREATE POLICY "Admins can view all projects" ON public.projects
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert projects" ON public.projects
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects" ON public.projects
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects" ON public.projects
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS Policies for project_images
DROP POLICY IF EXISTS "Project images are publicly viewable for published projects" ON public.project_images;

CREATE POLICY "Project images are publicly viewable for published projects" ON public.project_images
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_images.project_id 
        AND projects.published = true
    ));

CREATE POLICY "Admins can view all project images" ON public.project_images
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert project images" ON public.project_images
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images" ON public.project_images
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images" ON public.project_images
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for projects bucket
CREATE POLICY "Public can view project files" ON storage.objects
    FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Admins can upload project files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'projects' 
        AND public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Admins can update project files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'projects' 
        AND public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Admins can delete project files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'projects' 
        AND public.has_role(auth.uid(), 'admin')
    );