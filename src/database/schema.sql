-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- Create custom types
CREATE TYPE experience_level AS ENUM ('Iniciante', 'Experiente', 'Mentor');
CREATE TYPE user_status AS ENUM ('Ativo', 'Inativo', 'Afastado');
CREATE TYPE schedule_type AS ENUM ('semanal', 'mensal');
CREATE TYPE rotation_type AS ENUM ('manual', 'automatica');
CREATE TYPE schedule_status AS ENUM ('Rascunho', 'Ativa', 'Finalizada');
CREATE TYPE shift_type AS ENUM ('Individual', 'Dupla', 'Equipe');
CREATE TYPE shift_status AS ENUM ('Provisório', 'Confirmado', 'Cancelado');
CREATE TYPE absence_type AS ENUM ('Férias', 'Licença Médica', 'Falta Justificada', 'Licença Maternidade', 'Outros');
CREATE TYPE mentorship_status AS ENUM ('Ativo', 'Finalizado', 'Suspenso');
CREATE TYPE exchange_status AS ENUM ('Pendente', 'Aprovada', 'Rejeitada');

-- 1. Roles (Cargos)
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    level INTEGER NOT NULL CHECK (level > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Departments (Departamentos)
CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Permissions (Permissões)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    actions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Role Permissions (Relacionamento Cargo-Permissões)
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- 5. Profiles (Usuários/Funcionários)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    position VARCHAR(200) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    experience_level experience_level DEFAULT 'Iniciante',
    status user_status DEFAULT 'Ativo',
    experience_period_start DATE,
    experience_period_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Locations (Localizações)
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    address TEXT NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    contact_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Schedule Templates (Modelos de Escala)
CREATE TABLE IF NOT EXISTS schedule_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    configuration JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Schedules (Escalas)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    type schedule_type NOT NULL,
    rotation_type rotation_type DEFAULT 'manual',
    status schedule_status DEFAULT 'Rascunho',
    template_id UUID REFERENCES schedule_templates(id),
    configuration JSONB DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (period_end > period_start)
);

-- 9. Shifts (Plantões)
CREATE TABLE IF NOT EXISTS shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type shift_type DEFAULT 'Individual',
    status shift_status DEFAULT 'Provisório',
    location_id UUID REFERENCES locations(id),
    notes TEXT,
    is_multi_day BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_date >= start_date)
);

-- 10. Mentorships (Mentorias)
CREATE TABLE IF NOT EXISTS mentorships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES profiles(id),
    mentee_id UUID NOT NULL REFERENCES profiles(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status mentorship_status DEFAULT 'Ativo',
    observations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (mentor_id != mentee_id),
    CHECK (end_date > start_date)
);

-- 11. Shift Exchanges (Trocas de Plantão)
CREATE TABLE IF NOT EXISTS shift_exchanges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES profiles(id),
    target_user_id UUID NOT NULL REFERENCES profiles(id),
    original_shift_id UUID NOT NULL REFERENCES shifts(id),
    target_shift_id UUID NOT NULL REFERENCES shifts(id),
    reason TEXT NOT NULL,
    status exchange_status DEFAULT 'Pendente',
    approved_by UUID REFERENCES profiles(id),
    approval_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (requester_id != target_user_id)
);

-- 12. Absences (Ausências)
CREATE TABLE IF NOT EXISTS absences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id),
    type absence_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_date >= start_date)
);

-- 13. Audit Logs (Logs de Auditoria)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_shifts_schedule ON shifts(schedule_id);
CREATE INDEX IF NOT EXISTS idx_shifts_user ON shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_dates ON shifts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_schedules_department ON schedules(department_id);
CREATE INDEX IF NOT EXISTS idx_schedules_period ON schedules(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_absences_user ON absences(user_id);
CREATE INDEX IF NOT EXISTS idx_absences_dates ON absences(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentee ON mentorships(mentee_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentorships_updated_at BEFORE UPDATE ON mentorships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shift_exchanges_updated_at BEFORE UPDATE ON shift_exchanges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_absences_updated_at BEFORE UPDATE ON absences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role_id, position, department_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Usuário'),
        (SELECT id FROM roles WHERE name = 'Funcionário' LIMIT 1),
        'Posição não definida',
        (SELECT id FROM departments WHERE is_active = true LIMIT 1)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para log de auditoria
CREATE OR REPLACE FUNCTION public.audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
        VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data)
        VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar auditoria nas tabelas principais
CREATE TRIGGER audit_profiles_changes AFTER INSERT OR UPDATE OR DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_schedules_changes AFTER INSERT OR UPDATE OR DELETE ON schedules FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_shifts_changes AFTER INSERT OR UPDATE OR DELETE ON shifts FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_departments_changes AFTER INSERT OR UPDATE OR DELETE ON departments FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
