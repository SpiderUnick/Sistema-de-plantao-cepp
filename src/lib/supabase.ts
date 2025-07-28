import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role_id: string;
          position: string;
          department_id: string;
          experience_level: 'Iniciante' | 'Experiente' | 'Mentor';
          status: 'Ativo' | 'Inativo' | 'Afastado';
          experience_period_start: string | null;
          experience_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role_id: string;
          position: string;
          department_id: string;
          experience_level?: 'Iniciante' | 'Experiente' | 'Mentor';
          status?: 'Ativo' | 'Inativo' | 'Afastado';
          experience_period_start?: string | null;
          experience_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role_id?: string;
          position?: string;
          department_id?: string;
          experience_level?: 'Iniciante' | 'Experiente' | 'Mentor';
          status?: 'Ativo' | 'Inativo' | 'Afastado';
          experience_period_start?: string | null;
          experience_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          level: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          level: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          level?: number;
          created_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          color: string;
          parent_id: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          parent_id?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          parent_id?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          name: string;
          department_id: string;
          period_start: string;
          period_end: string;
          type: 'semanal' | 'mensal';
          rotation_type: 'manual' | 'automatica';
          status: 'Rascunho' | 'Ativa' | 'Finalizada';
          configuration: any;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          department_id: string;
          period_start: string;
          period_end: string;
          type: 'semanal' | 'mensal';
          rotation_type?: 'manual' | 'automatica';
          status?: 'Rascunho' | 'Ativa' | 'Finalizada';
          configuration?: any;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department_id?: string;
          period_start?: string;
          period_end?: string;
          type?: 'semanal' | 'mensal';
          rotation_type?: 'manual' | 'automatica';
          status?: 'Rascunho' | 'Ativa' | 'Finalizada';
          configuration?: any;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      shifts: {
        Row: {
          id: string;
          schedule_id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          start_time: string;
          end_time: string;
          type: 'Individual' | 'Dupla' | 'Equipe';
          status: 'Provisório' | 'Confirmado' | 'Cancelado';
          location_id: string | null;
          notes: string | null;
          is_multi_day: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          start_time: string;
          end_time: string;
          type?: 'Individual' | 'Dupla' | 'Equipe';
          status?: 'Provisório' | 'Confirmado' | 'Cancelado';
          location_id?: string | null;
          notes?: string | null;
          is_multi_day?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          schedule_id?: string;
          user_id?: string;
          start_date?: string;
          end_date?: string;
          start_time?: string;
          end_time?: string;
          type?: 'Individual' | 'Dupla' | 'Equipe';
          status?: 'Provisório' | 'Confirmado' | 'Cancelado';
          location_id?: string | null;
          notes?: string | null;
          is_multi_day?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
