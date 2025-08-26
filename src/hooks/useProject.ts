import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectImage } from "./useProjects";

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async (): Promise<Project | null> => {
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images (*)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }

      if (!project) return null;

      const images = (project.project_images || []) as ProjectImage[];
      
      return {
        ...project,
        images,
        beforeImages: images.filter(img => img.image_type === 'before').sort((a, b) => a.order_index - b.order_index),
        afterImages: images.filter(img => img.image_type === 'after').sort((a, b) => a.order_index - b.order_index),
        galleryImages: images.filter(img => img.image_type === 'gallery').sort((a, b) => a.order_index - b.order_index),
      };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};