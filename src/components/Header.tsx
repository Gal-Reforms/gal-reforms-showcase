import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { t } from "@/lib/translations";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
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
            <img src="/lovable-uploads/716cbf54-69ef-47e4-95a7-ec95811b8e9c.png" alt="Gal Reforms Logo" className="max-h-16 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavigation("home")} className="text-foreground hover:text-primary transition-colors font-medium">
              {t('home')}
            </button>
            <button onClick={() => handleNavigation("about")} className="text-foreground hover:text-primary transition-colors font-medium">
              {t('about')}
            </button>
            <button onClick={() => handleNavigation("projects")} className="text-foreground hover:text-primary transition-colors font-medium">
              {t('projects')}
            </button>
            <button onClick={() => handleNavigation("contact")} className="text-foreground hover:text-primary transition-colors font-medium">
              {t('contact')}
            </button>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone size={16} />
              <span>+34 XXX XXX XXX</span>
            </div>
            <ThemeToggle />
            <Button variant="default" className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold" onClick={() => handleNavigation("contact")}>
              {t('freeQuote')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed top-20 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border py-6 px-4 shadow-lg animate-fade-in z-50 md:hidden">
              <nav className="flex flex-col space-y-6">
                <button 
                  onClick={() => handleNavigation("home")} 
                  className="flex items-center space-x-3 text-left text-foreground hover:text-primary transition-colors font-medium py-3 text-lg"
                >
                  <span className="text-primary">🏠</span>
                  <span>{t('home')}</span>
                </button>
                <button 
                  onClick={() => handleNavigation("about")} 
                  className="flex items-center space-x-3 text-left text-foreground hover:text-primary transition-colors font-medium py-3 text-lg"
                >
                  <span className="text-primary">👥</span>
                  <span>{t('about')}</span>
                </button>
                <button 
                  onClick={() => handleNavigation("projects")} 
                  className="flex items-center space-x-3 text-left text-foreground hover:text-primary transition-colors font-medium py-3 text-lg"
                >
                  <span className="text-primary">🏗️</span>
                  <span>{t('projects')}</span>
                </button>
                <button 
                  onClick={() => handleNavigation("contact")} 
                  className="flex items-center space-x-3 text-left text-foreground hover:text-primary transition-colors font-medium py-3 text-lg"
                >
                  <span className="text-primary">📞</span>
                  <span>{t('contact')}</span>
                </button>
                <div className="pt-4 border-t border-border">
                  <Button 
                    variant="default" 
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground text-lg py-4" 
                    onClick={() => handleNavigation("contact")}
                  >
                    {t('freeQuote')}
                  </Button>
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>;
};
export default Header;