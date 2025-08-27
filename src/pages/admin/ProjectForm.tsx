import { ContentBlockManager } from '@/components/content-blocks/ContentBlockManager';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { useAdminProject, useCreateProject, useUpdateProject, CreateProjectData } from '@/hooks/useAdminProjects';
import { useCategories } from '@/hooks/useCategories';
import { useCheckSlugUniqueness } from '@/hooks/useProjectImageDetails';
import { useTempMediaManager } from '@/hooks/useTempMediaManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Calendar as CalendarIcon, Plus, X, Info, Image, Video, Search, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { CoverImageManager } from '@/components/admin/CoverImageManager';
import { MaterialsEditor } from '@/components/admin/MaterialsEditor';
import { VideoManager } from '@/components/admin/VideoManager';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const projectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  category_id: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  cover_image: z.string().optional(),
  client: z.string().optional(),
  start_date: z.string().optional(),
  completion_date: z.string().optional(),
  area_sqm: z.preprocess((v) => (v === '' || v === null || Number.isNaN(v) ? undefined : v), z.number().optional()),
  bedrooms: z.preprocess((v) => (v === '' || v === null || Number.isNaN(v) ? undefined : v), z.number().optional()),
  bathrooms: z.preprocess((v) => (v === '' || v === null || Number.isNaN(v) ? undefined : v), z.number().optional()),
  budget_range: z.string().optional(),
  construction_type: z.string().optional(),
  materials: z.record(z.any()).optional(),
  features: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  published: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectFormTabs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: project, isLoading: projectLoading } = useAdminProject(id || '');
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { associateWithProject, hasTempMedia } = useTempMediaManager();

  // For new projects, generate a proper UUID that won't be used in database operations
  const [tempProjectId] = useState(() => crypto.randomUUID());
  const currentProjectId = isEditing ? id! : tempProjectId;

  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
  const [selectedCompletionDate, setSelectedCompletionDate] = useState<Date | undefined>();
  const [newFeature, setNewFeature] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [slugError, setSlugError] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ images: 0, videos: 0 });
  const checkSlugUniqueness = useCheckSlugUniqueness();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, control } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      category_id: '',
      location: '',
      description: '',
      short_description: '',
      long_description: '',
      cover_image: '',
      client: '',
      start_date: '',
      completion_date: '',
      area_sqm: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      budget_range: '',
      construction_type: '',
      materials: {},
      features: [],
      keywords: [],
      meta_title: '',
      meta_description: '',
      published: false,
    },
  });

  const watchTitle = watch('title');
  const watchFeatures = watch('features') || [];
  const watchKeywords = watch('keywords') || [];
  const watchMaterials = watch('materials') || {};
  const watchSlug = watch('slug');
  const watchCoverImage = watch('cover_image');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchTitle, setValue, isEditing]);

  // Set form data when editing
  useEffect(() => {
    if (project && isEditing) {
      reset({
        title: project.title,
        slug: project.slug,
        category: project.category,
        category_id: project.category_id || '',
        location: project.location || '',
        description: project.description || '',
        short_description: project.short_description || '',
        long_description: project.long_description || '',
        cover_image: project.cover_image || '',
        client: project.client || '',
        start_date: project.start_date || '',
        completion_date: project.completion_date || '',
        area_sqm: project.area_sqm || undefined,
        bedrooms: project.bedrooms || undefined,
        bathrooms: project.bathrooms || undefined,
        budget_range: project.budget_range || '',
        construction_type: project.construction_type || '',
        materials: project.materials || {},
        features: project.features || [],
        keywords: project.keywords || [],
        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        published: project.published || false,
      });

      if (project.start_date) {
        setSelectedStartDate(parseISO(project.start_date));
      }
      if (project.completion_date) {
        setSelectedCompletionDate(parseISO(project.completion_date));
      }
    }
  }, [project, isEditing, reset]);

  // Slug validation
  const handleSlugBlur = async () => {
    if (watchSlug && watchSlug.length > 0) {
      try {
        const isDuplicate = await checkSlugUniqueness.mutateAsync({ 
          slug: watchSlug, 
          excludeId: id 
        });
        
        if (isDuplicate) {
          setSlugError('Este slug já está sendo usado por outro projeto');
        } else {
          setSlugError('');
        }
      } catch (error) {
        console.error('Error checking slug uniqueness:', error);
      }
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const submitData: CreateProjectData = {
        title: data.title,
        slug: data.slug,
        category: data.category,
        category_id: data.category_id,
        location: data.location,
        description: data.description,
        short_description: data.short_description,
        long_description: data.long_description,
        cover_image: data.cover_image,
        client: data.client,
        start_date: selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : undefined,
        completion_date: selectedCompletionDate ? format(selectedCompletionDate, 'yyyy-MM-dd') : undefined,
        area_sqm: data.area_sqm || undefined,
        bedrooms: data.bedrooms || undefined,
        bathrooms: data.bathrooms || undefined,
        budget_range: data.budget_range,
        construction_type: data.construction_type,
        materials: data.materials,
        features: data.features,
        keywords: data.keywords,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        published: data.published,
      };

      if (isEditing && id) {
        await updateProject.mutateAsync({ id, ...submitData });
        navigate('/admin/projects');
      } else {
        const newProject = await createProject.mutateAsync(submitData);

        // Reassociar blocos de conteúdo criados com o ID temporário
        try {
          await supabase
            .from('project_content_blocks')
            .update({ project_id: newProject.id })
            .eq('project_id', currentProjectId);
        } catch (e) {
          console.error('Erro ao reassociar blocos de conteúdo:', e);
        }

        // Associar mídia temporária (imagens/vídeos) ao novo projeto
        try {
          if (hasTempMedia) {
            await associateWithProject.mutateAsync(newProject.id);
          }
        } catch (e) {
          console.error('Erro ao associar mídia temporária:', e);
        }

        toast.success('Projeto criado com sucesso!');
        navigate(`/admin/projects/${newProject.id}/edit`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    if (category) {
      setValue('category_id', categoryId);
      setValue('category', category.name);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...watchFeatures, newFeature.trim()];
      setValue('features', updatedFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = watchFeatures.filter((_, i) => i !== index);
    setValue('features', updatedFeatures);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const updatedKeywords = [...watchKeywords, newKeyword.trim()];
      setValue('keywords', updatedKeywords);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = watchKeywords.filter((_, i) => i !== index);
    setValue('keywords', updatedKeywords);
  };

  const isLoading_form = createProject.isPending || updateProject.isPending;

  if ((isEditing && projectLoading) || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
          </h1>
        </div>
        
        <Button 
          type="submit" 
          form="project-form"
          disabled={isLoading_form || !!slugError}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Atualizar' : 'Criar'} Projeto
        </Button>
      </div>

      <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Mídia
              {!isEditing && uploadProgress.images > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {uploadProgress.images}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Vídeos
              {!isEditing && uploadProgress.videos > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {uploadProgress.videos}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          {/* Informações Tab */}
          <TabsContent value="info" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Ex: Renovação Completa de Apartamento"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="ex: renovacao-completa-apartamento"
                      onBlur={handleSlugBlur}
                    />
                    {(errors.slug || slugError) && (
                      <p className="text-sm text-destructive">
                        {errors.slug?.message || slugError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Usado na URL do projeto
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Controller
                      name="category_id"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={handleCategoryChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder="Ex: Barcelona, Espanha"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Curta</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Descrição breve do projeto..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Resumo do Projeto</Label>
                  <Textarea
                    id="short_description"
                    {...register('short_description')}
                    placeholder="Resumo destacado do projeto..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long_description">Descrição Detalhada</Label>
                  <Controller
                    name="long_description"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Descrição completa e detalhada do projeto..."
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input
                      id="client"
                      {...register('client')}
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="construction_type">Tipo de Construção</Label>
                    <Input
                      id="construction_type"
                      {...register('construction_type')}
                      placeholder="Ex: Residencial, Comercial, Industrial"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Data de Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedStartDate ? format(selectedStartDate, "dd/MM/yyyy") : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedStartDate}
                          onSelect={setSelectedStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Conclusão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedCompletionDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedCompletionDate ? format(selectedCompletionDate, "dd/MM/yyyy") : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedCompletionDate}
                          onSelect={setSelectedCompletionDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="area_sqm">Área (m²)</Label>
                    <Input
                      id="area_sqm"
                      type="number"
                      {...register('area_sqm', { valueAsNumber: true })}
                      placeholder="Ex: 120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      {...register('bedrooms', { valueAsNumber: true })}
                      placeholder="Ex: 3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      {...register('bathrooms', { valueAsNumber: true })}
                      placeholder="Ex: 2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_range">Faixa Orçamentária</Label>
                  <Input
                    id="budget_range"
                    {...register('budget_range')}
                    placeholder="Ex: €50.000 - €80.000"
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label>Características</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Adicionar característica..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="published"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Publicar projeto</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Blocks Tab */}
          <TabsContent value="content" className="space-y-6">
            {!isEditing && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Info className="w-4 h-4" />
                    <p className="text-sm">
                      Os blocos de conteúdo permitem criar uma estrutura personalizada para a página do projeto. 
                      Você pode adicionar e reordenar blocos mesmo antes de salvar o projeto.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <ContentBlockManager projectId={currentProjectId} />
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <MaterialsEditor
              materials={watchMaterials}
              onChange={(materials) => setValue('materials', materials)}
            />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            {!isEditing && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Info className="w-4 h-4" />
                    <p className="text-sm">
                      Você pode fazer upload de imagens antes de salvar o projeto. Elas serão associadas automaticamente após a criação.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cover Image Manager */}
            <CoverImageManager
              projectId={currentProjectId}
              currentCoverImage={watchCoverImage}
              galleryImages={isEditing ? (project?.images?.filter(img => img.image_type === 'gallery') || []) : []}
            />

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Imagens do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  projectId={currentProjectId}
                  images={isEditing ? (project?.images || []) : []}
                  currentCoverImage={watchCoverImage}
                  onImagesChange={() => {
                    if (!isEditing) {
                      setUploadProgress(prev => ({ ...prev, images: prev.images + 1 }));
                    }
                  }}
                  isTemporary={!isEditing}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            {!isEditing && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Info className="w-4 h-4" />
                    <p className="text-sm">
                      Você pode adicionar vídeos antes de salvar o projeto. Eles serão associados automaticamente após a criação.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <VideoManager
              projectId={currentProjectId}
              videos={isEditing ? (project?.videos || []) : []}
              onVideosChange={() => {
                if (!isEditing) {
                  setUploadProgress(prev => ({ ...prev, videos: prev.videos + 1 }));
                }
              }}
              isTemporary={!isEditing}
            />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Título SEO</Label>
                  <Input
                    id="meta_title"
                    {...register('meta_title')}
                    placeholder="Título otimizado para mecanismos de busca"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendado: até 60 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Descrição SEO</Label>
                  <Textarea
                    id="meta_description"
                    {...register('meta_description')}
                    placeholder="Descrição otimizada para mecanismos de busca"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendado: até 160 caracteres
                  </p>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label>Palavras-chave</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Adicionar palavra-chave..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}