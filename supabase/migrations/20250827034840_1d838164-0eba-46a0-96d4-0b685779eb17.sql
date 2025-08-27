-- Add missing fields for robust project management

-- Add short and long descriptions
ALTER TABLE public.projects 
ADD COLUMN short_description TEXT,
ADD COLUMN long_description TEXT,
ADD COLUMN start_date DATE;

-- Add project status enum
CREATE TYPE project_status AS ENUM ('draft', 'published', 'in_progress', 'completed');
ALTER TABLE public.projects 
ADD COLUMN status project_status DEFAULT 'draft';

-- Add SEO metadata fields
ALTER TABLE public.projects 
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN keywords TEXT[];

-- Add additional property information
ALTER TABLE public.projects 
ADD COLUMN bedrooms INTEGER,
ADD COLUMN bathrooms INTEGER,
ADD COLUMN construction_type TEXT; -- 'new_construction', 'renovation', 'restoration'

-- Update existing published boolean to status
UPDATE public.projects 
SET status = CASE 
    WHEN published = true THEN 'published'::project_status 
    ELSE 'draft'::project_status 
END;

-- Keep published column for backwards compatibility for now
-- We can remove it later after updating all code references

-- Add indexes for better performance
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_start_date ON public.projects(start_date);
CREATE INDEX idx_projects_construction_type ON public.projects(construction_type);