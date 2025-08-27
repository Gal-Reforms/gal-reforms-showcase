import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectVideo {
  id: string;
  project_id: string;
  video_url: string;
  video_type: 'youtube' | 'vimeo' | 'upload';
  title?: string;
  description?: string;
  thumbnail_url?: string;
  order_index: number;
  muted?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectVideoData {
  project_id: string;
  video_url: string;
  video_type: 'youtube' | 'vimeo' | 'upload';
  title?: string;
  description?: string;
  thumbnail_url?: string;
  order_index: number;
  muted?: boolean;
}

export const useCreateProjectVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectVideoData) => {
      const { data: video, error } = await supabase
        .from('project_videos')
        .insert([data])
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      return video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Vídeo adicionado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao adicionar vídeo');
    },
  });
};

export const useUpdateProjectVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateProjectVideoData> & { id: string }) => {
      const { data: video, error } = await supabase
        .from('project_videos')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      return video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Vídeo atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar vídeo');
    },
  });
};

export const useDeleteProjectVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_videos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Vídeo removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover vídeo');
    },
  });
};

export const useUploadProjectVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      projectId, 
      title, 
      description, 
      orderIndex 
    }: {
      file: File;
      projectId: string;
      title?: string;
      description?: string;
      orderIndex: number;
    }) => {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/videos/${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(fileName);

      // Save to database
      const { data, error } = await supabase
        .from('project_videos')
        .insert([{
          project_id: projectId,
          video_url: publicUrl,
          title: title || null,
          description: description || null,
          video_type: 'upload' as const,
          order_index: orderIndex,
        }])
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Vídeo enviado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar vídeo');
    },
  });
};