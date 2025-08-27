import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProjectImage } from "./useProjects";

export interface CreateProjectImageData {
  project_id: string;
  image_url: string;
  image_type: 'gallery' | 'before' | 'after';
  caption?: string;
  order_index: number;
}

export const useUploadProjectImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, projectId, imageType, orderIndex, caption }: {
      file: File;
      projectId: string;
      imageType: 'gallery' | 'before' | 'after';
      orderIndex: number;
      caption?: string;
    }) => {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${imageType}/${crypto.randomUUID()}.${fileExt}`;
      
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
        .from('project_images')
        .insert([{
          project_id: projectId,
          image_url: publicUrl,
          image_type: imageType,
          caption: caption || null,
          order_index: orderIndex,
        }])
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
      toast.success('Imagem enviada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar imagem');
    },
  });
};

export const useDeleteProjectImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageId: string) => {
      // Get image data first to delete from storage
      const { data: imageData, error: fetchError } = await supabase
        .from('project_images')
        .select('image_url')
        .eq('id', imageId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) {
        throw deleteError;
      }

      // Delete from storage if we have the URL
      if (imageData?.image_url) {
        try {
          const url = new URL(imageData.image_url);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts.slice(-3).join('/'); // Get project_id/type/filename.ext
          
          await supabase.storage
            .from('projects')
            .remove([fileName]);
        } catch (error) {
          console.warn('Could not delete file from storage:', error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Imagem excluída com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir imagem');
    },
  });
};

export const useUpdateProjectImageOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (images: { id: string; order_index: number }[]) => {
      const updates = images.map(({ id, order_index }) => 
        supabase
          .from('project_images')
          .update({ order_index })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) {
          throw result.error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Ordem das imagens atualizada!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao reordenar imagens');
    },
  });
};