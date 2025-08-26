import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectImage {
  id: string;
  image_url: string;
  image_type: 'gallery' | 'before' | 'after';
  caption?: string;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location?: string;
  description?: string;
  cover_image?: string;
  client?: string;
  completion_date?: string;
  area_sqm?: number;
  budget_range?: string;
  materials?: any;
  features?: string[];
  images: ProjectImage[];
  beforeImages: ProjectImage[];
  afterImages: ProjectImage[];
  galleryImages: ProjectImage[];
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_images (*)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (projectsError) {
        throw projectsError;
      }

      return (projects || []).map(project => {
        const images = (project.project_images || []) as ProjectImage[];
        
        return {
          ...project,
          images,
          beforeImages: images.filter(img => img.image_type === 'before').sort((a, b) => a.order_index - b.order_index),
          afterImages: images.filter(img => img.image_type === 'after').sort((a, b) => a.order_index - b.order_index),
          galleryImages: images.filter(img => img.image_type === 'gallery').sort((a, b) => a.order_index - b.order_index),
        };
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};