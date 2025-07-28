import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';
import { ToggleSwitch } from '../UI/ToggleSwitch';
import { Database } from '../../lib/supabase';

type Department = Database['public']['Tables']['departments']['Row'];
type DepartmentInsert = Database['public']['Tables']['departments']['Insert'];

const departmentSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
  is_active: z.boolean(),
});

interface DepartmentFormProps {
  onSubmit: (data: DepartmentInsert) => Promise<void>;
  onClose: () => void;
  defaultValues?: Department;
  isLoading: boolean;
}

export function DepartmentForm({ onSubmit, onClose, defaultValues, isLoading }: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<DepartmentInsert>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      ...defaultValues,
      is_active: defaultValues?.is_active ?? true,
      color: defaultValues?.color ?? '#3b82f6',
    },
  });

  const isActive = watch('is_active');
  const color = watch('color');

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        is_active: defaultValues.is_active ?? true,
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: DepartmentInsert) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Nome do Departamento"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Ex: Cardiologia"
        required
      />
      <Textarea
        label="Descrição"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Breve descrição do departamento"
        rows={3}
      />
      <div className="flex items-center gap-4">
        <Input
          label="Cor de Identificação"
          type="color"
          {...register('color')}
          error={errors.color?.message}
          className="p-1 h-10 w-14 block"
        />
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
            <div className="flex items-center gap-2 p-2 rounded-md border border-gray-200">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="font-semibold" style={{ color: color }}>Exemplo de Cor</span>
            </div>
        </div>
      </div>
      <ToggleSwitch
        label="Status"
        enabled={isActive}
        onChange={(enabled) => setValue('is_active', enabled, { shouldValidate: true })}
      />
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Departamento'}
        </Button>
      </div>
    </form>
  );
}
