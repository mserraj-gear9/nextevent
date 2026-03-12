-- Seed: default organization for demo
INSERT INTO organizations (id, name, slug) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo Organization', 'demo')
ON CONFLICT DO NOTHING;
