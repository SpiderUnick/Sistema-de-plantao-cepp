import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Hook para operações CRUD genéricas
export function useSupabaseTable<T extends keyof Tables>(
  tableName: T
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os registros
  const fetchAll = async (options?: {
    select?: string;
    eq?: { column: string; value: any };
    order?: { column: string; ascending?: boolean };
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(tableName as string).select(options?.select || '*');

      if (options?.eq) {
        query = query.eq(options.eq.column, options.eq.value);
      }

      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
      }

      const { data: result, error } = await query;

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo registro
  const create = async (newData: Tables[T]['Insert']) => {
    try {
      setError(null);
      const { data: result, error } = await supabase
        .from(tableName as string)
        .insert(newData)
        .select()
        .single();

      if (error) throw error;
      
      setData(prev => [...prev, result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Atualizar registro
  const update = async (id: string, updateData: Tables[T]['Update']) => {
    try {
      setError(null);
      const { data: result, error } = await supabase
        .from(tableName as string)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => 
        item.id === id ? result : item
      ));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Deletar registro
  const remove = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from(tableName as string)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Buscar por ID
  const fetchById = async (id: string) => {
    try {
      setError(null);
      const { data: result, error } = await supabase
        .from(tableName as string)
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar registro';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [tableName]);

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    fetchById,
    refetch: fetchAll
  };
}

// Hook específico para profiles com joins
export function useProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          role:roles(*),
          department:departments(*)
        `)
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar perfis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { profiles, loading, error, refetch: fetchProfiles };
}

// Hook específico para shifts com joins
export function useShifts(filters?: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  userId?: string;
}) {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('shifts')
        .select(`
          *,
          user:profiles(id, name, email),
          schedule:schedules(
            id, name, department:departments(*)
          ),
          location:locations(*)
        `);

      if (filters?.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('end_date', filters.endDate);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.departmentId) {
        query = query.eq('schedules.department_id', filters.departmentId);
      }

      const { data, error } = await query.order('start_date');

      if (error) throw error;
      setShifts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar plantões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [filters?.startDate, filters?.endDate, filters?.departmentId, filters?.userId]);

  return { shifts, loading, error, refetch: fetchShifts };
}

// Hook para real-time subscriptions
export function useRealtimeSubscription<T extends keyof Tables>(
  tableName: T,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${tableName as string}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName as string,
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, callback]);
}
