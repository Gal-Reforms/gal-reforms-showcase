import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectImage {
  id: string;
  image_url: string;
  image_type: 'gallery' | 'before' | 'after';
  caption?: string;
  order_index: number;
  alt_text?: string;
}

export interface ProjectVideo {
  id: string;
  project_id: string;
  video_url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  video_type: 'youtube' | 'vimeo' | 'upload';
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  category_id?: string;
  location?: string;
  description?: string;
  short_description?: string;
  long_description?: string;
  cover_image?: string;
  client?: string;
  start_date?: string;
  completion_date?: string;
  area_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  budget_range?: string;
  construction_type?: string;
  materials?: any;
  features?: string[];
  keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  images: ProjectImage[];
  beforeImages: ProjectImage[];
  afterImages: ProjectImage[];
  galleryImages: ProjectImage[];
  videos: ProjectVideo[];
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      console.log('Fetching projects from Supabase...');
      
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_images!project_images_project_id_fkey (*),
          project_videos!project_videos_project_id_fkey (*)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      console.log('Projects query result:', { projects, error: projectsError });

      if (projectsError) {
        console.error('Projects query error:', projectsError);
        throw projectsError;
      }

      if (!projects || projects.length === 0) {
        console.log('No projects found in database');
        return [];
      }

      const mappedProjects = projects.map(project => {
        const images = (project.project_images || []) as ProjectImage[];
        const videos = (project.project_videos || []) as ProjectVideo[];
        
        return {
          ...project,
          images,
          beforeImages: images.filter(img => img.image_type === 'before').sort((a, b) => a.order_index - b.order_index),
          afterImages: images.filter(img => img.image_type === 'after').sort((a, b) => a.order_index - b.order_index),
          galleryImages: images.filter(img => img.image_type === 'gallery').sort((a, b) => a.order_index - b.order_index),
          videos: videos.sort((a, b) => a.order_index - b.order_index),
        };
      });

      console.log('useProjects query successful:', mappedProjects.length, 'projects loaded');
      return mappedProjects;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log('Query retry attempt:', failureCount, error);
      return failureCount < 2;
    }
  });
};