import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { DepartmentForm } from '../components/Forms/DepartmentForm';
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react';
import { useSupabaseTable } from '../hooks/useSupabase';
import { useProfiles } from '../hooks/useProfiles';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { toast } from 'react-hot-toast';
import { Database } from '../lib/supabase';

type Department = Database['public']['Tables']['departments']['Row'];

export function Departments() {
  const { hasPermission } = useSupabaseAuth();
  const { data: departments, loading, error, create, update, remove, refetch } = useSupabaseTable('departments');
  const { profiles } = useProfiles();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCreate = hasPermission('departments', 'create');
  const canUpdate = hasPermission('departments', 'update');
  const canDelete = hasPermission('departments', 'delete');

  const userCounts = useMemo(() => {
    const counts = new Map<string, number>();
    profiles.forEach(profile => {
      if (profile.department_id) {
        counts.set(profile.department_id, (counts.get(profile.department_id) || 0) + 1);
      }
    });
    return counts;
  }, [profiles]);

  const handleOpenModal = (department?: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDepartment(undefined);
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedDepartment(undefined);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async (data: Omit<Department, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        await update(selectedDepartment.id, data);
        toast.success('Departamento atualizado com sucesso!');
      } else {
        await create(data);
        toast.success('Departamento criado com sucesso!');
      }
      refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao salvar departamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;

    const userCount = userCounts.get(selectedDepartment.id) || 0;
    if (userCount > 0) {
      toast.error('Não é possível excluir um departamento com usuários vinculados.');
      handleCloseDeleteModal();
      return;
    }

    setIsSubmitting(true);
    try {
      await remove(selectedDepartment.id);
      toast.success('Departamento excluído com sucesso!');
      refetch();
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao excluir departamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Carregando departamentos...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Erro ao carregar dados: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Departamentos</h1>
          <p className="text-gray-600 mt-1">Crie e gerencie os departamentos da organização</p>
        </div>
        {canCreate && (
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Departamento
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departamentos ({departments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuários</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: dept.color }}></div>
                        <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{dept.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userCounts.get(dept.id) || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={dept.is_active ? 'success' : 'default'}>
                        {dept.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canUpdate && (
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(dept)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteModal(dept)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criar/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedDepartment ? 'Editar Departamento' : 'Novo Departamento'}
      >
        <DepartmentForm
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          defaultValues={selectedDepartment}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal de Excluir */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Tem certeza que deseja excluir o departamento <strong className="text-gray-900">{selectedDepartment?.name}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseDeleteModal}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
