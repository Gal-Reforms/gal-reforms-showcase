import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface EmptyStateProps {
  selectedCategory: string;
  onContactClick: () => void;
}

export const EmptyState = ({ selectedCategory, onContactClick }: EmptyStateProps) => {
  return (
    <AnimatedSection animation="fade-in-up">
      <div className="text-center py-16">
        <div className="mb-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {selectedCategory === "Todos" 
              ? "Ainda não há projetos criados. Entre na área administrativa para criar seu primeiro projeto." 
              : `Não há projetos na categoria "${selectedCategory}". Tente selecionar outra categoria.`}
          </p>
          {selectedCategory === "Todos" && (
            <Button 
              variant="outline" 
              onClick={onContactClick}
              className="hover-glow"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Entrar em Contato
            </Button>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};