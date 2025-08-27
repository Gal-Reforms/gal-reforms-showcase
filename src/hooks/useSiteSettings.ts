import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SiteSettings {
  id: string;
  company_description?: string;
  address?: string;
  phone_number?: string;
  whatsapp_number?: string;
  email?: string;
  working_hours_weekdays?: string;
  working_hours_saturday?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  privacy_policy_url?: string;
  terms_of_service_url?: string;
  services_list?: string[];
  quick_links_list?: { name: string; href: string }[];
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsFormData {
  company_description: string;
  address: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  working_hours_weekdays: string;
  working_hours_saturday: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  privacy_policy_url: string;
  terms_of_service_url: string;
  services_list: string[];
  quick_links_list: { name: string; href: string }[];
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      return data as SiteSettings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SiteSettingsFormData>) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .select()
        .single();

      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }

      return data as SiteSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating site settings:', error);
      toast.error('Erro ao atualizar configurações');
    },
  });
};