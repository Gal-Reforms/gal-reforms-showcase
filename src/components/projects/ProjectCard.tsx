import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LazyImage } from "@/components/ui/LazyImage";
import { t } from "@/lib/translations";
import type { Project } from "@/hooks/useProjects";

interface ProjectCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

export const ProjectCard = ({ project, index, isVisible }: ProjectCardProps) => {
  const navigate = useNavigate();

  const viewProjectDetails = () => {
    navigate(`/proyecto/${project.slug}`);
  };

  return (
    <Card 
      className={`group hover-lift overflow-hidden border-0 shadow-soft hover:shadow-gold transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="relative h-64 overflow-hidden">
        <LazyImage
          src={project.cover_image || '/placeholder-project.jpg'}
          alt={project.title}
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          quality="medium"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground animate-fade-in-right">
          {project.category}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{project.location}</span>
          <Calendar className="w-4 h-4 ml-4" />
          <span>{new Date(project.completion_date || project.created_at).getFullYear()}</span>
        </div>
        
        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors duration-300">
          {project.title}
        </CardTitle>
        
        <CardDescription className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </CardDescription>

        <Button 
          onClick={viewProjectDetails}
          className="w-full group bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-glow"
        >
          <div className="flex items-center justify-center">
            <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            {t('viewDetails')}
          </div>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};