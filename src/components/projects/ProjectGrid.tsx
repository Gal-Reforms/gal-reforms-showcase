import { useStaggeredReveal } from "@/hooks/useScrollReveal";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/hooks/useProjects";

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const [staggerRef, visibleItems] = useStaggeredReveal(projects.length, 200);

  return (
    <div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          isVisible={visibleItems[index]}
        />
      ))}
    </div>
  );
};