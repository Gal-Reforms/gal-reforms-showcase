# 🚀 Guía de Despliegue - Gal Reformas

## ✅ Pre-Despliegue Checklist

### 🔧 Configuración Técnica
- [x] **Dominio**: Configurado para `galreformas.com.es`
- [x] **HTTPS**: Forzado en `.htaccess`
- [x] **WWW Redirect**: Configurado para redirigir www a no-www
- [x] **React Router**: Configurado para SPA
- [x] **Compresión**: Habilitada en Apache
- [x] **Cache Headers**: Configurados para assets estáticos

### 🎨 Assets y Contenido
- [x] **Logo**: SVG profesional creado (`/logo-gal-reforms.svg`)
- [x] **Favicon**: Actualizado al logo de la empresa
- [x] **Imágenes Hero**: Optimizadas y responsive
- [x] **Meta Tags**: Todas actualizadas con dominio correcto
- [x] **Schema Markup**: URLs corregidas

### 📱 Responsividad
- [x] **Mobile Layout**: Tabs y botones optimizados
- [x] **Touch Targets**: Mínimo 44px en todos los elementos
- [x] **Overflow**: Controlado en todos los componentes
- [x] **Navigation**: Funcional en todos los dispositivos

### 🌐 SEO y Localización
- [x] **Idioma**: 100% en español
- [x] **URLs Canónicas**: Configuradas correctamente
- [x] **Sitemap**: Generado automáticamente
- [x] **Robots.txt**: Configurado para SEO
- [x] **Structured Data**: LocalBusiness y Organization

## 🏗️ Comandos de Build

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build:prod
```

### Preview Local
```bash
npm run preview
```

### Análisis de Bundle
```bash
npm run analyze
```

## 📊 Optimizaciones de Performance

### Code Splitting Configurado
- **Vendor**: React y React-DOM separados
- **UI**: Componentes Radix UI agrupados
- **Supabase**: Cliente de base de datos separado
- **Query**: React Query separado

### Cache Strategy
- **CSS/JS**: 1 año de cache
- **Imágenes**: 1 año de cache
- **HTML**: Sin cache (siempre fresco)

### Compresión
- **Gzip**: Habilitado para todos los text assets
- **Minificación**: ESBuild en producción

## 🔒 Seguridad

### Headers Configurados
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## 🌍 Variables de Entorno

### Supabase (Requeridas)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Dominio (Opcional)
```env
VITE_SITE_URL=https://galreformas.com.es
```

## 📋 Post-Despliegue Verificación

### ✅ Funcionalidad
1. **Navegación**: Todas las rutas funcionan
2. **Formularios**: Contacto y WhatsApp operativos
3. **Galería**: Imágenes cargan correctamente
4. **Admin**: Panel administrativo accesible
5. **Mobile**: Responsive en todos los dispositivos

### ✅ SEO
1. **Google Search Console**: Verificar indexación
2. **PageSpeed Insights**: Verificar performance
3. **Meta Tags**: Verificar en redes sociales
4. **Structured Data**: Validar con Google Rich Results

### ✅ Performance
1. **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
2. **Lighthouse Score**: > 90 en todas las métricas
3. **Bundle Size**: Verificar chunks optimizados

## 🚨 Troubleshooting

### Problemas Comunes
1. **404 en rutas**: Verificar `.htaccess` configurado
2. **Imágenes no cargan**: Verificar paths relativos
3. **Supabase errors**: Verificar variables de entorno
4. **Mobile issues**: Verificar viewport meta tag

### Logs Útiles
```bash
# Verificar build
npm run build:prod

# Verificar preview local
npm run preview

# Verificar lint
npm run lint
```

## 📞 Soporte

Para cualquier problema técnico:
1. Verificar esta guía primero
2. Revisar logs del servidor
3. Contactar al equipo de desarrollo

---

**¡El sitio está listo para producción! 🎉**