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
      console.log('🔍 Buscando configurações do site...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (error) {
        console.error('❌ Erro ao buscar configurações:', error);
        throw error;
      }

      console.log('✅ Configurações carregadas:', data);
      return data as SiteSettings;
    },
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnWindowFocus: true, // Recarregar quando a janela ganhar foco
    refetchOnMount: true, // Recarregar sempre que o componente for montado
    refetchOnReconnect: true, // Recarregar quando reconectar à internet
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SiteSettingsFormData>) => {
      console.log('🔍 Tentando atualizar configurações:', settings);
      
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar configurações:', error);
        throw error;
      }

      console.log('✅ Configurações atualizadas com sucesso:', data);
      return data as SiteSettings;
    },
    onSuccess: (data) => {
      console.log('🎯 Cache sendo atualizado com:', data);
      
      // Invalidar e atualizar o cache imediatamente
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      
      // Também atualizar o cache diretamente para atualização imediata
      queryClient.setQueryData(['siteSettings'], data);
      
      // Verificar se o cache foi atualizado
      const cachedData = queryClient.getQueryData(['siteSettings']);
      console.log('🔍 Cache após atualização:', cachedData);
      
      // Forçar recarregamento de todos os componentes que usam essas configurações
      queryClient.refetchQueries({ queryKey: ['siteSettings'] });
      
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error) => {
      console.error('❌ Erro na mutação:', error);
      toast.error(`Erro ao atualizar configurações: ${error.message}`);
    },
  });
};

// Função para forçar atualização das configurações
export const refreshSiteSettings = (queryClient: any) => {
  console.log('🔄 Forçando atualização das configurações...');
  queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
  queryClient.refetchQueries({ queryKey: ['siteSettings'] });
};