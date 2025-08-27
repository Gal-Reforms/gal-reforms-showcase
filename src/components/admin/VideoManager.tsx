import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Youtube, Video, Upload, Play } from 'lucide-react';
import { ProjectVideo, useCreateProjectVideo, useDeleteProjectVideo, useUpdateProjectVideo, useUploadProjectVideo } from '@/hooks/useProjectVideos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface VideoManagerProps {
  projectId: string;
  videos: ProjectVideo[];
}

export const VideoManager = ({ projectId, videos }: VideoManagerProps) => {
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'upload'>('youtube');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const createVideo = useCreateProjectVideo();
  const deleteVideo = useDeleteProjectVideo();
  const updateVideo = useUpdateProjectVideo();
  const uploadVideo = useUploadProjectVideo();

  const getVideoIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'vimeo':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-green-500" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const extractVideoId = (url: string, type: 'youtube' | 'vimeo') => {
    if (type === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    } else if (type === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const getEmbedUrl = (url: string, type: 'youtube' | 'vimeo') => {
    const videoId = extractVideoId(url, type);
    if (!videoId) return url;
    
    if (type === 'youtube') {
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (type === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleAddVideo = async () => {
    if (videoType === 'upload' && uploadFile) {
      try {
        await uploadVideo.mutateAsync({
          file: uploadFile,
          projectId,
          title: videoTitle || undefined,
          description: videoDescription || undefined,
          orderIndex: videos.length,
        });
        resetForm();
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    } else if (videoUrl) {
      const embedUrl = videoType !== 'upload' ? getEmbedUrl(videoUrl, videoType) : videoUrl;
      
      if (!embedUrl || (videoType !== 'upload' && !extractVideoId(videoUrl, videoType))) {
        toast.error('URL do vídeo inválida');
        return;
      }

      try {
        await createVideo.mutateAsync({
          project_id: projectId,
          video_url: embedUrl,
          title: videoTitle || undefined,
          description: videoDescription || undefined,
          video_type: videoType,
          order_index: videos.length,
        });
        resetForm();
      } catch (error) {
        console.error('Error adding video:', error);
      }
    }
  };

  const resetForm = () => {
    setVideoUrl('');
    setVideoTitle('');
    setVideoDescription('');
    setVideoType('youtube');
    setUploadFile(null);
    setIsAddingVideo(false);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
      try {
        await deleteVideo.mutateAsync(videoId);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vídeos do Projeto</span>
          <Button onClick={() => setIsAddingVideo(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Vídeo
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum vídeo adicionado ainda
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getVideoIcon(video.video_type)}
                    <Badge variant="outline" className="text-xs">
                      {video.video_type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {video.video_type !== 'upload' ? (
                  <div className="aspect-video bg-muted rounded overflow-hidden">
                    <iframe
                      src={video.video_url}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded overflow-hidden">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                )}
                
                {video.title && (
                  <h4 className="font-medium text-sm">{video.title}</h4>
                )}
                {video.description && (
                  <p className="text-xs text-muted-foreground">{video.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Vídeo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Vídeo</Label>
                <Select value={videoType} onValueChange={(value: any) => setVideoType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="upload">Upload de Arquivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {videoType === 'upload' ? (
                <div className="space-y-2">
                  <Label>Arquivo de Vídeo</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>URL do Vídeo</Label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder={
                      videoType === 'youtube' 
                        ? 'https://www.youtube.com/watch?v=...' 
                        : 'https://vimeo.com/...'
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Título (opcional)</Label>
                <Input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Título do vídeo"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Descrição do vídeo"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddVideo}
                  disabled={
                    createVideo.isPending || 
                    uploadVideo.isPending || 
                    (videoType === 'upload' ? !uploadFile : !videoUrl)
                  }
                >
                  {(createVideo.isPending || uploadVideo.isPending) ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};