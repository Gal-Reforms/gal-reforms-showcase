-- Remove projetos fictícios que foram criados como exemplo
DELETE FROM project_images WHERE project_id IN (
  SELECT id FROM projects WHERE slug IN ('reforma-apartamento-moderno', 'construcao-casa-mediterranea')
);

DELETE FROM projects WHERE slug IN ('reforma-apartamento-moderno', 'construcao-casa-mediterranea');