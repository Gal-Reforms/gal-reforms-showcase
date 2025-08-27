import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Project, ProjectImage, ProjectVideo } from "./useProjects";

export interface CreateProjectData {
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
}

export const useAdminProjects = () => {
  return useQuery({
    queryKey: ['admin-projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images!project_images_project_id_fkey (*),
          project_videos!project_videos_project_id_fkey (*),
          categories!projects_category_id_fkey (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (projects || []).map(project => {
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
    },
  });
};

export const useAdminProject = (id: string) => {
  return useQuery({
    queryKey: ['admin-project', id],
    queryFn: async (): Promise<Project | null> => {
      if (!id) return null;
      
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images!project_images_project_id_fkey (*),
          project_videos!project_videos_project_id_fkey (*),
          categories!projects_category_id_fkey (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }

      if (!project) return null;

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
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar projeto');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateProjectData> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-project', data.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.slug] });
      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar projeto');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir projeto');
    },
  });
};