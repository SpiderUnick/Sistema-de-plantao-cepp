-- SEED DATA - Dados iniciais para o sistema
-- Execute este arquivo após criar o schema e as políticas RLS

-- 1. Inserir Cargos (Roles)
INSERT INTO roles (id, name, level) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Diretor', 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Coordenador', 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gerente', 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Analista', 4),
    ('550e8400-e29b-41d4-a716-446655440005', 'Funcionário', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. Inserir Permissões
INSERT INTO permissions (id, name, resource, actions) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Gerenciar Usuários', 'users', '["create", "read", "update", "delete"]'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Gerenciar Departamentos', 'departments', '["create", "read", "update", "delete"]'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Gerenciar Escalas', 'schedules', '["create", "read", "update", "delete"]'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Gerenciar Plantões', 'shifts', '["create", "read", "update", "delete"]'),
    ('660e8400-e29b-41d4-a716-446655440005', 'Aprovar Trocas', 'exchanges', '["read", "update"]'),
    ('660e8400-e29b-41d4-a716-446655440006', 'Visualizar Relatórios', 'reports', '["read"]'),
    ('660e8400-e29b-41d4-a716-446655440007', 'Gerenciar Ausências', 'absences', '["create", "read", "update", "delete"]')
ON CONFLICT (id) DO NOTHING;

-- 3. Associar Permissões aos Cargos
-- Diretor - Todas as permissões
INSERT INTO role_permissions (role_id, permission_id) 
SELECT '550e8400-e29b-41d4-a716-446655440001', id FROM permissions
ON CONFLICT DO NOTHING;

-- Coordenador - Todas exceto gerenciar usuários
INSERT INTO role_permissions (role_id, permission_id) 
SELECT '550e8400-e29b-41d4-a716-446655440002', id FROM permissions WHERE resource != 'users'
ON CONFLICT DO NOTHING;

-- Gerente - Escalas, plantões, trocas, relatórios, ausências
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004'),
    ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005'),
    ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440006'),
    ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440007')
ON CONFLICT DO NOTHING;

-- Analista - Apenas leitura de relatórios e plantões
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440006')
ON CONFLICT DO NOTHING;

-- Funcionário - Apenas visualizar plantões próprios (sem permissões específicas aqui)

-- 4. Inserir Departamentos
INSERT INTO departments (id, name, color, description, is_active) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Emergência', '#ef4444', 'Atendimento de emergência 24h', true),
    ('770e8400-e29b-41d4-a716-446655440002', 'Enfermaria', '#3b82f6', 'Cuidados gerais e internação', true),
    ('770e8400-e29b-41d4-a716-446655440003', 'UTI', '#8b5cf6', 'Unidade de Terapia Intensiva', true),
    ('770e8400-e29b-41d4-a716-446655440004', 'Pediatria', '#06d6a0', 'Atendimento pediátrico especializado', true),
    ('770e8400-e29b-41d4-a716-446655440005', 'Cirurgia', '#f59e0b', 'Centro cirúrgico e procedimentos', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Inserir Localizações
INSERT INTO locations (id, name, department_id, address, timezone, contact_info, is_active) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', 'Hospital Central - Ala Norte', '770e8400-e29b-41d4-a716-446655440001', 'Rua Principal, 123 - Centro', 'America/Sao_Paulo', '{"phone": "(11) 9999-0001", "email": "emergencia@hospital.com"}', true),
    ('880e8400-e29b-41d4-a716-446655440002', 'Hospital Central - Ala Sul', '770e8400-e29b-41d4-a716-446655440002', 'Rua Principal, 123 - Centro', 'America/Sao_Paulo', '{"phone": "(11) 9999-0002", "email": "enfermaria@hospital.com"}', true),
    ('880e8400-e29b-41d4-a716-446655440003', 'Hospital Central - UTI', '770e8400-e29b-41d4-a716-446655440003', 'Rua Principal, 123 - Centro', 'America/Sao_Paulo', '{"phone": "(11) 9999-0003", "email": "uti@hospital.com"}', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Inserir Schedule Templates
INSERT INTO schedule_templates (id, name, department_id, configuration, is_default, created_by) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'Template Emergência Padrão', '770e8400-e29b-41d4-a716-446655440001', '{"horasPorPlantao": 12, "descansoMinimo": 24, "maxPlantoesPorSemana": 4}', true, auth.uid()),
    ('990e8400-e29b-41d4-a716-446655440002', 'Template UTI Padrão', '770e8400-e29b-41d4-a716-446655440003', '{"horasPorPlantao": 6, "descansoMinimo": 12, "maxPlantoesPorSemana": 6}', true, auth.uid())
ON CONFLICT (id) DO NOTHING;

-- 7. Inserir Escalas de Exemplo
INSERT INTO schedules (id, name, department_id, period_start, period_end, type, rotation_type, status, configuration, created_by) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', 'Escala Emergência - Janeiro 2025', '770e8400-e29b-41d4-a716-446655440001', '2025-01-01', '2025-01-31', 'mensal', 'automatica', 'Ativa', '{"horasPorPlantao": 12, "descansoMinimo": 24, "maxPlantoesPorSemana": 4}', auth.uid()),
    ('aa0e8400-e29b-41d4-a716-446655440002', 'Escala UTI - Janeiro 2025', '770e8400-e29b-41d4-a716-446655440003', '2025-01-01', '2025-01-31', 'semanal', 'manual', 'Ativa', '{"horasPorPlantao": 6, "descansoMinimo": 12, "maxPlantoesPorSemana": 6}', auth.uid())
ON CONFLICT (id) DO NOTHING;

-- Note: Os usuários (profiles) serão criados automaticamente quando os usuários se registrarem
-- através da função handle_new_user() que criamos no schema.sql
-- Os plantões (shifts) também serão criados posteriormente quando houver usuários reais
