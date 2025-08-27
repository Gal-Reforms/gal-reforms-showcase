import { useState, useMemo } from "react";
import { useProjects, type Project } from "./useProjects";

export const useProjectsManager = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { data: projects = [], isLoading, error } = useProjects();

  const categories = ["Todos", "Reforma Residencial", "Construção Nova", "Reforma Comercial"];
  
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Todos") return projects;
    
    return projects.filter(project => 
      project.category === selectedCategory ||
      (selectedCategory === "Reforma Residencial" && project.category === "Reforma Residencial") ||
      (selectedCategory === "Construção Nova" && project.category === "Construção Nova") ||
      (selectedCategory === "Reforma Comercial" && project.category === "Reforma Comercial")
    );
  }, [projects, selectedCategory]);

  return {
    projects,
    filteredProjects,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    hasProjects: projects.length > 0,
    hasFilteredProjects: filteredProjects.length > 0
  };
};