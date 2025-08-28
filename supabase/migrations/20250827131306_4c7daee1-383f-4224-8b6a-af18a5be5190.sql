-- Create site_settings table for global site configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' PRIMARY KEY,
  company_description TEXT,
  address TEXT,
  phone_number VARCHAR(50),
  whatsapp_number VARCHAR(50),
  email VARCHAR(255),
  working_hours_weekdays VARCHAR(100),
  working_hours_saturday VARCHAR(100),
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  privacy_policy_url VARCHAR(500),
  terms_of_service_url VARCHAR(500),
  services_list JSONB DEFAULT '[]'::jsonb,
  quick_links_list JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Site settings are publicly viewable" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default configuration
INSERT INTO public.site_settings (
  id,
  company_description,
  address,
  phone_number,
  whatsapp_number,
  email,
  working_hours_weekdays,
  working_hours_saturday,
  facebook_url,
  instagram_url,
  linkedin_url,
  privacy_policy_url,
  terms_of_service_url,
  services_list,
  quick_links_list
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Transformamos espacios com calidad excepcional desde hace más de 15 años. Tu satisfacción es nuestra prioridad.',
  'Madrid, Espanha',
  '+34 XXX XXX XXX',
  '+34 XXX XXX XXX',
  'contato@galreforms.com',
  'Seg - Sex: 8h às 18h',
  'Sáb: 9h às 14h',
  'https://facebook.com/galreforms',
  'https://instagram.com/galreforms',
  'https://linkedin.com/company/galreforms',
  '/politica-de-privacidade',
  '/termos-de-servico',
  '["Construcción Residencial", "Reformas Completas", "Reformas de Cozinhas", "Fachadas y Exteriores", "Projetos Comerciais", "Consultoría Técnica"]'::jsonb,
  '[{"name": "Início", "href": "#home"}, {"name": "Sobre", "href": "#about"}, {"name": "Projetos", "href": "#projects"}, {"name": "Contato", "href": "#contact"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;