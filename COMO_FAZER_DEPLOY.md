# 🚀 Como Fazer Deploy do Site Gal Reforms

## 📁 Arquivos Prontos para Deploy

Após executar `npm run build`, todos os arquivos otimizados estão na pasta **`dist/`**:

```
dist/
├── assets/                    # CSS, JS e imagens otimizadas
├── .htaccess                 # Configuração Apache (IMPORTANTE!)
├── index.html                # Página principal
├── manifest.json             # PWA configuration
├── robots.txt                # SEO crawlers
├── sitemap.xml               # Mapa do site
└── sw.js                     # Service Worker
```

## 🎯 Opções de Deploy

### **Opção 1: Upload Manual via FTP/cPanel**

1. **Acesse seu painel de hospedagem** (cPanel, Plesk, etc.)
2. **Vá para o File Manager** ou use um cliente FTP
3. **Navegue até a pasta public_html** (ou www, htdocs)
4. **Faça upload de TODOS os arquivos da pasta `dist/`**
5. **Certifique-se que o .htaccess foi enviado** (arquivo oculto!)

### **Opção 2: Comando de Cópia (Windows)**

```cmd
# Copiar todos os arquivos da pasta dist para sua pasta de destino
xcopy "gal-reforms-showcase-main\\dist\\*" "C:\\caminho\\para\\seu\\servidor\\" /E /H /Y

# Exemplo para XAMPP:
xcopy "gal-reforms-showcase-main\\dist\\*" "C:\\xampp\\htdocs\\galreformas\\" /E /H /Y

# Exemplo para WAMP:
xcopy "gal-reforms-showcase-main\\dist\\*" "C:\\wamp64\\www\\galreformas\\" /E /H /Y
```

### **Opção 3: PowerShell (Recomendado)**

```powershell
# Copiar com PowerShell (preserva arquivos ocultos)
Copy-Item -Path "gal-reforms-showcase-main\\dist\\*" -Destination "C:\\caminho\\destino\\" -Recurse -Force

# Verificar se .htaccess foi copiado
Get-ChildItem -Path "C:\\caminho\\destino\\" -Force | Where-Object {$_.Name -eq ".htaccess"}
```

## ⚠️ IMPORTANTE: Verificações Obrigatórias

### ✅ **1. Arquivo .htaccess**
```bash
# DEVE estar presente na raiz do site
# Contém configurações essenciais para:
# - React Router (SPA)
# - HTTPS redirect
# - Compressão
# - Cache
# - Segurança
```

### ✅ **2. Estrutura de Arquivos**
```
seu-dominio.com/
├── assets/           # ✅ Pasta com CSS/JS/imagens
├── .htaccess         # ✅ OBRIGATÓRIO para funcionar
├── index.html        # ✅ Página principal
├── manifest.json     # ✅ PWA
├── robots.txt        # ✅ SEO
├── sitemap.xml       # ✅ SEO
└── sw.js            # ✅ Service Worker
```

### ✅ **3. Permissões de Arquivo**
- **Arquivos**: 644
- **Pastas**: 755
- **.htaccess**: 644

## 🔧 Comandos Práticos

### **Copiar para Servidor Local (XAMPP/WAMP)**
```cmd
# Para XAMPP
xcopy "dist\\*" "C:\\xampp\\htdocs\\galreformas\\" /E /H /Y

# Para WAMP  
xcopy "dist\\*" "C:\\wamp64\\www\\galreformas\\" /E /H /Y

# Para LARAGON
xcopy "dist\\*" "C:\\laragon\\www\\galreformas\\" /E /H /Y
```

### **Verificar Deploy**
```cmd
# Verificar se todos os arquivos foram copiados
dir "C:\\caminho\\destino\\" /A

# Verificar .htaccess especificamente
dir "C:\\caminho\\destino\\.htaccess"
```

## 🌐 Configuração do Domínio

### **DNS Settings**
```
Tipo: A
Nome: @
Valor: [IP do seu servidor]

Tipo: CNAME  
Nome: www
Valor: galreformas.com.es
```

### **SSL Certificate**
- ✅ Instalar certificado SSL
- ✅ Forçar HTTPS (já configurado no .htaccess)

## 🧪 Testar o Deploy

### **URLs para Testar:**
```
✅ https://galreformas.com.es/
✅ https://galreformas.com.es/proyectos
✅ https://galreformas.com.es/proyecto/reforma-cocina-moderna
✅ https://galreformas.com.es/contacto
✅ https://galreformas.com.es/sobre-nosotros
✅ https://galreformas.com.es/politica-privacidad
✅ https://galreformas.com.es/terminos-servicio
```

### **Verificações:**
- ✅ Todas as páginas carregam sem erro 404
- ✅ CSS e JS carregam corretamente
- ✅ Imagens aparecem
- ✅ Formulário de contato funciona
- ✅ WhatsApp button funciona
- ✅ Navegação entre páginas funciona

## 🚨 Solução de Problemas

### **Erro 404 nas Rotas**
```
Problema: Páginas como /proyectos retornam 404
Solução: Verificar se .htaccess está presente e com as regras corretas
```

### **CSS/JS não Carrega**
```
Problema: Site aparece sem estilo
Solução: Verificar se pasta assets/ foi copiada corretamente
```

### **Imagens não Aparecem**
```
Problema: Imagens quebradas
Solução: Verificar se todas as imagens foram copiadas
```

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs do servidor** (error.log)
2. **Testar em modo desenvolvimento** (`npm run dev`)
3. **Verificar console do navegador** (F12)
4. **Confirmar que .htaccess está ativo** no servidor

---

## ✅ Checklist Final

- [ ] Build executado com sucesso (`npm run build`)
- [ ] Pasta `dist/` contém todos os arquivos
- [ ] Arquivos copiados para servidor/pasta destino
- [ ] Arquivo `.htaccess` presente na raiz
- [ ] Permissões de arquivo corretas
- [ ] SSL configurado
- [ ] DNS apontando corretamente
- [ ] Todas as URLs testadas e funcionando

**🎉 Site pronto para produção!**