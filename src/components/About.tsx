import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Shield, Wrench } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";

const About = () => {
  const features = [
    {
      icon: Star,
      title: "Qualidade Premium",
      description: "Utilizamos apenas materiais de primeira linha e técnicas avançadas de construção."
    },
    {
      icon: Shield,
      title: "Garantia Total",
      description: "Todos os nossos trabalhos possuem garantia completa e suporte pós-obra."
    },
    {
      icon: Wrench,
      title: "Equipe Especializada",
      description: "Profissionais qualificados com anos de experiência em construção e reforma."
    }
  ];

  const achievements = [
    "Mais de 15 anos no mercado espanhol",
    "Equipe técnica certificada e experiente",
    "Projetos personalizados e únicos",
    "Uso de tecnologia moderna na construção",
    "Atendimento personalizado do início ao fim",
    "Prazos cumpridos rigorosamente"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              Sobre a <span className="text-gold-gradient">Gal Reforms</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Somos uma empresa especializada em construção e reformas com mais de 15 anos de experiência 
              no mercado espanhol. Nossa missão é transformar espaços com qualidade excepcional, 
              design sofisticado e acabamentos impecáveis.
            </p>
            
            <div className="space-y-4 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-gold"
              onClick={() => scrollToSection("contact")}
            >
              Fale Conosco
            </Button>
          </div>

          {/* Image */}
          <div className="animate-scale-in">
            <div className="relative">
              <img
                src={aboutTeam}
                alt="Equipe Gal Reforms"
                className="rounded-2xl shadow-elegant w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift bg-background border-border animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;