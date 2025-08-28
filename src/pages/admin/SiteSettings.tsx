import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings, type SiteSettingsFormData } from '@/hooks/useSiteSettings';

const siteSettingsSchema = z.object({
  company_description: z.string().min(1, 'Descrição é obrigatória'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone_number: z.string().min(1, 'Telefone é obrigatório'),
  whatsapp_number: z.string().min(1, 'WhatsApp é obrigatório'),
  email: z.string().email('Email inválido'),
  working_hours_weekdays: z.string().min(1, 'Horário de funcionamento é obrigatório'),
  working_hours_saturday: z.string().min(1, 'Horário do sábado é obrigatório'),
  facebook_url: z.string().url('URL inválida').or(z.literal('')),
  instagram_url: z.string().url('URL inválida').or(z.literal('')),
  linkedin_url: z.string().url('URL inválida').or(z.literal('')),
  privacy_policy_url: z.string().min(1, 'URL da política de privacidade é obrigatória'),
  terms_of_service_url: z.string().min(1, 'URL dos termos de serviço é obrigatória'),
  services_list: z.array(z.string().min(1, 'Serviço não pode estar vazio')),
  quick_links_list: z.array(z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    href: z.string().min(1, 'Link é obrigatório')
  }))
});

const SiteSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const form = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      company_description: '',
      address: '',
      phone_number: '',
      whatsapp_number: '',
      email: '',
      working_hours_weekdays: '',
      working_hours_saturday: '',
      facebook_url: '',
      instagram_url: '',
      linkedin_url: '',
      privacy_policy_url: '',
      terms_of_service_url: '',
      services_list: [],
      quick_links_list: []
    }
  });

  const { register, handleSubmit, control, formState: { errors }, reset } = form;

  // Reset form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      reset({
        company_description: settings.company_description || '',
        address: settings.address || '',
        phone_number: settings.phone_number || '',
        whatsapp_number: settings.whatsapp_number || '',
        email: settings.email || '',
        working_hours_weekdays: settings.working_hours_weekdays || '',
        working_hours_saturday: settings.working_hours_saturday || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || '',
        privacy_policy_url: settings.privacy_policy_url || '',
        terms_of_service_url: settings.terms_of_service_url || '',
        services_list: settings.services_list || [],
        quick_links_list: settings.quick_links_list || []
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: SiteSettingsFormData) => {
    updateSettings.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações do Site</h1>
        <p className="text-muted-foreground">
          Configure as informações do rodapé e dados de contato do site
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>Configure as informações básicas da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_description">Descrição da Empresa</Label>
              <Textarea
                id="company_description"
                {...register('company_description')}
                placeholder="Descrição que aparecerá no rodapé"
                rows={3}
              />
              {errors.company_description && (
                <p className="text-sm text-destructive">{errors.company_description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>Configure os dados de contato da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Madrid, Espanha"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone_number">Telefone</Label>
                <Input
                  id="phone_number"
                  {...register('phone_number')}
                  placeholder="+34 XXX XXX XXX"
                />
                {errors.phone_number && (
                  <p className="text-sm text-destructive">{errors.phone_number.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  {...register('whatsapp_number')}
                  placeholder="+34 XXX XXX XXX"
                />
                {errors.whatsapp_number && (
                  <p className="text-sm text-destructive">{errors.whatsapp_number.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="contato@galreforms.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="working_hours_weekdays">Horário (Seg-Sex)</Label>
                <Input
                  id="working_hours_weekdays"
                  {...register('working_hours_weekdays')}
                  placeholder="Seg - Sex: 8h às 18h"
                />
                {errors.working_hours_weekdays && (
                  <p className="text-sm text-destructive">{errors.working_hours_weekdays.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="working_hours_saturday">Horário (Sábado)</Label>
                <Input
                  id="working_hours_saturday"
                  {...register('working_hours_saturday')}
                  placeholder="Sáb: 9h às 14h"
                />
                {errors.working_hours_saturday && (
                  <p className="text-sm text-destructive">{errors.working_hours_saturday.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Configure os links das redes sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  {...register('facebook_url')}
                  placeholder="https://facebook.com/galreforms"
                />
                {errors.facebook_url && (
                  <p className="text-sm text-destructive">{errors.facebook_url.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  {...register('instagram_url')}
                  placeholder="https://instagram.com/galreforms"
                />
                {errors.instagram_url && (
                  <p className="text-sm text-destructive">{errors.instagram_url.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  {...register('linkedin_url')}
                  placeholder="https://linkedin.com/company/galreforms"
                />
                {errors.linkedin_url && (
                  <p className="text-sm text-destructive">{errors.linkedin_url.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Legais</CardTitle>
            <CardDescription>Configure os links para páginas legais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="privacy_policy_url">Política de Privacidade</Label>
                <Input
                  id="privacy_policy_url"
                  {...register('privacy_policy_url')}
                  placeholder="/politica-de-privacidade"
                />
                {errors.privacy_policy_url && (
                  <p className="text-sm text-destructive">{errors.privacy_policy_url.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="terms_of_service_url">Termos de Serviço</Label>
                <Input
                  id="terms_of_service_url"
                  {...register('terms_of_service_url')}
                  placeholder="/termos-de-servico"
                />
                {errors.terms_of_service_url && (
                  <p className="text-sm text-destructive">{errors.terms_of_service_url.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ServicesSection control={control} register={register} errors={errors} />
        <QuickLinksSection control={control} register={register} errors={errors} />

        <div className="flex justify-end">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Services Section Component
const ServicesSection = ({ control, register, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services_list'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Serviços</CardTitle>
        <CardDescription>Configure os serviços que aparecerão no rodapé</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`services_list.${index}`)}
                placeholder="Nome do serviço"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append('')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Serviço
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Links Section Component  
const QuickLinksSection = ({ control, register, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quick_links_list'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links Rápidos</CardTitle>
        <CardDescription>Configure os links rápidos que aparecerão no rodapé</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`quick_links_list.${index}.name`)}
                placeholder="Nome do link"
              />
              <Input
                {...register(`quick_links_list.${index}.href`)}
                placeholder="#secao ou /pagina"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', href: '' })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteSettings;