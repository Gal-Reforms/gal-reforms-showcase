import { supabase } from '@/integrations/supabase/client';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = window.location.origin;
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/politica-de-privacidade', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/termos-de-servico', priority: 0.3, changefreq: 'yearly' as const },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Dynamic project pages
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (projects) {
      projects.forEach(project => {
        urls.push({
          loc: `${baseUrl}/proyecto/${project.slug}`,
          lastmod: new Date(project.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.8
        });
      });
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const downloadSitemap = async () => {
  try {
    const sitemapXml = await generateSitemap();
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

export const generateRobotsTxt = (): string => {
  const baseUrl = window.location.origin;
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /auth/

# Allow important pages
Allow: /
Allow: /proyecto/
Allow: /politica-de-privacidade
Allow: /termos-de-servico

# Crawl-delay for better server performance
Crawl-delay: 1`;
};