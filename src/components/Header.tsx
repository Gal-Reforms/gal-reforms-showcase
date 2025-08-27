import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home with hash
      navigate(`/#${sectionId}`);
    } else {
      // If on home page, scroll to section
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };
  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-soft" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png" alt="Gal Reforms Logo" className="max-h-12 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavigation("home")} className="text-foreground hover:text-primary transition-colors font-medium">
              Início
            </button>
            <button onClick={() => handleNavigation("about")} className="text-foreground hover:text-primary transition-colors font-medium">
              Sobre
            </button>
            <button onClick={() => handleNavigation("projects")} className="text-foreground hover:text-primary transition-colors font-medium">
              Projetos
            </button>
            <button onClick={() => handleNavigation("contact")} className="text-foreground hover:text-primary transition-colors font-medium">
              Contato
            </button>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone size={16} />
              <span>+34 XXX XXX XXX</span>
            </div>
            <Button variant="default" className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold" onClick={() => handleNavigation("contact")}>
              Orçamento Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="md:hidden bg-background border-t border-border py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => handleNavigation("home")} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Início
              </button>
              <button onClick={() => handleNavigation("about")} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Sobre
              </button>
              <button onClick={() => handleNavigation("projects")} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Projetos
              </button>
              <button onClick={() => handleNavigation("contact")} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Contato
              </button>
              <div className="pt-4 border-t border-border">
                <Button variant="default" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground" onClick={() => handleNavigation("contact")}>
                  Orçamento Grátis
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;