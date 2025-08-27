import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import { t } from "@/lib/translations";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "Construcción Residencial",
    t('completeReforms'), 
    t('kitchenReforms'),
    "Fachadas y Exteriores",
    t('commercialProjects'),
    "Consultoría Técnica"
  ];

  const quickLinks = [
    { name: t('home'), href: "#home" },
    { name: t('about'), href: "#about" },
    { name: t('projects'), href: "#projects" },
    { name: t('contact'), href: "#contact" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <img 
                src="/lovable-uploads/358be0af-7f4a-4c47-bd7a-8127ae316584.png" 
                alt="Gal Reforms Logo" 
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-background/80 leading-relaxed">
                Transformamos espacios con calidad excepcional desde hace más de 15 años. 
                Tu satisfacción es nuestra prioridad.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/galreforms" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Siga-nos no Facebook"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://instagram.com/galreforms" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Siga-nos no Instagram"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://linkedin.com/company/galreforms" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Conecte-se no LinkedIn"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-primary">
              Nossos Serviços
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-background/80 hover:text-primary transition-colors cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-primary">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-background/80 hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-primary">
              Contato
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-background/80">Madrid, Espanha</p>
                  <p className="text-background/60 text-sm">Atendemos toda região</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-background/80">+34 XXX XXX XXX</p>
                  <p className="text-background/60 text-sm">WhatsApp disponível</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-background/80">contato@galreforms.com</p>
                  <p className="text-background/60 text-sm">Resposta em 24h</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-background/80">Seg - Sex: 8h às 18h</p>
                  <p className="text-background/60 text-sm">Sáb: 9h às 14h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © {currentYear} Gal Reforms S.L. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/politica-de-privacidade" className="text-background/60 hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="/termos-de-servico" className="text-background/60 hover:text-primary transition-colors">
                Termos de Serviço
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;