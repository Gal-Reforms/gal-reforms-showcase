import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminProject, useCreateProject, useUpdateProject, CreateProjectData } from '@/hooks/useAdminProjects';
import { useCategories } from '@/hooks/useCategories';
import { useCheckSlugUniqueness } from '@/hooks/useProjectImageDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { CoverImageManager } from '@/components/admin/CoverImageManager';
import { MaterialsEditor } from '@/components/admin/MaterialsEditor';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const projectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  category_id: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  cover_image: z.string().optional(),
  client: z.string().optional(),
  completion_date: z.string().optional(),
  area_sqm: z.number().optional(),
  budget_range: z.string().optional(),
  materials: z.record(z.any()).optional(),
  features: z.array(z.string()).optional(),
  published: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: project, isLoading: projectLoading } = useAdminProject(id || '');
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [newFeature, setNewFeature] = useState('');
  const [slugError, setSlugError] = useState('');
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
      cover_image: '',
      client: '',
      completion_date: '',
      area_sqm: undefined,
      budget_range: '',
      materials: {},
      features: [],
      published: false,
    },
  });

  const watchTitle = watch('title');
  const watchFeatures = watch('features') || [];
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
        cover_image: project.cover_image || '',
        client: project.client || '',
        completion_date: project.completion_date || '',
        area_sqm: project.area_sqm || undefined,
        budget_range: project.budget_range || '',
        materials: project.materials || {},
        features: project.features || [],
        published: project.published || false,
      });

      if (project.completion_date) {
        setSelectedDate(parseISO(project.completion_date));
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
        cover_image: data.cover_image,
        client: data.client,
        completion_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
        area_sqm: data.area_sqm || undefined,
        budget_range: data.budget_range,
        materials: data.materials,
        features: data.features,
        published: data.published,
      };

      if (isEditing && id) {
        await updateProject.mutateAsync({ id, ...submitData });
        navigate('/admin/projects');
      } else {
        const newProject = await createProject.mutateAsync(submitData);
        // Redirect to edit mode immediately to allow image uploads
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
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descrição detalhada do projeto..."
                rows={4}
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
                <Label>Data de Conclusão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="budget_range">Faixa Orçamentária</Label>
                <Input
                  id="budget_range"
                  {...register('budget_range')}
                  placeholder="Ex: €50.000 - €80.000"
                />
              </div>
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

        {/* Materials Editor */}
        <MaterialsEditor
          materials={watchMaterials}
          onChange={(materials) => setValue('materials', materials)}
        />

        {/* Image Management - Only show if editing */}
        {isEditing && project && (
          <>
            {/* Cover Image Manager */}
            <CoverImageManager
              projectId={project.id}
              currentCoverImage={watchCoverImage}
              galleryImages={project.images?.filter(img => img.image_type === 'gallery') || []}
            />

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Imagens do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  projectId={project.id}
                  images={project.images || []}
                  currentCoverImage={watchCoverImage}
                  onImagesChange={() => {
                    // Refresh project data when images change
                    // This will be handled by React Query invalidation
                  }}
                />
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex items-center space-x-4">
          <Button 
            type="submit" 
            disabled={isLoading_form || !!slugError}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Atualizar' : 'Criar'} Projeto
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/projects')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}