-- ROW LEVEL SECURITY (RLS) POLÍTICAS
-- Estas políticas garantem que usuários só vejam dados que têm permissão

-- Enable RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES (Usuários)
-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil (campos limitados)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política: Diretores e Coordenadores podem ver todos os perfis
CREATE POLICY "Directors and coordinators can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level <= 2
        )
    );

-- Política: Gerentes podem ver perfis do seu departamento
CREATE POLICY "Managers can view department profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() 
            AND r.level = 3 
            AND p.department_id = profiles.department_id
        )
    );

-- Política: Diretores podem inserir/atualizar/deletar perfis
CREATE POLICY "Directors can manage all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level = 1
        )
    );

-- DEPARTMENTS (Departamentos)
-- Política: Todos podem ver departamentos ativos
CREATE POLICY "Everyone can view active departments" ON departments
    FOR SELECT USING (is_active = true);

-- Política: Diretores e Coordenadores podem gerenciar departamentos
CREATE POLICY "Directors and coordinators can manage departments" ON departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level <= 2
        )
    );

-- ROLES (Cargos)
-- Política: Todos podem ver cargos
CREATE POLICY "Everyone can view roles" ON roles
    FOR SELECT USING (true);

-- Política: Apenas diretores podem gerenciar cargos
CREATE POLICY "Only directors can manage roles" ON roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level = 1
        )
    );

-- PERMISSIONS & ROLE_PERMISSIONS
-- Política: Todos podem ver permissões
CREATE POLICY "Everyone can view permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Everyone can view role permissions" ON role_permissions FOR SELECT USING (true);

-- Política: Apenas diretores podem gerenciar permissões
CREATE POLICY "Only directors can manage permissions" ON permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level = 1
        )
    );

CREATE POLICY "Only directors can manage role permissions" ON role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level = 1
        )
    );

-- SCHEDULES (Escalas)
-- Política: Usuários podem ver escalas do seu departamento
CREATE POLICY "Users can view department schedules" ON schedules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.department_id = schedules.department_id
        )
    );

-- Política: Gerentes podem gerenciar escalas do seu departamento
CREATE POLICY "Managers can manage department schedules" ON schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = schedules.department_id
        )
    );

-- Política: Diretores e Coordenadores podem ver/gerenciar todas as escalas
CREATE POLICY "Directors and coordinators can manage all schedules" ON schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level <= 2
        )
    );

-- SHIFTS (Plantões)
-- Política: Usuários podem ver seus próprios plantões
CREATE POLICY "Users can view own shifts" ON shifts
    FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuários podem ver plantões do seu departamento
CREATE POLICY "Users can view department shifts" ON shifts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN schedules s ON s.id = shifts.schedule_id
            WHERE p.id = auth.uid() 
            AND p.department_id = s.department_id
        )
    );

-- Política: Gerentes podem gerenciar plantões do seu departamento
CREATE POLICY "Managers can manage department shifts" ON shifts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            JOIN schedules s ON s.id = shifts.schedule_id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = s.department_id
        )
    );

-- Política: Diretores e Coordenadores podem gerenciar todos os plantões
CREATE POLICY "Directors and coordinators can manage all shifts" ON shifts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level <= 2
        )
    );

-- MENTORSHIPS (Mentorias)
-- Política: Usuários podem ver mentorias onde são mentor ou orientando
CREATE POLICY "Users can view related mentorships" ON mentorships
    FOR SELECT USING (
        auth.uid() = mentor_id OR auth.uid() = mentee_id
    );

-- Política: Gerentes podem ver mentorias do seu departamento
CREATE POLICY "Managers can view department mentorships" ON mentorships
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            JOIN profiles mentor ON mentor.id = mentorships.mentor_id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = mentor.department_id
        )
    );

-- Política: Diretores e Coordenadores podem gerenciar todas as mentorias
CREATE POLICY "Directors and coordinators can manage all mentorships" ON mentorships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level <= 2
        )
    );

-- SHIFT_EXCHANGES (Trocas de Plantão)
-- Política: Usuários podem ver trocas onde estão envolvidos
CREATE POLICY "Users can view related exchanges" ON shift_exchanges
    FOR SELECT USING (
        auth.uid() = requester_id OR auth.uid() = target_user_id
    );

-- Política: Gerentes podem aprovar trocas do seu departamento
CREATE POLICY "Managers can manage department exchanges" ON shift_exchanges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            JOIN profiles requester ON requester.id = shift_exchanges.requester_id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = requester.department_id
        )
    );

-- ABSENCES (Ausências)
-- Política: Usuários podem ver suas próprias ausências
CREATE POLICY "Users can view own absences" ON absences
    FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuários podem criar suas próprias ausências
CREATE POLICY "Users can create own absences" ON absences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Gerentes podem ver/aprovar ausências do seu departamento
CREATE POLICY "Managers can manage department absences" ON absences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            JOIN profiles user_profile ON user_profile.id = absences.user_id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = user_profile.department_id
        )
    );

-- LOCATIONS (Localizações)
-- Política: Usuários podem ver localizações do seu departamento
CREATE POLICY "Users can view department locations" ON locations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.department_id = locations.department_id
        )
    );

-- Política: Gerentes podem gerenciar localizações do seu departamento
CREATE POLICY "Managers can manage department locations" ON locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = locations.department_id
        )
    );

-- SCHEDULE_TEMPLATES (Templates de Escala)
-- Política: Usuários podem ver templates do seu departamento
CREATE POLICY "Users can view department templates" ON schedule_templates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.department_id = schedule_templates.department_id
        )
    );

-- Política: Gerentes podem gerenciar templates do seu departamento
CREATE POLICY "Managers can manage department templates" ON schedule_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() 
            AND r.level <= 3
            AND p.department_id = schedule_templates.department_id
        )
    );

-- AUDIT_LOGS (Logs de Auditoria)
-- Política: Apenas diretores podem ver logs de auditoria
CREATE POLICY "Only directors can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.level = 1
        )
    );

-- Política: Sistema pode inserir logs de auditoria
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);
