import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TempImageData {
  id: string;
  url: string;
  type: 'gallery' | 'before' | 'after';
  caption?: string;
  orderIndex: number;
}

interface TempVideoData {
  id: string;
  url: string;
  type: 'youtube' | 'vimeo' | 'upload';
  title?: string;
  description?: string;
  orderIndex: number;
}

export const useTempMediaManager = () => {
  const [tempImages, setTempImages] = useState<TempImageData[]>([]);
  const [tempVideos, setTempVideos] = useState<TempVideoData[]>([]);
  const queryClient = useQueryClient();

  // Upload temporary image
  const uploadTempImage = useMutation({
    mutationFn: async ({ 
      file, 
      tempProjectId, 
      imageType, 
      orderIndex, 
      caption 
    }: {
      file: File;
      tempProjectId: string;
      imageType: 'gallery' | 'before' | 'after';
      orderIndex: number;
      caption?: string;
    }) => {
      // Upload to storage with temp prefix
      const fileExt = file.name.split('.').pop();
      const fileName = `temp/${tempProjectId}/${imageType}/${crypto.randomUUID()}.${fileExt}`;
      
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

      return {
        id: crypto.randomUUID(),
        url: publicUrl,
        type: imageType,
        caption: caption || undefined,
        orderIndex,
        fileName // Store for later cleanup
      };
    },
    onSuccess: (data) => {
      setTempImages(prev => [...prev, {
        id: data.id,
        url: data.url,
        type: data.type,
        caption: data.caption,
        orderIndex: data.orderIndex
      }]);
      toast.success('Imagem enviada temporariamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar imagem');
    },
  });

  // Add temporary video
  const addTempVideo = useCallback((video: Omit<TempVideoData, 'id'>) => {
    const newVideo: TempVideoData = {
      ...video,
      id: crypto.randomUUID(),
    };
    setTempVideos(prev => [...prev, newVideo]);
    toast.success('Vídeo adicionado temporariamente');
  }, []);

  // Remove temporary image
  const removeTempImage = useCallback((imageId: string) => {
    setTempImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  // Remove temporary video
  const removeTempVideo = useCallback((videoId: string) => {
    setTempVideos(prev => prev.filter(video => video.id !== videoId));
  }, []);

  // Associate temporary media with real project
  const associateWithProject = useMutation({
    mutationFn: async (realProjectId: string) => {
      const results = { images: 0, videos: 0, errors: [] as string[] };

      // Process images
      for (const tempImage of tempImages) {
        try {
          const { error } = await supabase
            .from('project_images')
            .insert({
              project_id: realProjectId,
              image_url: tempImage.url,
              image_type: tempImage.type,
              caption: tempImage.caption,
              order_index: tempImage.orderIndex,
            });

          if (error) {
            results.errors.push(`Erro ao associar imagem: ${error.message}`);
          } else {
            results.images++;
          }
        } catch (error: any) {
          results.errors.push(`Erro ao associar imagem: ${error.message}`);
        }
      }

      // Process videos
      for (const tempVideo of tempVideos) {
        try {
          const { error } = await supabase
            .from('project_videos')
            .insert({
              project_id: realProjectId,
              video_url: tempVideo.url,
              video_type: tempVideo.type,
              title: tempVideo.title,
              description: tempVideo.description,
              order_index: tempVideo.orderIndex,
            });

          if (error) {
            results.errors.push(`Erro ao associar vídeo: ${error.message}`);
          } else {
            results.videos++;
          }
        } catch (error: any) {
          results.errors.push(`Erro ao associar vídeo: ${error.message}`);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      // Clear temporary data
      setTempImages([]);
      setTempVideos([]);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      // Show results
      if (results.images > 0 || results.videos > 0) {
        toast.success(`Mídia associada com sucesso! ${results.images} imagens, ${results.videos} vídeos`);
      }
      
      if (results.errors.length > 0) {
        results.errors.forEach(error => toast.error(error));
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao associar mídia ao projeto');
    },
  });

  // Clear all temporary data
  const clearTempData = useCallback(() => {
    setTempImages([]);
    setTempVideos([]);
  }, []);

  return {
    tempImages,
    tempVideos,
    uploadTempImage,
    addTempVideo,
    removeTempImage,
    removeTempVideo,
    associateWithProject,
    clearTempData,
    hasTempMedia: tempImages.length > 0 || tempVideos.length > 0,
  };
};