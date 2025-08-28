import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { t } from "@/lib/translations";
import { useProjectsManager } from "@/hooks/useProjectsManager";
import { CategoryFilter } from "./projects/CategoryFilter";
import { ProjectGrid } from "./projects/ProjectGrid";
import { EmptyState } from "./projects/EmptyState";
import { LoadingState } from "./projects/LoadingState";
import { CallToAction } from "./projects/CallToAction";

const Projects = () => {
  const {
    filteredProjects,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    hasFilteredProjects
  } = useProjectsManager();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-in-up">
          <div className="text-center mb-16">
            <h2 className="text-display text-foreground mb-4">
              {t('ourProjects')}
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Descubre algunos de nuestros trabajos más representativos. Cada proyecto es único y refleja nuestro compromiso con la excelencia y calidad.
            </p>
          </div>
        </AnimatedSection>

        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading && <LoadingState />}

        {!isLoading && hasFilteredProjects && (
          <ProjectGrid projects={filteredProjects} />
        )}

        {!isLoading && !hasFilteredProjects && (
          <EmptyState 
            selectedCategory={selectedCategory}
            onContactClick={scrollToContact}
          />
        )}

        <CallToAction onContactClick={scrollToContact} />
      </div>
    </section>
);
};

export default Projects;