import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUpdateProjectImageDetails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      imageId, 
      caption, 
      imageType,
      orderIndex 
    }: {
      imageId: string;
      caption?: string;
      imageType?: 'gallery' | 'before' | 'after';
      orderIndex?: number;
    }) => {
      const updateData: any = {};
      
      if (caption !== undefined) updateData.caption = caption;
      if (imageType !== undefined) updateData.image_type = imageType;
      if (orderIndex !== undefined) updateData.order_index = orderIndex;

      const { data, error } = await supabase
        .from('project_images')
        .update(updateData)
        .eq('id', imageId)
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
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Imagem atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar imagem');
    },
  });
};

export const useSetProjectCoverImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      projectId, 
      imageUrl 
    }: {
      projectId: string;
      imageUrl: string | null;
    }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ cover_image: imageUrl })
        .eq('id', projectId)
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
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Capa do projeto atualizada!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao definir capa');
    },
  });
};

export const useUploadCoverImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      projectId 
    }: {
      file: File;
      projectId: string;
    }) => {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/cover/${crypto.randomUUID()}.${fileExt}`;
      
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

      // Update project cover_image
      const { data, error } = await supabase
        .from('projects')
        .update({ cover_image: publicUrl })
        .eq('id', projectId)
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
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      toast.success('Capa enviada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar capa');
    },
  });
};

export const useCheckSlugUniqueness = () => {
  return useMutation({
    mutationFn: async ({ slug, excludeId }: { slug: string; excludeId?: string }) => {
      let query = supabase
        .from('projects')
        .select('id')
        .eq('slug', slug);
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.length > 0; // true if slug exists
    },
  });
};