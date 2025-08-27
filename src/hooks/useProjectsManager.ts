import { useState, useMemo } from "react";
import { useProjects, type Project } from "./useProjects";
import { useCategories } from "./useCategories";

export const useProjectsManager = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { data: projects = [], isLoading, error } = useProjects();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();

  const categories = categoriesData.map(cat => cat.name);
  
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
    isLoading: isLoading || categoriesLoading,
    error,
    hasProjects: projects.length > 0,
    hasFilteredProjects: filteredProjects.length > 0
  };
};