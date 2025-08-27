-- Insert default categories if they don't exist
INSERT INTO categories (name, slug, description) VALUES 
  ('Todos', 'todos', 'Visualizar todos os projetos'),
  ('Reforma Residencial', 'reforma-residencial', 'Projetos de reforma residencial'),
  ('Construção Nova', 'construcao-nova', 'Projetos de construção nova'),
  ('Reforma Comercial', 'reforma-comercial', 'Projetos de reforma comercial')
ON CONFLICT (slug) DO NOTHING;