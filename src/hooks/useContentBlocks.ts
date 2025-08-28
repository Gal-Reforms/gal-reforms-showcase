import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContentBlock {
  id: string;
  project_id: string;
  block_type: 'text' | 'image' | 'gallery' | 'video' | 'quote' | 'two_columns';
  content: any;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateContentBlockData {
  project_id: string;
  block_type: ContentBlock['block_type'];
  content: any;
  order_index: number;
}

// Fetch content blocks for a project
export const useContentBlocks = (projectId: string) => {
  return useQuery({
    queryKey: ['content-blocks', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_content_blocks')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      return data as ContentBlock[];
    },
    enabled: !!projectId,
  });
};

// Create a new content block
export const useCreateContentBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContentBlockData) => {
      const { data: result, error } = await supabase
        .from('project_content_blocks')
        .insert([data])
         .select()
         .maybeSingle();

      if (error) {
        throw error;
      }

      return result as ContentBlock;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content-blocks', variables.project_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Bloco de conteúdo criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar bloco de conteúdo');
    },
  });
};

// Update a content block
export const useUpdateContentBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<ContentBlock> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('project_content_blocks')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result as ContentBlock;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['content-blocks', result.project_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Bloco de conteúdo atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar bloco de conteúdo');
    },
  });
};

// Delete a content block
export const useDeleteContentBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get the block first to get project_id for cache invalidation
      const { data: block, error: fetchError } = await supabase
        .from('project_content_blocks')
        .select('project_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const { error } = await supabase
        .from('project_content_blocks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { id, project_id: block.project_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['content-blocks', result.project_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Bloco de conteúdo removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover bloco de conteúdo');
    },
  });
};

// Update content blocks order
export const useUpdateContentBlocksOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blocks, projectId }: { blocks: { id: string; order_index: number }[]; projectId: string }) => {
      const updates = blocks.map(({ id, order_index }) => 
        supabase
          .from('project_content_blocks')
          .update({ order_index })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) {
          throw result.error;
        }
      }

      return { projectId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['content-blocks', result.projectId] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Ordem dos blocos atualizada!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao reordenar blocos');
    },
  });
};